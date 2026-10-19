"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Package } from "@/data/packages";

type Props = {
  itinerary: NonNullable<Package["itinerary"]>;
  days: number;
  nights: number;
};

export function ItineraryPanel({ itinerary, days, nights }: Props) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const allOpen = open.size === itinerary.days.length;

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Day-by-day itinerary</h2>
          <p className="mt-1 text-[13px] text-ink-400">
            {days} days · {nights} nights · {itinerary.endpoints}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(itinerary.days.map((_, i) => i)))}
          className="flex h-9 flex-none cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-sand-300 bg-white px-3 text-[13px] font-semibold text-ocean-600 hover:border-ocean-600"
        >
          <Icon name={allOpen ? "unfold_less" : "unfold_more"} size={18} />
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <ol aria-label="Route" className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-sand-50 px-4 py-3 text-[13px] font-medium text-ocean-600">
        <Icon name="route" size={18} className="mr-1" />
        {itinerary.route.map((stop, i) => (
          <li key={`${stop}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-sand-400" />}
            {stop}
          </li>
        ))}
      </ol>

      <ol className="relative flex flex-col gap-3">
        {/* Dotted timeline behind the day badges. */}
        <span aria-hidden="true" className="absolute top-6 bottom-6 left-[37px] border-l-2 border-dotted border-sand-300" />
        {itinerary.days.map((day, i) => {
          const isOpen = open.has(i);
          const n = String(i + 1).padStart(2, "0");
          return (
            <li
              key={day.title}
              className={`relative rounded-xl border bg-white transition-shadow ${
                isOpen ? "border-sand-300 shadow-lf-md" : "border-sand-300"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`day-${i}`}
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-start gap-4 p-4 text-left sm:p-5"
              >
                <span
                  className={`flex size-10 flex-none flex-col items-center justify-center rounded-lg leading-none transition-colors ${
                    isOpen ? "bg-ocean-600 text-white" : "bg-sand-50 text-ocean-600"
                  }`}
                >
                  <span className="text-[8px] font-semibold tracking-[0.12em] opacity-80">DAY</span>
                  <span className="text-[15px] font-bold">{n}</span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-ocean-600 uppercase">
                    {day.category}
                  </span>
                  <span className="text-[15.5px] leading-snug font-semibold text-ink-900">{day.title}</span>
                  <span className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
                    {day.meta.map((m) => (
                      <span key={m.label} className="flex items-center gap-1">
                        <Icon name={m.icon} size={15} />
                        {m.label}
                      </span>
                    ))}
                  </span>
                </span>
                <span
                  className={`flex size-8 flex-none items-center justify-center rounded-full transition-colors ${
                    isOpen ? "bg-ocean-600 text-white" : "border border-sand-300 text-ink-600"
                  }`}
                >
                  <Icon name="expand_more" size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              <div id={`day-${i}`} hidden={!isOpen} className="px-4 pb-5 sm:pr-16 sm:pl-[76px]">
                <p className="border-t border-dashed border-sand-300 pt-4 text-sm leading-[1.8] text-ink-600">
                  {day.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="flex gap-2 text-xs leading-relaxed text-ink-400">
        <Icon name="info" size={16} className="mt-px text-ocean-600" />
        {itinerary.footnote}
      </p>
    </div>
  );
}
