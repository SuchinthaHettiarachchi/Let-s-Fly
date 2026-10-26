import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { TourGrid } from "@/components/holidays/TourGrid";
import { HotelBookings } from "@/components/holidays/HotelBookings";
import { packages } from "@/data/packages";

export const metadata: Metadata = {
  title: { absolute: "Sri Lanka Tour Packages & Hotel Bookings | Let's Fly" },
  description:
    "Explore Sri Lanka with tailor-made tour packages, round trips and hotel deals. Private drivers, guides and resort specials from an SLTDA-registered agency.",
};

export default function SriLankaPage() {
  const tours = packages.filter((p) => p.category === "sri-lanka");
  return (
    <>
      <PageHero
        image="/images/hero/sigiriya-sunset.jpg"
        imagePosition="object-[50%_55%]"
        overlay={false}
        crumbs={[{ label: "Home", href: "/" }, { label: "Holidays" }, { label: "Travel Sri Lanka + Hotels" }]}
        eyebrow="Travel Sri Lanka"
        title="Discover the island, your way"
        sub="Ancient cities, misty tea country, wild parks and golden beaches. Private tours with a driver-guide and hand-picked stays."
      />
      {/* The masks photo starts right under the hero and covers the rest of the page, under a 50% ocean-blue wash */}
      <div className="bg-[url(/images/hero/sri-lanka-masks.jpg)] bg-cover bg-top bg-no-repeat">
        <div className="bg-ocean-600/50">
          <section className="py-14 lg:py-20">
            <Container>
              <TourGrid tours={tours} />
            </Container>
          </section>
          <HotelBookings />
          <CtaBand tone="clear" />
        </div>
      </div>
    </>
  );
}
