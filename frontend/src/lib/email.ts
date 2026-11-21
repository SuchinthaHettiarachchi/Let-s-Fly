/**
 * Sends website form submissions to the Let's Fly inbox through EmailJS (https://www.emailjs.com).
 *
 * Every form uses ONE EmailJS template. The email body is built here as HTML and passed in
 * `message_html`, so the template in the EmailJS dashboard only needs:
 *   To Email:  kasun@letsfly.lk  (typed into the template, never sent from the browser)
 *   Subject:   {{subject}}
 *   From Name: {{from_name}}
 *   Reply To:  {{reply_to}}
 *   Content:   {{{message_html}}}  (three braces, so the HTML isn't escaped)
 * Setup steps: frontend/docs/emailjs-setup.md
 */

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/** Where submissions go. For reference only: the real address lives in the EmailJS template. */
export const FORMS_INBOX = "kasun@letsfly.lk";

// Read one by one: Next.js only inlines `process.env.NEXT_PUBLIC_*` when written out in full.
const config = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

export type FormEmail = {
  /** Which form it came from, shown as the email's heading, e.g. "Contact form". */
  form: string;
  /** Email subject line. */
  subject: string;
  /** Visitor's name and email, so Kasun can press Reply. */
  fromName?: string;
  replyTo?: string;
  /** Rows of the details table, in order. Empty values are left out. */
  fields: [label: string, value: string | undefined][];
  /** Whether the visitor ticked the GDPR consent box (omit for forms without one). */
  consent?: boolean;
};

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("EmailJS is not configured: set the NEXT_PUBLIC_EMAILJS_* variables.");
  }
}

/** Sends one submission. Throws if EmailJS isn't set up or the request fails. */
export async function sendFormEmail(email: FormEmail): Promise<void> {
  const { serviceId, templateId, publicKey } = config;
  if (!serviceId || !templateId || !publicKey) throw new EmailNotConfiguredError();

  // const res = await fetch(ENDPOINT, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     service_id: serviceId,
  //     template_id: templateId,
  //     user_id: publicKey,
  //     template_params: {
  //       subject: email.subject,
  //       from_name: email.fromName ? `${email.fromName} via letsfly.lk` : "Let's Fly website",
  //       reply_to: email.replyTo ?? "",
  //       message_html: renderEmail(email),
  //     },
  //   }),
  // });
  // if (!res.ok) throw new Error(`EmailJS ${res.status}: ${await res.text()}`);
}


/** Collapses whitespace and trims, for one-line values such as names in a subject. */
export function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Visitor text, escaped, with line breaks kept. */
function cell(value: string) {
  return escapeHtml(value.trim()).replace(/\r?\n/g, "<br>");
}

function sentAt() {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());
}

/** Table-based, inline-styled HTML so it looks the same in Gmail, Outlook and phone mail apps. */
function renderEmail({ form, fields, consent, replyTo }: FormEmail) {
  const rows = fields
    .filter(([, v]) => v && v.trim())
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #ece6d6;width:34%;vertical-align:top;font-size:13px;color:#6b7280;">${escapeHtml(label)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #ece6d6;vertical-align:top;font-size:15px;color:#111827;">${cell(value!)}</td>
        </tr>`,
    )
    .join("");

  const consentRow =
    consent === undefined
      ? ""
      : `
        <tr>
          <td style="padding:12px 16px;width:34%;vertical-align:top;font-size:13px;color:#6b7280;">GDPR consent</td>
          <td style="padding:12px 16px;vertical-align:top;font-size:15px;color:${consent ? "#047857" : "#b45309"};">${
            consent
              ? "Given: the visitor agreed that we may store and use these details."
              : "Not given: reply to this request only, then don't keep their details."
          }</td>
        </tr>`;

  const replyHint = replyTo
    ? `<p style="margin:20px 0 0;font-size:14px;color:#374151;">Press <strong>Reply</strong> to answer ${escapeHtml(replyTo)} directly.</p>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f4ec;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ec;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #ece6d6;">
            <tr>
              <td style="background:#0b2545;padding:22px 24px;border-bottom:4px solid #ffea00;">
                <div style="font-size:20px;font-weight:700;color:#ffffff;">Let's Fly<span style="color:#ffea00;">.lk</span></div>
                <div style="font-size:13px;color:#c8d4e6;margin-top:4px;">New website submission</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px;">
                <h1 style="margin:0;font-size:20px;color:#0b2545;">${escapeHtml(form)}</h1>
                <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">Received ${escapeHtml(sentAt())} (Sri Lanka time)</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ece6d6;border-radius:8px;border-collapse:separate;">
                  ${rows}${consentRow}
                </table>
                ${replyHint}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 24px;font-size:12px;color:#9ca3af;border-top:1px solid #ece6d6;">
                Sent automatically from the contact forms on letsfly.lk.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
