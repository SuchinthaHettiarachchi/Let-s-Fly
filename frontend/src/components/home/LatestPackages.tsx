"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { PackageCard, type PackageCardData } from "@/components/package/PackageCard";
import { HotelBookingCard } from "@/components/holidays/HotelBookings";
import { JourneyCard } from "@/components/holidays/JourneyList";
import type { Package } from "@/data/packages";
import type { Journey as VisitorJourney } from "@/data/journeys";
import { defaultHotelBooking, type HotelBookingContent } from "@/lib/hotel-booking-api";
import { browserApiUrl } from "@/lib/api-url";
import { toVisitorJourney, type Journey as JourneyRecord } from "@/lib/journey-api";

/** At most 3 rows of 4, balanced across Travel Sri Lanka and Outbound. */
const MAX_SHOWN = 12;
const PACKAGES_URL = browserApiUrl("/packages");

type CmsPackage = PackageCardData & {
  category: Package["category"];
  _id?: string;
  createdAt?: string;
};
type Filter = { label: string; href: string; show: "packages" | "hotels" | "journeys"; category?: Package["category"] };

const filters: Filter[] = [
  { label: "All", show: "packages", href: "/holidays/outbound" },
  { label: "Travel Sri Lanka", show: "packages", category: "sri-lanka", href: "/holidays/sri-lanka" },
  { label: "Overseas Travel", show: "packages", category: "outbound", href: "/holidays/outbound" },
  { label: "Hotel bookings", show: "hotels", href: "/holidays/sri-lanka#hotels" },
  { label: "Train & Cruise", show: "journeys", href: "/holidays/trains-cruises" },
];

function packageTime(p: CmsPackage) {
  const t = p.createdAt ? Date.parse(p.createdAt) : 0;
  return Number.isFinite(t) ? t : 0;
}

function byNewest(a: CmsPackage, b: CmsPackage) {
  return packageTime(b) - packageTime(a) || String(b._id ?? b.slug).localeCompare(String(a._id ?? a.slug));
}

function balanceLatest(sriLanka: CmsPackage[], outbound: CmsPackage[]): CmsPackage[] {
  const primary = [...sriLanka.slice(0, 6), ...outbound.slice(0, 6)];
  const seen = new Set(primary.map((p) => p.slug || String(p._id ?? "")));
  const chosen = [...primary];

  if (chosen.length < 12) {
    const rest = [...sriLanka.slice(6), ...outbound.slice(6)].sort(byNewest);
    for (const p of rest) {
      if (chosen.length >= 12) break;
      const key = p.slug || String(p._id ?? "");
      if (seen.has(key)) continue;
      seen.add(key);
      chosen.push(p);
    }
  }

  return chosen.sort(byNewest).slice(0, 12);
}

export function LatestPackages() {
  const [active, setActive] = useState(0);
  const [sriLankaPackages, setSriLankaPackages] = useState<CmsPackage[]>([]);
  const [outboundPackages, setOutboundPackages] = useState<CmsPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hotelContent, setHotelContent] = useState<HotelBookingContent | null>(null);
  const [journeys, setJourneys] = useState<VisitorJourney[]>([]);
  const [extrasLoading, setExtrasLoading] = useState(true);
  const pills = useRef<HTMLDivElement>(null);
  const { show, category, href } = filters[active];

  const allPackages = useMemo(
    () => balanceLatest(sriLankaPackages, outboundPackages),
    [sriLankaPackages, outboundPackages],
  );

  const shown =
    category === "sri-lanka"
      ? sriLankaPackages.slice(0, MAX_SHOWN)
      : category === "outbound"
        ? outboundPackages.slice(0, MAX_SHOWN)
        : allPackages;

  const shownJourneys = useMemo(() => {
    const time = (j: VisitorJourney) => {
      const t = parseInt(String(j.id).slice(0, 8), 16);
      return Number.isFinite(t) ? t * 1000 : 0;
    };
    const sorted = [...journeys].sort((a, b) => time(b) - time(a));
    const trains = sorted.filter((j) => j.kind === "train");
    const cruises = sorted.filter((j) => j.kind === "cruise");
    const picked = [...trains.slice(0, 3), ...cruises.slice(0, 2)];
    const used = new Set(picked.map((j) => j.id));
    for (const j of [...trains.slice(3), ...cruises.slice(2)]) {
      if (picked.length >= 5) break;
      if (!used.has(j.id)) {
        picked.push(j);
        used.add(j.id);
      }
    }
    return picked.slice(0, 5);
  }, [journeys]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [sriRes, outRes] = await Promise.all([
          fetch(`${PACKAGES_URL}?category=sri-lanka`),
          fetch(`${PACKAGES_URL}?category=outbound`),
        ]);
        if (!sriRes.ok || !outRes.ok) throw new Error("Failed to load packages");
        const [sriData, outData] = (await Promise.all([sriRes.json(), outRes.json()])) as [
          { packages?: CmsPackage[] },
          { packages?: CmsPackage[] },
        ];
        if (cancelled) return;
        setSriLankaPackages(Array.isArray(sriData.packages) ? sriData.packages : []);
        setOutboundPackages(Array.isArray(outData.packages) ? outData.packages : []);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadExtras() {
      try {
        const [hotelRes, journeyRes] = await Promise.all([
          fetch(browserApiUrl("/hotel-booking")),
          fetch(browserApiUrl("/journey-categories")),
        ]);
        if (cancelled) return;
        if (hotelRes.ok) {
          const data = (await hotelRes.json()) as { content?: Partial<HotelBookingContent> };
          if (data.content) setHotelContent({ ...defaultHotelBooking, ...data.content });
        }
        if (journeyRes.ok) {
          const data = (await journeyRes.json()) as { journeys?: JourneyRecord[] };
          if (Array.isArray(data.journeys)) setJourneys(data.journeys.map(toVisitorJourney));
        }
      } catch {
        setHotelContent(defaultHotelBooking);
      } finally {
        if (!cancelled) setExtrasLoading(false);
      }
    }
    void loadExtras();
    return () => {
      cancelled = true;
    };
  }, []);

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
                    className={`h-11 flex-none sm:h-10 cursor-pointer rounded-full border-[1.5px] px-[18px] text-small font-semibold whitespace-nowrap transition-[color,background-color,border-color,scale] duration-200 press ${
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

        {show === "hotels" && <HotelBookingCard content={hotelContent ?? defaultHotelBooking} />}

        {show === "journeys" && (
          extrasLoading ? (
            <div className="rounded-xl border border-dashed border-sand-300 py-12 text-center text-body text-ink-400">Loading journeys…</div>
          ) : shownJourneys.length ? (
            <ul className="flex flex-col gap-4 pt-2">
              {shownJourneys.map((j) => (
                <li key={j.id}>
                  <JourneyCard journey={j} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-sand-300 py-12 text-center text-body text-ink-600">No journeys are available yet.</div>
          )
        )}

        {/* Fills 4 across, then wraps: 12 packages make 3 full rows, 10 make 4 + 4 + 2. */}
        {show === "packages" && (
          loading ? <div className="rounded-xl border border-dashed border-sand-300 py-12 text-center text-body text-ink-400">Loading packages…</div>
            : error ? <div className="rounded-xl border border-dashed border-sand-300 py-12 text-center text-body text-ink-600">Packages are temporarily unavailable.</div>
              : shown.length ? <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-4">{shown.map((p, i) => <div key={p.slug} data-reveal={(i % 4) * 90}><PackageCard pkg={p} imageSizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" compact className="h-full" /></div>)}</div>
                : <div className="rounded-xl border border-dashed border-sand-300 py-12 text-center text-body text-ink-600">No packages are available yet.</div>
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
      className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border-[1.5px] border-sand-300 bg-white text-ocean-600 transition-[border-color,scale] duration-200 hover:border-ocean-600 press lg:hidden"
    >
      <Icon name={direction === "next" ? "chevron_right" : "chevron_left"} size={20} />
    </button>
  );
}
