const configuredApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export const apiUrl = (path: string) => {
  const base = configuredApi.endsWith("/api") ? configuredApi : `${configuredApi}/api`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
