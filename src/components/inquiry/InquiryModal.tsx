"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { InquiryForm, type InquiryPrefill } from "./InquiryForm";
import { InquiryHeader } from "./InquiryCard";

export type { InquiryPrefill };

type Props = { prefill: InquiryPrefill; onClose: () => void };

export function InquiryModal({ prefill, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center overflow-y-auto overscroll-contain bg-navy-900/55 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        className="mt-auto w-full max-w-[600px] overflow-hidden rounded-t-2xl sm:my-auto sm:rounded-2xl bg-white text-ink-900 shadow-[0_30px_80px_rgba(11,37,69,.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <InquiryHeader titleId="inquiry-title">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 flex-none sm:size-9 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,scale] duration-200 hover:bg-white/12 press"
          >
            <Icon name="close" />
          </button>
        </InquiryHeader>
        <div className="px-5 pt-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-6 sm:pb-7">
          <InquiryForm prefill={prefill} autoFocus />
        </div>
      </div>
    </div>
  );
}
