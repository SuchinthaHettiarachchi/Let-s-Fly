import Image from "next/image";
import type { PaymentMark } from "@/data/site";

/** Simplified payment marks on a white tile, drawn inline except Koko, which uses its logo file. */
const marks: Record<PaymentMark, React.ReactNode> = {
  Visa: (
    <svg viewBox="0 0 48 16" className="h-3.5" aria-hidden="true">
      <text x="24" y="14" textAnchor="middle" fontSize="17" fontWeight="800" fontStyle="italic" fill="#1a1f71" fontFamily="Arial, sans-serif">
        VISA
      </text>
    </svg>
  ),
  Mastercard: (
    <svg viewBox="0 0 38 24" className="h-6" aria-hidden="true">
      <circle cx="13" cy="12" r="11" fill="#eb001b" />
      <circle cx="25" cy="12" r="11" fill="#f79e1b" />
      <path d="M19 2.8a11 11 0 0 1 0 18.4 11 11 0 0 1 0-18.4z" fill="#ff5f00" />
    </svg>
  ),
  Amex: (
    <svg viewBox="0 0 44 24" className="h-6" aria-hidden="true">
      <rect width="44" height="24" rx="3" fill="#2e77bc" />
      <text x="22" y="16" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif" letterSpacing="0.5">
        AMEX
      </text>
    </svg>
  ),
  Koko: <Image src="/images/payments/koko.jpg" alt="" width={48} height={16} className="h-4 w-auto" />,
};

export function PaymentLogo({ name }: { name: PaymentMark }) {
  return (
    <span title={name} className="flex h-9 w-[60px] items-center justify-center rounded-md bg-white">
      {marks[name]}
      <span className="sr-only">{name}</span>
    </span>
  );
}
