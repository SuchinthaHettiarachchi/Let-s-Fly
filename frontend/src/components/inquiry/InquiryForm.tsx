"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConsentBlock } from "@/components/forms/ConsentBlock";
import { FormSent } from "@/components/forms/FormSent";
import { SubjectField } from "@/components/contact/ContactForm";
import { fieldClass, labelClass, serviceOptions, textareaClass, titleOptions } from "@/components/forms/styles";
import { FormError, Honeypot, isBot } from "@/components/forms/FormStatus";
import { WhatsAppSendButton, openWhatsApp } from "@/components/forms/WhatsAppSend";
import { oneLine, sendFormEmail } from "@/lib/email";
import { categoryFromService, submitInquiry, type InquiryCategory } from "@/lib/inquiry-api";

export type InquiryPrefill = { subject?: string; service?: string; destination?: string; details?: string; category?: InquiryCategory };

/** Today as YYYY-MM-DD in the visitor's time zone, for the read-only inquiry date. */
function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** "2026-12-24" becomes "Thu, 24 Dec 2026" so the email reads the same whatever the visitor's locale. */
function formatDate(value: string) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

type Props = {
  prefill?: InquiryPrefill;
  autoFocus?: boolean;
};

/**
 * The general "Send us an inquiry" form used by the modal and the inline
 * sidebar cards. Lays out in two columns once its container is wide enough.
 */
export function InquiryForm({ prefill = {}, autoFocus = false }: Props) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  /** Uses the browser's required-field checks, then opens WhatsApp with the details filled in. */
  function sendOnWhatsApp() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    openWhatsApp("Hi Let's Fly, I'd like to make an inquiry.", [
      ["Subject", prefill.subject],
      ["Service", get("service")],
      ["Name", oneLine(`${get("title")} ${get("name")}`)],
      ["Phone", get("phone")],
      ["Email", get("email")],
      ["Destination", oneLine(get("destination"))],
      ["Departure date", formatDate(get("departure"))],
      ["Details", get("details")],
    ]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    if (isBot(form)) return setSent(true);

    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const name = oneLine(`${get("title")} ${get("name")}`);
    const service = get("service");
    const destination = oneLine(get("destination"));
    setSending(true);
    setFailed(false);
    try {
      // Save to the CMS before the EmailJS notification is sent.
      try {
        await submitInquiry({
          customerName: name,
          email: get("email"),
          phone: get("phone"),
          category: prefill.category ?? categoryFromService(service, prefill.subject ?? ""),
          subject: prefill.subject ?? `${service}${destination ? `, ${destination}` : ""}`,
          message: [
            destination ? `Destination: ${destination}` : "",
            get("departure") ? `Departure: ${formatDate(get("departure"))}` : "",
            get("details"),
          ].filter(Boolean).join("\n"),
        });
      } catch (saveError) {
        console.error("Could not save inquiry to the CMS.", saveError);
      }
      await sendFormEmail({
        form: "Trip inquiry",
        subject: `New inquiry: ${prefill.subject ?? `${service}, ${destination}`} from ${name}`,
        fromName: name,
        replyTo: get("email"),
        fields: [
          ["Subject", prefill.subject],
          ["Service", service],
          ["Name", name],
          ["Phone", get("phone")],
          ["Email", get("email")],
          ["Destination", destination],
          ["Departure date", formatDate(get("departure"))],
          ["Inquiry date", formatDate(get("inquiryDate"))],
          ["Inquiry details", get("details")],
          ["Sent from page", window.location.href],
        ],
        consent: data.get("consent") === "on",
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (sent)
    return (
      <FormSent
        onReset={() => {
          setFailed(false);
          setSent(false);
        }}
      />
    );

  return (
    <div className="@container">
      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 @min-[21rem]:grid-cols-2">
        <Honeypot />
        {prefill.subject && <SubjectField value={prefill.subject} className="@min-[21rem]:col-span-2" />}
        <div className="grid grid-cols-[100px_1fr] gap-4 @min-[21rem]:col-span-2 @min-[21rem]:grid-cols-[120px_1fr]">
          <label className={labelClass}>
            Title *
            <select name="title" autoFocus={autoFocus} className={fieldClass}>
              {titleOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Full Name *
            <input name="name" required autoComplete="name" placeholder="e.g. Nimal Perera" className={fieldClass} />
          </label>
        </div>
        <label className={labelClass}>
          Phone number *
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+94 77 000 0000" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Email *
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Services *
          <select name="service" required defaultValue={prefill.service} className={fieldClass}>
            {serviceOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Destination *
          <input name="destination" required defaultValue={prefill.destination} placeholder="e.g. Dubai" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Departure date *
          <input name="departure" type="date" required className={fieldClass} />
        </label>
        <label className={labelClass}>
          Inquiry date *
          {/* Server and browser dates can differ around midnight, so the browser's value wins. */}
          <input
            name="inquiryDate"
            type="date"
            readOnly
            suppressHydrationWarning
            defaultValue={today()}
            className={`${fieldClass} bg-sand-50 text-ink-600`}
          />
        </label>
        <label className={`${labelClass} @min-[21rem]:col-span-2`}>
          Inquiry details
          <textarea
            name="details"
            defaultValue={prefill.details}
            placeholder="Hotel preferences, budget, special requests…"
            className={textareaClass}
          />
        </label>
        <ConsentBlock className="@min-[21rem]:col-span-2" />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={sending ? undefined : "arrow_forward"}
          disabled={sending}
          className="h-[52px] w-full @min-[21rem]:col-span-2"
        >
          {sending ? "Sending…" : "Inquire Now · Send Inquiry"}
        </Button>
        <WhatsAppSendButton onClick={sendOnWhatsApp} className="w-full @min-[21rem]:col-span-2" />
        {failed && <FormError className="@min-[21rem]:col-span-2" />}
      </form>
    </div>
  );
}
