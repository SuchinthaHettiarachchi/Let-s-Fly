import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { TourGrid } from "@/components/holidays/TourGrid";
import { HotelBookings } from "@/components/holidays/HotelBookings";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { packages, type SriLankaTheme } from "@/data/packages";
import type { PackageCardData } from "@/components/package/PackageCard";

const PACKAGES_API = `${process.env.NEXT_PUBLIC_API_URL}/packages`;

export const metadata: Metadata = {
  title: { absolute: "Sri Lanka Tour Packages & Hotel Bookings | Let's Fly" },
  description:
    "Explore Sri Lanka with tailor-made tour packages, round trips and hotel deals. Private drivers, guides and resort specials from an SLTDA-registered agency.",
};

type CmsTour = PackageCardData & { themes?: SriLankaTheme[] };

export default async function SriLankaPage() {
  const tours = await getSriLankaTours();
  return (
    <>
      <PageHero
        image="/images/hero/sigiriya-sunset.jpg"
        imagePosition="object-[50%_55%]"
        overlay={false}
        crumbs={[{ label: "Home", href: "/" }, { label: "Sri Lanka Tours" }]}
        eyebrow="Inbound tours"
        title="Sri Lanka tour packages and hotel bookings"
        sub="Trending and seasonal island packages designed for everyone, from Sigiriya to the south coast, with drivers and stays."
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
      <RevealOnScroll />
    </>
  );
}

async function getSriLankaTours(): Promise<CmsTour[]> {
  try {
    const response = await fetch(`${PACKAGES_API}?category=sri-lanka`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: { packages?: CmsTour[] } = await response.json();
    return Array.isArray(data.packages) ? data.packages : [];
  } catch {
    return packages.filter((p) => p.category === "sri-lanka");
  }
}
