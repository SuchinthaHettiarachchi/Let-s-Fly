/**
 * GDPR consent text and tick box, placed between a form's fields and its submit button.
 * Consent is optional: without it we only email the details needed to answer the request.
 */
export function ConsentBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 border-t border-sand-300 pt-4 text-[12.5px] leading-relaxed text-ink-600 ${className}`}>
      <span className="text-sm font-semibold text-ink-900">GDPR Compliance</span>
      <p>
        By giving your confirmation you explicitly give consent for us to store and use this information to service your
        requests.
      </p>
      <p>
        If you do not consent we will not store any personal information and will only send an email with the relevant
        details in order to service your requests.
      </p>
      <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-ink-900">
        <input type="checkbox" name="consent" className="mt-px size-[18px] flex-none accent-ocean-600" />
        I confirm I have read and given consent for the above.
      </label>
      <span className="text-xs text-ink-400">
        <span className="text-red-600">*</span>Required Fields
      </span>
    </div>
  );
}
