"use client";

import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact } from "@/data/site";

type Row = [label: string, value: string | undefined];

/**
 * Opens WhatsApp to the office number with the form's details already typed in, so the visitor
 * only has to press send. Empty rows are left out.
 */
export function openWhatsApp(intro: string, rows: Row[]) {
  const lines = rows.filter(([, v]) => v?.trim()).map(([label, v]) => `*${label}:* ${v!.trim()}`);
  const text = [intro, "", ...lines].join("\n");
  window.open(`${contact.whatsappHref}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

/** Green "Send on WhatsApp" button that sits beside a form's email submit button. */
export function WhatsAppSendButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[50px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#25d366] px-[26px] text-[0.9375rem] font-semibold whitespace-nowrap text-white transition-[background-color,translate,scale] duration-200 ease-lf press hover:-translate-y-px hover:bg-[#1ebe5b] ${className}`}
    >
      <SocialIcon name="WhatsApp" size={22} />
      Send on WhatsApp
    </button>
  );
}
