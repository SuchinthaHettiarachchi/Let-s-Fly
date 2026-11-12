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
import { MessageSection } from "@/components/contact/MessageSection";
import { RelatedPackages } from "@/components/package/RelatedPackages";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { detailPackages, durationLabel, formatLKR, getPackage, relatedPackages, type Package } from "@/data/packages";

const PACKAGES_API = `${process.env.NEXT_PUBLIC_API_URL}/packages`;

export function generateStaticParams() {
  return detailPackages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug) ?? await getCmsPackage(slug);
  if (!pkg) return {};
  return {
    title: pkg.title,
    description: `${durationLabel(pkg)} from ${formatLKR(pkg.price)} per person. ${pkg.overview?.summary ?? ""}`.trim(),
  };
}

export default async function PackagePage({ params }: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = getPackage(slug) ?? await getCmsPackage(slug);
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
        <div className="animate-rise">
          <PackageHeader pkg={pkg} />
        </div>
        <div className="animate-rise [animation-delay:120ms]">
          <PackageGallery images={pkg.gallery ?? (pkg.image ? [pkg.image] : [])} title={pkg.title} />
        </div>
      </Container>

      <Container className="pt-8 pb-16 lg:pb-24">
        <div className="min-w-0 animate-rise [animation-delay:240ms]">
          <PackageTabs tabs={tabs} />
        </div>
      </Container>

      <MessageSection
        subject={pkg.title}
        service="Tour package"
        text={`Questions about ${pkg.title}, or want to change dates, hotels or the route? Send us a message and we'll tailor it for you.`}
      />

      <RelatedPackages items={relatedPackages(pkg)} />
      <CtaBand tone="sand" />
      <MobileActionBar
        label="From, per person"
        value={formatLKR(pkg.price)}
        prefill={{ subject: pkg.title, service: "Tour package", destination: pkg.title }}
      />
      <RevealOnScroll />
    </>
  );
}

async function getCmsPackage(slug: string): Promise<Package | undefined> {
  try {
    const response = await fetch(`${PACKAGES_API}/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!response.ok) return undefined;
    const data: { package?: {
      slug: string; title: string; region: string; area?: string; category?: Package["category"];
      days: number; nights: number; price: number; image?: string; badge?: string; flightsIncluded?: boolean;
    } } = await response.json();
    const item = data.package;
    if (!item) return undefined;
    return {
      slug: item.slug,
      title: item.title,
      region: item.region,
      location: item.area ? `${item.region} · ${item.area}` : item.region,
      category: item.category ?? "outbound",
      area: item.area,
      badge: item.badge,
      days: item.days,
      nights: item.nights,
      price: item.price,
      image: item.image,
      flightsIncluded: item.flightsIncluded,
      overview: {
        summary: `Explore our ${item.title} travel package. Contact us for the latest availability and itinerary details.`,
        highlights: [],
      },
    };
  } catch {
    return undefined;
  }
}
