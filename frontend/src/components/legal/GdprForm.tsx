"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FormSent } from "@/components/forms/FormSent";
import { FormError, Honeypot, isBot } from "@/components/forms/FormStatus";
import { sendFormEmail } from "@/lib/email";
import { errorClass, fieldClass, labelClass } from "@/components/forms/styles";

function emailError(value: string) {
  const email = value.trim();
  if (!email) return "Please enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Enter a valid email address, e.g. you@email.com.";
}

/** Data amendment / deletion request, emailed to the office (see lib/email.ts). */
export function GdprForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const error = touched ? emailError(email) : undefined;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    setTouched(true);
    if (emailError(email)) {
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    if (isBot(form)) return setSent(true);

    const address = email.trim();
    setSending(true);
    setFailed(false);
    try {
      await sendFormEmail({
        form: "GDPR data request",
        subject: `GDPR request: amend or delete the data for ${address}`,
        replyTo: address,
        fields: [
          ["Request", "Amend or delete the personal data linked to this email address"],
          ["Email", address],
          ["Respond by", "Within 24 hours, as promised on the GDPR page"],
        ],
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <FormSent
        title="Request received"
        text="We'll amend or delete the personal data linked to this email within 24 hours and confirm by email."
        onReset={() => {
          setEmail("");
          setTouched(false);
          setFailed(false);
          setSent(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Honeypot />
      <label className={labelClass}>
        <span>
          Email <span aria-hidden="true" className="text-red-600">*</span>
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={!!error}
          aria-describedby={error ? "gdpr-email-error" : undefined}
          className={fieldClass}
        />
        {error && (
          <span id="gdpr-email-error" role="alert" className={errorClass}>
            <Icon name="error" size={15} />
            {error}
          </span>
        )}
      </label>
      <span className="text-caption font-normal text-ink-400">
        <span className="text-red-600">*</span>Required Fields
      </span>
      <Button type="submit" variant="primary" size="lg" icon={sending ? undefined : "send"} disabled={sending} className="self-start">
        {sending ? "Sending…" : "Submit"}
      </Button>
      {failed && <FormError />}
    </form>
  );
}
