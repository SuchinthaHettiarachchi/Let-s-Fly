"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormSent } from "@/components/forms/FormSent";
import { fieldClass, labelClass, serviceOptions, textareaClass, titleOptions } from "@/components/forms/styles";
import { contact } from "@/data/site";

export type InquiryPrefill = { service?: string; destination?: string; details?: string };

/** Today as YYYY-MM-DD in the visitor's time zone, for the read-only inquiry date. */
function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

type Props = {
  prefill?: InquiryPrefill;
  /** Called when a link inside the form navigates away (the modal closes itself). */
  onNavigate?: () => void;
  autoFocus?: boolean;
};

/**
 * The general "Send us an inquiry" form used by the modal and the inline
 * sidebar cards. Lays out in two columns once its container is wide enough.
 */
export function InquiryForm({ prefill = {}, onNavigate, autoFocus = false }: Props) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send to the inquiry endpoint / CMS once the backend exists.
    setSent(true);
  }

  if (sent) return <FormSent onReset={() => setSent(false)} />;

  return (
    <div className="@container">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 @xs:grid-cols-2">
        <div className="grid grid-cols-[100px_1fr] gap-4 @xs:col-span-2 @xs:grid-cols-[120px_1fr]">
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
        <label className={`${labelClass} @xs:col-span-2`}>
          Inquiry details
          <textarea
            name="details"
            defaultValue={prefill.details}
            placeholder="Hotel preferences, budget, special requests…"
            className={textareaClass}
          />
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-normal text-ink-400 @xs:col-span-2">
          <input type="checkbox" required className="mt-px size-[18px] flex-none accent-ocean-600" />
          <span>
            I agree to Let&apos;s Fly.lk storing my details to respond to this inquiry, as described in the{" "}
            <Link href="/privacy" onClick={onNavigate}>
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <Button type="submit" variant="primary" size="lg" icon="arrow_forward" className="h-[52px] w-full @xs:col-span-2">
          Inquire Now · Send Inquiry
        </Button>
        <ButtonLink
          href={contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="lg"
          leadingIcon="chat"
          className="h-[52px] w-full @xs:col-span-2"
        >
          WhatsApp Us
        </ButtonLink>
      </form>
    </div>
  );
}
