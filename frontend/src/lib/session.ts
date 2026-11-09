import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const SESSION_COOKIE = "letsfly_token";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export async function getSession(): Promise<{ id: string; role: string } | null> {
  if (!secret.length) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.id !== "string") return null;
    return { id: payload.id, role: typeof payload.role === "string" ? payload.role : "user" };
  } catch {
    return null;
  }
}