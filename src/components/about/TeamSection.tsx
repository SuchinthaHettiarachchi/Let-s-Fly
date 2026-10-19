"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { contact } from "@/data/site";
import type { team as teamData } from "@/data/about";

const initials = (name: string) =>
  name.startsWith("Name to")
    ? "?"
    : name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2);

/** "Meet Our Team": department tabs, member cards and a "Talk to us" card. */
export function TeamSection({ team }: { team: typeof teamData }) {
  const [active, setActive] = useState(0);
  const group = team[active];

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label="Departments" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:justify-center lg:px-0">
        {team.map((g, i) => {
          const on = i === active;
          return (
            <button
              key={g.department}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={`h-10 flex-none cursor-pointer rounded-full border-[1.5px] px-[18px] text-sm font-medium transition-colors ${
                on ? "border-ocean-600 bg-ocean-600 text-white" : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
              }`}
            >
              {g.department}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" aria-label={group.department} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {group.members.map((m, i) => (
          <figure key={`${m.name}-${i}`} className="flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white">
            <div className="relative flex aspect-[4/5] items-center justify-center bg-sand-100">
              {m.photo ? (
                <Image src={m.photo} alt={m.name} fill sizes="300px" className="object-cover" />
              ) : (
                <span className="flex size-20 items-center justify-center rounded-full bg-sand-200 text-2xl font-bold text-ocean-600">
                  {initials(m.name)}
                </span>
              )}
            </div>
            <figcaption className="flex flex-col gap-0.5 p-4">
              <span className={`text-[15px] font-semibold ${m.name.startsWith("Name to") ? "text-ink-400 italic" : ""}`}>
                {m.name}
              </span>
              <span className="text-[13px] text-ink-600">{m.role}</span>
            </figcaption>
          </figure>
        ))}
        <div className="flex flex-col justify-between gap-4 rounded-xl bg-navy-900 p-6 text-white">
          <div className="flex flex-col gap-2">
            <Icon name="support_agent" size={32} className="text-sun-400" />
            <span className="text-lg font-semibold">Talk to us</span>
            <span className="text-[13px] leading-relaxed text-white/75">
              Call our travel experts today for more information and bookings.
            </span>
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-xs text-white/60">General inquiries:</span>
            <a href={contact.phoneHref} className="font-semibold text-white hover:text-sun-400">
              {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
