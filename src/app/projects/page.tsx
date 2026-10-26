import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: { absolute: "MICE Tourism Sri Lanka | Corporate Events & Incentive Tours" },
  description:
    "Corporate meetings, incentive trips, conferences and events handled end to end. See Let's Fly's MICE projects in Sri Lanka and overseas.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        eyebrow="MICE tourism"
        title="Corporate MICE tourism, events and incentive travel"
        sub="Meetings, incentive trips, conferences and exhibitions planned end to end, from venues and flights to seamless group transfers."
      />
      <section className="py-14 lg:py-20">
        <Container>
          <ProjectGrid projects={projects} />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
