import { apiUrl, browserApiUrl } from "@/lib/api-url";

export type JobStatus = "Hiring" | "Soon" | "Open";
export type Job = {
  id: string;
  title: string;
  icon: string;
  status: JobStatus;
  employment: string;
  location: string;
  experience: string;
  description: string;
  posted: string;
  visible: boolean;
  sortOrder: number;
  meta: { icon: string; label: string }[];
};

const blankJob = (): Job => ({
  id: "",
  title: "",
  icon: "work",
  status: "Hiring",
  employment: "Full-time",
  location: "Rajagiriya",
  experience: "",
  description: "",
  posted: "Posted recently",
  visible: true,
  sortOrder: 0,
  meta: [],
});

export { blankJob };

export async function getPublicJobs(): Promise<{ jobs: Job[]; sectionVisible: boolean }> {
  try {
    const response = await fetch(apiUrl("/jobs/public"), { next: { revalidate: 60 } });
    if (!response.ok) return { jobs: [], sectionVisible: false };
    const data = (await response.json()) as { jobs?: Job[]; sectionVisible?: boolean };
    return {
      jobs: Array.isArray(data.jobs) ? data.jobs : [],
      sectionVisible: data.sectionVisible !== false,
    };
  } catch {
    return { jobs: [], sectionVisible: false };
  }
}

export async function fetchManageJobs(): Promise<Job[]> {
  const response = await fetch(browserApiUrl("/jobs/manage"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as { jobs?: Job[] };
  return Array.isArray(data.jobs) ? data.jobs : [];
}

export async function fetchJobSettings(): Promise<{ sectionVisible: boolean }> {
  const response = await fetch(browserApiUrl("/jobs/settings"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as { sectionVisible: boolean };
}

export const jobCmsApi = {
  save: (body: Job, id?: string) =>
    fetch(browserApiUrl(id ? `/jobs/${id}` : "/jobs"), {
      method: id ? "PUT" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  remove: (id: string) => fetch(browserApiUrl(`/jobs/${id}`), { method: "DELETE", credentials: "include" }),
  saveSettings: (sectionVisible: boolean) =>
    fetch(browserApiUrl("/jobs/settings"), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionVisible }),
    }),
};
