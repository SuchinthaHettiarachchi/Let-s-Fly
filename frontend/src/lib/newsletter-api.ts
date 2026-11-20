import { browserApiUrl } from "@/lib/api-url";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

export async function subscribeNewsletter(email: string): Promise<void> {
  const response = await fetch(browserApiUrl("/newsletter"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source: "website" }),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Could not subscribe.");
  }
}

export async function fetchSubscribers(): Promise<NewsletterSubscriber[]> {
  const response = await fetch(browserApiUrl("/newsletter/manage"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as { subscribers?: NewsletterSubscriber[] };
  return Array.isArray(data.subscribers) ? data.subscribers : [];
}

export const newsletterCmsApi = {
  remove: (id: string) => fetch(browserApiUrl(`/newsletter/${id}`), { method: "DELETE", credentials: "include" }),
};
