"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact } from "@/data/site";
import type { TeamMember, team as teamData } from "@/data/about";

const isPlaceholder = (m: TeamMember) => m.name.startsWith("Name to");

const initials = (m: TeamMember) =>
  isPlaceholder(m)
    ? "?"
    : m.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2);

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const iconLink = "flex size-11 items-center sm:size-9 justify-center rounded-md text-ink-400 transition-colors";

/**
 * "Meet Our Team": one list of names. Hovering (or focusing) a name shows that person's
 * portrait beside the list; with no name hovered the portrait area stays empty.
 * Phones show a small photo in each row instead.
 */
export function TeamSection({ team }: { team: typeof teamData }) {
  const members = team.flatMap((g) => g.members.map((m) => ({ ...m, department: g.department })));
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      {/* Portrait: stays in view while the list scrolls past */}
      <div className="hidden lg:block">
        <div className="sticky top-[160px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            {members.map((m, i) => (
              <div
                key={`${m.name}-${i}`}
                aria-hidden={i !== active}
                className={`absolute inset-0 bg-sand-100 transition-[opacity,scale] duration-500 ease-out ${
                  i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              >
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} fill sizes="480px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center">
                    <span className="flex size-36 items-center justify-center rounded-full bg-sand-200 text-5xl font-bold text-ocean-600">
                      {initials(m)}
                    </span>
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 flex flex-col bg-[linear-gradient(180deg,rgba(11,37,69,0)_0%,rgba(11,37,69,.85)_100%)] px-6 pt-16 pb-5 text-white">
                  <span className="text-h4">{isPlaceholder(m) ? "Team member" : m.name}</span>
                  <span className="text-small text-white/80">{m.role}</span>
                  {(m.email || m.phone) && (
                    <span className="mt-3 flex flex-col gap-1 border-t border-white/20 pt-3 text-small text-white/90">
                      {m.email && (
                        <span className="flex items-center gap-2">
                          <Icon name="mail" size={16} className="text-sun-400" />
                          {m.email}
                        </span>
                      )}
                      {m.phone && (
                        <span className="flex items-center gap-2">
                          <Icon name="call" size={16} className="text-sun-400" />
                          {m.phone}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="flex flex-col border-t border-sand-300">
        {members.map((m, i) => {
          const on = i === active;
          return (
            <li
              key={`${m.name}-${i}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              className="group relative grid cursor-default grid-cols-[56px_1fr_auto] items-center gap-x-4 gap-y-1 py-5 outline-none sm:grid-cols-[56px_1fr_1fr_auto] lg:grid-cols-[1.5fr_1fr_auto] lg:py-7"
            >
              {/* Divider, which turns into a thick ocean line under the active row */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 origin-left transition-[height,background-color] duration-300 ${
                  on ? "h-[3px] bg-ocean-600" : "h-px bg-sand-300"
                }`}
              />
              <span className="relative row-span-3 size-14 self-start overflow-hidden rounded-full bg-sand-200 sm:row-span-2 sm:self-center lg:hidden">
                {m.photo ? (
                  <Image src={m.photo} alt="" fill sizes="56px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-body font-bold text-ocean-600">
                    {initials(m)}
                  </span>
                )}
              </span>
              <span
                className={`col-span-2 font-display text-h3 sm:col-span-1 transition-[color,translate] duration-300 ${
                  on ? "translate-x-1.5" : ""
                } ${isPlaceholder(m) ? "font-medium text-ink-400 italic" : `font-semibold ${on ? "text-ocean-600" : "text-ink-900"}`}`}
              >
                {m.name}
              </span>
              <span className="col-span-2 col-start-2 row-start-2 flex flex-col sm:col-span-1 sm:col-start-3 sm:row-start-1 lg:col-start-2">
                <span className="text-body text-ink-900">{m.role}</span>
                <span className="text-caption font-normal text-ink-400">{m.department}</span>
              </span>
              {/* Contact details as text on phones and tablets; desktop shows them in the portrait */}
              {(m.email || m.phone) && (
                <span className="col-start-2 row-start-3 mt-1 flex flex-col gap-0.5 text-small sm:col-[2/4] sm:row-start-2 sm:flex-row sm:flex-wrap sm:gap-x-5 lg:hidden">
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="break-all">
                      {m.email}
                    </a>
                  )}
                  {m.phone && (
                    <a href={telHref(m.phone)} className="whitespace-nowrap">
                      {m.phone}
                    </a>
                  )}
                </span>
              )}
              <span className="col-start-3 row-start-3 flex items-center gap-0.5 self-end sm:col-start-4 sm:row-span-2 sm:row-start-1 sm:self-center lg:col-start-3 lg:row-span-1">
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    aria-label={`Email ${isPlaceholder(m) ? m.role : m.name}`}
                    className={`${iconLink} hover:bg-ocean-600 hover:text-white`}
                  >
                    <Icon name="mail" size={18} />
                  </a>
                )}
                {m.phone && (
                  <a
                    href={telHref(m.phone)}
                    aria-label={`Call ${isPlaceholder(m) ? m.role : m.name}`}
                    className={`${iconLink} hover:bg-ocean-600 hover:text-white`}
                  >
                    <Icon name="call" size={18} />
                  </a>
                )}
                {m.linkedin ? (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className={`${iconLink} hover:bg-[#0a66c2] hover:text-white`}
                  >
                    <SocialIcon name="LinkedIn" size={18} />
                  </a>
                ) : (
                  <span className="flex size-9 items-center justify-center">
                    <Icon
                      name="arrow_outward"
                      size={22}
                      className={`transition-[color,rotate] duration-300 ${on ? "rotate-45 text-ocean-600" : "text-sand-400"}`}
                    />
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="lg:col-start-2">
        <TalkToUs />
      </div>
    </div>
  );
}

function TalkToUs() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 on-dark rounded-2xl bg-navy-900 px-6 py-5 text-white">
      <div className="flex items-center gap-3">
        <Icon name="support_agent" size={30} className="text-sun-400" />
        <span className="flex flex-col">
          <span className="font-semibold">Talk to us</span>
          <span className="text-small text-white/75">Call our travel experts for information and bookings.</span>
        </span>
      </div>
      <a href={contact.phoneHref} className="font-semibold text-white hover:text-sun-400">
        {contact.phone}
      </a>
    </div>
  );
}
