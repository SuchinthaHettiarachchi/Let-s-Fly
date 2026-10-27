"use client";

import { useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ConsentBlock } from "@/components/forms/ConsentBlock";
import { FormSent } from "@/components/forms/FormSent";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact } from "@/data/site";
import { errorClass, fieldClass, labelClass, serviceOptions, textareaClass } from "@/components/forms/styles";

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

type Field = "name" | "phone" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const order: Field[] = ["name", "phone", "email", "message"];

/** Returns the error for one field, or undefined when it is valid. */
function check(field: Field, v: Values): string | undefined {
  switch (field) {
    case "name": {
      const name = v.name.trim();
      if (!name) return "Please enter your full name.";
      if (name.length < 2) return "Name must be at least 2 characters.";
      if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) return "Name can only contain letters, spaces, dots and hyphens.";
      return;
    }
    case "phone": {
      const phone = v.phone.trim();
      if (!phone) return "Please enter your phone number.";
      const digits = phone.replace(/[\s()-]/g, "");
      if (!/^\+?\d{9,15}$/.test(digits)) return "Enter a valid phone number, e.g. +94 77 000 0000.";
      return;
    }
    case "email": {
      const email = v.email.trim();
      if (!email) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Enter a valid email address, e.g. you@email.com.";
      return;
    }
    case "message": {
      const message = v.message.trim();
      if (!message) return "Please tell us a little about your trip.";
      if (message.length < MESSAGE_MIN) return `Message must be at least ${MESSAGE_MIN} characters.`;
      if (message.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer.`;
      return;
    }
  }
}

const empty: Values = { name: "", phone: "", email: "", message: "" };

type ContactFormProps = {
  /** Sent with the message and used as the WhatsApp opener, e.g. "Visa enquiry". */
  subject?: string;
  /** Service picked in the dropdown when the form loads. */
  service?: (typeof serviceOptions)[number];
};

/** "How can we help?" message form, with a WhatsApp alternative under the submit button. */
export function ContactForm({ subject = "General enquiry", service = serviceOptions[0] }: ContactFormProps) {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Values>(empty);
  // Errors appear once a field is left (or on submit), then update as the visitor types.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const errors: Errors = {};
  for (const f of order) if (touched[f]) errors[f] = check(f, values);

  const set = (field: Field, value: string) => setValues((v) => ({ ...v, [field]: value }));
  const touch = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, message: true });
    const firstBad = order.find((f) => check(f, values));
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    // TODO: send to the inquiry endpoint once the backend exists.
    setSent(true);
  }

  function reset() {
    setValues(empty);
    setTouched({});
    setSent(false);
  }

  if (sent) {
    return <FormSent title="Message sent!" text="Thanks! We usually reply within two working hours." onReset={reset} />;
  }

  /** Props shared by each validated text field. */
  const field = (name: Field) => ({
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(name, e.target.value),
    onBlur: () => touch(name),
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const messageLength = values.message.trim().length;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <input type="hidden" name="subject" value={subject} />
      <label className={labelClass}>
        <span>
          Full Name <Required />
        </span>
        <input {...field("name")} autoComplete="name" placeholder="e.g. Nimal Perera" className={fieldClass} />
        <FieldError id="contact-name-error" message={errors.name} />
      </label>
      <label className={labelClass}>
        <span>
          Phone <Required />
        </span>
        <input {...field("phone")} type="tel" autoComplete="tel" placeholder="+94 77 000 0000" className={fieldClass} />
        <FieldError id="contact-phone-error" message={errors.phone} />
      </label>
      <label className={labelClass}>
        <span>
          Email <Required />
        </span>
        <input {...field("email")} type="email" autoComplete="email" placeholder="you@email.com" className={fieldClass} />
        <FieldError id="contact-email-error" message={errors.email} />
      </label>
      <label className={labelClass}>
        Service
        <select name="service" defaultValue={service} className={fieldClass}>
          {serviceOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        <span>
          Message <Required />
        </span>
        <textarea
          {...field("message")}
          maxLength={MESSAGE_MAX}
          placeholder="Tell us about your trip…"
          className={`${textareaClass} h-32`}
        />
        <span className="flex items-start justify-between gap-3">
          <FieldError id="contact-message-error" message={errors.message} />
          <span className={`ml-auto flex-none text-caption font-normal ${messageLength > MESSAGE_MAX - 50 ? "text-red-600" : "text-ink-400"}`}>
            {messageLength}/{MESSAGE_MAX}
          </span>
        </span>
      </label>
      <ConsentBlock className="sm:col-span-2" />
      <Button type="submit" variant="primary" size="lg" icon="send" className="w-full sm:col-span-2">
        Send Message
      </Button>
      <ButtonLink
        href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, ${subject}: `)}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="outline"
        size="lg"
        className="w-full sm:col-span-2"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-[#25d366] text-white">
          <SocialIcon name="WhatsApp" size={14} />
        </span>
        WhatsApp Us
      </ButtonLink>
    </form>
  );
}

function Required() {
  return (
    <span aria-hidden="true" className="text-red-600">
      *
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" className={errorClass}>
      <Icon name="error" size={15} />
      {message}
    </span>
  );
}
