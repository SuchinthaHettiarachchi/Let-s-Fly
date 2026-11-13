"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { apiUrl } from "@/lib/api-url";

const API = apiUrl("/packages");
const UPLOAD = apiUrl("/upload");
const inputShell = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const btn = "inline-flex min-h-[38px] items-center justify-center rounded-[9px] border px-[14px] text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-50";
const primary = `${btn} border-transparent bg-cms-primary text-white hover:bg-[#150cb0]`;
const secondary = `${btn} border-cms-line bg-cms-card text-cms-ink hover:bg-[#f5f5f7] dark:hover:bg-[#101435]`;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

// Downscale oversized uploads and re-encode as WebP (same approach as the hero
// media slots) so R2 storage and page weight stay small; falls back to the
// original file when the browser cannot encode WebP.
async function prepareImage(file: File): Promise<string> {
  const original = await readAsDataUrl(file);
  if (file.type === "image/gif") return original;
  const image = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(null);
    img.onload = () => resolve(img);
    img.src = original;
  });
  if (!image || image.naturalWidth <= 1600) return original;
  try {
    const scale = 1600 / image.naturalWidth;
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    if (!blob) return original;
    return await readAsDataUrl(new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" }));
  } catch {
    return original;
  }
}

type Category = "outbound" | "sri-lanka";
type Theme = "cultural" | "hill-country" | "beaches" | "wildlife";
type PackageItem = {
  _id: string;
  slug: string;
  title: string;
  region: string;
  area: string;
  category: Category;
  themes?: Theme[];
  badge: string;
  days: number;
  nights: number;
  price: number;
  image: string;
  flightsIncluded: boolean;
  createdAt: string;
};
type Draft = Omit<PackageItem, "_id" | "createdAt">;

const blankDraft = (category: Category): Draft => ({
  slug: "", title: "", region: "", area: "", category, themes: [], badge: "",
  days: 1, nights: 0, price: 0, image: "", flightsIncluded: false,
});

async function fetchPackages(category: Category) {
  const response = await fetch(`${API}/manage?category=${category}`, { credentials: "include" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: { packages?: PackageItem[] } = await response.json();
  return Array.isArray(data.packages) ? data.packages : [];
}

export default function PackagesTab({ category, onNavigate }: { category: Category; onNavigate: (section: string) => void }) {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [draft, setDraft] = useState<Draft>(blankDraft(category));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dropping, setDropping] = useState(false);

  async function uploadImage(file?: File | null) {
    if (!file) return;
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file (JPEG, PNG, WebP, AVIF or GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError("Image must be 5MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const prepared = await prepareImage(file);
      const response = await fetch(UPLOAD, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: prepared, folder: "packages" }),
      });
      const data: { url?: string; message?: string } = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
      update("image", data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const load = useCallback(async () => {
    try {
      setItems(await fetchPackages(category));
    } catch {
      setNotice("Could not load packages. Please sign in again or try again.");
    } finally {
      setLoaded(true);
    }
  }, [category]);

  useEffect(() => {
    let cancelled = false;
    fetchPackages(category)
      .then((nextItems) => {
        if (!cancelled) setItems(nextItems);
      })
      .catch(() => {
        if (!cancelled) setNotice("Could not load packages. Please sign in again or try again.");
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function edit(item: PackageItem) {
    setEditingId(item._id);
    setDraft({
      slug: item.slug, title: item.title, region: item.region, area: item.area,
      category: item.category, themes: item.themes ?? [], badge: item.badge, days: item.days, nights: item.nights,
      price: item.price, image: item.image, flightsIncluded: item.flightsIncluded,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleTheme(theme: Theme) {
    setDraft((current) => ({
      ...current,
      themes: (current.themes ?? []).includes(theme) ? (current.themes ?? []).filter((item) => item !== theme) : [...(current.themes ?? []), theme],
    }));
  }

  function reset() {
    setEditingId(null);
    setDraft(blankDraft(category));
  }

  async function save() {
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save package.");
      setNotice(editingId ? "Package updated." : "Package created.");
      reset();
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save package.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: PackageItem) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    const response = await fetch(`${API}/${item._id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) {
      setNotice("Could not delete package.");
      return;
    }
    setNotice("Package deleted.");
    if (editingId === item._id) reset();
    await load();
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">{category === "outbound" ? "Outbound Travels" : "Travel Sri Lanka"}</h1>
          <p className="mt-1 text-[13px] text-cms-muted">Create and manage packages shown on the homepage and package pages.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: category === "outbound" ? "Outbound Travels" : "Travel Sri Lanka" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
      </div>

      <section className="mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-cms-ink">{editingId ? "Edit package" : "Add package"}</h2>
          {editingId && <button className={secondary} onClick={reset} type="button">Cancel edit</button>}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Package title"><input className={inputShell} value={draft.title} onChange={(event) => update("title", event.target.value)} /></Field>
          <Field label="Slug"><input className={inputShell} placeholder="dubai-family-escape" value={draft.slug} onChange={(event) => update("slug", event.target.value)} /></Field>
          <Field label="Region"><input className={inputShell} placeholder="UAE" value={draft.region} onChange={(event) => update("region", event.target.value)} /></Field>
          <Field label="Area label"><input className={inputShell} placeholder="Dubai" value={draft.area} onChange={(event) => update("area", event.target.value)} /></Field>
          <Field label="Category"><select className={inputShell} value={draft.category} onChange={(event) => update("category", event.target.value as Category)}><option value="outbound">Outbound</option><option value="sri-lanka">Sri Lanka</option></select></Field>
          <Field label="Badge (optional)"><input className={inputShell} placeholder="Best seller" value={draft.badge} onChange={(event) => update("badge", event.target.value)} /></Field>
          <Field label="Days"><input className={inputShell} min="1" type="number" value={draft.days} onChange={(event) => update("days", Number(event.target.value))} /></Field>
          <Field label="Nights"><input className={inputShell} min="0" type="number" value={draft.nights} onChange={(event) => update("nights", Number(event.target.value))} /></Field>
          <Field label="Price (LKR)"><input className={inputShell} min="0" type="number" value={draft.price} onChange={(event) => update("price", Number(event.target.value))} /></Field>
          <div className="sm:col-span-2">
            <span className="block text-[12.5px] font-semibold text-cms-text">Cover image</span>
            <div
              className={`mt-1.5 grid h-[150px] place-items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed bg-center bg-cover bg-no-repeat text-center text-[12.5px] font-medium transition-[border-color,box-shadow] duration-[180ms] ease-out ${dropping ? "border-[#6f6e80] shadow-[0_0_0_4px_rgba(110,110,130,.16)] dark:border-[#8a8ab0]" : "border-cms-line dark:border-[#2a2e63]"}`}
              style={draft.image ? { backgroundImage: `url("${draft.image}")` } : undefined}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                setDropping(true);
              }}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
                setDropping(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDropping(false);
                void uploadImage(event.dataTransfer.files?.[0]);
              }}
            >{draft.image || uploading ? "" : (
              <>
                <svg aria-hidden="true" fill="none" height="26" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="26">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
                <span>Drop image here</span>
              </>
            )}</div>
            <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5">
              <label className={`${secondary} ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
                {uploading ? "Uploading…" : draft.image ? "Replace image" : "Choose image"}
                <input accept="image/*" hidden disabled={uploading} onChange={(event) => void uploadImage(event.target.files?.[0])} type="file" />
              </label>
              {draft.image && !uploading && <button className={secondary} onClick={() => update("image", "")} type="button">Remove</button>}
            </div>
            <span className="mt-1.5 block truncate text-[11.5px] text-cms-muted" title={draft.image}>{draft.image || "JPEG, PNG, WebP or GIF · up to 5MB"}</span>
            <span className="mt-1 block text-[12px] text-[#d42a45] empty:hidden dark:text-[#ff9aa8]" role="alert">{uploadError}</span>
          </div>
          <label className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-cms-text"><input checked={draft.flightsIncluded} onChange={(event) => update("flightsIncluded", event.target.checked)} type="checkbox" /> Flights included</label>
        </div>
        {draft.category === "sri-lanka" && (
          <fieldset className="mt-4">
            <legend className="text-[12.5px] font-semibold text-cms-text">Sri Lanka themes</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {([["cultural", "Cultural"], ["hill-country", "Hill country"], ["beaches", "Beaches"], ["wildlife", "Wildlife"]] as const).map(([value, label]) => (
                <label className="inline-flex items-center gap-1.5 text-[12px] text-cms-text" key={value}>
                  <input checked={(draft.themes ?? []).includes(value)} onChange={() => toggleTheme(value)} type="checkbox" /> {label}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="mt-4 flex items-center gap-2">
          <button className={primary} disabled={saving} onClick={() => void save()} type="button">{saving ? "Saving…" : editingId ? "Update package" : "Create package"}</button>
          <span className="text-[12px] text-cms-muted" aria-live="polite">{notice}</span>
        </div>
      </section>

      <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-[16px] font-semibold text-cms-ink">Packages ({items.length})</h2><button className={secondary} onClick={() => void load()} type="button">Refresh</button></div>
        {!loaded ? <p className="text-[13px] text-cms-muted">Loading packages…</p> : items.length === 0 ? <p className="text-[13px] text-cms-muted">No packages in this category yet.</p> : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {items.map((item) => <article className="rounded-[11px] border border-cms-line p-4" key={item._id}>
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-cms-ink">{item.title}</h3><p className="mt-1 text-[12px] text-cms-muted">{item.region}{item.area ? ` · ${item.area}` : ""} · {item.days}D / {item.nights}N</p></div>{item.badge && <span className="rounded-full bg-[#fff8c2] px-2 py-1 text-[10px] font-semibold text-[#796900]">{item.badge}</span>}</div>
              <p className="mt-2 text-[13px] font-semibold text-cms-primary">LKR {item.price.toLocaleString("en-LK")}</p>
              <div className="mt-3 flex gap-2"><button className={secondary} onClick={() => edit(item)} type="button">Edit</button><button className={secondary} onClick={() => void remove(item)} type="button">Delete</button></div>
            </article>)}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}
