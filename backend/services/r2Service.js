const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const config = require('../config/config');
const { httpError } = require('../middleware/error');

let getSignedUrlFn = null;
try {
  ({ getSignedUrl: getSignedUrlFn } = require('@aws-sdk/s3-request-presigner'));
} catch {
  getSignedUrlFn = null;
}

// Cloudflare R2 exposes an S3-compatible API; region "auto" is required by R2.
const getClient = () => {
  const { accountId, accessKeyId, secretAccessKey, bucket } = config.r2;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw httpError(500, 'Uploads are not configured (missing R2_* settings on the server).');
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
};

const IMAGE_MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};
const VIDEO_MIME_EXT = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};
const MIME_EXT = { ...IMAGE_MIME_EXT, ...VIDEO_MIME_EXT };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const safeFolder = (folder) => String(folder || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'uploads';

const publicUrlForKey = (key) => {
  if (!config.r2.publicUrl) throw httpError(500, 'R2_PUBLIC_URL is not set on the server.');
  return `${config.r2.publicUrl}/${key}`;
};

const putObject = async (buffer, contentType, ext, folder) => {
  const key = `${safeFolder(folder)}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  await getClient().send(new PutObjectCommand({
    Bucket: config.r2.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return publicUrlForKey(key);
};

// dataUrl: "data:image/webp;base64,...." -> public HTTPS URL on the R2 bucket. (legacy JSON upload path)
exports.uploadDataUrl = async (dataUrl, folder = 'packages') => {
  const match = /^data:(image\/[a-z.+-]+);base64,([A-Za-z0-9+/=\s]+)$/i.exec(String(dataUrl || ''));
  if (!match) throw httpError(400, 'Expected a base64 image (data:image/...;base64,...).');
  const contentType = match[1].toLowerCase();
  const ext = IMAGE_MIME_EXT[contentType];
  if (!ext) throw httpError(400, 'Only JPEG, PNG, WebP, AVIF or GIF images are allowed.');
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) throw httpError(400, 'The image is empty.');
  if (buffer.length > MAX_IMAGE_BYTES) throw httpError(413, 'Image must be 5MB or smaller.');
  return putObject(buffer, contentType, ext, folder);
};

// Raw binary upload (image or video): body arrives via express.raw.
exports.uploadRaw = async (buffer, contentType, folder = 'uploads') => {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  const ext = MIME_EXT[type];
  if (!ext) throw httpError(400, 'Only JPEG, PNG, WebP, AVIF, GIF, MP4 or WebM files are allowed.');
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw httpError(400, 'The file is empty.');
  const isVideo = Boolean(VIDEO_MIME_EXT[type]);
  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (buffer.length > limit) throw httpError(413, isVideo ? 'Video must be 100MB or smaller.' : 'Image must be 5MB or smaller.');
  return putObject(buffer, type, ext, folder);
};

// Presigned direct-to-R2 PUT URL (browser uploads directly to R2).
exports.presignPut = async (contentType, folder = 'uploads') => {
  if (!getSignedUrlFn) {
    try {
      ({ getSignedUrl: getSignedUrlFn } = require('@aws-sdk/s3-request-presigner'));
    } catch {
      throw httpError(500, 'Presigned uploads are not available on this server.');
    }
  }
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  const ext = MIME_EXT[type];
  if (!ext) throw httpError(400, 'Only JPEG, PNG, WebP, AVIF, GIF, MP4 or WebM files are allowed.');
  const key = `${safeFolder(folder)}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: config.r2.bucket,
    Key: key,
    ContentType: type,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  const uploadUrl = await getSignedUrlFn(getClient(), command, { expiresIn: 900 });
  return { uploadUrl, publicUrl: publicUrlForKey(key), key, contentType: type };
};

// Deletes an object on our R2 bucket from its public URL. Returns false (no-op)
// for anything that is not an R2-hosted URL (e.g. local /images/... paths).
exports.deleteByUrl = async (url) => {
  if (typeof url !== 'string' || !url) return false;
  const publicUrl = config.r2.publicUrl;
  if (!publicUrl || !url.startsWith(`${publicUrl}/`)) return false;
  const key = url.slice(publicUrl.length + 1);
  if (!key || key.startsWith('/') || key.includes('..')) return false;
  await getClient().send(new DeleteObjectCommand({ Bucket: config.r2.bucket, Key: key }));
  return true;
};

/** Sums object sizes in the bucket through the S3-compatible ListObjectsV2 API. */
exports.getStorageUsage = async () => {
  const client = getClient();
  let usedBytes = 0;
  let objectCount = 0;
  let continuationToken;

  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: config.r2.bucket,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    }));
    for (const object of page.Contents || []) usedBytes += Number(object.Size || 0);
    objectCount += page.KeyCount ?? (page.Contents || []).length;
    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  return { usedBytes, objectCount };
};
