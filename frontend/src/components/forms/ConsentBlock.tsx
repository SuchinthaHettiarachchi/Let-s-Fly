"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { errorClass } from "@/components/forms/styles";

/**
 * GDPR consent text and tick box, placed between a form's fields and its submit buttons.
 *
 * The tick box is required. The browser's own check (submitting the form, `reportValidity()` or
 * `checkValidity()`) fires `invalid` on it, and that shows the message under the box instead of the
 * browser's bubble. Ticking it clears the message.
 */
export function ConsentBlock({ className = "" }: { className?: string }) {
  const [missing, setMissing] = useState(false);
  const errorId = useId();
  return (
    <div className={`flex flex-col gap-3 border-t border-sand-300 pt-4 text-small text-ink-600 ${className}`}>
      <span className="text-h5 text-ink-900">GDPR Compliance</span>
      <p>
        By giving your confirmation you explicitly give consent for us to store and use this information to service your
        requests.
      </p>
      <p>
        If you do not consent we will not store any personal information and will only send an email with the relevant
        details in order to service your requests.
      </p>
      <label className="flex cursor-pointer items-start gap-2.5 text-small text-ink-900">
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={missing}
          aria-describedby={missing ? errorId : undefined}
          onInvalid={(e) => {
            e.preventDefault();
            setMissing(true);
            e.currentTarget.focus();
          }}
          onChange={(e) => e.currentTarget.checked && setMissing(false)}
          className="mt-px size-[18px] flex-none accent-ocean-600"
        />
        <span>
          I confirm I have read and given consent for the above. <span aria-hidden="true" className="text-red-600">*</span>
        </span>
      </label>
      {missing && (
        <span id={errorId} role="alert" className={errorClass}>
          <Icon name="error" size={16} />
          Please tick the box to give your consent.
        </span>
      )}
      <span className="text-caption font-normal text-ink-400">
        <span className="text-red-600">*</span>Required Fields
      </span>
    </div>
  );
}
