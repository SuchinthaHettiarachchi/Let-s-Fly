import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/layout/CtaBand";
import { PackageHeader } from "@/components/package/PackageHeader";
import { PackageGallery } from "@/components/package/PackageGallery";
import { PackageTabs, type Tab } from "@/components/package/PackageTabs";
import { OverviewPanel } from "@/components/package/OverviewPanel";
import { ItineraryPanel } from "@/components/package/ItineraryPanel";
import { InclusionsPanel } from "@/components/package/InclusionsPanel";
import { PaymentPanel } from "@/components/package/PaymentPanel";
import { BookingCard } from "@/components/package/BookingCard";
import { RelatedPackages } from "@/components/package/RelatedPackages";
import { detailPackages, durationLabel, formatLKR, getPackage, relatedPackages } from "@/data/packages";

// Only packages with full content get a page; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return detailPackages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  return {
    title: pkg.title,
    description: `${durationLabel(pkg)} from ${formatLKR(pkg.price)} per person. ${pkg.overview?.summary ?? ""}`.trim(),
  };
}

export default async function PackagePage({ params }: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg?.overview) notFound();

  const tabs: Tab[] = [{ id: "overview", label: "Overview", content: <OverviewPanel overview={pkg.overview} /> }];
  if (pkg.itinerary) {
    tabs.push({
      id: "itinerary",
      label: "Itinerary",
      content: <ItineraryPanel itinerary={pkg.itinerary} days={pkg.days} nights={pkg.nights} />,
    });
  }
  if (pkg.inclusions) {
    tabs.push({ id: "inclusions", label: "Inclusions & Exclusions", content: <InclusionsPanel inclusions={pkg.inclusions} /> });
  }
  tabs.push({ id: "payment", label: "Payment Methods", content: <PaymentPanel /> });

  return (
    <>
      <Container className="flex flex-col gap-6 pt-8">
        <PackageHeader pkg={pkg} />
        <PackageGallery images={pkg.gallery ?? (pkg.image ? [pkg.image] : [])} title={pkg.title} />
      </Container>

      <Container className="grid grid-cols-1 gap-10 pt-8 pb-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:pb-24">
        <PackageTabs tabs={tabs} />
        <aside className="lg:sticky lg:top-[108px] lg:self-start">
          <BookingCard pkg={pkg} />
        </aside>
      </Container>

      <RelatedPackages items={relatedPackages(pkg)} />
      <CtaBand tone="sand" />
    </>
  );
}
