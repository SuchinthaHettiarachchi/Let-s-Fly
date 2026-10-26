import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { VisaTabs } from "@/components/visa/VisaTabs";
import { visaSteps, visas } from "@/data/visas";

export const metadata: Metadata = {
  title: { absolute: "Visa Services Sri Lanka | Tourist & Visit Visas | Let's Fly" },
  description:
    "Hassle-free visa assistance from Colombo for Malaysia, Singapore, the UK, USA and more. We help with document checks, appointments and applications.",
};

export default function VisaServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Visa Services" }]}
        eyebrow="Visa services"
        title="Visas made simple"
        sub="Going abroad or coming to Sri Lanka, we check your documents, fill the forms and track your application until it's approved."
      >
        <div className="h-14" />
      </PageHero>

      <VisaTabs visas={visas} />

      <section className="bg-navy-900 py-16 text-white lg:py-20">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Eyebrow onDark>How it works</Eyebrow>
            <h2 className="text-[30px] font-bold tracking-[-0.01em] sm:text-[36px]">Four steps to your visa</h2>
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visaSteps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 rounded-xl border border-white/12 bg-white/4 p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-sun-400 text-sm font-bold text-navy-900">
                  {i + 1}
                </span>
                <span className="text-base font-semibold">{s.title}</span>
                <span className="text-[13px] leading-relaxed text-white/70">{s.text}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <div className="pt-16 lg:pt-[100px]">
        <CtaBand />
      </div>
    </>
  );
}
