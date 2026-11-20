import type { NextRequest } from "next/server";

const configuredApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
const backendBase = configuredApi.endsWith("/api") ? configuredApi : `${configuredApi}/api`;

async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const target = `${backendBase}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? Buffer.from(await request.arrayBuffer()) : undefined,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  const responseType = response.headers.get("content-type");
  if (responseType) responseHeaders.set("content-type", responseType);
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) responseHeaders.set("set-cookie", setCookie);

  const status = response.status;
  const body = status === 204 || status === 205 || status === 304 ? null : await response.arrayBuffer();

  return new Response(body, {
    status,
    headers: responseHeaders,
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
