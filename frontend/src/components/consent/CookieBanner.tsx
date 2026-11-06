"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { useConsent } from "./ConsentProvider";

/**
 * First-visit cookie notice. A card in the bottom-left corner from sm up (clear of the WhatsApp
 * button on the right), a full-width sheet on phones. Accept and Reject carry equal weight.
 */
export function CookieBanner() {
  const { acceptAll, rejectAll, openSettings } = useConsent();

  return (
    <section
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-70 animate-rise sm:inset-x-auto sm:bottom-7 sm:left-7 sm:w-[440px]"
    >
      <div className="rounded-t-2xl border border-sand-300 bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-ink-900 shadow-[0_-12px_40px_rgba(11,37,69,0.16)] sm:rounded-2xl sm:p-6 sm:shadow-lf-lg">
        <h2 id="cookie-banner-title" className="font-sans text-h5">
          We value your privacy
        </h2>
        <p className="mt-1.5 text-small text-ink-600">
          We use essential cookies to run this site. With your permission we&apos;d also use cookies to show maps,
          understand how the site is used and measure our ads. Read our{" "}
          <Link href="/privacy" className="font-semibold underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={rejectAll} className={buttonClasses("outline", "md", "w-full px-4")}>
            Reject all
          </button>
          <button type="button" onClick={acceptAll} className={buttonClasses("primary", "md", "w-full px-4")}>
            Accept all
          </button>
        </div>
        <button
          type="button"
          onClick={openSettings}
          className="mx-auto mt-3 block cursor-pointer py-1.5 text-small font-semibold text-ocean-600 underline-offset-2 hover:text-navy-900 hover:underline"
        >
          Customise choices
        </button>
      </div>
    </section>
  );
}
