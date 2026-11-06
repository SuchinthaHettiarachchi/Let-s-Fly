import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { PortalCard } from "@/components/flights/PortalCard";
import { FareGrid } from "@/components/flights/FareGrid";
import { MessageSection } from "@/components/contact/MessageSection";
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
        title="Book cheap air tickets from Sri Lanka"
        sub="Self-book flights on our portal or send your requirements and our team will find the best available fares."
        overlap="lg"
      />

      <Container className="relative -mt-20 animate-rise [animation-delay:480ms] lg:-mt-24">
        <PortalCard />
      </Container>

      <section className="py-16 lg:py-20">
        <Container className="flex flex-col gap-8">
          <div data-reveal className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Popular routes" title="Top fares from Colombo" />
            <p className="text-caption font-normal text-ink-400">Return fares per person, incl. taxes · Prices indicative</p>
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
                <span className="text-h5">{f.title}</span>
                <span className="text-small text-ink-600">{f.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <MessageSection
        id="flight-inquiry"
        subject="Air ticket enquiry"
        service="Air tickets"
        title="Let our ticketing desk book it for you"
        text="Group bookings, multi-city trips, student fares or just short on time? Share your plans and we'll send the best options, usually within a few hours."
      />

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
