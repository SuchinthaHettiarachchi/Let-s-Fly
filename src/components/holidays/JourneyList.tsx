"use client";

import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { contact } from "@/data/site";
import { formatLKR } from "@/data/packages";
import type { Journey } from "@/data/journeys";

const kinds = [
  { id: "train", label: "Trains", icon: "train", note: "Seats open 30 days before travel, so book early." },
  { id: "cruise", label: "Cruises", icon: "directions_boat", note: "Cabins sell out early in peak season." },
] as const;

export function JourneyList({ journeys }: { journeys: Journey[] }) {
  const [kind, setKind] = useState<Journey["kind"]>("train");
  const current = kinds.find((k) => k.id === kind)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Journey type" className="inline-flex self-start rounded-xl bg-sand-50 p-1.5">
          {kinds.map((k) => {
            const on = k.id === kind;
            return (
              <button
                key={k.id}
                role="tab"
                aria-selected={on}
                onClick={() => setKind(k.id)}
                className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg px-5 text-small font-semibold transition-colors ${
                  on ? "bg-white text-ocean-600 shadow-lf-header" : "text-ink-600 hover:text-ocean-600"
                }`}
              >
                <Icon name={k.icon} size={20} />
                {k.label}
              </button>
            );
          })}
        </div>
        <p className="text-small text-ink-400">{current.note}</p>
      </div>

      <ul role="tabpanel" aria-label={current.label} className="flex flex-col gap-4">
        {journeys
          .filter((j) => j.kind === kind)
          .map((j, i) => (
            <li key={j.id} data-reveal={(i % 3) * 90}>
              <JourneyCard journey={j} />
            </li>
          ))}
      </ul>
    </div>
  );
}

/** One train or cruise row, also shown under the home page's "Train & Cruise" filter. */
export function JourneyCard({ journey: j }: { journey: Journey }) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-sand-300 bg-white transition-[border-color,box-shadow] hover:border-ocean-600 hover:shadow-lf-card-hover md:grid-cols-[260px_1fr_220px]">
      <div className="relative h-[180px] bg-sand-200 md:h-auto md:min-h-[180px]">
        {j.image ? (
          <Image src={j.image} alt="" fill sizes="(min-width: 768px) 260px, 100vw" className="object-cover" />
        ) : (
          <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
        )}
      </div>
      <div className="flex flex-col gap-2.5 p-6">
        <span className="eyebrow text-ocean-600">{j.label}</span>
        <h3 className="font-sans text-h4">{j.title}</h3>
        <p className="text-body text-ink-600">{j.text}</p>
        <ul className="mt-1 flex flex-wrap gap-2">
          {j.chips.map((c) => (
            <li key={c} className="rounded-full bg-sand-50 px-3 py-1 text-caption font-medium text-ocean-600">
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row items-end justify-between gap-4 border-t border-sand-300 p-6 md:flex-col md:items-start md:justify-center md:border-t-0 md:border-l">
        <div className="flex flex-col">
          <span className="text-caption font-normal text-ink-400">From</span>
          <span className="num font-sans text-h3 font-bold text-ocean-600">{formatLKR(j.price)}</span>
          <span className="text-caption font-normal text-ink-400">{j.priceNote}</span>
        </div>
        <ButtonLink
          href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, I'd like to book: ${j.title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="md"
          icon="arrow_forward"
        >
          Book Now
        </ButtonLink>
      </div>
    </div>
  );
}
