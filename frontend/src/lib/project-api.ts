import { apiUrl, browserApiUrl } from "@/lib/api-url";

export type ProjectCategory = "meetings" | "incentives" | "conferences" | "exhibitions";
export type ProjectImage = { src: string; alt: string; name?: string };
export type ProjectStatus = "draft" | "published";

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  date: string;
  summary: string;
  description: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  status: ProjectStatus;
  sortOrder?: number;
  updatedAt: number;
};

export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: "meetings", label: "Meetings" },
  { id: "incentives", label: "Incentives" },
  { id: "conferences", label: "Conferences" },
  { id: "exhibitions", label: "Exhibitions" },
];

export const projectCategoryLabel = (category: string) =>
  projectCategories.find((item) => item.id === category)?.label ?? "";

export async function getProjects(): Promise<ProjectRecord[]> {
  try {
    const response = await fetch(apiUrl("/projects"), { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = (await response.json()) as { projects?: ProjectRecord[] };
    return Array.isArray(data.projects) ? data.projects : [];
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  try {
    const response = await fetch(apiUrl(`/projects/by-slug/${encodeURIComponent(slug)}`), { next: { revalidate: 60 } });
    if (!response.ok) return null;
    const data = (await response.json()) as { project?: ProjectRecord };
    return data.project ?? null;
  } catch {
    return null;
  }
}

export async function fetchManageProjects(): Promise<ProjectRecord[]> {
  const response = await fetch(browserApiUrl("/projects/manage"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as { projects?: ProjectRecord[] };
  return Array.isArray(data.projects) ? data.projects : [];
}

export const projectCmsApi = {
  save: (body: ProjectRecord, id?: string) =>
    fetch(browserApiUrl(id ? `/projects/${id}` : "/projects"), {
      method: id ? "PUT" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    fetch(browserApiUrl(`/projects/${id}`), { method: "DELETE", credentials: "include" }),
};
