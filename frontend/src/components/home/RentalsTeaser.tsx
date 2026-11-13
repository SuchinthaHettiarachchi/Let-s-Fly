"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { rentalPerks } from "@/data/home";
import {
  defaultRentalTeaser,
  getRentalTeaser,
  rentalSlotMeta,
  type RentalTeaserContent,
} from "@/lib/rental-teaser-api";

export function RentalsTeaser() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [content, setContent] = useState<RentalTeaserContent>(defaultRentalTeaser);

  useEffect(() => {
    let cancelled = false;
    void getRentalTeaser().then((next) => {
      if (!cancelled) setContent(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const slots = content.slots;
  const current = slots[selected] ?? slots[0];
  const currentMeta = current ? rentalSlotMeta[current.id] : null;

  // Image carousel: the vehicle photo changes on its own every few seconds. Picking a type
  // restarts the timer, hovering the photo pauses it, and reduced motion turns it off.
  useEffect(() => {
    if (paused || slots.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setSelected((i) => (i + 1) % slots.length), 4000);
    return () => window.clearTimeout(id);
  }, [selected, paused, slots.length]);

  return (
    <section id="rentals" className="scroll-mt-[110px] lg:scroll-mt-[156px] py-20 lg:py-[110px]">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-[72px]">
        <div data-reveal className="flex flex-col gap-5">
          <Eyebrow>Car &amp; bike rental</Eyebrow>
          <h2>
            Explore Sri Lanka at your own pace
          </h2>
          <p className="text-lead text-ink-600">
            Self-drive or with a chauffeur. Clean, insured vehicles delivered to your hotel or the airport.
          </p>
          <ul className="flex flex-col gap-3">
            {rentalPerks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-body">
                <Icon name="check_circle" size={22} fill className="text-ocean-600" />
                {perk}
              </li>
            ))}
          </ul>
          <div role="group" aria-label="Vehicle type" className="my-1 flex flex-wrap gap-2.5">
            {slots.map((t, i) => {
              const on = i === selected;
              const meta = rentalSlotMeta[t.id];
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  aria-label={meta.label}
                  title={meta.label}
                  onClick={() => setSelected(i)}
                  className={`flex h-[52px] w-16 cursor-pointer items-center justify-center rounded-full border-[1.5px] transition-[color,background-color,border-color,scale] duration-200 press ${
                    on
                      ? "border-ocean-600 bg-ocean-600 text-white"
                      : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
                  }`}
                >
                  <Icon name={meta.icon} size={28} />
                </button>
              );
            })}
          </div>
          <ButtonLink href="/rentals" variant="primary" size="lg" icon="arrow_forward" className="mt-1 self-start">
            View Rentals
          </ButtonLink>
        </div>

        <div
          data-reveal="150"
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative h-[320px] overflow-hidden rounded-2xl bg-sand-200 sm:h-[480px]">
            {slots.map((t, i) => (
              <Image
                key={`${t.id}-${t.image}`}
                src={t.image}
                alt={i === selected && currentMeta ? `${currentMeta.label} for rent` : ""}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className={`object-cover transition-opacity duration-700 ${i === selected ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
          {current && (
            <div className="absolute bottom-6 left-4 flex flex-col rounded-xl bg-sun-400 px-5 py-4 text-navy-900 shadow-[0_18px_40px_rgba(11,37,69,.18)] sm:bottom-9 lg:-left-7">
              <span className="text-caption font-medium">{current.line1}</span>
              <span className="num text-h3">{current.line2}</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
