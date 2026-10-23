"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FormSent } from "@/components/forms/FormSent";
import { errorClass, fieldClass, labelClass, serviceOptions, textareaClass } from "@/components/forms/styles";

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

type Field = "name" | "phone" | "email" | "message" | "agree";
type Values = Record<Exclude<Field, "agree">, string> & { agree: boolean };
type Errors = Partial<Record<Field, string>>;

const order: Field[] = ["name", "phone", "email", "message", "agree"];

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
    case "agree":
      return v.agree ? undefined : "Please agree to the Privacy Policy.";
  }
}

/** "How can we help?" message form on the Contact page. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Values>({ name: "", phone: "", email: "", message: "", agree: false });
  // Errors appear once a field is left (or on submit), then update as the visitor types.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const errors: Errors = {};
  for (const f of order) if (touched[f]) errors[f] = check(f, values);

  const set = (field: Field, value: string | boolean) => setValues((v) => ({ ...v, [field]: value }));
  const touch = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, message: true, agree: true });
    const firstBad = order.find((f) => check(f, values));
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    // TODO: send to the inquiry endpoint once the backend exists.
    setSent(true);
  }

  function reset() {
    setValues({ name: "", phone: "", email: "", message: "", agree: false });
    setTouched({});
    setSent(false);
  }

  if (sent) {
    return <FormSent title="Message sent!" text="Thanks! We usually reply within two working hours." onReset={reset} />;
  }

  /** Props shared by each validated text field. */
  const field = (name: Exclude<Field, "agree">) => ({
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
        <select name="service" className={fieldClass}>
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
          <span className={`ml-auto flex-none text-xs font-normal ${messageLength > MESSAGE_MAX - 50 ? "text-red-600" : "text-ink-400"}`}>
            {messageLength}/{MESSAGE_MAX}
          </span>
        </span>
      </label>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-ink-400">
          <input
            type="checkbox"
            name="agree"
            checked={values.agree}
            onChange={(e) => {
              set("agree", e.target.checked);
              touch("agree");
            }}
            aria-invalid={!!errors.agree}
            aria-describedby={errors.agree ? "contact-agree-error" : undefined}
            className="size-[18px] flex-none accent-ocean-600"
          />
          <span>
            I agree to the <Link href="/privacy">Privacy Policy</Link>. <Required />
          </span>
        </label>
        <FieldError id="contact-agree-error" message={errors.agree} />
      </div>
      <Button type="submit" variant="primary" size="lg" icon="send" className="w-full sm:col-span-2">
        Send Message
      </Button>
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
