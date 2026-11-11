"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import seeds from "./projects.json";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";

const STORAGE_KEY = "letsfly-cms-projects-v1";
const VIEW_KEY = "cms-proj-view";
const categories = {
  meetings: "Meetings",
  incentives: "Incentives",
  conventions: "Conventions",
  exhibitions: "Exhibitions",
} as const;
type ProjectCategory = keyof typeof categories;
type LegacyProjectCategory = "csr" | "events" | "other";
type ProjectStatus = "draft" | "published";
type ProjectImage = { src: string; alt: string; name?: string };
interface Project {
  id: string;
  slug: string;
  category: ProjectCategory | LegacyProjectCategory | "";
  title: string;
  date: string;
  summary: string;
  description: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  status: ProjectStatus;
  updatedAt: number;
}
type SeedProject = (typeof seeds)[number];

const btnPrimary =
  "inline-flex min-h-[38px] items-center justify-center gap-[7px] whitespace-nowrap rounded-[9px] border border-cms-primary bg-cms-primary px-[13px] text-[12px] font-semibold text-white transition-colors hover:bg-[#1408b0] dark:hover:bg-[#7d74ff]";
const btnSecondary =
  "inline-flex min-h-[38px] items-center justify-center gap-[7px] whitespace-nowrap rounded-[9px] border border-cms-line bg-cms-card px-[13px] text-[12px] font-semibold text-cms-ink transition-colors hover:border-[#cfcce8] hover:bg-[#f6f6fb] dark:hover:border-[#41478c] dark:hover:bg-[#1f2353]";
const btnTiny =
  "min-h-[30px] whitespace-nowrap rounded-[7px] border border-cms-line bg-cms-card px-2 text-[10px] font-semibold text-cms-ink transition-colors hover:border-[#cfcce8] hover:bg-[#f6f6fb] dark:hover:border-[#41478c] dark:hover:bg-[#1f2353]";
const panelShell =
  "min-w-0 rounded-[13px] border border-cms-line bg-cms-card p-[18px] shadow-[0_1px_2px_rgba(19,8,122,.04)] dark:shadow-none";
const inputShell =
  "min-h-[38px] w-full rounded-lg border border-[#dcdaf0] bg-white px-[10px] py-2 text-[12px] font-semibold text-cms-ink outline-none transition-colors focus:border-cms-primary focus:shadow-[0_0_0_3px_rgba(27,15,216,.1)] focus-visible:outline-none! dark:border-[#2a2e63] dark:bg-[#101435] dark:focus:border-cms-primary dark:focus:shadow-[0_0_0_3px_rgba(106,96,255,.28)]";
const chipShell = "inline-flex items-center rounded-full px-2 py-[3px] text-[10px] font-semibold";

const categoryChipStyles: Record<string, string> = {
  meetings: "bg-[#ecebff] text-[#1b0fd8] dark:bg-[#232755] dark:text-[#8f86ff]",
  incentives: "bg-[#e6f7ef] text-[#087a4e] dark:bg-[#12351f] dark:text-[#6ee7a8]",
  conventions: "bg-[#fff8c2] text-[#796900] dark:bg-[#3a3413] dark:text-[#f5d76e]",
  exhibitions: "bg-[#ffeef1] text-[#d42a6a] dark:bg-[#3a1420] dark:text-[#ff9aa8]",
  csr: "bg-[#f1f0fd] text-cms-muted dark:bg-[#232755]",
  events: "bg-[#f1f0fd] text-cms-muted dark:bg-[#232755]",
  other: "bg-[#f1f0fd] text-cms-muted dark:bg-[#232755]",
  none: "bg-[#f1f0fd] text-cms-ink dark:bg-[#232755]",
};
const chipClass = (category: string) => `${chipShell} ${categoryChipStyles[category] ?? categoryChipStyles.none}`;
const statusClass = (status: ProjectStatus) =>
  status === "published"
    ? "bg-[#e6f7ef] text-[#087a4e] dark:bg-[#12351f] dark:text-[#6ee7a8]"
    : "bg-[#fff8c2] text-[#796900] dark:bg-[#3a3413] dark:text-[#f5d76e]";

const seedProjects = (): Project[] => seeds.map((project: SeedProject, index) => ({
  id: `pj-${project.id}`,
  slug: project.id,
  category: project.category as LegacyProjectCategory,
  title: project.title,
  date: project.date,
  summary: project.summary || "",
  description: project.overview.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""),
  cover: { ...project.cover },
  gallery: project.gallery.map((image) => ({ ...image })),
  status: project.id === "corporate-awards-night-colombo" ? "draft" : "published",
  updatedAt: Date.now() - (index + 1) * 5 * 3600_000,
}));

const categoryLabel = (category: Project["category"]) =>
  category ? categories[category as ProjectCategory] ?? { csr: "CSR", events: "Events", other: "Other" }[category as LegacyProjectCategory] : "";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

function safeDescription(value: string) {
  const template = document.createElement("template");
  template.innerHTML = value;
  const allowed = new Set(["P", "BR", "B", "STRONG", "I", "EM", "A"]);
  const clean = (parent: ParentNode) => {
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) return;
      if (!(node instanceof HTMLElement)) {
        node.remove();
        return;
      }
      clean(node);
      if (node.tagName === "DIV") {
        const paragraph = document.createElement("p");
        paragraph.append(...node.childNodes);
        node.replaceWith(paragraph);
        return;
      }
      if (!allowed.has(node.tagName)) {
        node.replaceWith(...node.childNodes);
        return;
      }
      [...node.attributes].forEach((attribute) => {
        if (!(node.tagName === "A" && attribute.name === "href")) node.removeAttribute(attribute.name);
      });
      if (node.tagName === "A") {
        const href = node.getAttribute("href") || "";
        if (!/^(https?:|mailto:|tel:)/i.test(href)) {
          node.replaceWith(...node.childNodes);
        } else {
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener");
        }
      }
    });
  };
  clean(template.content);
  const output = document.createElement("div");
  let paragraph: HTMLParagraphElement | null = null;
  [...template.content.childNodes].forEach((node) => {
    if (node instanceof HTMLParagraphElement) {
      paragraph = null;
      output.append(node);
    } else {
      if (!paragraph) {
        paragraph = document.createElement("p");
        output.append(paragraph);
      }
      paragraph.append(node);
    }
  });
  return output.innerHTML;
}

function readProjects(): Project[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    const initial = seedProjects();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed as Project[];
  } catch (error) {
    console.error("Saved project data is not readable; restoring the existing sample projects.", error);
  }
  const initial = seedProjects();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function slugify(value: string) {
  return value.normalize("NFKD").toLowerCase().trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function newId() {
  return `pj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function dateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "No date"
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function timeAgo(value: number) {
  const minutes = Math.max(0, Math.floor((Date.now() - value) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return dateLabel(new Date(value).toISOString().slice(0, 10));
}

function imageCount(project: Project) {
  return [project.cover, ...project.gallery].filter((image) => image.src).length;
}

function backgroundStyle(src: string) {
  return src ? { backgroundImage: `url("${src.replace(/"/g, "%22")}")` } : undefined;
}

function blankProject(): Project {
  return {
    id: newId(), slug: "", category: "", title: "",
    date: new Date().toISOString().slice(0, 10), summary: "", description: "",
    cover: { src: "", alt: "" }, gallery: [], status: "draft", updatedAt: Date.now(),
  };
}

async function readImage(file: File, maxWidth: number): Promise<ProjectImage> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
      !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    throw new Error(`${file.name}: unsupported format (use JPG, PNG or WebP).`);
  }
  if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name}: larger than 5 MB.`);

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const scale = Math.min(1, maxWidth / image.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error(`${file.name}: image processing is not available.`);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return {
      src: canvas.toDataURL("image/jpeg", 0.8),
      alt: file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim(),
      name: file.name,
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(file.name)) throw error;
    throw new Error(`${file.name}: could not be read.`);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function ProjectsTab({ onDirtyChange, onNavigate }: { onDirtyChange: (dirty: boolean) => void; onNavigate: (section: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [status, setStatus] = useState<"" | ProjectStatus>("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<Project | null>(null);
  const [imageError, setImageError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const descriptionEditor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setProjects(readProjects());
      setView(localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid");
    } catch (caught) {
      console.error("Could not load projects.", caught);
      setError("Projects could not be loaded from browser storage.");
    }
  }, []);

  useEffect(() => {
    const editor = descriptionEditor.current;
    if (editor && draft && editor.innerHTML !== draft.description) editor.innerHTML = draft.description;
  }, [activeId, draft]);
  const counts = useMemo(() => ({
    all: projects.length,
    meetings: projects.filter((project) => project.category === "meetings").length,
    incentives: projects.filter((project) => project.category === "incentives").length,
    conventions: projects.filter((project) => project.category === "conventions").length,
    exhibitions: projects.filter((project) => project.category === "exhibitions").length,
  }), [projects]);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    const result = projects.filter((project) =>
      (category === "all" || project.category === category) &&
      (!status || project.status === status) &&
      (!term || `${project.title} ${project.summary}`.toLocaleLowerCase().includes(term)),
    );
    const comparators: Record<string, (a: Project, b: Project) => number> = {
      newest: (a, b) => b.date.localeCompare(a.date),
      oldest: (a, b) => a.date.localeCompare(b.date),
      updated: (a, b) => b.updatedAt - a.updatedAt,
      name: (a, b) => a.title.localeCompare(b.title),
    };
    return result.sort(comparators[sort]);
  }, [category, projects, query, sort, status]);

  function saveList(next: Project[], message?: string) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProjects(next);
      setError("");
      if (message) setNotice(message);
      return true;
    } catch (caught) {
      console.error("Could not save projects.", caught);
      setError("Could not save: browser storage is full. Try fewer or smaller photos.");
      return false;
    }
  }

  function startNew() {
    setDraft(blankProject());
    setActiveId("new");
    setSlugTouched(false);
    onDirtyChange(false);
    setError("");
    setNotice("");
  }

  function startEdit(project: Project) {
    setDraft({ ...project, cover: { ...project.cover }, gallery: project.gallery.map((image) => ({ ...image })) });
    setActiveId(project.id);
    setSlugTouched(project.slug !== slugify(project.title));
    onDirtyChange(false);
    setError("");
    setNotice("");
  }

  function updateDraft(update: Partial<Project>) {
    setDraft((currentDraft) => {
      if (!currentDraft) return currentDraft;
      const next = { ...currentDraft, ...update };
      if (update.title !== undefined && !slugTouched) next.slug = slugify(update.title);
      return next;
    });
    onDirtyChange(true);
    setError("");
  }

  function saveProject(nextStatus: ProjectStatus) {
    if (!draft) return;
    const savedProject = projects.find((project) => project.id === draft.id);
    if (nextStatus === "draft" && savedProject?.status === "published" &&
        !window.confirm("This project is currently published. Saving it as a draft will hide it from the Projects page until you publish it again.")) {
      return;
    }
    const slug = slugify(draft.slug || draft.title);
    const validation = !draft.title.trim()
      ? "Add a project title."
      : nextStatus === "published" && !(draft.category in categories)
        ? "Choose a category: Meetings, Incentives, Conventions or Exhibitions."
        : nextStatus === "published" && !slug
          ? "Add a page URL (slug)."
          : nextStatus === "published" && projects.some((project) => project.id !== draft.id && project.slug === slug)
            ? "This URL is already used by another project. Please change it."
            : nextStatus === "published" && !draft.date
              ? "Choose the project date."
              : nextStatus === "published" && !draft.summary.trim()
                ? "Write a short card summary."
                : nextStatus === "published" && !draft.description.replace(/<[^>]*>/g, "").trim()
                  ? "Write the description overview."
                  : nextStatus === "published" && !draft.cover.src
                    ? "Upload a cover image."
                    : nextStatus === "published" && !draft.cover.alt.trim()
                      ? "Describe the cover image (alt text)."
                      : nextStatus === "published" && draft.gallery.some((image) => !image.alt.trim())
                        ? "Add alt text to every gallery photo."
                        : "";
    if (validation) {
      setError(validation);
      return;
    }
    const updated: Project = {
      ...draft,
      title: draft.title.trim(),
      slug,
      summary: draft.summary.trim(),
      description: safeDescription(draft.description),
      cover: { ...draft.cover, alt: draft.cover.alt.trim() },
      gallery: draft.gallery.filter((image) => image.src).map((image) => ({ ...image, alt: image.alt.trim() })),
      status: nextStatus,
      updatedAt: Date.now(),
    };
    const exists = projects.some((project) => project.id === updated.id);
    const next = exists
      ? projects.map((project) => project.id === updated.id ? updated : project)
      : [updated, ...projects];
    if (saveList(next, nextStatus === "published" ? "Project published." : "Draft saved successfully.")) {
      setDraft(updated);
      setActiveId(null);
      onDirtyChange(false);
    }
  }

  async function chooseCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !draft) return;
    try {
      const image = await readImage(file, 1600);
      updateDraft({ cover: { ...image, alt: draft.cover.alt || image.alt } });
      setImageError("");
    } catch (caught) {
      setImageError(caught instanceof Error ? caught.message : "Could not read the image.");
    }
  }

  async function chooseGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    if (!draft || !files.length) return;
    const loaded = await Promise.all(files.map(async (file) => {
      try {
        return await readImage(file, 1400);
      } catch (caught) {
        setImageError((currentError) => [currentError, caught instanceof Error ? caught.message : "Could not read image."]
          .filter(Boolean).join(" "));
        return null;
      }
    }));
    const images = loaded.filter((image): image is ProjectImage => image !== null);
    if (images.length) updateDraft({ gallery: [...draft.gallery, ...images] });
  }

  async function duplicateProject(project: Project) {
    const copy = {
      ...project,
      id: newId(),
      title: `${project.title} (copy)`,
      slug: slugify(`${project.title} copy`),
      status: "draft" as const,
      updatedAt: Date.now(),
    };
    let uniqueSlug = copy.slug || "project";
    let suffix = 2;
    while (projects.some((item) => item.slug === uniqueSlug)) uniqueSlug = `${copy.slug}-${suffix++}`;
    copy.slug = uniqueSlug;
    saveList([...projects.slice(0, projects.indexOf(project) + 1), copy, ...projects.slice(projects.indexOf(project) + 1)], `Duplicated as “${copy.title}” (Draft).`);
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete “${project.title}” and all ${imageCount(project)} photos? This cannot be undone.`)) return;
    saveList(projects.filter((item) => item.id !== project.id), `“${project.title}” deleted.`);
  }

  function resetProjects() {
    if (!window.confirm("All projects will be replaced with the original sample projects. Anything you added or edited in this browser will be lost.")) return;
    saveList(seedProjects(), "Sample projects restored.");
  }

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setStatus("");
  }

  function closeEditor() {
    setActiveId(null);
    setDraft(null);
    onDirtyChange(false);
    setError("");
    setImageError("");
  }

  function crumbNavigate(section: string) {
    if (section === "projects" && activeId !== null) {
      closeEditor();
      return;
    }
    onNavigate(section);
  }

  function moveGallery(index: number, offset: -1 | 1) {
    if (!draft) return;
    const target = index + offset;
    if (target < 0 || target >= draft.gallery.length) return;
    const gallery = [...draft.gallery];
    [gallery[index], gallery[target]] = [gallery[target], gallery[index]];
    updateDraft({ gallery });
  }

  function setCoverFromGallery(index: number) {
    if (!draft) return;
    const gallery = [...draft.gallery];
    const [image] = gallery.splice(index, 1);
    if (draft.cover.src) gallery.splice(index, 0, draft.cover);
    updateDraft({ cover: image, gallery });
  }

  function onDrop(event: DragEvent<HTMLElement>, target: "cover" | "gallery") {
    event.preventDefault();
    if (target === "cover") {
      const file = event.dataTransfer.files[0];
      if (file && draft) {
        void readImage(file, 1600).then((image) => updateDraft({ cover: { ...image, alt: draft.cover.alt || image.alt } }))
          .catch((caught: unknown) => setImageError(caught instanceof Error ? caught.message : "Could not read the image."));
      }
    } else {
      const files = [...event.dataTransfer.files];
      void Promise.all(files.map(async (file) => {
        try {
          return await readImage(file, 1400);
        } catch (caught) {
          setImageError((currentError) => [currentError, caught instanceof Error ? caught.message : "Could not read image."]
            .filter(Boolean).join(" "));
          return null;
        }
      })).then((images) => {
        const accepted = images.filter((image): image is ProjectImage => image !== null);
        if (accepted.length) updateDraft({ gallery: [...(draft?.gallery ?? []), ...accepted] });
      });
    }
  }

  const activeEdit = activeId !== null;

  return (
    <div className="animate-[cms-home-fade_0.35s_cubic-bezier(.2,.7,.2,1)] text-cms-text">
      {notice && <p className="mb-3 rounded-[7px] bg-[#e6f7ef] px-3 py-2.5 text-[12px] text-[#087a4e] dark:bg-[#12351f] dark:text-[#6ee7a8]" role="status">{notice}</p>}
      {error && <p className="mb-3 rounded-[7px] border-l-[3px] border-[#d42a45] bg-[#fff1f2] px-3 py-2.5 text-[12px] text-[#991b1b] dark:border-[#5c2233] dark:bg-[#3a1420] dark:text-[#ff9aa8]" role="alert">{error}</p>}
      {!activeEdit ? (
        <>
          <section className="mb-5 flex flex-col items-start justify-between gap-[18px] min-[481px]:flex-row min-[481px]:items-center">
            <div>
              <h2 className="text-[21px] font-semibold text-cms-ink">Projects</h2>
              <p className="mt-1 text-[13px] text-cms-muted">Manage meetings, incentives, conventions and exhibitions shown on the website’s Projects page.</p>
              <Breadcrumbs
                className="mt-3"
                items={[{ label: "Home", href: "#home", id: "home" }, { label: "Projects" }]}
                onNavigate={crumbNavigate}
              />
            </div>
            <button suppressHydrationWarning className={btnPrimary} onClick={startNew} type="button">＋ Add Project</button>
          </section>
          <nav aria-label="Filter by category" className="mb-[15px] flex gap-1.5 overflow-x-auto">
            {(["all", "meetings", "incentives", "conventions", "exhibitions"] as const).map((item) => (
              <button suppressHydrationWarning aria-pressed={category === item} key={item}
                className={`inline-flex min-h-9 flex-none items-center gap-[7px] whitespace-nowrap rounded-lg border px-[11px] text-[12px] transition-colors ${
                  category === item
                    ? "border-[#dedcf0] bg-[#f1f0fd] font-semibold text-cms-primary dark:border-[#41478c] dark:bg-[#232755]"
                    : "border-transparent text-cms-muted hover:text-cms-ink"
                }`}
                onClick={() => setCategory(item)} type="button">
                {item === "all" ? "All" : categories[item]}
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[rgba(19,8,122,.07)] px-[5px] dark:bg-[rgba(255,255,255,.09)]">{counts[item]}</span>
              </button>
            ))}
          </nav>
          <section aria-label="Project filters" className="flex flex-wrap items-center gap-[9px] rounded-xl border border-cms-line bg-cms-card p-3">
            <label className="flex h-[38px] w-full min-w-[180px] items-center gap-2 rounded-lg border border-cms-line px-2.5 text-cms-muted min-[761px]:w-auto min-[761px]:flex-1">
              <span aria-hidden="true">⌕</span>
              <input suppressHydrationWarning aria-label="Search projects" className="w-full border-0 bg-transparent text-[12px] text-cms-ink outline-none placeholder:text-cms-muted" onChange={(event) => setQuery(event.target.value)} placeholder="Search by project title or summary…" type="search" value={query} />
            </label>
            <select suppressHydrationWarning aria-label="Publication status" className="h-[38px] flex-1 rounded-lg border border-cms-line bg-cms-card px-2.5 text-[12px] text-cms-ink outline-none min-[761px]:max-w-[190px] min-[761px]:flex-none" onChange={(event) => setStatus(event.target.value as "" | ProjectStatus)} value={status}>
              <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>
            </select>
            <select suppressHydrationWarning aria-label="Sort projects" className="h-[38px] flex-1 rounded-lg border border-cms-line bg-cms-card px-2.5 text-[12px] text-cms-ink outline-none min-[761px]:max-w-[190px] min-[761px]:flex-none" onChange={(event) => setSort(event.target.value)} value={sort}>
              <option value="newest">Project date: newest first</option><option value="oldest">Project date: oldest first</option>
              <option value="updated">Recently updated</option><option value="name">Name (A–Z)</option>
            </select>
            <div aria-label="Layout" className="flex rounded-lg border border-cms-line p-[3px]" role="group">
              {(["grid", "list"] as const).map((item) => (
                <button suppressHydrationWarning aria-pressed={view === item} key={item} onClick={() => {
                  setView(item);
                  try { localStorage.setItem(VIEW_KEY, item); } catch (caught) {
                    console.error("Could not save project layout preference.", caught);
                    setError("The layout preference could not be saved.");
                  }
                }} title={`${item} view`} type="button"
                className="h-[30px] w-8 rounded-[5px] border-0 bg-transparent text-cms-muted transition-colors aria-pressed:bg-[#f1f0fd] aria-pressed:text-cms-primary dark:aria-pressed:bg-[#232755]">{item === "grid" ? "▦" : "☷"}</button>
              ))}
            </div>
          </section>
          <div className="flex min-h-[46px] flex-wrap items-center justify-between gap-3 text-[12px] text-cms-muted">
            <span>{query || category !== "all" || status ? <>Showing <b className="text-cms-ink">{filtered.length}</b> of {projects.length} projects</> : <><b className="text-cms-ink">{projects.length} {projects.length === 1 ? "project" : "projects"}</b> · {projects.filter((project) => project.status === "published").length} published · {projects.filter((project) => project.status === "draft").length} draft{projects.filter((project) => project.status === "draft").length === 1 ? "" : "s"}</>}</span>
            {(query || category !== "all" || status) && <button suppressHydrationWarning className="border-0 bg-transparent p-1 text-[12px] font-semibold text-cms-primary" onClick={clearFilters} type="button">× Clear filters</button>}
          </div>
          {projects.length === 0 ? (
            <div className="grid min-h-[240px] content-center justify-items-center gap-[9px] rounded-[13px] border border-cms-line bg-cms-card p-[25px] text-center shadow-[0_1px_2px_rgba(19,8,122,.04)] dark:shadow-none">
              <h3 className="text-[16px] font-semibold text-cms-ink">No projects yet</h3>
              <p className="text-[12px] text-cms-muted">Add your first project to show it on the website’s Projects page.</p>
              <button suppressHydrationWarning className={btnPrimary} onClick={startNew} type="button">＋ Add Project</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid min-h-[240px] content-center justify-items-center gap-[9px] rounded-[13px] border border-cms-line bg-cms-card p-[25px] text-center shadow-[0_1px_2px_rgba(19,8,122,.04)] dark:shadow-none">
              <h3 className="text-[16px] font-semibold text-cms-ink">No projects match your filters</h3>
              <p className="text-[12px] text-cms-muted">Try another category or search term.</p>
              <button suppressHydrationWarning className={btnSecondary} onClick={clearFilters} type="button">Clear filters</button>
            </div>
          ) : (
            <div className={`grid gap-4 ${view === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
              <button suppressHydrationWarning onClick={startNew} type="button"
                className={view === "list"
                  ? "flex min-h-[96px] min-w-0 items-center justify-start gap-3 overflow-hidden rounded-[13px] border border-dashed border-cms-line bg-cms-card p-5 text-left text-cms-ink transition-colors hover:border-cms-primary dark:shadow-none"
                  : "flex min-h-[260px] min-w-0 flex-col items-start justify-center overflow-hidden rounded-[13px] border border-dashed border-cms-line bg-cms-card p-5 text-left text-cms-ink transition-colors hover:border-cms-primary dark:shadow-none"}>
                <span className="grid size-[42px] shrink-0 place-items-center rounded-xl bg-[#f1f0fd] text-[24px] text-cms-primary dark:bg-[#232755]">＋</span>
                <b className={view === "list" ? "text-[14px]" : "mt-3.5 text-[14px]"}>Add new project</b>
                <small className={view === "list" ? "text-[11px] font-normal leading-[1.5] text-cms-muted" : "mt-[5px] text-[11px] font-normal leading-[1.5] text-cms-muted"}>Create a meeting, incentive, convention or exhibition with its description and photo gallery.</small>
              </button>
              {filtered.map((project) => (
                <article className={`min-w-0 overflow-hidden rounded-[13px] border border-cms-line bg-cms-card shadow-[0_1px_2px_rgba(19,8,122,.04)] dark:shadow-none ${
                  view === "list"
                    ? "grid grid-cols-[minmax(150px,220px)_minmax(0,1fr)_auto] items-stretch max-[760px]:grid-cols-[120px_minmax(0,1fr)]"
                    : "flex flex-col"
                }`} key={project.id}>
                  <button suppressHydrationWarning onClick={() => startEdit(project)} style={backgroundStyle(project.cover.src)} type="button"
                    className={`block w-full border-0 bg-[#eeedf7] bg-cover bg-center transition-transform dark:bg-[#1f2353] ${
                      view === "list"
                        ? "relative h-full min-h-[150px] max-[760px]:min-h-[125px]"
                        : "relative aspect-video"
                    }`}>
                    <span className={`absolute left-2.5 top-2.5 inline-flex min-h-[23px] items-center rounded-full px-2 text-[10px] font-semibold ${statusClass(project.status)}`}>{project.status === "published" ? "Published" : "Draft"}</span>
                    {imageCount(project) > 1 && <span className="absolute right-2.5 top-2.5 inline-flex min-h-[23px] items-center rounded-full bg-[rgba(18,10,92,.8)] px-2 text-[10px] font-semibold text-white dark:bg-[rgba(0,0,0,.65)]">{imageCount(project)} photos</span>}
                  </button>
                  <div className="flex flex-1 flex-col items-start p-3.5">
                    <span className={chipClass(project.category || "none")}>{categoryLabel(project.category) || "No category"}</span>
                    <h3 className="mt-2 text-[14px] font-semibold leading-[1.4] text-cms-ink">{project.title || "Untitled project"}</h3>
                    <p className="mt-[5px] text-[12px] leading-[1.5] text-cms-muted">{project.summary || <i>No summary yet</i>}</p>
                    <small className="mt-auto pt-3 text-[10px] font-normal text-cms-muted">{dateLabel(project.date)} · Updated {timeAgo(project.updatedAt)}</small>
                  </div>
                  <div className={`flex flex-wrap gap-[5px] px-3 py-2.5 ${
                    view === "list"
                      ? "content-center justify-end border-t-0 border-cms-line max-[760px]:col-span-full max-[760px]:justify-start max-[760px]:border-t"
                      : "border-t border-cms-line"
                  }`}>
                    <button suppressHydrationWarning className={btnTiny} onClick={() => startEdit(project)} type="button">Edit</button>
                    <button suppressHydrationWarning className={btnTiny} onClick={() => setPreview(project)} type="button">Preview</button>
                    <button suppressHydrationWarning aria-label={`Duplicate ${project.title}`} className={`${btnTiny} text-[#d42a6a] dark:text-[#ff9aa8]`} onClick={() => void duplicateProject(project)} type="button">Duplicate</button>
                    <button suppressHydrationWarning aria-label={`Delete ${project.title}`} className={`${btnTiny} text-[#b42336] dark:text-[#ff9aa8]`} onClick={() => void deleteProject(project)} type="button">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="mt-[18px] flex flex-wrap items-center gap-2 text-[11px] text-cms-muted max-[480px]:items-start">Prototype: changes are saved in this browser only, not on a server. Published projects appear on the public Projects page, newest first.
            <button suppressHydrationWarning className="ml-auto border-0 bg-transparent p-1 text-[12px] font-semibold text-cms-primary max-[480px]:ml-0" onClick={resetProjects} type="button">Reset sample projects</button>
          </p>
        </>
      ) : draft && (
        <section>
          <button suppressHydrationWarning className="mb-3.5 border-0 bg-transparent p-0 text-[12px] font-semibold text-cms-primary hover:underline" onClick={closeEditor} type="button">← Back to Projects</button>
          <header className="mb-4 flex min-h-[88px] items-center gap-3.5 rounded-[13px] border border-cms-line bg-cms-card p-3 shadow-[0_1px_2px_rgba(19,8,122,.04)] dark:shadow-none max-[480px]:items-start">
            <div className="h-[58px] w-[76px] shrink-0 rounded-lg bg-cms-card2 bg-cover bg-center max-[480px]:h-12 max-[480px]:w-[58px]" style={backgroundStyle(draft.cover.src)} />
            <div className="min-w-0">
              <span className={chipClass(draft.category || "none")}>{categoryLabel(draft.category) || "No category yet"}</span>
              <h2 className="mt-[3px] text-[17px] font-semibold text-cms-ink max-[480px]:text-[15px]">{draft.title || (activeId === "new" ? "New project" : "Untitled project")}</h2>
              <p className="text-[11px] text-cms-muted">{dateLabel(draft.date)} · {imageCount(draft)} photos</p>
              <Breadcrumbs
                className="mt-2.5"
                items={[
                  { label: "Home", href: "#home", id: "home" },
                  { label: "Projects", href: "#projects", id: "projects" },
                  { label: draft.title || (activeId === "new" ? "New project" : "Untitled project") },
                ]}
                onNavigate={crumbNavigate}
              />
            </div>
            <span className={`ml-auto inline-flex min-h-[23px] shrink-0 items-center rounded-full px-2 text-[10px] font-semibold ${statusClass(draft.status)}`}>{draft.status === "published" ? "Published" : "Draft"}</span>
          </header>
          <div className="grid items-start gap-4 grid-cols-1 min-[1101px]:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.8fr)]">
            <div className="grid gap-3.5">
              <section className={panelShell}>
                <header className="mb-3.5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-cms-ink">Project details</h3>
                    <p className="mt-1 text-[10.5px] leading-[1.5] text-cms-muted">Shown on the Projects page and at the top of the project page. Fields marked * are required to publish.</p>
                  </div>
                </header>
                <div className="grid grid-cols-1 gap-[13px] min-[481px]:grid-cols-2">
                  <fieldset className="col-span-full m-0 grid min-w-0 gap-1.5 border-0 p-0 text-[11px] font-semibold text-cms-ink">
                    <legend className="mb-[7px] text-[11px] font-semibold text-cms-ink">Category *</legend>
                    <div className="flex flex-wrap gap-[7px]">
                      {(Object.entries(categories) as [ProjectCategory, string][]).map(([key, label]) => (
                        <button suppressHydrationWarning aria-pressed={draft.category === key} key={key} onClick={() => updateDraft({ category: key })} type="button"
                          className="min-h-[34px] whitespace-nowrap rounded-lg border border-cms-line bg-cms-card px-3 text-[11px] font-semibold text-cms-muted transition-colors aria-pressed:border-cms-primary aria-pressed:bg-[#f1f0fd] aria-pressed:text-cms-primary dark:bg-[#171a42] dark:aria-pressed:bg-[#232755]">{label}</button>
                      ))}
                    </div>
                    <small className="mt-1.5 text-[10.5px] font-normal leading-[1.5] text-cms-muted">Choose whether this project is a meeting, incentive, convention or exhibition.</small>
                  </fieldset>
                  <label className="grid min-w-0 gap-1.5 text-[11px] font-semibold text-cms-ink col-span-full">Project title *
                    <input suppressHydrationWarning className={inputShell} maxLength={100} onChange={(event) => updateDraft({ title: event.target.value })} placeholder="e.g. Beach Clean-up at Mount Lavinia" value={draft.title} />
                  </label>
                  <label className="grid min-w-0 gap-1.5 text-[11px] font-semibold text-cms-ink col-span-full">Page URL (slug) *
                    <span className="flex items-center overflow-hidden rounded-lg border border-[#dcdaf0] bg-white text-[10px] font-normal text-cms-muted dark:border-[#2a2e63] dark:bg-[#101435]">
                      <span className="pl-[9px] whitespace-nowrap">letsfly.lk/projects/</span>
                      <input suppressHydrationWarning className="min-h-[38px] w-full border-0 bg-transparent px-2.5 text-[12px] text-cms-ink outline-none focus-visible:outline-none!" maxLength={80} onChange={(event) => { setSlugTouched(true); updateDraft({ slug: event.target.value }); }} value={draft.slug} />
                    </span>
                    <small className="text-[10.5px] font-normal leading-[1.5] text-cms-muted">Created automatically from the title. Use lowercase letters, numbers and hyphens.</small>
                  </label>
                  <label className="grid min-w-0 gap-1.5 text-[11px] font-semibold text-cms-ink">Project date *
                    <input suppressHydrationWarning className={inputShell} onChange={(event) => updateDraft({ date: event.target.value })} type="date" value={draft.date} />
                    <small className="text-[10.5px] font-normal leading-[1.5] text-cms-muted">Used to sort projects, newest first.</small>
                  </label>
                  <label className="grid min-w-0 gap-1.5 text-[11px] font-semibold text-cms-ink">Publication status
                    <select suppressHydrationWarning className={inputShell} onChange={(event) => updateDraft({ status: event.target.value as ProjectStatus })} value={draft.status}>
                      <option value="draft">Draft</option><option value="published">Published</option>
                    </select>
                    <small className="text-[10.5px] font-normal leading-[1.5] text-cms-muted">Choosing Published checks the project and puts it live.</small>
                  </label>
                  <label className="grid min-w-0 gap-1.5 text-[11px] font-semibold text-cms-ink col-span-full">Card summary *
                    <textarea suppressHydrationWarning className={`${inputShell} resize-y`} maxLength={200} onChange={(event) => updateDraft({ summary: event.target.value })} placeholder="One or two sentences shown on the Projects page card." rows={3} value={draft.summary} />
                    <small className="text-[10.5px] font-normal leading-[1.5] text-cms-muted">{draft.summary.length} / 200</small>
                  </label>
                </div>
              </section>
              <section className={panelShell}>
                <header className="mb-3.5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-cms-ink">Description Overview *</h3>
                    <p className="mt-1 text-[10.5px] leading-[1.5] text-cms-muted">The full story of the project, shown in full on the project page. Use the formatting buttons or write paragraphs.</p>
                  </div>
                </header>
                <div className="flex gap-[5px] rounded-lg border border-b-0 border-cms-line p-1.5">
                  <button suppressHydrationWarning className="h-7 min-w-[30px] rounded-[5px] border-0 bg-cms-card px-[7px] text-[11px] font-semibold text-cms-ink transition-colors hover:bg-cms-card2" onMouseDown={(event) => event.preventDefault()} onClick={() => document.execCommand("bold")} type="button"><b>B</b></button>
                  <button suppressHydrationWarning className="h-7 min-w-[30px] rounded-[5px] border-0 bg-cms-card px-[7px] text-[11px] font-semibold text-cms-ink transition-colors hover:bg-cms-card2" onMouseDown={(event) => event.preventDefault()} onClick={() => document.execCommand("italic")} type="button"><i>I</i></button>
                  <button suppressHydrationWarning className="h-7 min-w-[30px] rounded-[5px] border-0 bg-cms-card px-[7px] text-[11px] font-semibold text-cms-ink transition-colors hover:bg-cms-card2" onClick={() => {
                    const url = window.prompt("Paste the full web address, starting with https://");
                    if (url && /^(https?:\/\/|mailto:|tel:)\S+$/i.test(url)) document.execCommand("createLink", false, url);
                  }} onMouseDown={(event) => event.preventDefault()} type="button">Link</button>
                  <button suppressHydrationWarning className="h-7 min-w-[30px] rounded-[5px] border-0 bg-cms-card px-[7px] text-[11px] font-semibold text-cms-ink transition-colors hover:bg-cms-card2" onMouseDown={(event) => event.preventDefault()} onClick={() => { document.execCommand("removeFormat"); document.execCommand("unlink"); }} type="button">Clear formatting</button>
                </div>
                <div aria-label="Description overview" className="min-h-[180px] rounded-b-lg border border-cms-line p-3 text-[12px] leading-[1.65] text-cms-ink outline-none transition-colors empty:before:content-['What_was_the_project,_who_was_involved_and_what_did_it_achieve?'] empty:before:text-cms-muted focus:border-cms-primary focus-visible:outline-none! dark:border-[#2a2e63]" contentEditable onInput={(event) => updateDraft({ description: event.currentTarget.innerHTML })} onPaste={(event) => {
                  event.preventDefault();
                  document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
                }} ref={descriptionEditor} role="textbox" suppressContentEditableWarning />
              </section>
              <section className={panelShell}>
                <header className="mb-3.5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-cms-ink">Project gallery</h3>
                    <p className="mt-1 text-[10.5px] leading-[1.5] text-cms-muted">Photos shown on the project page after the cover image. Add a short description (alt text) to each one.</p>
                  </div>
                  <label className={`${btnSecondary} cursor-pointer`}>＋ Upload images
                    <input suppressHydrationWarning accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden multiple onChange={(event) => void chooseGallery(event)} type="file" />
                  </label>
                </header>
                {imageError && <p className="mb-3 rounded-[7px] border-l-[3px] border-[#d42a45] bg-[#fff1f2] px-3 py-2.5 text-[12px] text-[#991b1b] dark:border-[#5c2233] dark:bg-[#3a1420] dark:text-[#ff9aa8]" role="alert">{imageError}</p>}
                <div className="grid grid-cols-1 gap-3 min-[481px]:grid-cols-2" onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, "gallery")}>
                  {draft.gallery.map((image, index) => (
                    <article className="min-w-0" key={`${image.src.slice(0, 35)}-${index}`}>
                      <div className="relative aspect-video rounded-lg bg-cms-card2 bg-cover bg-center" style={backgroundStyle(image.src)}>
                        <span className="absolute left-1.5 top-1.5 grid size-[22px] place-items-center rounded-full bg-[rgba(18,10,92,.8)] text-[10px] text-white dark:bg-[rgba(0,0,0,.65)]">{index + 1}</span>
                      </div>
                      <input suppressHydrationWarning aria-label={`Alt text for image ${index + 1}`} className="mt-1.5 h-[34px] w-full rounded-[7px] border border-cms-line bg-white px-2 text-[10px] text-cms-ink outline-none transition-colors focus:border-cms-primary focus-visible:outline-none! dark:border-[#2a2e63] dark:bg-[#101435]" maxLength={140} onChange={(event) => updateDraft({ gallery: draft.gallery.map((item, itemIndex) => itemIndex === index ? { ...item, alt: event.target.value } : item) })} placeholder="Describe this photo (alt text)" value={image.alt} />
                      <div className="mt-[5px] flex flex-wrap gap-1">
                        <button suppressHydrationWarning aria-label={`Move image ${index + 1} earlier`} className={`${btnTiny} min-h-[27px] px-1.5 text-[9px]`} disabled={index === 0} onClick={() => moveGallery(index, -1)} type="button">←</button>
                        <button suppressHydrationWarning aria-label={`Move image ${index + 1} later`} className={`${btnTiny} min-h-[27px] px-1.5 text-[9px]`} disabled={index === draft.gallery.length - 1} onClick={() => moveGallery(index, 1)} type="button">→</button>
                        <button suppressHydrationWarning className={`${btnTiny} min-h-[27px] px-1.5 text-[9px]`} onClick={() => setCoverFromGallery(index)} type="button">Set as cover</button>
                        <button suppressHydrationWarning className={`${btnTiny} min-h-[27px] px-1.5 text-[9px]`} onClick={() => updateDraft({ gallery: draft.gallery.filter((_, itemIndex) => itemIndex !== index) })} type="button">Remove</button>
                      </div>
                    </article>
                  ))}
                  <label className="flex min-h-[115px] cursor-pointer flex-col items-center justify-center gap-[7px] rounded-[9px] border border-dashed border-[#cfcce8] text-center text-[11px] font-semibold text-cms-primary transition-colors hover:border-cms-primary dark:border-[#41478c]">
                    ＋ Add project photos
                    <small className="text-[9px] font-normal text-cms-muted">Drag &amp; drop or browse · JPG, PNG, WebP · max 5 MB each</small>
                    <input suppressHydrationWarning accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden multiple onChange={(event) => void chooseGallery(event)} type="file" />
                  </label>
                </div>
              </section>
            </div>
            <aside className="grid gap-3.5 grid-cols-1 min-[761px]:max-[1100px]:grid-cols-2">
              <section className={panelShell}>
                <header className="mb-3.5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-cms-ink">Cover image *</h3>
                    <p className="mt-1 text-[10.5px] leading-[1.5] text-cms-muted">The main image on the project card and at the top of the project page.</p>
                  </div>
                </header>
                <p className="mb-[9px] text-[10px] text-cms-muted">1600 × 900 px · 16:9 · JPG / PNG / WebP · Max 5 MB</p>
                {imageError && <p className="mb-3 rounded-[7px] border-l-[3px] border-[#d42a45] bg-[#fff1f2] px-3 py-2.5 text-[12px] text-[#991b1b] dark:border-[#5c2233] dark:bg-[#3a1420] dark:text-[#ff9aa8]" role="alert">{imageError}</p>}
                <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, "cover")} style={backgroundStyle(draft.cover.src)}
                  className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[9px] border border-dashed border-[#cfcce8] bg-cms-card2 bg-cover bg-center text-center text-[12px] font-semibold text-cms-ink [text-shadow:0_1px_4px_white] transition-colors hover:border-cms-primary dark:border-[#41478c] dark:[text-shadow:0_1px_4px_rgba(0,0,0,.7)]">
                  {!draft.cover.src && <>Upload Cover Image<small className="text-[10px] font-normal">Drag &amp; drop here, or browse files</small></>}
                  <input suppressHydrationWarning accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden onChange={(event) => void chooseCover(event)} type="file" />
                </label>
                {draft.cover.src && <button suppressHydrationWarning className={`${btnSecondary} mt-2`} onClick={() => updateDraft({ cover: { ...draft.cover, src: "", name: undefined } })} type="button">Remove cover</button>}
                <label className="mt-3.5 grid min-w-0 gap-1.5 text-[11px] font-semibold text-cms-ink">Cover alt text *
                  <input suppressHydrationWarning className={inputShell} maxLength={140} onChange={(event) => updateDraft({ cover: { ...draft.cover, alt: event.target.value } })} placeholder="Describe the cover photo" value={draft.cover.alt} />
                </label>
              </section>
              <section className={`${panelShell} grid gap-2.5`}>
                <h3 className="text-[14px] font-semibold text-cms-ink">Card preview · Projects page</h3>
                <div className="aspect-video rounded-lg bg-cms-card2 bg-cover bg-center" style={backgroundStyle(draft.cover.src)} />
                <span className={chipClass(draft.category || "none")}>{categoryLabel(draft.category) || "Category"}</span>
                <b className="text-[13px] text-cms-ink">{draft.title || "Project title"}</b>
                <p className="text-[11px] text-cms-muted">{draft.summary || "Your card summary will appear here."}</p>
              </section>
            </aside>
          </div>
          <footer className="sticky bottom-0 z-[2] mt-4 flex items-center justify-between gap-3 border-t border-cms-line bg-white/95 px-4 py-3 shadow-[0_-6px_18px_rgba(19,8,122,.05)] backdrop-blur-sm max-[760px]:flex-col max-[760px]:items-start dark:border-[#2a2e63] dark:bg-[#171a42]/95 dark:shadow-none">
            <span className="text-[11px] text-[#991b1b] dark:text-[#ff9aa8]">{error && <span role="alert">{error}</span>}</span>
            <div className="flex flex-wrap justify-end gap-[7px] max-[760px]:w-full max-[760px]:justify-start">
              <button suppressHydrationWarning className={btnSecondary} onClick={closeEditor} type="button">Cancel</button>
              <button suppressHydrationWarning className={btnSecondary} onClick={() => setPreview(draft)} type="button">Preview</button>
              <button suppressHydrationWarning className={btnSecondary} onClick={() => saveProject("draft")} type="button">Save Draft</button>
              <button suppressHydrationWarning className={btnPrimary} onClick={() => saveProject("published")} type="button">Publish</button>
            </div>
          </footer>
        </section>
      )}
      {preview && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(10,4,70,.52)] p-5 backdrop-blur-[3px]" onClick={() => setPreview(null)}>
        <section aria-label="Project preview" aria-modal="true" onClick={(event) => event.stopPropagation()} role="dialog"
          className="w-[min(100%,760px)] max-h-[88dvh] overflow-y-auto rounded-[15px] bg-cms-card shadow-[0_24px_60px_rgba(10,4,70,.22)] dark:shadow-none">
          <header className="flex items-start justify-between gap-3 p-[18px]">
            <div>
              <span className={chipClass(preview.category || "none")}>{categoryLabel(preview.category) || "Category"}</span>
              <h2 className="mt-[7px] text-[18px] font-semibold text-cms-ink">{preview.title || "Untitled project"}</h2>
              <p className="mt-1 text-[11px] text-cms-muted">{dateLabel(preview.date)} · {preview.status === "published" ? "Published" : "Draft — not visible on the website"}</p>
            </div>
            <button suppressHydrationWarning aria-label="Close preview" className="size-8 shrink-0 rounded-[7px] border border-cms-line bg-cms-card text-[20px] text-cms-muted transition-colors hover:bg-cms-card2" onClick={() => setPreview(null)} type="button">×</button>
          </header>
          {preview.cover.src && <img alt={preview.cover.alt} className="mx-[18px] block max-h-[360px] w-[calc(100%-36px)] rounded-[10px] object-cover" src={preview.cover.src} />}
          <div className="p-[18px] text-[12px] leading-[1.7] text-cms-ink"><p className="mb-3.5 font-semibold">{preview.summary}</p><div dangerouslySetInnerHTML={{ __html: safeDescription(preview.description) }} /></div>
          {!!preview.gallery.length && <div className="grid grid-cols-2 gap-2 px-[18px] pb-[18px] min-[481px]:grid-cols-3">{preview.gallery.map((image, index) => <img alt={image.alt} className="aspect-[16/10] w-full rounded-[7px] object-cover" key={`${image.src.slice(0, 35)}-${index}`} src={image.src} />)}</div>}
          <footer className="flex justify-end px-[18px] pb-[18px]"><button suppressHydrationWarning className={btnSecondary} onClick={() => setPreview(null)} type="button">Close preview</button></footer>
        </section>
      </div>}
    </div>
  );
}
