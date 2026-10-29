"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { PackageCard } from "@/components/package/PackageCard";
import { HotelBookingCard } from "@/components/holidays/HotelBookings";
import { JourneyCard } from "@/components/holidays/JourneyList";
import { packages, type Package } from "@/data/packages";
import { journeys } from "@/data/journeys";

/** At most 3 rows of 4. Packages are listed newest first in data/packages.ts. */
const MAX_SHOWN = 12;

type Filter = { label: string; href: string; show: "packages" | "hotels" | "journeys"; category?: Package["category"] };

const filters: Filter[] = [
  { label: "All", show: "packages", href: "/holidays/outbound" },
  { label: "Travel Sri Lanka", show: "packages", category: "sri-lanka", href: "/holidays/sri-lanka" },
  { label: "Overseas Travel", show: "packages", category: "outbound", href: "/holidays/outbound" },
  { label: "Hotel bookings", show: "hotels", href: "/holidays/sri-lanka#hotels" },
  { label: "Train & Cruise", show: "journeys", href: "/holidays/trains-cruises" },
];

export function LatestPackages() {
  const [active, setActive] = useState(0);
  const pills = useRef<HTMLDivElement>(null);
  const { show, category, href } = filters[active];
  const shown = (category ? packages.filter((p) => p.category === category) : packages).slice(0, MAX_SHOWN);

  const scrollPills = (dir: 1 | -1) => pills.current?.scrollBy({ left: dir * 160, behavior: "smooth" });

  return (
    <section id="packages" className="scroll-mt-[110px] lg:scroll-mt-[156px] pt-20 pb-12 lg:pt-[110px] lg:pb-14">
      <Container>
        <div data-reveal className="mb-10 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Latest packages" title="Spend less. Travel more." />
          <div className="flex w-full min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:justify-end">
            {/* One scrolling row on narrow screens, with arrows to nudge it; all pills fit from lg up. */}
            <div className="flex w-full min-w-0 items-center gap-2 sm:flex-1 lg:w-auto lg:flex-none">
              <PillArrow direction="prev" onClick={() => scrollPills(-1)} />
              <div
                ref={pills}
                role="group"
                aria-label="Filter packages"
                className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto lg:flex-none"
              >
                {filters.map((f, i) => (
                  <button
                    key={f.label}
                    type="button"
                    aria-pressed={i === active}
                    onClick={() => setActive(i)}
                    className={`h-10 flex-none cursor-pointer rounded-full border-[1.5px] px-[18px] text-small font-semibold whitespace-nowrap transition-[color,background-color,border-color,scale] duration-200 press ${
                      i === active
                        ? "border-navy-900 bg-navy-900 text-white"
                        : "border-sand-300 bg-white text-ink-600 hover:border-ocean-600 hover:text-ocean-600"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <PillArrow direction="next" onClick={() => scrollPills(1)} />
            </div>
            <Link href={href} className="flex flex-none items-center gap-1.5 text-body font-semibold">
              View all
              <Icon name="arrow_forward" />
            </Link>
          </div>
        </div>

        {show === "hotels" && <HotelBookingCard />}

        {show === "journeys" && (
          <ul className="flex flex-col gap-4 pt-2">
            {journeys.map((j) => (
              <li key={j.id}>
                <JourneyCard journey={j} />
              </li>
            ))}
          </ul>
        )}

        {/* Fills 4 across, then wraps: 12 packages make 3 full rows, 10 make 4 + 4 + 2. */}
        {show === "packages" && (
          <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((p, i) => (
              <div key={p.slug} data-reveal={(i % 4) * 90}>
                <PackageCard pkg={p} imageSizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" compact className="h-full" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function PillArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={direction === "next" ? "Scroll filters right" : "Scroll filters left"}
      onClick={onClick}
      className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-full border-[1.5px] border-sand-300 bg-white text-ocean-600 transition-[border-color,scale] duration-200 hover:border-ocean-600 press lg:hidden"
    >
      <Icon name={direction === "next" ? "chevron_right" : "chevron_left"} size={20} />
    </button>
  );
}
