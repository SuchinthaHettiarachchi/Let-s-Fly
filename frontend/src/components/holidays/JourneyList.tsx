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
  { id: "train", label: "Trains", icon: "train", note: "Reserved seats are limited and typically open 30 days before departure. We recommend booking early to secure the best availability." },
  { id: "cruise", label: "Cruises", icon: "directions_boat", note: "Cabin availability is limited during peak travel seasons. Early reservations help secure preferred cabins and sailing dates." },
] as const;

const trainCountries = [
  { id: "all", label: "All routes" },
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
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-sand-200 bg-white/70 p-3 shadow-sm backdrop-blur-sm sm:p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div role="tablist" aria-label="Journey type" className="inline-flex w-full rounded-xl border border-sand-200 bg-sand-50 p-1 sm:w-auto">
              {kinds.map((k) => {
                const on = k.id === kind;
                return (
                  <button
                    key={k.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setKind(k.id)}
                    className={`flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-small font-semibold transition-all duration-200 sm:flex-none ${
                      on
                        ? "bg-white text-ocean-700 shadow-sm ring-1 ring-ocean-600/10"
                        : "text-ink-500 hover:bg-white/70 hover:text-ocean-700"
                    }`}
                  >
                    <Icon name={k.icon} size={19} />
                    {k.label}
                  </button>
                );
              })}
            </div>

            {kind === "train" && (
              <div className="flex flex-col gap-2 sm:items-end">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">Traveler type</span>
                <div role="radiogroup" aria-label="Train traveler type" className="inline-flex flex-wrap gap-1.5 rounded-xl border border-sand-200 bg-sand-50 p-1">
                  {trainCountries.map((option) => {
                    const on = trainCountry === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-small font-medium transition-all duration-200 ${
                          on ? "bg-white text-ocean-700 shadow-sm ring-1 ring-ocean-600/10" : "text-ink-500 hover:bg-white/70 hover:text-ocean-700"
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
              </div>
            )}
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-ocean-600/10 bg-ocean-600/[0.04] px-4 py-3 text-small leading-[1.6] text-ink-600">
            <Icon name="info" size={18} className="mt-0.5 shrink-0 text-ocean-600" />
            <p>{current.note}</p>
          </div>
        </div>
      </div>

      {visible.length ? (
        <ul role="tabpanel" aria-label={current.label} className="flex flex-col gap-6">
          {visible.map((j, i) => (
            <li key={j.id} data-reveal={(i % 3) * 90}>
              <JourneyCard journey={j} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-sand-300 bg-sand-50/70 px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white text-ocean-600 shadow-sm ring-1 ring-sand-200">
            <Icon name={kind === "train" ? "train" : "directions_boat"} size={22} />
          </span>
          <div>
            <p className="text-h5 text-navy-900">No journeys available</p>
            <p className="mt-1 text-body text-ink-500">
              No {kind === "train" ? (trainCountry === "all" ? "train" : `${trainCountries.find((c) => c.id === trainCountry)?.label.toLowerCase()} train`) : "cruise"} journeys are listed at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** One train or cruise row, also shown under the home page's "Train & Cruise" filter. */
export function JourneyCard({ journey: j }: { journey: Journey }) {
  const route = [j.startingPoint, ...(j.stops ?? [])].map((s) => s?.trim()).filter(Boolean) as string[];
  const dedupedRoute = route.filter((point, index) => index === 0 || point.toLowerCase() !== route[index - 1]?.toLowerCase());
  const stopCount = Math.max(0, dedupedRoute.length - 1);

  return (
    <article className="group relative overflow-hidden rounded-3xl border-2 border-dashed border-sand-300/80 bg-white shadow-[0_12px_40px_rgba(11,37,69,0.08)] transition-all duration-300 ease-lf hover:-translate-y-1 hover:border-ocean-600/35 hover:shadow-[0_20px_50px_rgba(11,37,69,0.14)]">
      <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_260px]">
        <div className="relative min-h-[220px] overflow-hidden bg-sand-200 md:min-h-full">
          {j.image ? (
            <Image
              src={j.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 320px, (min-width: 768px) 300px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/55 via-navy-900/10 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-ocean-700 shadow-sm ring-1 ring-white/70 backdrop-blur">
              <Icon name={j.kind === "train" ? "train" : "directions_boat"} size={15} />
              {j.kind === "train" ? "Train journey" : "Cruise package"}
            </span>
            {j.kind === "train" && j.country && (
              <span className="inline-flex items-center rounded-full bg-navy-900/75 px-3 py-1.5 text-[12px] font-semibold text-white ring-1 ring-white/10 backdrop-blur">
                {j.country === "Sri Lankan" ? "Sri Lankans" : "Overseas"}
              </span>
            )}
          </div>
          {dedupedRoute.length > 1 && (
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[12px] font-semibold text-navy-900 shadow-sm backdrop-blur">
              <Icon name="route" size={14} className="text-ocean-600" />
              {stopCount} {stopCount === 1 ? "stop" : "stops"}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col p-6 md:p-7 xl:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-ocean-600/15 bg-ocean-600/[0.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ocean-700">
              {j.label}
            </span>
            {dedupedRoute[0] && (
              <span className="inline-flex items-center gap-1.5 text-caption font-medium text-ink-500">
                <Icon name="location_on" size={14} className="text-ocean-600" />
                Departs from {dedupedRoute[0]}
              </span>
            )}
          </div>

          <h3 className="mt-3 font-sans text-[1.45rem] font-semibold leading-[1.2] tracking-[-0.02em] text-navy-900 sm:text-h4">
            {j.title}
          </h3>
          <p className="mt-2.5 max-w-[64ch] text-body leading-[1.75] text-ink-600">{j.text}</p>

          {dedupedRoute.length > 0 && (
            <div className="mt-3 inline-flex max-w-full flex-wrap items-center rounded-xl border border-sand-300/80  px-4 py-2.5 text-small font-medium leading-[1.7] text-ink-700 ">
              {dedupedRoute.join("  →  ")}
            </div>
          )}

          {j.chips?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Highlights</p>
              <ul className="flex flex-wrap gap-2">
                {j.chips.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 bg-white px-3 py-1.5 text-caption font-medium text-ink-700 shadow-[0_1px_0_rgba(11,37,69,0.02)]"
                  >
                    <Icon name="check_circle" size={14} className="text-ocean-600" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="flex flex-col justify-between gap-5 border-t border-sand-200 bg-gradient-to-b from-sand-50/70 via-white to-white p-6 md:col-span-2 md:flex-row md:items-end xl:col-span-1 xl:flex-col xl:items-stretch xl:justify-center xl:border-t-0 xl:border-l xl:p-7">
          <div className="flex flex-col">
            {j.price > 0 ? (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Starting from</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="num font-sans text-[2rem] font-bold leading-none tracking-[-0.03em] text-ocean-700">{formatLKR(j.price)}</span>
                </div>
                <span className="mt-2 inline-flex w-fit items-center rounded-full bg-white px-2.5 py-1 text-caption font-medium text-ink-500 ring-1 ring-sand-200">
                  {j.priceNote}
                </span>
              </>
            ) : (
              <div className="mt-2">
                <span className="num font-sans text-[2rem] font-bold leading-none tracking-[-0.03em] text-ocean-700">Price on Request</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 md:min-w-[220px] xl:min-w-0">
            <ButtonLink
              href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, I'd like to book: ${j.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              icon="arrow_forward"
              className="w-full justify-center"
            >
              Book Now
            </ButtonLink>
            <p className="text-center text-[12px] leading-[1.5] text-ink-400">Speak with our team for availability and reservations.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
