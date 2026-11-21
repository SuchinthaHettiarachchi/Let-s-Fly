const PUBLIC_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "") || "";

/**
 * Older records stored the R2 S3 endpoint instead of the public r2.dev URL.
 * Map those to the public domain so images render without signed requests.
 */
export function mediaUrl(value?: string | null) {
  if (!value) return "";
  if (!PUBLIC_BASE) return value;
  const match = /^https:\/\/[^/]+\.r2\.cloudflarestorage\.com\/(.+)$/.exec(value);
  return match ? `${PUBLIC_BASE}/${match[1]}` : value;
}
