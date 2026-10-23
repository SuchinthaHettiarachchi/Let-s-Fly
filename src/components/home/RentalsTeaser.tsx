"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { rentalPerks, rentalTypes } from "@/data/home";

export function RentalsTeaser() {
  const [selected, setSelected] = useState(0);
  const current = rentalTypes[selected];

  return (
    <section id="rentals" className="scroll-mt-[110px] lg:scroll-mt-[156px] py-20 lg:py-[110px]">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-[72px]">
        <div className="flex flex-col gap-5">
          <Eyebrow>Car &amp; bike rental</Eyebrow>
          <h2 className="text-[30px] leading-[1.18] font-bold tracking-[-0.01em] text-pretty sm:text-[36px] lg:text-[42px]">
            Explore Sri Lanka at your own pace
          </h2>
          <p className="text-base leading-[1.75] text-ink-600">
            Self-drive or with a chauffeur — clean, insured vehicles delivered to your hotel or the airport.
          </p>
          <ul className="flex flex-col gap-3">
            {rentalPerks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-[15px]">
                <Icon name="check_circle" size={22} fill className="text-ocean-600" />
                {perk}
              </li>
            ))}
          </ul>
          <div role="group" aria-label="Vehicle type" className="my-1 flex flex-wrap gap-2.5">
            {rentalTypes.map((t, i) => {
              const on = i === selected;
              return (
                <button
                  key={t.label}
                  type="button"
                  aria-pressed={on}
                  aria-label={t.label}
                  title={t.label}
                  onClick={() => setSelected(i)}
                  className={`flex h-[52px] w-16 cursor-pointer items-center justify-center rounded-full border-[1.5px] transition-colors ${
                    on
                      ? "border-ocean-600 bg-ocean-600 text-white"
                      : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
                  }`}
                >
                  <Icon name={t.icon} size={28} />
                </button>
              );
            })}
          </div>
          <ButtonLink href="/rentals" variant="primary" size="lg" icon="arrow_forward" className="mt-1 self-start">
            View Rentals
          </ButtonLink>
        </div>

        <div className="relative">
          <div className="relative h-[320px] overflow-hidden rounded-2xl bg-sand-200 sm:h-[480px]">
            {rentalTypes.map((t, i) => (
              <Image
                key={t.image}
                src={t.image}
                alt={i === selected ? `${t.label} for rent` : ""}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className={`object-cover transition-opacity duration-500 ${i === selected ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
          <div className="absolute bottom-6 left-4 flex flex-col rounded-xl bg-sun-400 px-5 py-4 text-navy-900 shadow-[0_18px_40px_rgba(11,37,69,.18)] sm:bottom-9 lg:-left-7">
            <span className="text-xs font-medium">{current.label} from</span>
            <span className="text-2xl font-bold">{current.price}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
