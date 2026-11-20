"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { CollapsiblePanel } from "@/components/cms/CollapsiblePanel";
import { CmsSelect } from "@/components/cms/CmsSelect";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { Icon } from "@/components/ui/Icon";
import { browserApiUrl } from "@/lib/api-url";
import { uploadMediaFile } from "@/lib/cms-upload";
import type { GalleryCategory, GalleryItem, GalleryMediaType } from "@/lib/gallery-api";

const CATEGORIES_API = browserApiUrl("/gallery-categories");
const ITEMS_API = browserApiUrl("/gallery-items");

const inputShell = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";

type CategoryDraft = { name: string };
type ItemDraft = { caption: string; category: string; media: string; mediaType: GalleryMediaType | "" };

const blankCategory = (): CategoryDraft => ({ name: "" });
const blankItem = (): ItemDraft => ({ caption: "", category: "", media: "", mediaType: "" });

type DeleteTarget = { kind: "category" | "item"; id: string; label: string };

export default function GalleryTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [itemFormOpen, setItemFormOpen] = useState(false);

  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(blankCategory());
  const [categoryEditingId, setCategoryEditingId] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  const [itemDraft, setItemDraft] = useState<ItemDraft>(blankItem());
  const [itemEditingId, setItemEditingId] = useState<string | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async (): Promise<{ categories: GalleryCategory[]; items: GalleryItem[] }> => {
    const [catRes, itemRes] = await Promise.all([
      fetch(CATEGORIES_API, { credentials: "include" }),
      fetch(ITEMS_API, { credentials: "include" }),
    ]);
    if (!catRes.ok || !itemRes.ok) throw new Error("load failed");
    const catData: { categories?: GalleryCategory[] } = await catRes.json();
    const itemData: { items?: GalleryItem[] } = await itemRes.json();
    return {
      categories: Array.isArray(catData.categories) ? catData.categories : [],
      items: Array.isArray(itemData.items) ? itemData.items : [],
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const { categories: catList, items: itemList } = await fetchAll();
      setCategories(catList);
      setItems(itemList);
    } catch {
      setNotice("Could not load gallery. Please sign in again or try again.");
    } finally {
      setLoaded(true);
    }
  }, [fetchAll]);

  useEffect(() => {
    let cancelled = false;
    fetchAll()
      .then(({ categories: catList, items: itemList }) => {
        if (cancelled) return;
        setCategories(catList);
        setItems(itemList);
      })
      .catch(() => {
        if (cancelled) return;
        setNotice("Could not load gallery. Please sign in again or try again.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchAll]);

  const categoryName = (id: string) => categories.find((c) => c._id === id)?.name ?? "—";

  // —— Categories ————————————————————————————————————————————————

  const categoryValid = categoryDraft.name.trim().length > 0;

  async function saveCategory() {
    if (!categoryValid) return;
    setSavingCategory(true);
    setNotice("");
    try {
      const response = await fetch(categoryEditingId ? `${CATEGORIES_API}/${categoryEditingId}` : CATEGORIES_API, {
        method: categoryEditingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryDraft.name.trim() }),
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save category.");
      setNotice(categoryEditingId ? "Category updated." : "Category created.");
      setCategoryDraft(blankCategory());
      setCategoryEditingId(null);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save category.");
    } finally {
      setSavingCategory(false);
    }
  }

  function editCategory(cat: GalleryCategory) {
    setCategoryEditingId(cat._id);
    setCategoryDraft({ name: cat.name });
    setNotice("");
    setCategoriesOpen(true);
  }

  function resetCategory() {
    setCategoryEditingId(null);
    setCategoryDraft(blankCategory());
  }

  // —— Items ————————————————————————————————————————————————————

  const itemValid =
    itemDraft.caption.trim().length > 0 &&
    itemDraft.category.length > 0 &&
    itemDraft.media.length > 0 &&
    itemDraft.mediaType !== "";

  async function uploadMedia(file?: File | null) {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    setUploadProgress(0);
    try {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo && !file.type.startsWith("image/")) throw new Error("Choose an image or video file.");
      const url = await uploadMediaFile(file, { folder: "gallery", kind: isVideo ? "video" : "image", onProgress: setUploadProgress });
      setItemDraft((current) => ({ ...current, media: url, mediaType: isVideo ? "video" : "image" }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function saveItem() {
    if (!itemValid) return;
    setSavingItem(true);
    setNotice("");
    try {
      // New items land after the current list; edits keep their position.
      const nextSort = itemEditingId
        ? items.find((i) => i._id === itemEditingId)?.sortOrder ?? 0
        : items.reduce((max, i) => Math.max(max, i.sortOrder ?? 0), 0) + 1;
      const body = {
        caption: itemDraft.caption.trim(),
        category: itemDraft.category,
        media: itemDraft.media,
        mediaType: itemDraft.mediaType,
        sortOrder: nextSort,
      };
      const response = await fetch(itemEditingId ? `${ITEMS_API}/${itemEditingId}` : ITEMS_API, {
        method: itemEditingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save gallery item.");
      setNotice(itemEditingId ? "Gallery item updated." : "Gallery item added.");
      setItemDraft(blankItem());
      setItemEditingId(null);
      setUploadError("");
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save gallery item.");
    } finally {
      setSavingItem(false);
    }
  }

  function editItem(item: GalleryItem) {
    setItemEditingId(item._id);
    setItemDraft({
      caption: item.caption,
      category: typeof item.category === "string" ? item.category : "",
      media: item.media,
      mediaType: item.mediaType,
    });
    setUploadError("");
    setNotice("");
    setItemFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetItem() {
    setItemEditingId(null);
    setItemDraft(blankItem());
    setUploadError("");
  }

  // —— Reorder (rewrite full order so sortOrders stay distinct) ————————

  async function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const payload = reordered.map((item, position) => ({ id: item._id, sortOrder: position + 1 }));
    setNotice("");
    try {
      const response = await fetch(`${ITEMS_API}/reorder`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { message?: string; items?: GalleryItem[] } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not reorder.");
      if (Array.isArray(data.items)) setItems(data.items);
      else await load();
      setNotice("Order updated.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not reorder.");
      await load();
    }
  }

  // —— Delete (with confirmation modal) ————————————————————————————

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setNotice("");
    try {
      const url = deleteTarget.kind === "category" ? `${CATEGORIES_API}/${deleteTarget.id}` : `${ITEMS_API}/${deleteTarget.id}`;
      const response = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!response.ok) {
        const data: { message?: string } = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Could not delete.");
      }
      setNotice(deleteTarget.kind === "category" ? "Category deleted." : "Gallery item deleted.");
      if (deleteTarget.kind === "category" && categoryEditingId === deleteTarget.id) resetCategory();
      if (deleteTarget.kind === "item" && itemEditingId === deleteTarget.id) resetItem();
      setDeleteTarget(null);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">Gallery</h1>
          <p className="mt-1.5 text-[13px] text-cms-muted">Manage gallery categories and the photos and videos shown on the Travellers Gallery page.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Gallery" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice}</span>
      </div>

      {/* —— Categories: form | list —— */}
      <CollapsiblePanel
        onToggle={() => setCategoriesOpen((current) => !current)}
        open={categoriesOpen}
        subtitle="Filter chips on the Travellers Gallery page. Each category groups the photos and videos of one theme."
        title="Categories"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Left: add / edit form */}
          <div className="rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]">
            <h3 className="text-[13px] font-semibold text-cms-ink">{categoryEditingId ? "Edit category" : "Add category"}</h3>
            <div className="mt-3">
              <Field label="Category name">
                <input
                  className={inputShell}
                  placeholder="Overseas Travel"
                  value={categoryDraft.name}
                  onChange={(event) => setCategoryDraft((d) => ({ ...d, name: event.target.value }))}
                />
              </Field>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CmsButton variant="primary" disabled={!categoryValid || savingCategory} onClick={() => void saveCategory()}>
                {savingCategory ? "Saving…" : categoryEditingId ? "Update category" : "Add category"}
              </CmsButton>
              {categoryEditingId && (
                <CmsButton variant="secondary" onClick={resetCategory}>Cancel edit</CmsButton>
              )}
              {!categoryValid && <span className="text-[12px] text-cms-muted">Name is required.</span>}
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
                      <th className="pb-2 pr-3">Name</th>
                      <th className="pb-2 pr-3">Items</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr className="border-b border-cms-line last:border-0" key={cat._id}>
                        <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{cat.name}</td>
                        <td className="py-2.5 pr-3 text-[13px] text-cms-muted">
                          {items.filter((item) => item.category === cat._id).length}
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="inline-flex gap-1.5">
                            <CmsButton size="sm" variant="secondary" onClick={() => editCategory(cat)}>Edit</CmsButton>
                            <CmsButton
                              size="sm"
                              variant="danger"
                              onClick={() => setDeleteTarget({ kind: "category", id: cat._id, label: cat.name })}
                            >
                              Delete
                            </CmsButton>
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
      </CollapsiblePanel>

      {/* —— Item form —— */}
      <CollapsiblePanel
        headerExtra={itemEditingId ? <CmsButton variant="secondary" onClick={resetItem}>Cancel edit</CmsButton> : undefined}
        onToggle={() => setItemFormOpen((current) => !current)}
        open={itemFormOpen}
        subtitle="Each item is one photo or video with a caption, shown in the Travellers Gallery wall."
        title={itemEditingId ? "Edit gallery item" : "Add gallery item"}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_1px_360px] lg:items-start">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Caption (Location)">
              <input
                className={inputShell}
                placeholder="Mirissa beach"
                value={itemDraft.caption}
                onChange={(event) => setItemDraft((d) => ({ ...d, caption: event.target.value }))}
              />
            </Field>
            <Field label="Category">
              <CmsSelect
                aria-label="Category"
                className="mt-1.5"
                onChange={(category) => setItemDraft((d) => ({ ...d, category }))}
                options={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
                placeholder="Select a category…"
                value={itemDraft.category}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Order position">
                <span className="mt-1.5 flex h-10 items-center rounded-[9px] border border-[#e6e4f5] bg-[#f7f6fc] px-3 text-[13px] text-cms-muted dark:border-[#2a2e63] dark:bg-[#101435]">
                  {itemEditingId
                    ? `Position ${(items.find((i) => i._id === itemEditingId)?.sortOrder ?? 1)} of ${items.length}`
                    : `New items are added at position ${items.reduce((max, i) => Math.max(max, i.sortOrder ?? 0), 0) + 1}`}
                </span>
              </Field>
            </div>
          </div>

          <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block" />

          <div className="lg:sticky lg:top-4">
            <ImageUpload
              accept="image/*,video/*"
              chooseText="Choose media"
              emptyText="Choose a photo or video"
              error={uploadError}
              height="h-[180px]"
              hint="JPEG, PNG, WebP or GIF up to 5MB · MP4 or WebM up to 100MB"
              label="Photo or video"
              onFile={(file) => void uploadMedia(file)}
              onRemove={() => setItemDraft((d) => ({ ...d, media: "", mediaType: "" }))}
              uploading={uploading}
              progress={uploadProgress}
              value={itemDraft.media}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cms-line pt-4">
          <CmsButton variant="primary" disabled={!itemValid || savingItem || uploading} onClick={() => void saveItem()}>
            {savingItem ? "Saving…" : itemEditingId ? "Update item" : "Add item"}
          </CmsButton>
          {!itemValid && <span className="text-[12px] text-cms-muted">Caption, category and media are required.</span>}
        </div>
      </CollapsiblePanel>

      {/* —— Item listing —— */}
      <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-cms-ink">Gallery items ({items.length})</h2>
          <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
        </div>
        {!loaded ? (
          <p className="text-[13px] text-cms-muted">Loading items…</p>
        ) : !items.length ? (
          <p className="text-[13px] text-cms-muted">No gallery items yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                  <th className="pb-2 pr-3">Order</th>
                  <th className="pb-2 pr-3">Media</th>
                  <th className="pb-2 pr-3">Caption</th>
                  <th className="pb-2 pr-3">Category</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr className="border-b border-cms-line last:border-0" key={item._id}>
                    <td className="py-2.5 pr-3 align-middle">
                      <span className="inline-flex items-center gap-1">
                        <CmsButton
                          size="icon"
                          variant="muted"
                          aria-label={`Move ${item.caption} up`}
                          disabled={index === 0}
                          onClick={() => void moveItem(index, -1)}
                        >
                          ↑
                        </CmsButton>
                        <CmsButton
                          size="icon"
                          variant="muted"
                          aria-label={`Move ${item.caption} down`}
                          disabled={index === items.length - 1}
                          onClick={() => void moveItem(index, 1)}
                        >
                          ↓
                        </CmsButton>
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-2 text-[13px] text-cms-ink">
                        <Icon name={item.mediaType === "video" ? "play_arrow" : "photo_camera"} size={18} className="text-cms-primary" />
                        <span className="text-[12px] text-cms-muted">{item.mediaType}</span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{item.caption}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{categoryName(typeof item.category === "string" ? item.category : "")}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex gap-1.5">
                        <CmsButton size="sm" variant="secondary" onClick={() => editItem(item)}>Edit</CmsButton>
                        <CmsButton
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteTarget({ kind: "item", id: item._id, label: item.caption })}
                        >
                          Delete
                        </CmsButton>
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
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "category" ? "Delete category?" : "Delete gallery item?"}
        message={
          deleteTarget
            ? deleteTarget.kind === "category"
              ? `“${deleteTarget.label}” will be removed. Items using it must be reassigned first, and nothing else is affected.`
              : `“${deleteTarget.label}” will be permanently removed from the gallery. Its media file is deleted from Cloudflare only if no other page uses it.`
            : ""
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}
