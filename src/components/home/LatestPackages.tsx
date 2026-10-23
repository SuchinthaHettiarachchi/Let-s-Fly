"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PackageCard } from "@/components/package/PackageCard";
import { useScroller } from "@/hooks/useScroller";
import { packages, type Package } from "@/data/packages";

const filters: { label: string; category?: Package["category"] }[] = [
  { label: "All" },
  { label: "Travel Sri Lanka", category: "sri-lanka" },
  { label: "Overseas Travel", category: "outbound" },
];

export function LatestPackages() {
  const { ref, prev, next } = useScroller<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const { category } = filters[active];
  const shown = category ? packages.filter((p) => p.category === category) : packages;

  function choose(i: number) {
    setActive(i);
    ref.current?.scrollTo({ left: 0 });
  }

  return (
    <section id="packages" className="scroll-mt-[110px] lg:scroll-mt-[156px] overflow-hidden pt-20 pb-8 lg:pt-[110px] lg:pb-10">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Latest packages" title="Spend less. Travel more." />
          <div className="flex w-full flex-wrap items-center justify-between gap-4 lg:w-auto lg:justify-end">
            <div role="group" aria-label="Filter packages" className="flex flex-wrap gap-2">
              {filters.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => choose(i)}
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
            <div className="flex items-center gap-2.5">
              <Link href="/holidays/outbound" className="mr-2 flex items-center gap-1.5 text-[15px] font-semibold">
                View all
                <Icon name="arrow_forward" />
              </Link>
              <ArrowButton direction="prev" onClick={prev} />
              <ArrowButton direction="next" onClick={next} />
            </div>
          </div>
        </div>

        {/* Three rows that scroll sideways together; columns are sized so only whole cards show. */}
        <div
          ref={ref}
          className="no-scrollbar -mx-4 grid snap-x snap-mandatory scroll-px-4 auto-cols-[82%] grid-flow-col sm:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-3.75rem)/4)] grid-rows-3 gap-5 overflow-x-auto px-4 pt-2 pb-4 lg:mx-0 lg:scroll-px-0 lg:px-0"
        >
          {shown.map((p) => (
            <PackageCard key={p.slug} pkg={p} imageSizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 82vw" compact className="snap-start" />
          ))}
        </div>
      </Container>
    </section>
  );
}
