"use client";

import { useConsent } from "./ConsentProvider";

/** Reopens the cookie settings dialog. Used in the footer and on the Privacy Policy page. */
export function CookieSettingsButton({ className = "", children = "Cookie settings" }: { className?: string; children?: React.ReactNode }) {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={`cursor-pointer ${className}`}>
      {children}
    </button>
  );
}
