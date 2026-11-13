import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api-url";

const SESSION_COOKIE = "letsfly_token";

export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  if (!["login", "register", "logout", "forgot-password"].includes(action)) {
    return NextResponse.json({ message: "Unknown authentication action" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const response = await fetch(apiUrl(`/auth/${action}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  const result = NextResponse.json(data, { status: response.status });

  if (response.ok && typeof data.token === "string" && (action === "login" || action === "register")) {
    result.cookies.set({
      name: SESSION_COOKIE,
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: body.remember ? 7 * 24 * 60 * 60 : 15 * 60,
      path: "/",
    });
  } else if (action === "logout" && response.ok) {
    result.cookies.set({ name: SESSION_COOKIE, value: "", maxAge: 0, path: "/" });
  }

  return result;
}
