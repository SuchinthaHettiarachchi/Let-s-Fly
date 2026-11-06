"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { ArrowButton, buttonClasses } from "@/components/ui/Button";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import type { Visa } from "@/data/visas";

const ANY = "";
/** Three rows of three on desktop. */
const PAGE_SIZE = 9;

/**
 * "Where Sri Lankans are heading": visa cards with a country search and a type filter,
 * shown 9 at a time with arrows and page dots (the list will grow to about 90 countries).
 */
export function VisaGrid({ visas }: { visas: Visa[] }) {
  const [type, setType] = useState(ANY);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const { openInquiry } = useInquiry();

  const types = [...new Set(visas.map((v) => v.type))];
  const q = query.trim().toLowerCase();
  const matches = visas.filter(
    (v) => (!type || v.type === type) && (!q || v.country.toLowerCase().includes(q) || v.city.toLowerCase().includes(q)),
  );
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = matches.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  const goTo = (p: number) => {
    setPage(p);
    // Bring the top of the grid back into view when paging from further down.
    const box = top.current?.getBoundingClientRect();
    if (box && box.top < 0) top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pill =
    "h-11 cursor-pointer appearance-none rounded-full sm:h-10 border-[1.5px] border-sand-300 bg-white pr-9 pl-4 font-medium text-ink-900 hover:border-ocean-600 focus:border-ocean-600 focus:outline-none";

  return (
    <div ref={top} className="flex scroll-mt-[110px] flex-col gap-8 lg:scroll-mt-[156px]">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex w-full items-center sm:w-[300px]">
          <span className="sr-only">Search country or city</span>
          <Icon name="search" size={20} className="pointer-events-none absolute left-4 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search country or city"
            className="h-11 w-full rounded-full border-[1.5px] border-sand-300 bg-white pr-4 pl-11 text-ink-900 placeholder:text-ink-400 hover:border-ocean-600 focus:border-ocean-600 focus:outline-none sm:h-10"
          />
        </label>
        <label className="relative flex items-center">
          <span className="sr-only">Visa type</span>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(0);
            }}
            className={pill}
          >
            <option value={ANY}>Visa Type</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Icon name="expand_more" size={18} className="pointer-events-none absolute right-3 text-ink-400" />
        </label>
        {/* Page arrows sit above the cards, so they're in reach without scrolling past 3 rows. */}
        {pages > 1 && (
          <nav aria-label="Visa pages" className="flex items-center gap-3 sm:ml-auto">
            <ArrowButton direction="prev" disabled={current === 0} onClick={() => goTo(current - 1)} />
            <ol className="flex flex-wrap items-center justify-center gap-1.5">
              {Array.from({ length: pages }, (_, p) => (
                <li key={p}>
                  <button
                    type="button"
                    aria-label={`Page ${p + 1}`}
                    aria-current={p === current ? "page" : undefined}
                    onClick={() => goTo(p)}
                    className={`flex size-9 cursor-pointer items-center justify-center rounded-full text-small font-semibold transition-colors ${
                      p === current ? "bg-ocean-600 text-white" : "text-ink-600 hover:bg-sand-100"
                    }`}
                  >
                    {p + 1}
                  </button>
                </li>
              ))}
            </ol>
            <ArrowButton direction="next" disabled={current === pages - 1} onClick={() => goTo(current + 1)} />
          </nav>
        )}
      </div>

      {visible.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((v, i) => {
            const hasPage = Boolean(v.documentGroups?.length);
            const body = (
              <>
                {v.image ? (
                  <Image
                    src={v.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
                )}
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,.55)_0%,rgba(11,37,69,0)_40%,rgba(11,37,69,0)_70%,rgba(11,37,69,.55)_100%)]" />
                <span className="absolute top-4 left-4 flex flex-col text-white">
                  <span className="text-caption font-normal text-white/85">{v.type}</span>
                  <span className="flex items-center gap-1.5 text-h4">
                    <Icon name="flight" size={20} className="text-sun-400" />
                    {v.city}
                  </span>
                </span>
                <span className={buttonClasses("primary", "md", "absolute right-4 bottom-4 h-10 px-4 text-small")}>
                  {hasPage ? "View More" : "Ask about this visa"}
                  <Icon name="arrow_forward" size={18} />
                </span>
              </>
            );
            const card =
              "group relative block h-[300px] overflow-hidden sm:h-[360px] rounded-xl bg-navy-900 text-left transition-[translate,box-shadow,scale] duration-300 ease-lf press-card hover:-translate-y-1 hover:shadow-lf-card-hover";
            return hasPage ? (
              <Link key={v.slug} href={`/visa/${v.slug}`} data-reveal={(i % 3) * 100} className={card} aria-label={`${v.city} ${v.type}`}>
                {body}
              </Link>
            ) : (
              <button
                key={v.slug}
                data-reveal={(i % 3) * 100}
                type="button"
                onClick={() => openInquiry({ subject: `${v.city} visa`, service: "Visa services", destination: v.city })}
                className={`${card} cursor-pointer`}
                aria-label={`Ask about a ${v.city} ${v.type}`}
              >
                {body}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-ink-600">No visas match your search. We can still help with your destination.</p>
          <button
            type="button"
            onClick={() => openInquiry({ subject: "Visa enquiry", service: "Visa services", destination: query.trim() })}
            className={buttonClasses("primary", "md")}
          >
            Ask about {query.trim() || "a visa"}
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>
      )}

    </div>
  );
}
