"use client";

import { useInquiry } from "@/components/inquiry/InquiryProvider";
import type { InquiryPrefill } from "@/components/inquiry/InquiryForm";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = {
  /** Small label above the value, e.g. "From, per person". */
  label?: string;
  /** Price or short fact shown on the left, e.g. "LKR 185,000". */
  value?: string;
  prefill: InquiryPrefill;
  cta?: string;
};

/**
 * Phone and tablet only: a bar pinned to the bottom of detail pages with one clear action.
 * data-mobile-bar lets globals.css pad the page and lift the WhatsApp button above it.
 */
export function MobileActionBar({ label, value, prefill, cta = "Enquire now" }: Props) {
  const { openInquiry } = useInquiry();
  return (
    <div
      data-mobile-bar
      className="fixed inset-x-0 bottom-0 z-50 border-t border-sand-300 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(11,37,69,0.08)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-[600px] items-center gap-4">
        {value && (
          <div className="flex min-w-0 flex-col">
            {label && <span className="text-caption font-normal text-ink-400">{label}</span>}
            <span className="num truncate text-h5 font-bold text-ocean-600">{value}</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => openInquiry(prefill)}
          className={buttonClasses("primary", "md", "ml-auto flex-1 sm:flex-none")}
        >
          {cta}
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  );
}
