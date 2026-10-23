"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PackageCard } from "@/components/package/PackageCard";
import { useScroller } from "@/hooks/useScroller";
import { featuredPackages } from "@/data/packages";

export function LatestPackages() {
  const { ref, prev, next } = useScroller<HTMLDivElement>();
  return (
    <section id="packages" className="scroll-mt-[110px] lg:scroll-mt-[156px] overflow-hidden py-20 lg:py-[110px]">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Latest packages" title="Spend less. Travel more." />
          <div className="flex items-center gap-[18px]">
            <Link href="/holidays/outbound" className="mr-2 flex items-center gap-1.5 text-[15px] font-semibold">
              View all
              <Icon name="arrow_forward" />
            </Link>
            <ArrowButton direction="prev" onClick={prev} />
            <ArrowButton direction="next" onClick={next} />
          </div>
        </div>

        <div
          ref={ref}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pt-2 pb-8 lg:mx-0 lg:scroll-px-0 lg:px-0"
        >
          {featuredPackages().map((p) => (
            <PackageCard key={p.slug} pkg={p} imageSizes="282px" className="w-[282px] flex-none snap-start" />
          ))}
        </div>
      </Container>
    </section>
  );
}
