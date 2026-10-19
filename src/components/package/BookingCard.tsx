"use client";

import { useState, useSyncExternalStore } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { contact } from "@/data/site";
import { formatLKR, type Package } from "@/data/packages";

const MAX_TRAVELLERS = 20;
const noopSubscribe = () => () => {};

/**
 * Next 12 months, read on the client only. The page is prerendered at build
 * time, so computing this on the server would freeze the list at build date.
 */
function useUpcomingMonths() {
  const start = useSyncExternalStore(
    noopSubscribe,
    () => {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    },
    () => null,
  );
  if (start === null) return [];
  return Array.from({ length: 12 }, (_, i) =>
    new Date(Math.floor((start + i) / 12), (start + i) % 12, 1).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    }),
  );
}

export function BookingCard({ pkg }: { pkg: Package }) {
  const { openInquiry } = useInquiry();
  const months = useUpcomingMonths();
  const [month, setMonth] = useState("");
  const [travellers, setTravellers] = useState(2);
  const selectedMonth = month || months[0] || "";

  const summary = `${selectedMonth ? `${selectedMonth}, ` : ""}${travellers} traveller${travellers === 1 ? "" : "s"}`;
  const whatsappText = encodeURIComponent(`Hi Let's Fly, I'm interested in ${pkg.title} (${summary}).`);

  const stepBtn =
    "flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="overflow-hidden rounded-xl border border-sand-300 bg-white shadow-lf-md">
      <div className="flex flex-col gap-4 p-6">
        <div>
          <div className="text-xs text-ink-400">From, per person</div>
          <div className="text-[30px] font-bold text-ocean-600">{formatLKR(pkg.price)}</div>
          {pkg.priceNote && <div className="text-xs text-ink-400">{pkg.priceNote}</div>}
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-ink-600">
          Travel month
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setMonth(e.target.value)}
              className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-sand-300 bg-white px-3.5 pr-10 text-sm text-ink-900 focus:border-ocean-600 focus:outline-none"
            >
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <Icon name="expand_more" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-400" />
          </div>
        </label>

        <div className="flex items-center justify-between rounded-lg border border-sand-300 px-3.5 py-2.5">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Travellers</span>
            <span className="text-xs text-ink-400">Adults &amp; children</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Remove a traveller"
              disabled={travellers <= 1}
              onClick={() => setTravellers((n) => n - 1)}
              className={`${stepBtn} border border-sand-300 text-ink-600 hover:border-ocean-600`}
            >
              <Icon name="remove" size={18} />
            </button>
            <span aria-live="polite" className="w-5 text-center text-[15px] font-semibold">
              {travellers}
            </span>
            <button
              type="button"
              aria-label="Add a traveller"
              disabled={travellers >= MAX_TRAVELLERS}
              onClick={() => setTravellers((n) => n + 1)}
              className={`${stepBtn} bg-ocean-600 text-white hover:bg-ocean-500`}
            >
              <Icon name="add" size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-sand-300 pt-4 text-sm">
          <span className="text-ink-600">Estimated total</span>
          <span className="font-bold">{formatLKR(pkg.price * travellers)}</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon="arrow_forward"
          className="w-full"
          onClick={() => openInquiry({ service: "Tour package", destination: pkg.title, details: summary })}
        >
          Inquire Now
        </Button>
        <ButtonLink
          href={`${contact.whatsappHref}?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="lg"
          leadingIcon="chat"
          className="w-full"
        >
          WhatsApp Us
        </ButtonLink>
      </div>
      <div className="h-1.5 bg-sun-400" />
    </div>
  );
}
