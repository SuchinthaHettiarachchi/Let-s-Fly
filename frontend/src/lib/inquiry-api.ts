import { browserApiUrl } from "@/lib/api-url";

export type InquiryCategory = "Contact" | "Plan my Trip Section" | "Air Ticket" | "Visa Inquiry";
export type InquiryStatus = "New" | "In Progress" | "Closed";

export type Inquiry = {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  category: InquiryCategory;
  subject: string;
  message: string;
  status: InquiryStatus;
  comments: string[];
};

export type InquiryInput = {
  customerName: string;
  email: string;
  phone: string;
  category: InquiryCategory;
  subject: string;
  message: string;
};

/** Map the service/subject chosen in a visitor form to a CMS inquiry category. */
export function categoryFromService(service = "", subject = ""): InquiryCategory {
  const value = `${subject} ${service}`.toLowerCase();
  if (value.includes("visa")) return "Visa Inquiry";
  if (value.includes("air ticket") || value.includes("flight") || value.includes("fare")) return "Air Ticket";
  return "Plan my Trip Section";
}

/** The Contact page form defaults to Contact unless the subject/service is clearly visa or air ticket. */
export function categoryFromContactForm(subject = "", service = ""): InquiryCategory {
  const value = `${subject} ${service}`.toLowerCase();
  if (value.includes("visa")) return "Visa Inquiry";
  if (value.includes("air ticket") || value.includes("flight") || value.includes("fare")) return "Air Ticket";
  return "Contact";
}

/** Persist a visitor inquiry before the EmailJS notification is sent. */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  const response = await fetch(browserApiUrl("/inquiries"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Could not save inquiry.");
  }
}

export async function fetchManageInquiries(): Promise<Inquiry[]> {
  const response = await fetch(browserApiUrl("/inquiries/manage"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as { inquiries?: Inquiry[] };
  return Array.isArray(data.inquiries) ? data.inquiries : [];
}

export const inquiryCmsApi = {
  update: (id: string, body: { status?: InquiryStatus; comment?: string }) =>
    fetch(browserApiUrl(`/inquiries/${id}`), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  remove: (id: string) => fetch(browserApiUrl(`/inquiries/${id}`), { method: "DELETE", credentials: "include" }),
};
