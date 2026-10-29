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
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-navy-900/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        className="my-auto w-full max-w-[600px] overflow-hidden rounded-2xl bg-white text-ink-900 shadow-[0_30px_80px_rgba(11,37,69,.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <InquiryHeader titleId="inquiry-title">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,scale] duration-200 hover:bg-white/12 press"
          >
            <Icon name="close" />
          </button>
        </InquiryHeader>
        <div className="px-6 pt-6 pb-7 sm:px-8">
          <InquiryForm prefill={prefill} autoFocus />
        </div>
      </div>
    </div>
  );
}
