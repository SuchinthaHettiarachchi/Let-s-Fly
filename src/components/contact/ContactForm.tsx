"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormSent } from "@/components/forms/FormSent";
import { fieldClass, labelClass, serviceOptions, textareaClass } from "@/components/forms/styles";

/** "How can we help?" message form on the Contact page. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send to the inquiry endpoint once the backend exists.
    setSent(true);
  }

  if (sent) {
    return <FormSent title="Message sent!" text="Thanks — we usually reply within two working hours." onReset={() => setSent(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className={labelClass}>
        Full Name
        <input name="name" required autoComplete="name" placeholder="e.g. Nimal Perera" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Phone
        <input name="phone" type="tel" required autoComplete="tel" placeholder="+94 77 000 0000" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Service
        <select name="service" className={fieldClass}>
          {serviceOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        Message
        <textarea name="message" required placeholder="Tell us about your trip…" className={`${textareaClass} h-32`} />
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-ink-400 sm:col-span-2">
        <input type="checkbox" required className="size-[18px] flex-none accent-ocean-600" />
        <span>
          I agree to the <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>
      <Button type="submit" variant="primary" size="lg" icon="send" className="w-full sm:col-span-2">
        Send Message
      </Button>
    </form>
  );
}
