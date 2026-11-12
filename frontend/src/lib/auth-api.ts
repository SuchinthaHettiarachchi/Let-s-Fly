const API = "/api";

async function post(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data: { message?: string; token?: string } = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, message: data.message ?? "", token: data.token ?? "" };
}

export const authApi = {
  login: (email: string, password: string, remember: boolean) =>
    post("/auth/login", { email, password, remember }),
  register: (name: string, email: string, password: string) =>
    post("/auth/register", { name, email, password }),
  forgotPassword: (email: string) => post("/auth/forgot-password", { email }),
  logout: () => post("/auth/logout", {}),
};