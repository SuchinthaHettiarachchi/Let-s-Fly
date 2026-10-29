"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { VisaGrid } from "./VisaGrid";
import { residenceCategories, sriLankaVisas, type Visa } from "@/data/visas";

/** The Sri Lanka tab can be linked to directly: /visa#visit-sri-lanka */
const SRI_LANKA_HASH = "#visit-sri-lanka";

const tabs = [
  { id: "outbound", icon: "flight_takeoff", title: "Visas for Sri Lankans", sub: "Travelling abroad from Sri Lanka" },
  { id: "inbound", icon: "travel_explore", title: "Visas for Sri Lanka", sub: "For foreign nationals visiting or living here" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const onHashChange = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

/** Switch between visas for Sri Lankans going abroad and visas for foreigners coming to Sri Lanka. */
export function VisaTabs({ visas }: { visas: Visa[] }) {
  // Opens on the tab the URL asks for, until the visitor picks one.
  const hash = useSyncExternalStore(onHashChange, () => window.location.hash, () => "");
  const [picked, setPicked] = useState<TabId | null>(null);
  const tab: TabId = picked ?? (hash === SRI_LANKA_HASH ? "inbound" : "outbound");

  const choose = (id: TabId) => {
    setPicked(id);
    history.replaceState(null, "", id === "inbound" ? SRI_LANKA_HASH : window.location.pathname);
  };

  return (
    <>
      <Container className="relative z-[1] -mt-16 animate-rise [animation-delay:480ms]">
        <div
          role="tablist"
          aria-label="Visa services"
          className="grid max-w-[760px] grid-cols-1 gap-1 rounded-2xl bg-white p-2 shadow-lf-md sm:grid-cols-2"
        >
          {tabs.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`panel-${t.id}`}
                onClick={() => choose(t.id)}
                className={`flex cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-[color,background-color,scale] duration-200 press ${
                  on ? "bg-ocean-600 text-white" : "text-ink-900 hover:bg-sand-50"
                }`}
              >
                <span
                  className={`flex size-11 flex-none items-center justify-center rounded-[10px] transition-colors duration-200 ${
                    on ? "bg-sun-400 text-navy-900" : "bg-sand-100 text-ocean-600"
                  }`}
                >
                  <Icon name={t.icon} size={22} />
                </span>
                <span className="flex flex-col">
                  <span className="text-h5">{t.title}</span>
                  <span className={`text-caption font-normal ${on ? "text-white/75" : "text-ink-400"}`}>{t.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Container>

      <section
        key={tab}
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="animate-rise py-16 [animation-duration:.45s] lg:py-20"
      >
        <Container className="flex flex-col gap-8">
          {tab === "outbound" ? (
            <>
              <SectionHeading eyebrow="Popular visas" title="Where Sri Lankans are heading" />
              <VisaGrid visas={visas} />
            </>
          ) : (
            <SriLankaVisas />
          )}
        </Container>
      </section>
    </>
  );
}

function SriLankaVisas() {
  const { openInquiry } = useInquiry();
  const ask = (visa: string, details?: string) =>
    openInquiry({ service: "Visa services", destination: `Sri Lanka (${visa})`, details });

  return (
    <>
      <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <SectionHeading eyebrow="Sri Lankan visa types" title="Coming to Sri Lanka? Find the right visa" />
        <p className="text-lead text-ink-600">
          Whether you&apos;re here for a holiday, a business trip or a longer stay, we&apos;ll match you to the right
          visa, prepare your application and keep you updated until it&apos;s approved.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sriLankaVisas.map((v, i) => (
          <article
            key={v.name}
            data-reveal={i * 120}
            className="group flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lf-card-hover"
          >
            <div className="relative h-[200px]">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={v.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 580px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="absolute -bottom-6 left-6 flex size-[52px] items-center justify-center rounded-xl bg-sun-400 text-navy-900 shadow-lf-md">
                <Icon name={v.icon} size={24} />
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-5 px-6 pt-10 pb-6 sm:px-7">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-sans text-h4">{v.name}</h3>
                <p className="text-small text-ink-600">{v.text}</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {v.purposes.map((p) => (
                  <li key={p} className="rounded-full bg-ocean-600/8 px-3 py-1 text-caption text-ocean-600">
                    {p}
                  </li>
                ))}
              </ul>
              <dl className="grid grid-cols-1 rounded-xl border border-sand-300 sm:grid-cols-3">
                {v.facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col border-sand-300 px-4 py-3 not-first:border-t sm:not-first:border-t-0 sm:not-first:border-l"
                  >
                    <dt className="text-caption font-normal text-ink-400">{f.label}</dt>
                    <dd className="num text-h5 font-bold text-ocean-600">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <Button variant="primary" size="md" icon="arrow_forward" onClick={() => ask(v.name)}>
                  Apply for {v.short}
                </Button>
                <button
                  type="button"
                  onClick={() => ask(v.name, `Please send me the requirements for a Sri Lanka ${v.name}.`)}
                  className="flex cursor-pointer items-center gap-1.5 text-small font-semibold text-ocean-600 hover:text-navy-900"
                >
                  Check requirements
                  <Icon name="arrow_forward" size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div data-reveal className="relative overflow-hidden on-dark rounded-2xl bg-navy-900 px-6 py-9 text-white sm:px-10 sm:py-11">
        <span
          aria-hidden="true"
          className="absolute -top-40 -right-36 size-[420px] rounded-full border-[60px] border-white/4"
        />
        <div className="relative mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 eyebrow text-sun-400">
              <Icon name="home" size={16} />
              Long-term stay
            </span>
            <h3 className="text-h2">Residence Visa</h3>
            <p className="max-w-[560px] text-body text-white/75">
              Designed for foreign nationals who wish to stay in Sri Lanka for an extended period. Choose the category
              that matches your reason for staying.
            </p>
          </div>
          <div className="flex max-w-[300px] flex-none gap-3 rounded-xl border border-white/14 bg-white/8 px-5 py-4 text-small">
            <Icon name="autorenew" size={20} className="mt-0.5 text-sun-400" />
            <span className="flex flex-col">
              <span className="font-semibold">Renewed annually</span>
              <span className="text-white/75">
                We handle your yearly renewal through Let&apos;s Fly.lk, so you never miss a deadline.
              </span>
            </span>
          </div>
        </div>
        <ul className="relative grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {residenceCategories.map((c, i) => (
            <li
              key={c.title}
              data-reveal={150 + i * 90}
              className="group flex flex-col rounded-xl bg-white p-5 text-ink-900 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="mb-4 flex size-10 items-center justify-center rounded-[9px] bg-sand-100 text-ocean-600 transition-[background-color,color,scale] duration-300 group-hover:scale-110 group-hover:bg-ocean-600 group-hover:text-white">
                <Icon name={c.icon} size={20} />
              </span>
              <h4 className="text-h5">{c.title}</h4>
              <p className="mt-2 mb-3.5 flex-1 text-small text-ink-600">{c.text}</p>
              {c.highlight && (
                <span className="mb-3 self-start rounded bg-sun-400 px-2 py-0.5 text-caption text-navy-900">
                  {c.highlight}
                </span>
              )}
              <button
                type="button"
                onClick={() => ask(`Residence Visa, ${c.title}`)}
                className="flex cursor-pointer items-center gap-1.5 self-start text-small font-semibold text-ocean-600 hover:text-navy-900"
              >
                Enquire
                <Icon name="arrow_forward" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p data-reveal className="flex gap-3 rounded-md border-l-[3px] border-sun-400 bg-sun-400/15 px-4 py-3.5 text-small text-ink-900">
        <Icon name="info" size={18} className="mt-0.5 text-ocean-600" />
        <span>
          Visa rules and fees are set by Sri Lanka&apos;s Department of Immigration &amp; Emigration and can change. We
          confirm the current requirements for your case before you apply.
        </span>
      </p>
    </>
  );
}
