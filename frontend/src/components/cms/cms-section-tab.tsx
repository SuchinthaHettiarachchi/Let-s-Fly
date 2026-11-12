"use client";

import { Breadcrumbs } from "@/components/cms/Breadcrumbs";

type Props = {
  title: string;
  description: string;
  onNavigate: (section: string) => void;
};

export default function CmsSectionTab({ title, description, onNavigate }: Props) {
  return (
    <div className="w-full px-5 py-6 sm:px-7 sm:py-7 xl:px-10 xl:py-8">
      <div className="mb-7">
        <h1 className="text-[24px] font-semibold text-cms-ink">{title}</h1>
        <p className="mt-1 text-[13px] text-cms-muted">{description}</p>
        <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: title }]} onNavigate={onNavigate} className="mt-3" />
      </div>
      <section className="rounded-[14px] border border-cms-line bg-cms-card p-6 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="grid gap-4 sm:grid-cols-3">
          {["Content", "Media", "Settings"].map((item) => (
            <article className="rounded-[12px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]" key={item}>
              <div className="mb-3 grid size-10 place-items-center rounded-[10px] bg-cms-yellow text-cms-navy">
                <span className="text-[18px] font-bold">{item[0]}</span>
              </div>
              <h2 className="text-[14px] font-semibold text-cms-ink">{item}</h2>
              <p className="mt-1 text-[12px] leading-[1.5] text-cms-muted">Manage {item.toLowerCase()} for this section.</p>
            </article>
          ))}
        </div>
        <p className="mt-6 rounded-[10px] border border-dashed border-cms-line px-4 py-3 text-[12px] text-cms-muted">
          This CMS section now uses the shared Tailwind dashboard shell. Content controls can be added here without loading a separate page or stylesheet.
        </p>
      </section>
    </div>
  );
}
