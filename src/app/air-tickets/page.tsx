import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { PortalCard } from "@/components/flights/PortalCard";
import { FareGrid } from "@/components/flights/FareGrid";
import { FlightInquiryForm } from "@/components/flights/FlightInquiryForm";
import { AirlineLogos } from "@/components/flights/AirlineLogos";
import { flightFeatures, topFares } from "@/data/flights";

export const metadata: Metadata = {
  title: { absolute: "Air Tickets Sri Lanka | Book Cheap Flights | Let's Fly" },
  description:
    "Book international air tickets from Colombo on SriLankan, Emirates, Qatar, Singapore Airlines and more. Great fares, expert help, and pay later with KOKO.",
};

export default function AirTicketsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Air Tickets" }]}
        eyebrow="Air tickets"
        title="Fly anywhere for less"
        sub="Search fares across 40+ airlines and book instantly on our own booking portal, or let our ticketing desk find the best route for you."
      >
        <div className="h-16 lg:h-20" />
      </PageHero>

      <Container className="relative -mt-20 animate-rise [animation-delay:480ms] lg:-mt-24">
        <PortalCard />
      </Container>

      <section className="py-16 lg:py-20">
        <Container className="flex flex-col gap-8">
          <div data-reveal className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Popular routes" title="Top fares from Colombo" />
            <p className="text-xs text-ink-400">Return fares per person, incl. taxes · Prices indicative</p>
          </div>
          <FareGrid fares={topFares} />
        </Container>
      </section>

      <section className="border-y border-sand-300 bg-sand-50 py-16 lg:py-20">
        <Container className="flex flex-col gap-8">
          <div data-reveal>
            <SectionHeading eyebrow="Airline partners" title="We ticket with 40+ airlines" centered />
          </div>
          <AirlineLogos />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flightFeatures.map((f, i) => (
              <li key={f.title} data-reveal={i * 100} className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-sand-300 bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-ocean-600 hover:shadow-lf-card-hover">
                <span className="flex size-11 items-center justify-center rounded-tile bg-sand-200 text-ocean-600 transition-[background-color,color,scale] duration-300 group-hover:scale-110 group-hover:bg-ocean-600 group-hover:text-white">
                  <Icon name={f.icon} size={22} />
                </span>
                <span className="text-base font-semibold">{f.title}</span>
                <span className="text-[13px] leading-relaxed text-ink-600">{f.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="flight-inquiry" className="scroll-mt-[110px] lg:scroll-mt-[156px] bg-sand-50 py-16 lg:py-20">
        <Container className="flex flex-col items-center gap-8">
          <div data-reveal className="flex max-w-[620px] flex-col items-center gap-3 text-center">
            <Eyebrow>Need a hand?</Eyebrow>
            <h2 className="text-[28px] font-bold tracking-[-0.01em] sm:text-[36px]">Let our ticketing desk book it for you</h2>
            <p className="text-[15px] leading-relaxed text-ink-600">
              Group bookings, multi-city trips, student fares or just short on time? Share your plans and we&apos;ll send
              the best options, usually within a few hours.
            </p>
          </div>
          <div data-reveal="150" className="w-full max-w-[960px] rounded-2xl border border-sand-300 bg-white p-6 shadow-lf-md sm:p-10">
            <FlightInquiryForm />
          </div>
        </Container>
      </section>

      <div className="bg-sand-50">
        <CtaBand
          tone="sand"
          title="Planning more than a flight?"
          text="Add hotels, visas and tours, and we'll send one quote for the whole trip."
        />
      </div>
      <RevealOnScroll />
    </>
  );
}
