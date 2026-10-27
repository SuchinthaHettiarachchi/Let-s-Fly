import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { RegionPackages } from "@/components/holidays/RegionPackages";
import { packages } from "@/data/packages";

export const metadata: Metadata = {
  title: { absolute: "Holiday Packages from Sri Lanka | Outbound Tours | Let's Fly" },
  description:
    "Overseas tour packages from Sri Lanka to Singapore, Malaysia and beyond. Flights, hotels and visas bundled in one, with easy KOKO instalments.",
};

const reasons = [
  { icon: "flight", title: "Flights included", text: "Return air tickets on trusted carriers." },
  { icon: "description", title: "Visa handled", text: "We prepare and submit your documents." },
  { icon: "hotel", title: "Quality hotels", text: "3★ to 5★ stays, reviewed by our team." },
  { icon: "payments", title: "Easy payments", text: "Pay in LKR, with instalment options." },
];

export default function OutboundPage() {
  const tours = packages.filter((p) => p.category === "outbound");
  return (
    <>
      <PageHero
        image="/images/hero/dubai.jpg"
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays" }, { label: "Outbound Travels" }]}
        eyebrow="Outbound travel"
        title="Holiday packages from Sri Lanka, fully planned"
        sub="Group and private holidays to Asia, the Middle East and Europe, with flights, hotels and visas arranged together."
      />

      <section className="py-16 lg:py-20">
        <Container className="flex flex-col gap-8">
          <div data-reveal>
            <SectionHeading eyebrow="Choose a region" title="Where to next?" />
          </div>
          <RegionPackages tours={tours} />
        </Container>
      </section>

      <section className="bg-sand-50 py-16 lg:py-20">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <div data-reveal className="flex flex-col gap-4">
            <Eyebrow>Why Let&apos;s Fly</Eyebrow>
            <h2>
              One team for your whole trip
            </h2>
            <p className="text-lead text-ink-600">
              No juggling five websites. We handle it all and stay on WhatsApp while you travel.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <li
                key={r.title}
                data-reveal={i * 100}
                className="group flex items-start gap-4 rounded-xl border border-sand-300 bg-white p-5 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-ocean-600 hover:shadow-lf-card-hover"
              >
                <span className="flex size-11 flex-none items-center justify-center rounded-tile bg-sand-200 text-ocean-600 transition-[background-color,color,scale] duration-300 group-hover:scale-110 group-hover:bg-ocean-600 group-hover:text-white">
                  <Icon name={r.icon} size={22} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-h5">{r.title}</span>
                  <span className="text-small text-ink-600">{r.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand tone="sand" />
      <RevealOnScroll />
    </>
  );
}
