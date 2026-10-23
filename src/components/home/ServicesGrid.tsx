"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { services, type Service } from "@/data/home";

const cardClass =
  "flex flex-col gap-3.5 rounded-xl border border-sand-300 bg-white p-7 text-left text-ink-900 transition-all duration-250 hover:-translate-y-1 hover:border-ocean-600 hover:text-ink-900 hover:shadow-lf-card-hover lg:p-8";

// With 7 cards the last one sits alone, so it is centred under the row above.
const lastCardClass = "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-12px)] lg:col-span-1 lg:col-start-2 lg:w-auto";

function CardBody({ s }: { s: Service }) {
  return (
    <>
      <div className="flex size-[60px] items-center justify-center rounded-tile bg-sand-200 text-ocean-600">
        <Icon name={s.icon} size={30} />
      </div>
      <div className="text-xl font-semibold">{s.title}</div>
      <div className="text-[14.5px] leading-[1.6] text-ink-600">{s.line}</div>
      <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ocean-600">
        {s.link}
        <Icon name={s.linkIcon} size={18} />
      </div>
    </>
  );
}

export function ServicesGrid() {
  const { openInquiry } = useInquiry();
  const loneLastCard = services.length % 2 === 1 && services.length % 3 === 1;

  return (
    <section id="services" className="scroll-mt-[110px] lg:scroll-mt-[156px] bg-sand-50 py-20 lg:py-[110px]">
      <Container>
        <SectionHeading
          eyebrow="Our services"
          title="Everything your trip needs, in one place"
          centered
          className="mb-[52px]"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const className = `${cardClass} ${loneLastCard && i === services.length - 1 ? lastCardClass : ""}`;
            return s.href ? (
              <Link key={s.title} href={s.href} className={className}>
                <CardBody s={s} />
              </Link>
            ) : (
              <button
                key={s.title}
                type="button"
                onClick={() => openInquiry({ service: s.inquiry })}
                className={`${className} cursor-pointer`}
              >
                <CardBody s={s} />
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
