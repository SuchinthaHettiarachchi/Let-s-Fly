"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cookieCategories, type OptionalCategory } from "@/data/cookies";
import { allAllowed, noneAllowed, type Choices } from "@/lib/consent";
import { useConsent } from "./ConsentProvider";

/** On/off switch for one category. */
function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 flex-none cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? "bg-ocean-600" : "bg-sand-400"
      }`}
    >
      <span
        className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-lf ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

/**
 * The full cookie settings dialog. Opened from the banner's "Customise choices" and from
 * "Cookie settings" in the footer, so visitors can change or withdraw consent at any time.
 */
export function CookiePreferences() {
  const { consent, save, closeSettings } = useConsent();
  const [choices, setChoices] = useState<Choices>(() =>
    consent ? { functional: consent.functional, analytics: consent.analytics, marketing: consent.marketing } : noneAllowed,
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape closes, the page behind doesn't scroll, Tab stays inside, and focus returns where it was.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("h2")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings();
      if (e.key !== "Tab" || !dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>("button, a[href], summary");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [closeSettings]);

  const set = (id: OptionalCategory, value: boolean) => setChoices((c) => ({ ...c, [id]: value }));

  return (
    <div
      className="fixed inset-0 z-110 flex items-end justify-center overflow-y-auto overscroll-contain bg-navy-900/55 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={closeSettings}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        className="mt-auto flex max-h-[92dvh] w-full max-w-[600px] flex-col overflow-hidden rounded-t-2xl bg-white text-ink-900 shadow-[0_30px_80px_rgba(11,37,69,.28)] sm:my-auto sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 bg-navy-900 px-5 py-4 text-white sm:px-8">
          <h2 id="cookie-prefs-title" tabIndex={-1} className="font-sans text-h4 outline-none">
            Cookie settings
          </h2>
          <button
            type="button"
            onClick={closeSettings}
            aria-label="Close"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,scale] duration-200 hover:bg-white/12 press sm:size-9"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8">
          <p className="text-small text-ink-600">
            Choose which cookies we can use. You can change this at any time from &ldquo;Cookie settings&rdquo; at the
            bottom of every page. See our{" "}
            <Link href="/privacy" onClick={closeSettings} className="font-semibold underline underline-offset-2">
              Privacy Policy
            </Link>{" "}
            for more.
          </p>

          <ul className="mt-5 flex flex-col divide-y divide-sand-300 border-y border-sand-300">
            {cookieCategories.map((cat) => (
              <li key={cat.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-[0.9375rem] font-semibold">{cat.title}</h3>
                    <p className="mt-1 text-small text-ink-600">{cat.description}</p>
                  </div>
                  {cat.required ? (
                    <span className="mt-0.5 flex-none rounded-full bg-sand-100 px-3 py-1 text-caption text-ink-600">
                      Always on
                    </span>
                  ) : (
                    <Switch
                      label={cat.title}
                      checked={choices[cat.id as OptionalCategory]}
                      onChange={(v) => set(cat.id as OptionalCategory, v)}
                    />
                  )}
                </div>
                <details className="group mt-2">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1 py-1 text-small font-semibold text-ocean-600 hover:text-navy-900 [&::-webkit-details-marker]:hidden">
                    Cookies used
                    <Icon name="expand_more" size={18} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 overflow-x-auto rounded-lg border border-sand-300">
                    <table className="w-full min-w-[420px] text-left text-caption font-normal">
                      <thead className="bg-sand-50 text-ink-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Cookie</th>
                          <th className="px-3 py-2 font-semibold">Provider</th>
                          <th className="px-3 py-2 font-semibold">Purpose</th>
                          <th className="px-3 py-2 font-semibold">Expires</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand-300 text-ink-900">
                        {cat.cookies.map((c) => (
                          <tr key={c.name}>
                            <td className="px-3 py-2 font-mono">{c.name}</td>
                            <td className="px-3 py-2">{c.provider}</td>
                            <td className="px-3 py-2">{c.purpose}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{c.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2.5 border-t border-sand-300 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex sm:justify-end sm:px-8">
          <button type="button" onClick={() => save(noneAllowed)} className={buttonClasses("outline", "md", "px-4")}>
            Reject all
          </button>
          <button type="button" onClick={() => save(allAllowed)} className={buttonClasses("outline", "md", "px-4")}>
            Accept all
          </button>
          <button
            type="button"
            onClick={() => save(choices)}
            className={buttonClasses("primary", "md", "col-span-2 px-4 sm:col-span-1")}
          >
            Save my choices
          </button>
        </div>
      </div>
    </div>
  );
}
