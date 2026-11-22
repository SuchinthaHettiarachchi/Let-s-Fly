import { getProjectBySlug, type ProjectRecord } from "@/lib/project-api";

export type ProjectCategory = "meetings" | "incentives" | "conferences" | "exhibitions";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** YYYY-MM, used for sorting and the date label. */
  date: string;
  summary: string;
  image?: string;
  body?: string[];
  gallery?: string[];
  photoCount?: number;
};

export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: "meetings", label: "Meetings" },
  { id: "incentives", label: "Incentives" },
  { id: "conferences", label: "Conferences" },
  { id: "exhibitions", label: "Exhibitions" },
];

export function fromRecord(record: ProjectRecord): Project {
  return {
    slug: record.slug,
    title: record.title,
    category: record.category,
    date: (record.date || "").slice(0, 7),
    summary: record.summary,
    image: record.cover?.src || undefined,
    body: (record.description || "")
      .split(/<\/p>/i)
      .map((part) => part.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim())
      .filter(Boolean),
    gallery: (record.gallery || []).map((image) => image.src).filter(Boolean),
    photoCount: [record.cover, ...(record.gallery || [])].filter((image) => image?.src).length,
  };
}

export async function loadProject(slug: string): Promise<Project | null> {
  const record = await getProjectBySlug(slug);
  return record ? fromRecord(record) : null;
}

export const projectDate = (p: Project) =>
  new Date(`${p.date}-01T00:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export const categoryLabel = (c: ProjectCategory) => projectCategories.find((x) => x.id === c)!.label;
