"use client";

import { CmsSelect, type CmsSelectOption } from "@/components/cms/CmsSelect";

export type CmsIconKind = "payment" | "highlight";

/** Material Symbols grouped by where they are used in the CMS. */
const ICONS: Record<CmsIconKind, { value: string; label: string }[]> = {
  payment: [
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
  ],
  highlight: [
    { value: "check_circle", label: "Check" },
    { value: "star", label: "Star" },
    { value: "auto_awesome", label: "Sparkle" },
    { value: "rocket_launch", label: "Rocket" },
    { value: "lightbulb", label: "Idea" },
    { value: "schedule", label: "Time" },
    { value: "verified", label: "Verified" },
    { value: "workspace_premium", label: "Premium" },
    { value: "diamond", label: "Diamond" },
    { value: "favorite", label: "Heart" },
    { value: "photo_camera", label: "Photo" },
    { value: "landscape", label: "Landscape" },
    { value: "beach_access", label: "Beach" },
    { value: "hiking", label: "Hiking" },
    { value: "museum", label: "Museum" },
    { value: "local_dining", label: "Dining" },
    { value: "hotel", label: "Hotel" },
    { value: "flight", label: "Flight" },
    { value: "train", label: "Train" },
    { value: "group", label: "Group" },
    { value: "support_agent", label: "Support agent" },
    { value: "campaign", label: "Campaign" },
    { value: "map", label: "Map" },
    { value: "school", label: "School" },
  ],
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  kind?: CmsIconKind;
  id?: string;
  className?: string;
  disabled?: boolean;
};

/** Centralized icon picker — options show the glyph + friendly label, never a raw icon name. */
export function CmsIconSelect({ value, onChange, kind = "highlight", id, className = "", disabled = false }: Props) {
  const options: CmsSelectOption[] = ICONS[kind].map((icon) => ({
    value: icon.value,
    label: icon.label,
    icon: icon.value,
  }));
  return (
    <CmsSelect
      aria-label={`${kind === "payment" ? "Payment" : "Highlight"} icon`}
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
