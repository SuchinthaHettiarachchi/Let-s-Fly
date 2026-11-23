const configuredApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export const apiUrl = (path: string) => {
  const base = configuredApi.endsWith("/api") ? configuredApi : `${configuredApi}/api`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

/** Same-origin proxy for browser calls, so the session cookie is always sent. */
export const browserApiUrl = (path: string) => `/api/backend${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Time limit for server-side backend requests. Without one, a backend that never answers makes
 * `next build` wait 60s per page, retry three times and then fail the whole deploy. On timeout the
 * fetch throws, the helper's catch returns its fallback, and ISR fills the real data in later.
 */
export const backendTimeout = () => AbortSignal.timeout(8000);
