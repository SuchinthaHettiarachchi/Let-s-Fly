"use client";

import { browserApiUrl } from "@/lib/api-url";

export type UploadProgress = (percent: number) => void;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

function isGif(file: File) {
  return file.type === "image/gif" || /\.gif$/i.test(file.name);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image."));
    };
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.src = url;
  });
}

async function encodeToWebp(
  source: CanvasImageSource,
  width: number,
  height: number,
): Promise<Blob | null> {
  try {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(source, 0, 0, width, height);
      return await canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
    }
  } catch {
    // fall through
  }
  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(source, 0, 0, width, height);
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  } catch {
    return null;
  }
}

export async function prepareImageBlob(
  file: File,
  opts: { maxWidth?: number; forceWebp?: boolean } = {},
): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be 5MB or smaller.");
  const maxWidth = opts.maxWidth ?? 1600;
  const forceWebp = opts.forceWebp === true;

  if (isGif(file)) return file;

  if (typeof createImageBitmap !== "undefined") {
    try {
      const probe = await createImageBitmap(file);
      const { width: w } = probe;
      probe.close();
      const needsResize = w > maxWidth;
      const needsWebp = forceWebp && file.type !== "image/webp";
      if (!needsResize && !needsWebp) return file;
      const bitmap = needsResize
        ? await createImageBitmap(file, { resizeWidth: maxWidth, resizeQuality: "high" })
        : await createImageBitmap(file);
      const blob = await encodeToWebp(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
      if (blob) return blob;
      return file;
    } catch {
      // fall through
    }
  }

  try {
    const img = await loadImage(file);
    const needsResize = img.naturalWidth > maxWidth;
    const needsWebp = forceWebp && file.type !== "image/webp";
    if (!needsResize && !needsWebp) return file;
    const scale = needsResize ? maxWidth / img.naturalWidth : 1;
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const blob = await encodeToWebp(img, width, height);
    if (blob) return blob;
    return file;
  } catch {
    return file;
  }
}

type XhrResult = { status: number; responseText: string };

function xhrRequest(
  method: string,
  url: string,
  body: Document | XMLHttpRequestBodyInit | null,
  opts: { headers?: Record<string, string>; withCredentials?: boolean; onProgress?: UploadProgress } = {},
): Promise<XhrResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (opts.withCredentials) xhr.withCredentials = true;
    if (opts.headers) {
      for (const [k, v] of Object.entries(opts.headers)) xhr.setRequestHeader(k, v);
    }
    xhr.upload.onprogress = (e) => {
      if (!opts.onProgress) return;
      if (e.lengthComputable && e.total > 0) {
        opts.onProgress(Math.max(0, Math.min(100, Math.round((e.loaded / e.total) * 100))));
      } else {
        opts.onProgress(-1);
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onload = () => resolve({ status: xhr.status, responseText: xhr.responseText || "" });
    xhr.send(body);
  });
}

function parseJson(text: string): Record<string, unknown> {
  try {
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function presignAndUploadBlob(
  blob: Blob,
  contentType: string,
  folder: string,
  onProgress?: UploadProgress,
): Promise<string> {
  const presignRes = await fetch(browserApiUrl("/upload/presign"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, folder }),
  });
  const presignData = await presignRes.json().catch(() => ({}));
  if (!presignRes.ok || !presignData.uploadUrl || !presignData.publicUrl) {
    throw new Error(presignData.message || "Presign failed");
  }
  const put = await xhrRequest("PUT", presignData.uploadUrl as string, blob, {
    headers: { "Content-Type": contentType },
    onProgress,
  });
  if (put.status < 200 || put.status >= 300) {
    throw new Error(`Direct upload failed (${put.status})`);
  }
  onProgress?.(100);
  return presignData.publicUrl as string;
}

async function binaryProxyUploadBlob(
  blob: Blob,
  contentType: string,
  folder: string,
  onProgress?: UploadProgress,
): Promise<string> {
  const res = await xhrRequest("POST", `${browserApiUrl("/upload/binary")}?folder=${encodeURIComponent(folder)}`, blob, {
    headers: { "Content-Type": contentType },
    withCredentials: true,
    onProgress,
  });
  const data = parseJson(res.responseText);
  const url = typeof data.url === "string" ? data.url : "";
  if (res.status < 200 || res.status >= 300 || !url) {
    const message = typeof data.message === "string" ? data.message : "Upload failed.";
    throw new Error(message);
  }
  onProgress?.(100);
  return url;
}

export async function uploadBlobWithProgress(
  blob: Blob,
  opts: { folder: string; contentType: string; onProgress?: UploadProgress },
): Promise<string> {
  const { folder, contentType, onProgress } = opts;
  onProgress?.(0);
  try {
    return await presignAndUploadBlob(blob, contentType, folder, onProgress);
  } catch {
    return await binaryProxyUploadBlob(blob, contentType, folder, onProgress);
  }
}

export async function uploadMediaFile(
  file: File,
  opts: { folder: string; kind?: "image" | "video"; onProgress?: UploadProgress },
): Promise<string> {
  const kind = opts.kind ?? (file.type.startsWith("video/") ? "video" : "image");
  if (kind === "video") {
    if (!file.type.startsWith("video/")) throw new Error("Choose a video file.");
    if (file.size > MAX_VIDEO_BYTES) throw new Error("Video must be 100MB or smaller.");
    const contentType = file.type || "video/mp4";
    return uploadBlobWithProgress(file, { folder: opts.folder, contentType, onProgress: opts.onProgress });
  }
  const prepared = await prepareImageBlob(file);
  const contentType = prepared.type || file.type || "image/webp";
  return uploadBlobWithProgress(prepared, { folder: opts.folder, contentType, onProgress: opts.onProgress });
}
