import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { MessageSection } from "@/components/contact/MessageSection";
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
        title="Visa services for Sri Lankan travellers, simplified"
        sub="Document checks, appointments and application submissions for 30+ countries, handled start to finish by our expert visa team."
        overlap="md"
      />

      <VisaTabs visas={visas} />

      <section className="on-dark bg-navy-900 py-16 text-white lg:py-20">
        <Container className="flex flex-col gap-10">
          <div data-reveal className="flex flex-col items-center gap-2.5 text-center">
            <Eyebrow onDark>How it works</Eyebrow>
            <h2>Four steps to your visa</h2>
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visaSteps.map((s, i) => (
              <li
                key={s.title}
                data-reveal={i * 100}
                className="group flex flex-col gap-3 rounded-xl border border-white/12 bg-white/4 p-6 transition-[translate,background-color,border-color] duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/8"
              >
                <span className="flex size-9 transition-transform duration-300 group-hover:scale-110 items-center justify-center rounded-full bg-sun-400 text-small font-bold text-navy-900">
                  {i + 1}
                </span>
                <span className="text-h5">{s.title}</span>
                <span className="text-small text-white/70">{s.text}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <MessageSection
        subject="Visa enquiry"
        service="Visa services"
        text="Tell us where you're going or why you're visiting Sri Lanka, and our visa team will confirm the documents you need."
      />

      <div className="pt-16 lg:pt-[100px]">
        <CtaBand />
      </div>
      <RevealOnScroll />
    </>
  );
}
