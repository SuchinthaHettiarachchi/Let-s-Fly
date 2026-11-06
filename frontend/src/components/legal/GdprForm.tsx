"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FormSent } from "@/components/forms/FormSent";
import { errorClass, fieldClass, labelClass } from "@/components/forms/styles";

function emailError(value: string) {
  const email = value.trim();
  if (!email) return "Please enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Enter a valid email address, e.g. you@email.com.";
}

/**
 * Data amendment / deletion request. There's no backend yet, so a valid submit only shows the
 * confirmation; nothing is sent anywhere.
 */
export function GdprForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const error = touched ? emailError(email) : undefined;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    if (emailError(email)) {
      e.currentTarget.querySelector("input")?.focus();
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <FormSent
        title="Request received"
        text="We'll amend or delete the personal data linked to this email within 24 hours and confirm by email."
        onReset={() => {
          setEmail("");
          setTouched(false);
          setSent(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
      <Button type="submit" variant="primary" size="lg" icon="send" className="self-start">
        Submit
      </Button>
    </form>
  );
}
