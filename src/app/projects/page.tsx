import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "CSR initiatives, events and group journeys our team has planned and delivered for communities, companies and travellers.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        eyebrow="Our projects"
        title="Projects"
        sub="CSR initiatives, events and group journeys our team has planned and delivered for communities, companies and travellers."
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
