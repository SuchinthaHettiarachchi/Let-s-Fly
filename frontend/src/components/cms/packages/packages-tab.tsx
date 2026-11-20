"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsCheckbox } from "@/components/cms/CmsCheckbox";
import { CmsButton, cmsButtonClasses } from "@/components/cms/CmsButton";
import { CmsSelect } from "@/components/cms/CmsSelect";
import { CollapsiblePanel } from "@/components/cms/CollapsiblePanel";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { CmsIconSelect } from "@/components/cms/CmsIconSelect";
import { CmsViewModal, ViewLines, ViewPills, type CmsViewSection } from "@/components/cms/CmsViewModal";
import { UploadProgressCircle } from "@/components/cms/UploadProgress";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { apiUrl } from "@/lib/api-url";
import { uploadMediaFile } from "@/lib/cms-upload";
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
const inputShell = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const areaShell = `${inputShell} min-h-[72px] py-2 leading-[1.5] resize-y`;
const primary = cmsButtonClasses("primary");
const secondary = cmsButtonClasses("secondary");

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const TABS = ["Details", "Gallery", "Overview", "Itinerary", "Inclusions", "Payment"] as const;
type FormTab = (typeof TABS)[number];

type Category = "outbound" | "sri-lanka";
type PackageItem = Package & { _id: string; createdAt?: string };

type DraftBase = {
  slug: string;
  title: string;
  region: string;
  location: string;
  area: string;
  category: Category;
  outboundRegion: string;
  themes: string[];
  badge: string;
  days: number;
  nights: number;
  price: number;
  priceNote: string;
  image: string;
  flightsIncluded: boolean;
  featured: boolean;
};

type Draft = DraftBase & PackageDetailFields;

const blankDraft = (category: Category): Draft => ({
  slug: "",
  title: "",
  region: "",
  location: "",
  area: "",
  category,
  outboundRegion: "",
  themes: [],
  badge: "",
  days: 1,
  nights: 0,
  price: 0,
  priceNote: "",
  image: "",
  flightsIncluded: false,
  featured: false,
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

async function fetchCategories(scope: Category) {
  const response = await fetch(`${CATEGORIES_API}?scope=${scope}`, { credentials: "include" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: { categories?: TourCategory[] } = await response.json();
  return Array.isArray(data.categories) ? data.categories : [];
}

export default function PackagesTab({ category, onNavigate }: { category: Category; onNavigate: (section: string) => void }) {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [draft, setDraft] = useState<Draft>(blankDraft(category));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>("Details");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [catNotice, setCatNotice] = useState("");
  const [catDraft, setCatDraft] = useState({ key: "", label: "", sortOrder: 0, image: "" });
  const [catEditingId, setCatEditingId] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [catUploading, setCatUploading] = useState(false);
  const [catDeleteTarget, setCatDeleteTarget] = useState<TourCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [packageDeleteTarget, setPackageDeleteTarget] = useState<PackageItem | null>(null);
  const [deletingPackage, setDeletingPackage] = useState(false);
  const [packageViewTarget, setPackageViewTarget] = useState<PackageItem | null>(null);

  const categoryValid = catDraft.label.trim().length > 0;
  const selectedCategoryKeys = category === "outbound"
    ? (draft.outboundRegion ? [draft.outboundRegion] : [])
    : draft.themes;

  async function uploadImage(file?: File | null) {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadMediaFile(file, { folder: "packages", kind: "image", onProgress: setUploadProgress });
      update("image", url);
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
    setGalleryUploadProgress(0);
    try {
      const url = await uploadMediaFile(file, { folder: "packages", kind: "image", onProgress: setGalleryUploadProgress });
      setDraft((current) => ({ ...current, gallery: [...current.gallery, url] }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setGalleryUploading(false);
    }
  }

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await fetchCategories(category));
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
    fetchCategories(category)
      .then((next) => {
        if (!cancelled) setCategories(next);
      })
      .catch(() => {
        if (!cancelled) setCatNotice("Could not load categories.");
      });
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
      location: item.location ?? "",
      area: item.area ?? "",
      category: item.category,
      outboundRegion: item.outboundRegion || item.themes?.[0] || "",
      themes: item.themes ?? [],
      badge: item.badge ?? "",
      days: item.days,
      nights: item.nights,
      price: item.price,
      priceNote: item.priceNote ?? "",
      image: item.image ?? "",
      flightsIncluded: item.flightsIncluded === true,
      featured: item.featured === true,
      ...detail,
    });
    setActiveTab("Details");
    setFormOpen(true);
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
        slug: draft.slug || slugify(draft.title),
        title: draft.title,
        region: draft.region,
        location: draft.location,
        area: draft.area,
        category,
        outboundRegion: category === "outbound" ? draft.outboundRegion : "",
        themes: category === "sri-lanka" ? draft.themes : [],
        badge: draft.badge,
        days: draft.days,
        nights: draft.nights,
        price: draft.price,
        priceNote: draft.priceNote,
        image: draft.image,
        flightsIncluded: draft.flightsIncluded,
        featured: draft.featured,
        gallery: draft.gallery,
        overview: draft.overview,
        itinerary: { ...draft.itinerary, route: draft.itinerary.route.map((stop) => stop.trim()).filter(Boolean) },
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
      setFormOpen(false);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save package.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    const item = packageDeleteTarget;
    if (!item) return;
    setDeletingPackage(true);
    try {
      const response = await fetch(`${API}/${item._id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) {
        setNotice("Could not delete package.");
        return;
      }
      setNotice("Package deleted.");
      if (editingId === item._id) reset();
      await load();
      setPackageDeleteTarget(null);
    } catch {
      setNotice("Could not delete package.");
    } finally {
      setDeletingPackage(false);
    }
  }

  async function saveCategory() {
    if (!categoryValid) return;
    setCatNotice("");
    setSavingCategory(true);
    try {
      const response = await fetch(catEditingId ? `${CATEGORIES_API}/${catEditingId}` : CATEGORIES_API, {
        method: catEditingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...catDraft, key: catDraft.key || slugify(catDraft.label), scope: category, image: catDraft.image }),
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save category.");
      setCatNotice(catEditingId ? "Category updated." : "Category created.");
      resetCategory();
      await loadCategories();
    } catch (error) {
      setCatNotice(error instanceof Error ? error.message : "Could not save category.");
    } finally {
      setSavingCategory(false);
    }
  }

  function editCategory(cat: TourCategory) {
    setCatEditingId(cat._id);
    setCatDraft({ key: cat.key, label: cat.label, sortOrder: cat.sortOrder ?? 0, image: cat.image ?? "" });
    setCategoriesOpen(true);
  }

  function resetCategory() {
    setCatEditingId(null);
    setCatDraft({ key: "", label: "", sortOrder: 0, image: "" });
  }

  async function uploadCategoryImage(file?: File | null) {
    if (!file) return;
    setCatUploading(true);
    setCatNotice("");
    try {
      const url = await uploadMediaFile(file, { folder: "categories", kind: "image" });
      setCatDraft((current) => ({ ...current, image: url }));
    } catch (error) {
      setCatNotice(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setCatUploading(false);
    }
  }

  async function removeCategory() {
    const cat = catDeleteTarget;
    if (!cat) return;
    setDeletingCategory(true);
    try {
      const response = await fetch(`${CATEGORIES_API}/${cat._id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) {
        setCatNotice("Could not delete category.");
        return;
      }
      setCatNotice("Category deleted.");
      if (catEditingId === cat._id) resetCategory();
      await loadCategories();
      setCatDeleteTarget(null);
    } catch {
      setCatNotice("Could not delete category.");
    } finally {
      setDeletingCategory(false);
    }
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

      <CollapsiblePanel
        onToggle={() => setCategoriesOpen((current) => !current)}
        open={categoriesOpen}
        subtitle={category === "outbound"
          ? "Filter chips and category cards on the Outbound Travels listing page. Each category can have its own image."
          : "Filter chips on the Sri Lanka listing page. Each category groups packages of one theme."}
        title="Categories"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Left: add / edit form */}
          <div className="rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]">
            <h3 className="text-[13px] font-semibold text-cms-ink">{catEditingId ? "Edit category" : "Add category"}</h3>
            <div className="mt-3 grid gap-3">
              <Field label="Label">
                <input
                  className={inputShell}
                  placeholder={category === "outbound" ? "Middle East" : "Cultural Triangle"}
                  value={catDraft.label}
                  onChange={(event) => setCatDraft((d) => ({ ...d, label: event.target.value }))}
                />
              </Field>
              <Field label="Sort order">
                <input
                  className={inputShell}
                  min="0"
                  type="number"
                  value={catDraft.sortOrder}
                  onChange={(event) => setCatDraft((d) => ({ ...d, sortOrder: Number(event.target.value) }))}
                />
              </Field>
              <ImageUpload
                accept="image/*"
                error={catNotice}
                height="h-[120px]"
                hint="JPEG, PNG, WebP or GIF · up to 5MB"
                label="Category image"
                onFile={(file) => void uploadCategoryImage(file)}
                onRemove={() => setCatDraft((d) => ({ ...d, image: "" }))}
                uploading={catUploading}
                value={catDraft.image}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CmsButton variant="primary" disabled={!categoryValid || savingCategory || catUploading} onClick={() => void saveCategory()}>
                {savingCategory ? "Saving…" : catEditingId ? "Update category" : "Add category"}
              </CmsButton>
              {catEditingId && <CmsButton variant="secondary" onClick={resetCategory}>Cancel edit</CmsButton>}
              {!categoryValid && <span className="text-[12px] text-cms-muted">Label is required.</span>}
            </div>
          </div>

          {/* Right: existing categories table */}
          <div className="rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]">
            <h3 className="text-[13px] font-semibold text-cms-ink">Existing categories</h3>
            {!loaded ? (
              <p className="mt-3 text-[12.5px] text-cms-muted">Loading…</p>
            ) : !categories.length ? (
              <p className="mt-3 text-[12.5px] text-cms-muted">No categories yet — add one on the left.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                      <th className="pb-2 pr-3">Image</th>
                      <th className="pb-2 pr-3">Name</th>
                      <th className="pb-2 pr-3">Packages</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr className="border-b border-cms-line last:border-0" key={cat._id}>
                        <td className="py-2.5 pr-3">
                          <div className="h-12 w-16 overflow-hidden rounded-md bg-[#eef1ff] dark:bg-[#101435]">
                            {cat.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img alt="" className="h-full w-full object-cover" src={cat.image} />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[10px] text-cms-muted">No image</div>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">
                          {cat.label}
                          <span className="ml-1.5 text-[11.5px] font-normal text-cms-muted">{cat.key}</span>
                        </td>
                        <td className="py-2.5 pr-3 text-[13px] text-cms-muted">
                          {items.filter((item) => (category === "outbound" ? item.outboundRegion === cat.key : item.themes?.includes(cat.key))).length}
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="inline-flex gap-1.5">
                            <CmsButton size="sm" variant="secondary" onClick={() => editCategory(cat)}>Edit</CmsButton>
                            <CmsButton size="sm" variant="danger" onClick={() => setCatDeleteTarget(cat)}>Delete</CmsButton>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <DeleteConfirmModal
          open={catDeleteTarget !== null}
          title="Delete category?"
          message={`“${catDeleteTarget?.label ?? ""}” will be removed. Packages keep their keys until you edit them.`}
          confirmLabel="Delete"
          busy={deletingCategory}
          onConfirm={() => void removeCategory()}
          onCancel={() => { if (!deletingCategory) setCatDeleteTarget(null); }}
        />
      </CollapsiblePanel>

      <CollapsiblePanel
        headerExtra={editingId ? <CmsButton variant="secondary" onClick={reset}>Cancel edit</CmsButton> : undefined}
        onToggle={() => setFormOpen((current) => !current)}
        open={formOpen}
        title={editingId ? "Edit package" : "Add package"}
      >
        <nav aria-label="Package form pages" className="mb-5 flex flex-wrap items-center gap-1.5 border-b border-cms-line pb-3">
          {TABS.map((tab, index) => {
            const current = tab === activeTab;
            const done = index < TABS.indexOf(activeTab);
            return (
              <span
                aria-current={current ? "step" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  current
                    ? "bg-cms-primary text-white"
                    : done
                      ? "bg-cms-card2 text-cms-ink"
                      : "text-cms-muted"
                }`}
                key={tab}
              >
                <span className={`grid size-5 place-items-center rounded-full text-[10px] ${current ? "bg-white/25" : "bg-cms-card"}`}>
                  {done ? "✓" : index + 1}
                </span>
                {tab}
              </span>
            );
          })}
        </nav>

        {activeTab === "Details" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_1px_360px] lg:items-start">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Package Name"><input className={inputShell} value={draft.title} onChange={(event) => { const value = event.target.value; setDraft((d) => ({ ...d, title: value, slug: d.slug || slugify(value) })); }} /></Field>
              <Field label="Region"><input className={inputShell} placeholder="Sri Lanka" value={draft.region} onChange={(event) => update("region", event.target.value)} /></Field>
              <Field label="Area label"><input className={inputShell} placeholder="Sigiriya" value={draft.area} onChange={(event) => update("area", event.target.value)} /></Field>
              <Field label="Location (card/detail)"><input className={inputShell} placeholder="Sigiriya, Central Province" value={draft.location} onChange={(event) => update("location", event.target.value)} /></Field>
              <div>
                <Field label="Category">
                  <CmsSelect
                    onChange={(key) => setDraft((d) => (category === "outbound"
                      ? { ...d, outboundRegion: key }
                      : { ...d, themes: key ? [key] : [] }))}
                    options={categories.map((cat) => ({ value: cat.key, label: cat.label }))}
                    placeholder="Select a category…"
                    value={selectedCategoryKeys[0] ?? ""}
                  />
                </Field>
                {selectedCategoryKeys.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {selectedCategoryKeys.map((key) => (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cms-card2 px-2.5 py-1 text-[11.5px] font-semibold text-cms-ink" key={key}>
                        {themeLabel(key)}
                        <button
                          aria-label={`Remove ${themeLabel(key)}`}
                          className="border-0 bg-transparent p-0 text-[14px] leading-none text-cms-muted hover:text-[#d42a45]"
                          onClick={() => setDraft((d) => (category === "outbound"
                            ? { ...d, outboundRegion: "" }
                            : { ...d, themes: d.themes.filter((theme) => theme !== key) }))}
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Field label="Badge (optional)"><input className={inputShell} placeholder="Best seller" value={draft.badge} onChange={(event) => update("badge", event.target.value)} /></Field>
              <Field label="Days"><input className={inputShell} min="1" type="number" value={draft.days} onChange={(event) => update("days", Number(event.target.value))} /></Field>
              <Field label="Nights"><input className={inputShell} min="0" type="number" value={draft.nights} onChange={(event) => update("nights", Number(event.target.value))} /></Field>
              <Field label="Price (LKR)"><input className={inputShell} min="0" type="number" value={draft.price} onChange={(event) => update("price", Number(event.target.value))} /></Field>
              <Field label="Price note (optional)"><input className={inputShell} placeholder="per person, twin share" value={draft.priceNote} onChange={(event) => update("priceNote", event.target.value)} /></Field>
              <CmsCheckbox
                checked={draft.flightsIncluded}
                onChange={(checked) => update("flightsIncluded", checked)}
                label="Flights included"
                containerClassName="mt-7"
                labelClassName="text-[13px] font-normal text-cms-text"
              />
              <CmsCheckbox
                checked={draft.featured}
                onChange={(checked) => update("featured", checked)}
                label="Featured package"
                containerClassName="mt-7"
                labelClassName="text-[13px] font-normal text-cms-text"
              />
              {draft.category === "sri-lanka" && (
                <fieldset className="sm:col-span-2">
                  <legend className="text-[12.5px] font-semibold text-cms-text">Category (filter chips)</legend>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {categories.length ? (
                    categories.map((cat) => (
                      <CmsCheckbox
                        key={cat.key}
                        checked={draft.themes.includes(cat.key)}
                        onChange={() => toggleTheme(cat.key)}
                        label={cat.label}
                        labelClassName="text-[12px] font-normal text-cms-text"
                      />
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

            <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block" />

            <div className="lg:sticky lg:top-4">
              <ImageUpload
                accept="image/*"
                error={uploadError}
                height="h-[180px]"
                hint="JPEG, PNG, WebP or GIF · up to 5MB"
                label="Cover image"
                onFile={(file) => void uploadImage(file)}
                onRemove={() => update("image", "")}
                uploading={uploading}
                progress={uploadProgress}
                value={draft.image}
              />
            </div>
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
                      className={cmsButtonClasses("danger", "sm")}
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
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className={`${secondary} ${galleryUploading ? "pointer-events-none opacity-70" : "cursor-pointer"}`}>
                {galleryUploading ? (
                  <span className="inline-flex items-center gap-2">
                    <UploadProgressCircle progress={galleryUploadProgress} size={28} />
                    <span>Uploading {galleryUploadProgress >= 0 ? `${galleryUploadProgress}%` : "..."}</span>
                  </span>
                ) : "Add gallery image"}
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
                  <div key={index} className="grid grid-cols-1 gap-2 rounded-[10px] border border-cms-line p-3 sm:grid-cols-[150px_1fr_auto]">
                    <CmsIconSelect
                      kind="highlight"
                      onChange={(icon) => updateOverview("highlights", draft.overview.highlights.map((item, i) => (i === index ? { ...item, icon } : item)))}
                      value={h.icon}
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
                  onChange={(e) => updateItinerary("route", e.target.value.split(",").map((s) => s.trim()))}
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
                      className={cmsButtonClasses("danger", "sm")}
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
                  <div key={index} className="grid grid-cols-1 gap-2 rounded-[10px] border border-cms-line p-3 sm:grid-cols-[150px_1fr_1fr_auto]">
                    <CmsIconSelect
                      kind="payment"
                      onChange={(icon) => updatePayment("methods", draft.payment.methods.map((item, i) => (i === index ? { ...item, icon } : item)))}
                      value={m.icon}
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
                      className={cmsButtonClasses("danger", "sm")}
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
                      className={cmsButtonClasses("danger", "sm")}
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

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cms-line pt-4">
          {TABS.indexOf(activeTab) > 0 && (
            <button className={secondary} onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) - 1])} type="button">← Back</button>
          )}
          {TABS.indexOf(activeTab) < TABS.length - 1 ? (
            <>
              {editingId && (
                <button className={secondary} disabled={saving} onClick={() => void save()} type="button">
                  {saving ? "Saving…" : "Update package"}
                </button>
              )}
              <button
                className={primary}
                onClick={() => {
                  setActiveTab(TABS[TABS.indexOf(activeTab) + 1]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                type="button"
              >
                Next: {TABS[TABS.indexOf(activeTab) + 1]}
              </button>
            </>
          ) : (
            <button className={primary} disabled={saving} onClick={() => void save()} type="button">
              {saving ? "Saving…" : editingId ? "Update package" : "Create package"}
            </button>
          )}
          <span className="text-[12px] text-cms-muted" aria-live="polite">{notice}</span>
        </div>
      </CollapsiblePanel>

      <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-cms-ink">Packages ({items.length})</h2>
          <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
        </div>
        {!loaded ? (
          <p className="text-[13px] text-cms-muted">Loading packages...</p>
        ) : !items.length ? (
          <p className="text-[13px] text-cms-muted">No packages in this category yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                  <th className="pb-2 pr-3">Image</th>
                  <th className="pb-2 pr-3">Package</th>
                  <th className="pb-2 pr-3">Price / person</th>
                  <th className="pb-2 pr-3">Categories</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr className="border-b border-cms-line last:border-0" key={item._id}>
                    <td className="py-2.5 pr-3">
                      <div className="h-12 w-16 overflow-hidden rounded-md bg-[#eef1ff] dark:bg-[#101435]">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[10px] text-cms-muted">No image</div>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">
                      <span className="inline-flex flex-wrap items-center gap-1.5">
                        {item.title}
                        {item.badge && <span className="rounded-full bg-[#fff8c2] px-2 py-1 text-[10px] font-semibold text-[#796900]">{item.badge}</span>}
                      </span>
                      <span className="mt-0.5 block text-[12px] font-normal text-cms-muted">
                        {item.region}{item.area ? ` · ${item.area}` : ""} · {item.days}D / {item.nights}N
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">LKR {item.price.toLocaleString("en-LK")}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">
                      {item.themes?.length ? item.themes.map(themeLabel).join(" · ") : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex gap-1.5">
                        <CmsButton size="sm" variant="secondary" onClick={() => setPackageViewTarget(item)}>View</CmsButton>
                        <CmsButton size="sm" variant="secondary" onClick={() => edit(item)}>Edit</CmsButton>
                        <CmsButton size="sm" variant="danger" onClick={() => setPackageDeleteTarget(item)}>Delete</CmsButton>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <DeleteConfirmModal
        open={packageDeleteTarget !== null}
        title="Delete package?"
        message={packageDeleteTarget ? `“${packageDeleteTarget.title}” will be permanently removed. This cannot be undone.` : ""}
        confirmLabel="Delete"
        busy={deletingPackage}
        onConfirm={() => void remove()}
        onCancel={() => { if (!deletingPackage) setPackageDeleteTarget(null); }}
      />

      <CmsViewModal
        open={packageViewTarget !== null}
        title={packageViewTarget?.title ?? ""}
        subtitle={packageViewTarget
          ? `${packageViewTarget.region}${packageViewTarget.area ? ` · ${packageViewTarget.area}` : ""} · ${packageViewTarget.days}D / ${packageViewTarget.nights}N`
          : undefined}
        image={packageViewTarget?.image}
        badge={packageViewTarget?.badge ? (
          <span className="rounded-full bg-[#fff8c2] px-2 py-1 text-[10px] font-semibold text-[#796900]">
            {packageViewTarget.badge}
          </span>
        ) : undefined}
        sections={packageViewSections(packageViewTarget, themeLabel, category)}
        onClose={() => setPackageViewTarget(null)}
      />
    </div>
  );
}

function packageViewSections(item: PackageItem | null, themeLabel: (key: string) => string, scope: Category): CmsViewSection[] {
  if (!item) return [];
  return [
    {
      title: "Package",
      fields: [
        { label: "Title", value: item.title },
        { label: "Slug", value: item.slug },
        { label: "Category", value: item.category },
        { label: "Region", value: item.region },
        { label: "Location", value: item.location },
        ...(item.outboundRegion ? [{ label: "Outbound region", value: item.outboundRegion }] : []),
        ...(item.area ? [{ label: "Area", value: item.area }] : []),
        ...(item.badge ? [{ label: "Badge", value: item.badge }] : []),
        { label: "Featured", value: item.featured ? "Yes" : "No" },
        { label: "Duration", value: `${item.days} days / ${item.nights} nights` },
        { label: "Price / person", value: `LKR ${item.price.toLocaleString("en-LK")}` },
        ...(item.priceNote ? [{ label: "Price note", value: item.priceNote }] : []),
        { label: "Flights included", value: item.flightsIncluded ? "Yes" : "No" },
        ...(item.rating ? [{ label: "Rating", value: `${item.rating.score} / 5 · ${item.rating.count} reviews` }] : []),
        ...(item.brochureUrl ? [{ label: "Brochure", value: <a className="text-cms-primary hover:underline" href={item.brochureUrl} rel="noopener noreferrer" target="_blank">Open brochure</a> }] : []),
        { label: "Record ID", value: item._id },
        ...(item.createdAt ? [{ label: "Created", value: item.createdAt }] : []),
      ],
    },
    {
      title: "Themes & media",
      fields: [
        { label: scope === "outbound" ? "Category" : "Themes", value: scope === "outbound"
          ? (item.outboundRegion ? themeLabel(item.outboundRegion) : "—")
          : <ViewPills items={item.themes?.map(themeLabel)} />, wide: true },
        { label: "Gallery", value: item.gallery?.length ? `${item.gallery.length} image(s)` : "—" },
        { label: "Related", value: <ViewPills items={item.related} /> },
      ],
    },
    ...(item.overview ? [{
      title: "Overview",
      fields: [
        { label: "Summary", value: item.overview.summary, wide: true },
        { label: "Highlights", value: <ViewLines items={item.overview.highlights.map((h) => ({ title: h.label }))} />, wide: true },
      ],
    }] : []),
    ...(item.itinerary ? [{
      title: "Itinerary",
      fields: [
        { label: "Endpoints", value: item.itinerary.endpoints },
        { label: "Route", value: <ViewPills items={item.itinerary.route} />, wide: true },
        { label: "Footnote", value: item.itinerary.footnote, wide: true },
        { label: "Days", value: <ViewLines items={item.itinerary.days.map((d) => ({ title: `${d.category} · ${d.title}`, note: d.body }))} />, wide: true },
      ],
    }] : []),
    ...(item.inclusions ? [{
      title: "Inclusions",
      fields: [
        { label: "Intro", value: item.inclusions.intro, wide: true },
        { label: "Included", value: <ViewLines items={item.inclusions.included} />, wide: true },
        { label: "Excluded", value: <ViewLines items={item.inclusions.excluded} />, wide: true },
      ],
    }] : []),
    ...(item.payment ? [{
      title: "Payment",
      fields: [
        { label: "Methods", value: <ViewLines items={item.payment.methods.map((m) => ({ title: m.title, note: m.text }))} />, wide: true },
        { label: "Steps", value: <ViewLines items={item.payment.steps.map((s) => ({ title: s.title, note: s.text }))} />, wide: true },
        { label: "Note", value: item.payment.note, wide: true },
      ],
    }] : []),
  ];
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
            <button className={cmsButtonClasses("danger", "sm")} type="button" onClick={() => onRemove(index)}>Remove</button>
          </div>
        ))}
        {!items.length && <p className="text-[12px] text-cms-muted">Empty list.</p>}
      </div>
    </div>
  );
}
