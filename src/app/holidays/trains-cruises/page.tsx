import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JourneyList } from "@/components/holidays/JourneyList";
import { journeyPerks, journeys } from "@/data/journeys";

export const metadata: Metadata = {
  title: "Trains + Cruises",
  description: "Reserved seats on Sri Lanka's most scenic rail routes, and ocean cruises across Asia and the Gulf.",
};

export default function TrainsCruisesPage() {
  return (
    <>
      <PageHero
        image="/images/hero/hill-country-rail.jpg"
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays" }, { label: "Trains + Cruises" }]}
        eyebrow="Trains + Cruises"
        title="Slow travel, big views"
        sub="Reserved seats on Sri Lanka's most scenic rail routes, and ocean cruises across Asia and the Gulf."
      />

      <section className="py-14 lg:py-20">
        <Container>
          <JourneyList journeys={journeys} />
        </Container>
      </section>

      <section className="bg-sand-50 py-12 lg:py-14">
        <Container>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {journeyPerks.map((p) => (
              <li key={p.title} className="flex items-start gap-4">
                <span className="flex size-11 flex-none items-center justify-center rounded-full bg-sun-400 text-navy-900">
                  <Icon name={p.icon} size={22} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold">{p.title}</span>
                  <span className="text-[13px] leading-relaxed text-ink-600">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand tone="sand" />
    </>
  );
}
