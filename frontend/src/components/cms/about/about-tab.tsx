"use client";

import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import WhoWeAreSection from "@/components/cms/home/who-we-are-section";

export default function AboutTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <div className="w-full">
      <div className="mb-7">
        <h1 className="text-[24px] font-semibold text-cms-ink">About Us</h1>
        <p className="mt-1.5 text-[13px] text-cms-muted">Manage the About Us page content and sections.</p>
        <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "About Us" }]} onNavigate={onNavigate} className="mt-3" />
      </div>
      <WhoWeAreSection />
    </div>
  );
}
