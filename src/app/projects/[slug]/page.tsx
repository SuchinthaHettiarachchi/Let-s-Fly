import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CategoryPill } from "@/components/projects/CategoryPill";
import { ProjectCover, ProjectGallery } from "@/components/projects/ProjectMedia";
import { getProject, projectDate, projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const images = project.gallery ?? (project.image ? [project.image] : []);
  const total = Math.max(project.photoCount ?? 0, images.length);
  const body = project.body ?? [project.summary];

  return (
    <article className="pt-8 pb-20 lg:pb-24">
      <Container className="flex flex-col gap-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: project.title }]} />
        <div className="flex items-center gap-3">
          <CategoryPill category={project.category} />
          <span className="flex items-center gap-1.5 text-small text-ink-400">
            <Icon name="calendar_month" size={16} />
            {projectDate(project)}
          </span>
        </div>
        <h1 className="max-w-[760px]">{project.title}</h1>
        <ProjectCover images={images} total={total} title={project.title} />
      </Container>

      <Container className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-14">
        <div className="flex flex-col items-start gap-3">
          <Eyebrow>About the project</Eyebrow>
          <h2 className="text-h3">Overview</h2>
          {total > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1 text-caption text-ocean-600">
              <Icon name="photo_library" size={15} />
              {total} photos
            </span>
          )}
        </div>
        <div className="flex max-w-[720px] flex-col gap-5">
          {body.map((p, i) => (
            <p key={i} className={i === 0 ? "text-lead text-ink-900" : "text-body text-ink-600"}>
              {p}
            </p>
          ))}
        </div>
      </Container>

      {total > 0 && (
        <Container className="mt-14">
          <div className="border-t border-sand-300 pt-12">
            <div className="mb-6 flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <Eyebrow>Photos</Eyebrow>
                <h2 className="text-h3">Project gallery</h2>
              </div>
              <span className="text-small text-ink-400">{total} photos</span>
            </div>
            <ProjectGallery images={images} total={total} title={project.title} />
          </div>
        </Container>
      )}

      <Container className="mt-12">
        <ButtonLink href="/projects" variant="outline" size="lg" leadingIcon="arrow_back">
          Back to Projects
        </ButtonLink>
      </Container>
    </article>
  );
}
