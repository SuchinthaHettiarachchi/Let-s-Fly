"use client";

import type { OptionalCategory } from "@/data/cookies";
import { useConsent } from "./ConsentProvider";

type Props = {
  /** Category that must be allowed before the content loads. */
  category: OptionalCategory;
  /** What the visitor is about to load, e.g. "the map". */
  label: string;
  /** "dark" for navy sections such as the footer. */
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
};

/**
 * Holds back third-party embeds (Google Maps) until their cookie category is allowed.
 * Until then it shows a placeholder with a button that allows that one category.
 */
export function ConsentGate({ category, label, tone = "light", className = "", children }: Props) {
  const { consent, allowed, save } = useConsent();
  if (allowed(category)) return <>{children}</>;

  const allow = () =>
    save({
      functional: consent?.functional ?? false,
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
      [category]: true,
    });

  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-4 text-center ${
        dark ? "bg-white/8 text-white/75" : "bg-sand-50 text-ink-600"
      } ${className}`}
    >
      <p className="max-w-[260px] text-small">Google sets cookies when {label} loads.</p>
      <button
        type="button"
        onClick={allow}
        className={`cursor-pointer rounded-lg px-4 py-2 text-small font-semibold transition-colors duration-200 press ${
          dark ? "border border-white/40 text-white hover:bg-white/12" : "bg-ocean-600 text-white hover:bg-ocean-500"
        }`}
      >
        Load {label}
      </button>
    </div>
  );
}
