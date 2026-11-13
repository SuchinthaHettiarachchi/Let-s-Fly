const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const config = require('../config/config');
const { httpError } = require('../middleware/error');

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

const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const putObject = async (buffer, contentType, ext, folder) => {
  const safeFolder = String(folder).replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'uploads';
  const key = `${safeFolder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  await getClient().send(new PutObjectCommand({
    Bucket: config.r2.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  if (!config.r2.publicUrl) throw httpError(500, 'R2_PUBLIC_URL is not set on the server.');
  return `${config.r2.publicUrl}/${key}`;
};

// dataUrl: "data:image/webp;base64,...." -> public HTTPS URL on the R2 bucket.
exports.uploadDataUrl = async (dataUrl, folder = 'packages') => {
  const match = /^data:(image\/[a-z.+-]+);base64,([A-Za-z0-9+/=\s]+)$/i.exec(String(dataUrl || ''));
  if (!match) throw httpError(400, 'Expected a base64 image (data:image/...;base64,...).');
  const contentType = match[1].toLowerCase();
  const ext = MIME_EXT[contentType];
  if (!ext) throw httpError(400, 'Only JPEG, PNG, WebP, AVIF or GIF images are allowed.');
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) throw httpError(400, 'The image is empty.');
  if (buffer.length > MAX_IMAGE_BYTES) throw httpError(413, 'Image must be 5MB or smaller.');
  return putObject(buffer, contentType, ext, folder);
};

// Raw binary upload (video): body arrives via express.raw, Content-Type decides the extension.
exports.uploadRaw = async (buffer, contentType, folder = 'uploads') => {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  const ext = MIME_EXT[type];
  if (!ext) throw httpError(400, 'Only MP4 or WebM videos are allowed.');
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw httpError(400, 'The file is empty.');
  if (buffer.length > MAX_VIDEO_BYTES) throw httpError(413, 'Video must be 100MB or smaller.');
  return putObject(buffer, type, ext, folder);
};
