"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { apiUrl } from "@/lib/api-url";
import {
  defaultInclusions,
  defaultItinerary,
  defaultOverview,
  defaultPayment,
  hydrateDetailFields,
  type InclusionItemCms,
  type ItineraryDayCms,
  type PackageDetailFields,
  type PackageInclusions,
  type PackageItinerary,
  type PackageOverview,
  type PackagePayment,
  type TourCategory,
} from "@/lib/package-cms";
import type { Package } from "@/data/packages";

const API = apiUrl("/packages");
const CATEGORIES_API = apiUrl("/categories");
const UPLOAD = apiUrl("/upload");
const inputShell = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const areaShell = `${inputShell} min-h-[72px] py-2 leading-[1.5] resize-y`;
const btn = "inline-flex min-h-[38px] items-center justify-center rounded-[9px] border px-[14px] text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-50";
const primary = `${btn} border-transparent bg-cms-primary text-white hover:bg-[#150cb0]`;
const secondary = `${btn} border-cms-line bg-cms-card text-cms-ink hover:bg-[#f5f5f7] dark:hover:bg-[#101435]`;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TABS = ["Details", "Gallery", "Overview", "Itinerary", "Inclusions", "Payment"] as const;
type FormTab = (typeof TABS)[number];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

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
type PackageItem = Package & { _id: string; createdAt?: string };

type DraftBase = {
  slug: string;
  title: string;
  region: string;
  area: string;
  category: Category;
  themes: string[];
  badge: string;
  days: number;
  nights: number;
  price: number;
  image: string;
  flightsIncluded: boolean;
};

type Draft = DraftBase & PackageDetailFields;

const blankDraft = (category: Category): Draft => ({
  slug: "",
  title: "",
  region: "",
  area: "",
  category,
  themes: [],
  badge: "",
  days: 1,
  nights: 0,
  price: 0,
  image: "",
  flightsIncluded: false,
  gallery: [],
  overview: defaultOverview(),
  itinerary: defaultItinerary(),
  inclusions: defaultInclusions(),
  payment: defaultPayment(),
});

async function fetchPackages(category: Category) {
  const response = await fetch(`${API}/manage?category=${category}`, { credentials: "include" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: { packages?: PackageItem[] } = await response.json();
  return Array.isArray(data.packages) ? data.packages : [];
}

async function fetchCategories() {
  const response = await fetch(CATEGORIES_API, { credentials: "include" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: { categories?: TourCategory[] } = await response.json();
  return Array.isArray(data.categories) ? data.categories : [];
}

export default function PackagesTab({ category, onNavigate }: { category: Category; onNavigate: (section: string) => void }) {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [draft, setDraft] = useState<Draft>(blankDraft(category));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FormTab>("Details");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dropping, setDropping] = useState(false);
  const [catNotice, setCatNotice] = useState("");
  const [catDraft, setCatDraft] = useState({ key: "", label: "", sortOrder: 0 });
  const [catEditingId, setCatEditingId] = useState<string | null>(null);

  async function uploadToR2(file: File, folder: string): Promise<string> {
    if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
    if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be 5MB or smaller.");
    const prepared = await prepareImage(file);
    const response = await fetch(UPLOAD, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: prepared, folder }),
    });
    const data: { url?: string; message?: string } = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
    return data.url;
  }

  async function uploadImage(file?: File | null) {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      update("image", await uploadToR2(file, "packages"));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function addGalleryImage(file?: File | null) {
    if (!file) return;
    setUploadError("");
    setGalleryUploading(true);
    try {
      const url = await uploadToR2(file, "packages");
      setDraft((current) => ({ ...current, gallery: [...current.gallery, url] }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setGalleryUploading(false);
    }
  }

  const loadCategories = useCallback(async () => {
    if (category !== "sri-lanka") return;
    try {
      setCategories(await fetchCategories());
    } catch {
      setCatNotice("Could not load categories.");
    }
  }, [category]);

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
    if (category === "sri-lanka") {
      fetchCategories()
        .then((next) => {
          if (!cancelled) setCategories(next);
        })
        .catch(() => {
          if (!cancelled) setCatNotice("Could not load categories.");
        });
    }
    return () => {
      cancelled = true;
    };
  }, [category]);

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function edit(item: PackageItem) {
    const detail = hydrateDetailFields(item);
    setEditingId(item._id);
    setDraft({
      slug: item.slug,
      title: item.title,
      region: item.region,
      area: item.area ?? "",
      category: item.category,
      themes: item.themes ?? [],
      badge: item.badge ?? "",
      days: item.days,
      nights: item.nights,
      price: item.price,
      image: item.image ?? "",
      flightsIncluded: item.flightsIncluded === true,
      ...detail,
    });
    setActiveTab("Details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleTheme(key: string) {
    setDraft((current) => ({
      ...current,
      themes: current.themes.includes(key) ? current.themes.filter((item) => item !== key) : [...current.themes, key],
    }));
  }

  function reset() {
    setEditingId(null);
    setDraft(blankDraft(category));
    setActiveTab("Details");
    setUploadError("");
  }

  async function save() {
    setSaving(true);
    setNotice("");
    try {
      const body = {
        slug: draft.slug,
        title: draft.title,
        region: draft.region,
        area: draft.area,
        category: draft.category,
        themes: draft.themes,
        badge: draft.badge,
        days: draft.days,
        nights: draft.nights,
        price: draft.price,
        image: draft.image,
        flightsIncluded: draft.flightsIncluded,
        gallery: draft.gallery,
        overview: draft.overview,
        itinerary: draft.itinerary,
        inclusions: draft.inclusions,
        payment: draft.payment,
      };
      const response = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  async function saveCategory() {
    setCatNotice("");
    try {
      const response = await fetch(catEditingId ? `${CATEGORIES_API}/${catEditingId}` : CATEGORIES_API, {
        method: catEditingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catDraft),
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save category.");
      setCatNotice(catEditingId ? "Category updated." : "Category created.");
      setCatDraft({ key: "", label: "", sortOrder: 0 });
      setCatEditingId(null);
      await loadCategories();
    } catch (error) {
      setCatNotice(error instanceof Error ? error.message : "Could not save category.");
    }
  }

  function editCategory(cat: TourCategory) {
    setCatEditingId(cat._id);
    setCatDraft({ key: cat.key, label: cat.label, sortOrder: cat.sortOrder ?? 0 });
  }

  async function removeCategory(cat: TourCategory) {
    if (!window.confirm(`Delete category “${cat.label}”? Packages keep their keys until you edit them.`)) return;
    const response = await fetch(`${CATEGORIES_API}/${cat._id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) {
      setCatNotice("Could not delete category.");
      return;
    }
    setCatNotice("Category deleted.");
    if (catEditingId === cat._id) {
      setCatEditingId(null);
      setCatDraft({ key: "", label: "", sortOrder: 0 });
    }
    await loadCategories();
  }

  function updateOverview<K extends keyof PackageOverview>(field: K, value: PackageOverview[K]) {
    setDraft((current) => ({ ...current, overview: { ...current.overview, [field]: value } }));
  }

  function updateItinerary<K extends keyof PackageItinerary>(field: K, value: PackageItinerary[K]) {
    setDraft((current) => ({ ...current, itinerary: { ...current.itinerary, [field]: value } }));
  }

  function updateDay(index: number, patch: Partial<ItineraryDayCms>) {
    setDraft((current) => ({
      ...current,
      itinerary: {
        ...current.itinerary,
        days: current.itinerary.days.map((day, i) => (i === index ? { ...day, ...patch } : day)),
      },
    }));
  }

  function updateInclusions<K extends keyof PackageInclusions>(field: K, value: PackageInclusions[K]) {
    setDraft((current) => ({ ...current, inclusions: { ...current.inclusions, [field]: value } }));
  }

  function updateList(list: "included" | "excluded", index: number, patch: Partial<InclusionItemCms>) {
    setDraft((current) => ({
      ...current,
      inclusions: {
        ...current.inclusions,
        [list]: current.inclusions[list].map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  }

  function updatePayment<K extends keyof PackagePayment>(field: K, value: PackagePayment[K]) {
    setDraft((current) => ({ ...current, payment: { ...current.payment, [field]: value } }));
  }

  const themeLabel = (key: string) => categories.find((c) => c.key === key)?.label ?? key;

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">{category === "outbound" ? "Outbound Travels" : "Travel Sri Lanka"}</h1>
          <p className="mt-1 text-[13px] text-cms-muted">
            {category === "sri-lanka"
              ? "Manage categories and Sri Lanka packages with gallery, overview, itinerary, inclusions and payment methods."
              : "Create and manage outbound packages shown on the homepage and package pages."}
          </p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: category === "outbound" ? "Outbound Travels" : "Travel Sri Lanka" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
      </div>

      {category === "sri-lanka" && (
        <section className="mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-cms-ink">Categories</h2>
              <p className="mt-1 text-[12px] text-cms-muted">Filter chips on the Sri Lanka listing page. Create, edit and delete here.</p>
            </div>
            <button className={secondary} onClick={() => void loadCategories()} type="button">Refresh</button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Key (slug)"><input className={inputShell} placeholder="cultural" value={catDraft.key} onChange={(e) => setCatDraft((d) => ({ ...d, key: e.target.value }))} /></Field>
            <Field label="Label"><input className={inputShell} placeholder="Cultural Triangle" value={catDraft.label} onChange={(e) => setCatDraft((d) => ({ ...d, label: e.target.value }))} /></Field>
            <Field label="Sort order"><input className={inputShell} min="0" type="number" value={catDraft.sortOrder} onChange={(e) => setCatDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))} /></Field>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className={primary} onClick={() => void saveCategory()} type="button">{catEditingId ? "Update category" : "Add category"}</button>
            {catEditingId && (
              <button className={secondary} onClick={() => { setCatEditingId(null); setCatDraft({ key: "", label: "", sortOrder: 0 }); }} type="button">Cancel</button>
            )}
            <span className="text-[12px] text-cms-muted" aria-live="polite">{catNotice}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat._id} className="inline-flex items-center gap-2 rounded-full border border-cms-line bg-cms-bg px-3 py-1.5 text-[12px] text-cms-ink dark:bg-[#101435]">
                <strong className="font-semibold">{cat.label}</strong>
                <span className="text-cms-muted">{cat.key}</span>
                <button className="text-cms-primary hover:underline" onClick={() => editCategory(cat)} type="button">Edit</button>
                <button className="text-[#d42a45] hover:underline" onClick={() => void removeCategory(cat)} type="button">Delete</button>
              </span>
            ))}
            {!categories.length && <span className="text-[12px] text-cms-muted">No categories yet — defaults seed on first load.</span>}
          </div>
        </section>
      )}

      <section className="mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-cms-ink">{editingId ? "Edit package" : "Add package"}</h2>
          {editingId && <button className={secondary} onClick={reset} type="button">Cancel edit</button>}
        </div>

        <div role="tablist" aria-label="Package form sections" className="mb-5 flex flex-wrap gap-2 border-b border-cms-line pb-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                activeTab === tab
                  ? "border-cms-primary bg-cms-primary text-white"
                  : "border-cms-line bg-cms-card text-cms-ink hover:bg-[#f5f5f7] dark:hover:bg-[#101435]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Details" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Package Name"><input className={inputShell} value={draft.title} onChange={(event) => update("title", event.target.value)} /></Field>
            <Field label="Slug"><input className={inputShell} placeholder="sigiriya-culture-escape" value={draft.slug} onChange={(event) => update("slug", event.target.value)} /></Field>
            <Field label="Region"><input className={inputShell} placeholder="Sri Lanka" value={draft.region} onChange={(event) => update("region", event.target.value)} /></Field>
            <Field label="Area label"><input className={inputShell} placeholder="Sigiriya" value={draft.area} onChange={(event) => update("area", event.target.value)} /></Field>
            <Field label="Top category"><select className={inputShell} value={draft.category} onChange={(event) => update("category", event.target.value as Category)}><option value="outbound">Outbound</option><option value="sri-lanka">Sri Lanka</option></select></Field>
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
            {draft.category === "sri-lanka" && (
              <fieldset className="sm:col-span-2 lg:col-span-3">
                <legend className="text-[12.5px] font-semibold text-cms-text">Category (filter chips)</legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {categories.length ? (
                    categories.map((cat) => (
                      <label className="inline-flex items-center gap-1.5 text-[12px] text-cms-text" key={cat.key}>
                        <input checked={draft.themes.includes(cat.key)} onChange={() => toggleTheme(cat.key)} type="checkbox" /> {cat.label}
                      </label>
                    ))
                  ) : (
                    <span className="text-[12px] text-cms-muted">No dynamic categories loaded — add them in Categories above.</span>
                  )}
                </div>
                {draft.themes.length > 0 && (
                  <p className="mt-2 text-[11.5px] text-cms-muted">Selected: {draft.themes.map(themeLabel).join(", ")}</p>
                )}
              </fieldset>
            )}
          </div>
        )}

        {activeTab === "Gallery" && (
          <div>
            <p className="mb-3 text-[12.5px] text-cms-muted">Multiple images shown on the package detail page. Up to 20.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {draft.gallery.map((url, index) => (
                <div key={`${url}-${index}`} className="overflow-hidden rounded-[10px] border border-cms-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={`Gallery ${index + 1}`} className="h-28 w-full object-cover" src={url} />
                  <div className="flex justify-between gap-1 p-2">
                    <button
                      className={secondary}
                      disabled={index === 0}
                      onClick={() => setDraft((current) => {
                        const next = [...current.gallery];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return { ...current, gallery: next };
                      })}
                      type="button"
                      aria-label="Move left"
                    >
                      ←
                    </button>
                    <button
                      className={secondary}
                      onClick={() => setDraft((current) => ({ ...current, gallery: current.gallery.filter((_, i) => i !== index) }))}
                      type="button"
                    >
                      Remove
                    </button>
                    <button
                      className={secondary}
                      disabled={index === draft.gallery.length - 1}
                      onClick={() => setDraft((current) => {
                        const next = [...current.gallery];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        return { ...current, gallery: next };
                      })}
                      type="button"
                      aria-label="Move right"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className={`${secondary} ${galleryUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
                {galleryUploading ? "Uploading…" : "Add gallery image"}
                <input accept="image/*" hidden disabled={galleryUploading} onChange={(event) => { void addGalleryImage(event.target.files?.[0]); event.target.value = ""; }} type="file" />
              </label>
              <span className="text-[11.5px] text-cms-muted">{draft.gallery.length}/20 images</span>
            </div>
            <span className="mt-1 block text-[12px] text-[#d42a45] empty:hidden dark:text-[#ff9aa8]" role="alert">{uploadError}</span>
          </div>
        )}

        {activeTab === "Overview" && (
          <div className="flex flex-col gap-4">
            <Field label="Paragraph (summary)">
              <textarea
                className={areaShell}
                rows={5}
                value={draft.overview.summary}
                onChange={(event) => updateOverview("summary", event.target.value)}
                placeholder="What makes this trip special…"
              />
            </Field>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-cms-text">Cards (highlights)</span>
                <button
                  className={secondary}
                  type="button"
                  onClick={() => updateOverview("highlights", [...draft.overview.highlights, { icon: "check_circle", label: "" }])}
                >
                  + Add card
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {draft.overview.highlights.map((h, index) => (
                  <div key={index} className="grid grid-cols-1 gap-2 rounded-[10px] border border-cms-line p-3 sm:grid-cols-[140px_1fr_auto]">
                    <input
                      className={inputShell}
                      placeholder="Icon name"
                      value={h.icon}
                      onChange={(e) => updateOverview("highlights", draft.overview.highlights.map((item, i) => (i === index ? { ...item, icon: e.target.value } : item)))}
                    />
                    <input
                      className={inputShell}
                      placeholder="Card label"
                      value={h.label}
                      onChange={(e) => updateOverview("highlights", draft.overview.highlights.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)))}
                    />
                    <button
                      className={secondary}
                      type="button"
                      onClick={() => updateOverview("highlights", draft.overview.highlights.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {!draft.overview.highlights.length && <p className="text-[12px] text-cms-muted">No cards yet. Use “+ Add card”.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Itinerary" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Endpoints"><input className={inputShell} placeholder="Colombo ⇄ Kandy" value={draft.itinerary.endpoints} onChange={(e) => updateItinerary("endpoints", e.target.value)} /></Field>
              <Field label="Route stops (comma-separated)">
                <input
                  className={inputShell}
                  placeholder="Colombo, Kandy, Ella"
                  value={draft.itinerary.route.join(", ")}
                  onChange={(e) => updateItinerary("route", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                />
              </Field>
            </div>
            <Field label="Footnote">
              <textarea
                className={areaShell}
                rows={2}
                value={draft.itinerary.footnote}
                onChange={(e) => updateItinerary("footnote", e.target.value)}
              />
            </Field>
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-cms-text">Days</span>
              <button
                className={secondary}
                type="button"
                onClick={() => updateItinerary("days", [...draft.itinerary.days, { category: "", title: "", body: "" }])}
              >
                + Add day
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {draft.itinerary.days.map((day, index) => (
                <div key={index} className="rounded-[11px] border border-cms-line p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <strong className="text-[13px] text-cms-ink">Day {index + 1}</strong>
                    <button
                      className={secondary}
                      type="button"
                      onClick={() => updateItinerary("days", draft.itinerary.days.filter((_, i) => i !== index))}
                    >
                      Remove day
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Field label="Eyebrow">
                      <input className={inputShell} placeholder="Arrival" value={day.category} onChange={(e) => updateDay(index, { category: e.target.value })} />
                    </Field>
                    <Field label="Heading">
                      <input className={inputShell} placeholder="Day title" value={day.title} onChange={(e) => updateDay(index, { title: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      className={areaShell}
                      rows={3}
                      value={day.body}
                      onChange={(e) => updateDay(index, { body: e.target.value })}
                    />
                  </Field>
                </div>
              ))}
              {!draft.itinerary.days.length && <p className="text-[12px] text-cms-muted">No itinerary days yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "Inclusions" && (
          <div className="flex flex-col gap-4">
            <Field label="Intro paragraph">
              <textarea
                className={areaShell}
                rows={3}
                value={draft.inclusions.intro}
                onChange={(e) => updateInclusions("intro", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <InclusionEditor
                title="What's included"
                items={draft.inclusions.included}
                onAdd={() => updateInclusions("included", [...draft.inclusions.included, { title: "" }])}
                onUpdate={(i, patch) => updateList("included", i, patch)}
                onRemove={(i) => updateInclusions("included", draft.inclusions.included.filter((_, idx) => idx !== i))}
              />
              <InclusionEditor
                title="Not included"
                items={draft.inclusions.excluded}
                onAdd={() => updateInclusions("excluded", [...draft.inclusions.excluded, { title: "" }])}
                onUpdate={(i, patch) => updateList("excluded", i, patch)}
                onRemove={(i) => updateInclusions("excluded", draft.inclusions.excluded.filter((_, idx) => idx !== i))}
              />
            </div>
          </div>
        )}

        {activeTab === "Payment" && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-cms-text">Payment methods</span>
                <button
                  className={secondary}
                  type="button"
                  onClick={() => updatePayment("methods", [...draft.payment.methods, { icon: "payments", title: "", text: "" }])}
                >
                  + Add method
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {draft.payment.methods.map((m, index) => (
                  <div key={index} className="grid grid-cols-1 gap-2 rounded-[10px] border border-cms-line p-3 sm:grid-cols-[120px_1fr_1fr_auto]">
                    <input
                      className={inputShell}
                      placeholder="Icon"
                      value={m.icon}
                      onChange={(e) => updatePayment("methods", draft.payment.methods.map((item, i) => (i === index ? { ...item, icon: e.target.value } : item)))}
                    />
                    <input
                      className={inputShell}
                      placeholder="Title"
                      value={m.title}
                      onChange={(e) => updatePayment("methods", draft.payment.methods.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))}
                    />
                    <input
                      className={inputShell}
                      placeholder="Text"
                      value={m.text}
                      onChange={(e) => updatePayment("methods", draft.payment.methods.map((item, i) => (i === index ? { ...item, text: e.target.value } : item)))}
                    />
                    <button
                      className={secondary}
                      type="button"
                      onClick={() => updatePayment("methods", draft.payment.methods.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-cms-text">How payment works (steps)</span>
                <button
                  className={secondary}
                  type="button"
                  onClick={() => updatePayment("steps", [...draft.payment.steps, { title: "", text: "" }])}
                >
                  + Add step
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {draft.payment.steps.map((s, index) => (
                  <div key={index} className="grid grid-cols-1 gap-2 rounded-[10px] border border-cms-line p-3 sm:grid-cols-[1fr_1.5fr_auto]">
                    <input
                      className={inputShell}
                      placeholder="Step title"
                      value={s.title}
                      onChange={(e) => updatePayment("steps", draft.payment.steps.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))}
                    />
                    <input
                      className={inputShell}
                      placeholder="Step text"
                      value={s.text}
                      onChange={(e) => updatePayment("steps", draft.payment.steps.map((item, i) => (i === index ? { ...item, text: e.target.value } : item)))}
                    />
                    <button
                      className={secondary}
                      type="button"
                      onClick={() => updatePayment("steps", draft.payment.steps.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <Field label="Payment note">
              <textarea
                className={areaShell}
                rows={3}
                value={draft.payment.note}
                onChange={(e) => updatePayment("note", e.target.value)}
              />
            </Field>
            <div>
              <button
                className={secondary}
                type="button"
                onClick={() => {
                  if (!window.confirm("Replace this package's payment methods with site defaults?")) return;
                  updatePayment("methods", defaultPayment().methods);
                  updatePayment("steps", defaultPayment().steps);
                  updatePayment("note", "");
                }}
              >
                Reset to site defaults
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-2 border-t border-cms-line pt-4">
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
              {item.themes?.length ? (
                <p className="mt-1 text-[11.5px] text-cms-muted">{item.themes.map(themeLabel).join(" · ")}</p>
              ) : null}
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

function InclusionEditor({
  title,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  items: InclusionItemCms[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<InclusionItemCms>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-[11px] border border-cms-line p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-cms-ink">{title}</span>
        <button className={secondary} type="button" onClick={onAdd}>+ Add</button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-[9px] border border-cms-line p-2 sm:flex-row">
            <input
              className={inputShell}
              placeholder="Item title"
              value={item.title}
              onChange={(e) => onUpdate(index, { title: e.target.value })}
            />
            <input
              className={inputShell}
              placeholder="Note (optional)"
              value={item.note ?? ""}
              onChange={(e) => onUpdate(index, { note: e.target.value })}
            />
            <button className={secondary} type="button" onClick={() => onRemove(index)}>Remove</button>
          </div>
        ))}
        {!items.length && <p className="text-[12px] text-cms-muted">Empty list.</p>}
      </div>
    </div>
  );
}
