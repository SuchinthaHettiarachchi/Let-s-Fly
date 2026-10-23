"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { PackageCard } from "@/components/package/PackageCard";
import { packages, type Package } from "@/data/packages";

/** At most 3 rows of 4. Packages are listed newest first in data/packages.ts. */
const MAX_SHOWN = 12;

const filters: { label: string; category?: Package["category"]; href: string }[] = [
  { label: "All", href: "/holidays/outbound" },
  { label: "Travel Sri Lanka", category: "sri-lanka", href: "/holidays/sri-lanka" },
  { label: "Overseas Travel", category: "outbound", href: "/holidays/outbound" },
];

export function LatestPackages() {
  const [active, setActive] = useState(0);
  const { category, href } = filters[active];
  const shown = (category ? packages.filter((p) => p.category === category) : packages).slice(0, MAX_SHOWN);

  return (
    <section id="packages" className="scroll-mt-[110px] lg:scroll-mt-[156px] pt-20 pb-12 lg:pt-[110px] lg:pb-14">
      <Container>
        <div data-reveal className="mb-10 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Latest packages" title="Spend less. Travel more." />
          <div className="flex w-full flex-wrap items-center justify-between gap-4 lg:w-auto lg:justify-end">
            <div role="group" aria-label="Filter packages" className="flex flex-wrap gap-2">
              {filters.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                  className={`h-10 cursor-pointer rounded-full border-[1.5px] px-[18px] text-[13.5px] font-semibold transition-colors ${
                    i === active
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-sand-300 bg-white text-ink-600 hover:border-ocean-600 hover:text-ocean-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Link href={href} className="flex items-center gap-1.5 text-[15px] font-semibold">
              View all
              <Icon name="arrow_forward" />
            </Link>
          </div>
        </div>

        {/* Fills 4 across, then wraps: 12 packages make 3 full rows, 10 make 4 + 4 + 2. */}
        <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p, i) => (
            <div key={p.slug} data-reveal={(i % 4) * 90}>
              <PackageCard pkg={p} imageSizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" compact className="h-full" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
