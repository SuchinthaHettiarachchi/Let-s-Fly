import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { TourGrid } from "@/components/holidays/TourGrid";
import { HotelBookings } from "@/components/holidays/HotelBookings";
import { packages } from "@/data/packages";

export const metadata: Metadata = {
  title: "Travel Sri Lanka + Hotels",
  description:
    "Private Sri Lanka tours with a driver-guide and hand-picked stays — ancient cities, tea country, wildlife and beaches.",
};

export default function SriLankaPage() {
  const tours = packages.filter((p) => p.category === "sri-lanka");
  return (
    <>
      <PageHero
        image="/images/hero/maldives-beach.jpg"
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays" }, { label: "Travel Sri Lanka + Hotels" }]}
        eyebrow="Travel Sri Lanka"
        title="Discover the island, your way"
        sub="Ancient cities, misty tea country, wild parks and golden beaches — private tours with a driver-guide and hand-picked stays."
      />
      <section className="py-14 lg:py-20">
        <Container>
          <TourGrid tours={tours} />
        </Container>
      </section>
      <HotelBookings />
      <CtaBand />
    </>
  );
}
