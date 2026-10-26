"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { buttonClasses } from "@/components/ui/Button";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { bookingPortals } from "@/data/site";
import { formatLKR } from "@/data/packages";
import type { Fare } from "@/data/flights";

/** "Top fares from Colombo": photo cards; actions appear on hover (always visible on touch screens). */
export function FareGrid({ fares }: { fares: Fare[] }) {
  const { openInquiry } = useInquiry();
  const portal = bookingPortals.flights;

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {fares.map((f, i) => (
        <li
          key={f.city}
          data-reveal={(i % 3) * 100}
          className="group relative h-[220px] overflow-hidden rounded-xl bg-navy-900 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lf-card-hover"
        >
          {f.image ? (
            <Image
              src={f.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
          )}
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,0)_35%,rgba(11,37,69,.88)_100%)]" />
          <div className="absolute top-3.5 right-3.5 flex gap-2 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
            {portal && (
              <a
                href={portal}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("outline", "md", "h-8 px-3 text-xs")}
              >
                Book on Portal
                <Icon name="north_east" size={14} />
              </a>
            )}
            <button
              type="button"
              onClick={() => openInquiry({ service: "Air tickets", destination: f.city })}
              className={buttonClasses("primary", "md", "h-8 px-3 text-xs")}
            >
              Ask for this fare
            </button>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white">
            <div className="flex flex-col">
              <span className="text-xs text-white/75">Colombo</span>
              <span className="flex items-center gap-1.5 text-xl font-semibold">
                <Icon name="flight" size={20} className="text-sun-400" />
                {f.city}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-white/75">from</span>
              <span className="text-lg font-bold">{formatLKR(f.price)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
