"use client";

import Image from "next/image";
import { useState } from "react";
import { PackageCard } from "@/components/package/PackageCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { outboundRegions, type OutboundRegion, type Package } from "@/data/packages";

/** "Where to next?" region cards that filter the outbound package grid below them. */
export function RegionPackages({ tours }: { tours: Package[] }) {
  const [region, setRegion] = useState<OutboundRegion>(outboundRegions[0].id);
  const { openInquiry } = useInquiry();
  const count = (id: OutboundRegion) => tours.filter((t) => t.outboundRegion === id).length;
  const visible = tours.filter((t) => t.outboundRegion === region);
  const regionLabel = outboundRegions.find((r) => r.id === region)?.label ?? "";

  return (
    <div className="flex flex-col gap-9">
      <div role="group" aria-label="Region" className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {outboundRegions.map((r, i) => {
          const on = r.id === region;
          const n = count(r.id);
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={on}
              data-reveal={i * 90}
              onClick={() => setRegion(r.id)}
              className={`group relative h-[120px] cursor-pointer overflow-hidden rounded-xl bg-navy-900 text-left outline-offset-2 transition-[translate,box-shadow,scale] duration-300 ease-lf press-card hover:-translate-y-1 hover:shadow-lf-card-hover sm:h-[140px] ${
                on ? "-translate-y-1 shadow-lf-card-hover ring-[3px] ring-sun-400" : ""
              }`}
            >
              {r.image ? (
                <Image
                  src={r.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 300px, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <Icon name="travel_explore" size={56} className="absolute top-4 right-4 text-white/15" />
              )}
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,.1)_0%,rgba(11,37,69,.85)_100%)]" />
              <span className="absolute bottom-3.5 left-4 flex flex-col text-white">
                <span className="text-h4">{r.label}</span>
                <span className="text-caption font-normal text-white/80">
                  {n ? `${n} ${n === 1 ? "package" : "packages"}` : "Ask for a quote"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {visible.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t, i) => (
            <div key={t.slug} data-reveal={(i % 3) * 100}>
              <PackageCard pkg={t} className="h-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-sand-400 bg-sand-50 px-6 py-12 text-center">
          <p className="max-w-md text-body text-ink-600">
            We don&apos;t have ready-made {regionLabel} packages listed yet, but we plan custom trips there all the time.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon="arrow_forward"
            onClick={() => openInquiry({ service: "Tour package", destination: regionLabel })}
          >
            Ask for a {regionLabel} quote
          </Button>
        </div>
      )}
    </div>
  );
}
