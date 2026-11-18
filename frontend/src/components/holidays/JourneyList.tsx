"use client";

import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { contact } from "@/data/site";
import { formatLKR } from "@/lib/package-format";
import type { Journey } from "@/data/journeys";

const kinds = [
  { id: "train", label: "Trains", icon: "train", note: "Seats open 30 days before travel, so book early." },
  { id: "cruise", label: "Cruises", icon: "directions_boat", note: "Cabins sell out early in peak season." },
] as const;

const trainCountries = [
  { id: "all", label: "All" },
  { id: "Sri Lankan", label: "Sri Lankans" },
  { id: "Overseas", label: "Overseas" },
] as const;

export function JourneyList({ journeys }: { journeys: Journey[] }) {
  const [kind, setKind] = useState<Journey["kind"]>("train");
  const [trainCountry, setTrainCountry] = useState<"all" | "Sri Lankan" | "Overseas">("all");
  const current = kinds.find((k) => k.id === kind)!;
  const visible = journeys.filter((j) => {
    if (j.kind !== kind) return false;
    if (kind === "train" && trainCountry !== "all") return j.country === trainCountry;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div role="tablist" aria-label="Journey type" className="grid w-full grid-cols-2 rounded-xl bg-sand-50 p-1.5 sm:inline-flex sm:w-auto">
            {kinds.map((k) => {
              const on = k.id === kind;
              return (
                <button
                  key={k.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setKind(k.id)}
                  className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-small font-semibold transition-[color,background-color,box-shadow,scale] duration-200 press ${
                    on ? "bg-white text-ocean-600 shadow-lf-header ring-1 ring-ocean-600/30" : "text-ink-600 hover:text-ocean-600"
                  }`}
                >
                  <Icon name={k.icon} size={20} />
                  {k.label}
                </button>
              );
            })}
          </div>

          {kind === "train" && (
            <div role="radiogroup" aria-label="Train traveler type" className="flex flex-wrap items-center gap-2 rounded-xl border border-sand-300 bg-white p-1.5 sm:justify-end">
              {trainCountries.map((option) => {
                const on = trainCountry === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-small font-semibold transition-colors ${
                      on ? "bg-ocean-600/10 text-ocean-700" : "text-ink-600 hover:bg-sand-50 hover:text-ocean-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="train-country"
                      value={option.id}
                      checked={on}
                      onChange={() => setTrainCountry(option.id)}
                      className="h-4 w-4 accent-ocean-600"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          )}
        </div>
        <p className="text-small text-ink-400">{current.note}</p>
      </div>

      {visible.length ? (
        <ul role="tabpanel" aria-label={current.label} className="flex flex-col gap-5">
          {visible.map((j, i) => (
            <li key={j.id} data-reveal={(i % 3) * 90}>
              <JourneyCard journey={j} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-sand-300 bg-sand-50/60 px-6 py-12 text-center text-body text-ink-600">
          No {kind === "train" ? (trainCountry === "all" ? "train" : `${trainCountries.find((c) => c.id === trainCountry)?.label.toLowerCase()} train`) : "cruise"} journeys available right now.
        </div>
      )}
    </div>
  );
}

/** One train or cruise row, also shown under the home page's "Train & Cruise" filter. */
export function JourneyCard({ journey: j }: { journey: Journey }) {
  return (
    <div className="group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-sand-200/80 bg-white shadow-[0_10px_30px_rgba(11,37,69,0.06)] transition-[transform,box-shadow,border-color] duration-300 ease-lf hover:-translate-y-1 hover:border-ocean-600/40 hover:shadow-lf-card-hover md:grid-cols-[280px_minmax(0,1fr)_240px]">
      <div className="relative h-[210px] overflow-hidden bg-sand-200 md:h-auto md:min-h-[220px]">
        {j.image ? (
          <Image
            src={j.image}
            alt=""
            fill
            sizes="(min-width: 768px) 280px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/45 via-navy-900/5 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-caption font-semibold text-ocean-700 shadow-sm backdrop-blur">
            <Icon name={j.kind === "train" ? "train" : "directions_boat"} size={15} />
            {j.kind === "train" ? "Train" : "Cruise"}
          </span>
          {j.kind === "train" && j.country && (
            <span className="inline-flex items-center rounded-full bg-navy-900/80 px-3 py-1.5 text-caption font-semibold text-white backdrop-blur">
              {j.country === "Sri Lankan" ? "Sri Lankans" : "Overseas"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-6 md:p-7">
        <span className="inline-flex w-fit items-center rounded-full bg-ocean-600/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ocean-700">
          {j.label}
        </span>
        <h3 className="font-sans text-h4 text-navy-900">{j.title}</h3>
        <p className="max-w-[62ch] text-body leading-[1.65] text-ink-600">{j.text}</p>
        {j.chips?.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {j.chips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-sand-300 bg-sand-50 px-3 py-1.5 text-caption font-medium text-ocean-700"
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-row items-end justify-between gap-4 border-t border-sand-200 bg-gradient-to-b from-white to-sand-50/70 p-6 md:flex-col md:items-stretch md:justify-center md:gap-5 md:border-t-0 md:border-l md:p-7">
        <div className="flex flex-col">
          <span className="text-caption font-medium uppercase tracking-[0.08em] text-ink-400">From</span>
          <span className="num mt-1 font-sans text-h3 font-bold leading-none text-ocean-600">{formatLKR(j.price)}</span>
          <span className="mt-1.5 text-caption font-normal text-ink-500">{j.priceNote}</span>
        </div>
        <ButtonLink
          href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, I'd like to book: ${j.title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="md"
          icon="arrow_forward"
          className="md:w-full md:justify-center"
        >
          Book Now
        </ButtonLink>
      </div>
    </div>
  );
}
