import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Fleet } from "@/components/rentals/Fleet";
import { rentalEssentials, vehicles } from "@/data/rentals";

export const metadata: Metadata = {
  title: { absolute: "Car & Bike Rental Sri Lanka | Airport Transfers | Let's Fly" },
  description:
    "Rent cars, vans and motorbikes across Sri Lanka, self-drive or with a driver. Airport pickups, day trips and island tours at fair daily rates.",
};

export default function RentalsPage() {
  return (
    <>
      <PageHero
        image="/images/rentals/van.jpg"
        crumbs={[{ label: "Home", href: "/" }, { label: "Rentals" }]}
        eyebrow="Vehicle rental"
        title="Car and bike rental across Sri Lanka"
        sub="Cars, vans and motorbikes for airport pickups, day trips and island tours, self-drive or with a trusted driver."
      />

      <section className="py-14 lg:py-20">
        <Container>
          <Fleet vehicles={vehicles} />
        </Container>
      </section>

      <section className="bg-sand-50 py-16 lg:py-20">
        <Container className="flex flex-col gap-8">
          <h2 className="text-[28px] font-bold tracking-[-0.01em] sm:text-[32px]">Rental essentials</h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rentalEssentials.map((e) => (
              <li key={e.title} className="flex flex-col gap-3 rounded-xl border border-sand-300 bg-white p-6">
                <Icon name={e.icon} size={26} className="text-ocean-600" />
                <span className="text-base font-semibold">{e.title}</span>
                <span className="text-[13px] leading-relaxed text-ink-600">{e.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand tone="sand" />
    </>
  );
}
