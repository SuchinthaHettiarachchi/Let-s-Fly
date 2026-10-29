"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { buttonClasses } from "@/components/ui/Button";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import type { Visa } from "@/data/visas";

const ANY = "";

/** "Where Sri Lankans are heading": visa cards with type and country filters. */
export function VisaGrid({ visas }: { visas: Visa[] }) {
  const [type, setType] = useState(ANY);
  const [country, setCountry] = useState(ANY);
  const { openInquiry } = useInquiry();

  const types = [...new Set(visas.map((v) => v.type))];
  const countries = [...new Set(visas.map((v) => v.country))].sort();
  const visible = visas.filter((v) => (!type || v.type === type) && (!country || v.country === country));

  const pill =
    "h-10 cursor-pointer appearance-none rounded-full border-[1.5px] border-sand-300 bg-white pr-9 pl-4 font-medium text-ink-900 hover:border-ocean-600 focus:border-ocean-600 focus:outline-none";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <label className="relative flex items-center">
          <span className="sr-only">Visa type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className={pill}>
            <option value={ANY}>Visa Type</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Icon name="expand_more" size={18} className="pointer-events-none absolute right-3 text-ink-400" />
        </label>
        <label className="relative flex items-center">
          <span className="sr-only">Country</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={pill}>
            <option value={ANY}>Country</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Icon name="expand_more" size={18} className="pointer-events-none absolute right-3 text-ink-400" />
        </label>
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
              "group relative block h-[360px] overflow-hidden rounded-xl bg-navy-900 text-left transition-[translate,box-shadow,scale] duration-300 ease-lf press-card hover:-translate-y-1 hover:shadow-lf-card-hover";
            return hasPage ? (
              <Link key={v.slug} href={`/visa/${v.slug}`} data-reveal={(i % 3) * 100} className={card} aria-label={`${v.city} ${v.type}`}>
                {body}
              </Link>
            ) : (
              <button
                key={v.slug}
                data-reveal={(i % 3) * 100}
                type="button"
                onClick={() => openInquiry({ service: "Visa services", destination: v.city })}
                className={`${card} cursor-pointer`}
                aria-label={`Ask about a ${v.city} ${v.type}`}
              >
                {body}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="py-10 text-center text-ink-600">No visas match those filters. Ask us about your destination.</p>
      )}
    </div>
  );
}
