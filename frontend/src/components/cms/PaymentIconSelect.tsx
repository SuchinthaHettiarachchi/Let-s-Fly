"use client";

import { CmsSelect, type CmsSelectOption } from "@/components/cms/CmsSelect";

/** Payment-related Material Symbols used by package payment method cards. */
export const PAYMENT_ICONS: { value: string; label: string }[] = [
  { value: "payments", label: "Payments" },
  { value: "credit_card", label: "Credit card" },
  { value: "account_balance", label: "Bank" },
  { value: "account_balance_wallet", label: "Wallet" },
  { value: "local_atm", label: "ATM" },
  { value: "currency_exchange", label: "Exchange" },
  { value: "money", label: "Cash" },
  { value: "savings", label: "Savings" },
  { value: "qr_code", label: "QR code" },
  { value: "smartphone", label: "Mobile" },
  { value: "receipt_long", label: "Installments" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
};

/** Payment-icon dropdown: each option shows its glyph + label, never a raw icon name. */
export function PaymentIconSelect({ value, onChange, id, className = "", disabled = false }: Props) {
  const options: CmsSelectOption[] = PAYMENT_ICONS.map((icon) => ({
    value: icon.value,
    label: icon.label,
    icon: icon.value,
  }));
  return (
    <CmsSelect
      aria-label="Payment icon"
      className={className}
      disabled={disabled}
      id={id}
      onChange={onChange}
      options={options}
      placeholder="Select an icon…"
      value={value}
    />
  );
}
