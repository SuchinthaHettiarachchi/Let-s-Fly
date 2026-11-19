"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { CmsSelect } from "@/components/cms/CmsSelect";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { uploadMediaFile } from "@/lib/cms-upload";
import {
  defaultVisaPage,
  fetchVisaManage,
  visaCmsApi,
  type ResidenceCategory,
  type SriLankaVisa,
  type Visa,
  type VisaCategory,
  type VisaCountry,
  type VisaPageContent,
  type VisaStep,
} from "@/lib/visa-api";

const input = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] font-normal text-cms-ink outline-none placeholder:text-cms-muted focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const area = `${input} min-h-[88px] py-2.5 leading-[1.55] resize-y`;
const subcard = "rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]";

const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

type View = "records" | "detail" | "page";

type Named = { _id: string; key: string; label: string; sortOrder?: number };
type NamedDraft = { key: string; label: string; sortOrder: number };

const blankVisa = (): Visa => ({
  slug: "", countryKey: "", country: "", city: "", categoryKey: "", type: "",
  image: "", flag: "", summary: "", facts: [], documentGroups: [], warning: "",
  feeGroups: [], extraSections: [], sortOrder: 0,
});

export default function VisasTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [view, setView] = useState<View>("records");

  const [categories, setCategories] = useState<VisaCategory[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [page, setPage] = useState<VisaPageContent>(defaultVisaPage);

  const [catDraft, setCatDraft] = useState<NamedDraft>({ key: "", label: "", sortOrder: 0 });
  const [catEditId, setCatEditId] = useState<string | null>(null);
  const [catSaving, setCatSaving] = useState(false);
  const [catDelete, setCatDelete] = useState<VisaCategory | null>(null);
  const [catDeleting, setCatDeleting] = useState(false);

  const [countryDraft, setCountryDraft] = useState<NamedDraft>({ key: "", label: "", sortOrder: 0 });
  const [countryEditId, setCountryEditId] = useState<string | null>(null);
  const [countrySaving, setCountrySaving] = useState(false);
  const [countryDelete, setCountryDelete] = useState<VisaCountry | null>(null);
  const [countryDeleting, setCountryDeleting] = useState(false);

  const [draft, setDraft] = useState<Visa>(blankVisa());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingVisa, setSavingVisa] = useState(false);
  const [visaDelete, setVisaDelete] = useState<Visa | null>(null);
  const [visaDeleting, setVisaDeleting] = useState(false);
  const [uploading, setUploading] = useState<"image" | "flag" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const [savingPage, setSavingPage] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchVisaManage();
      setCategories(data.categories);
      setCountries(data.countries);
      setVisas(data.visas);
      setPage({ ...defaultVisaPage, ...data.page });
    } catch {
      setNotice("Could not load visa CMS data. Please sign in again or try again.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial async CMS data load
    void load();
  }, [load]);

  const labelForCat = (key: string) => categories.find((c) => c.key === key)?.label || key;
  const labelForCountry = (key: string) => countries.find((c) => c.key === key)?.label || key;

  async function saveNamed(kind: "category" | "country") {
    const isCat = kind === "category";
    const draftVal = isCat ? catDraft : countryDraft;
    if (!draftVal.key.trim() || !draftVal.label.trim()) { setNotice("Key and label are required."); return; }
    const payload = { key: slugify(draftVal.key), label: draftVal.label.trim(), sortOrder: Number(draftVal.sortOrder) || 0 };
    if (isCat) setCatSaving(true); else setCountrySaving(true);
    setNotice("");
    try {
      const id = isCat ? catEditId : countryEditId;
      const res = await (isCat ? visaCmsApi.saveCategory(payload, id || undefined) : visaCmsApi.saveCountry(payload, id || undefined));
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || `Could not save ${kind}.`);
      setNotice(`${isCat ? "Category" : "Country"} ${id ? "updated" : "created"}.`);
      if (isCat) { setCatEditId(null); setCatDraft({ key: "", label: "", sortOrder: 0 }); }
      else { setCountryEditId(null); setCountryDraft({ key: "", label: "", sortOrder: 0 }); }
      await load();
    } catch (e) { setNotice(e instanceof Error ? e.message : `Could not save ${kind}.`); }
    finally { if (isCat) setCatSaving(false); else setCountrySaving(false); }
  }

  async function confirmDeleteNamed(kind: "category" | "country") {
    const target = kind === "category" ? catDelete : countryDelete;
    if (!target) return;
    if (kind === "category") setCatDeleting(true); else setCountryDeleting(true);
    try {
      const res = await (kind === "category" ? visaCmsApi.deleteCategory(target._id) : visaCmsApi.deleteCountry(target._id));
      if (!res.ok) throw new Error("Delete failed");
      setNotice(`${kind === "category" ? "Category" : "Country"} deleted.`);
      if (kind === "category") { setCatDelete(null); if (catEditId === target._id) { setCatEditId(null); setCatDraft({ key: "", label: "", sortOrder: 0 }); } }
      else { setCountryDelete(null); if (countryEditId === target._id) { setCountryEditId(null); setCountryDraft({ key: "", label: "", sortOrder: 0 }); } }
      await load();
    } catch { setNotice(`Could not delete ${kind}.`); }
    finally { if (kind === "category") setCatDeleting(false); else setCountryDeleting(false); }
  }

  function editVisa(v: Visa) {
    setEditingId(v._id || null);
    setDraft({
      slug: v.slug || "", countryKey: v.countryKey || "", country: v.country || "", city: v.city || "",
      categoryKey: v.categoryKey || "", type: v.type || "", image: v.image || "", flag: v.flag || "",
      summary: v.summary || "", facts: v.facts || [], documentGroups: v.documentGroups || [],
      warning: v.warning || "", feeGroups: v.feeGroups || [], extraSections: v.extraSections || [], sortOrder: v.sortOrder ?? 0,
    });
    setUploadError("");
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetVisa() { setEditingId(null); setDraft(blankVisa()); setUploadError(""); }

  async function upload(field: "image" | "flag", file?: File | null) {
    if (!file) return;
    setUploadError(""); setUploading(field); setUploadProgress(0);
    try {
      const url = await uploadMediaFile(file, { folder: field === "flag" ? "visas/flags" : "visas", kind: "image", onProgress: setUploadProgress });
      setDraft((d) => ({ ...d, [field]: url }));
    } catch (e) { setUploadError(e instanceof Error ? e.message : "Upload failed."); }
    finally { setUploading(null); }
  }

  async function saveVisa() {
    if (!draft.slug.trim()) { setNotice("Visa slug is required."); return; }
    if (!draft.city.trim()) { setNotice("City is required."); return; }
    const payload: Visa = {
      ...draft,
      slug: slugify(draft.slug),
      country: draft.country || labelForCountry(draft.countryKey),
      type: draft.type || labelForCat(draft.categoryKey),
      countryKey: draft.countryKey || slugify(draft.country),
      categoryKey: draft.categoryKey || slugify(draft.type),
    };
    setSavingVisa(true); setNotice("");
    try {
      const res = await visaCmsApi.saveVisa(payload, editingId || undefined);
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Could not save visa.");
      setNotice(editingId ? "Visa updated." : "Visa created.");
      resetVisa(); setView("records");
      await load();
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not save visa."); }
    finally { setSavingVisa(false); }
  }

  async function confirmDeleteVisa() {
    if (!visaDelete?._id) return;
    setVisaDeleting(true);
    try {
      const res = await visaCmsApi.deleteVisa(visaDelete._id);
      if (!res.ok) throw new Error("Delete failed");
      setNotice("Visa deleted.");
      if (editingId === visaDelete._id) { resetVisa(); setView("records"); }
      setVisaDelete(null);
      await load();
    } catch { setNotice("Could not delete visa."); }
    finally { setVisaDeleting(false); }
  }

  async function savePageContent() {
    setSavingPage(true); setNotice("");
    try {
      const res = await visaCmsApi.savePage(page);
      const data = (await res.json().catch(() => ({}))) as { message?: string; page?: VisaPageContent };
      if (!res.ok) throw new Error(data.message || "Could not save visa page content.");
      if (data.page) setPage({ ...defaultVisaPage, ...data.page });
      setNotice("Visa page content saved.");
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not save visa page content."); }
    finally { setSavingPage(false); }
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">Visa Services</h1>
          <p className="mt-1 text-[13px] text-cms-muted">Manage visa categories, countries, visa records and detail/listing page content shown to visitors.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Visa Services" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice || (loaded ? "All changes saved" : "Loading...")}</span>
      </div>

      <div role="tablist" aria-label="Visa CMS sections" className="mb-5 flex flex-wrap gap-2 border-b border-cms-line pb-3">
        {([
          ["records", "Visas & Filters"],
          ["detail", editingId ? "Edit Visa" : "Add Visa"],
          ["page", "Listing Page Content"],
        ] as [View, string][]).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={view === id} type="button" onClick={() => setView(id)}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${view === id ? "border-cms-primary bg-cms-primary text-white" : "border-cms-line bg-cms-card text-cms-ink hover:bg-[#f5f5f7] dark:hover:bg-[#101435]"}`}>
            {label}
          </button>
        ))}
      </div>

      {view === "records" && (
        <>
          <div className="mb-5 flex flex-col gap-5">
            <NamedManager title="Visa categories" subtitle="Used in visitor filter dropdowns and visa type labels." draft={catDraft} setDraft={setCatDraft} items={categories} editId={catEditId} saving={catSaving}
              onEdit={(c) => { setCatEditId(c._id); setCatDraft({ key: c.key, label: c.label, sortOrder: c.sortOrder ?? 0 }); }}
              onCancel={() => { setCatEditId(null); setCatDraft({ key: "", label: "", sortOrder: 0 }); }}
              onSave={() => void saveNamed("category")} onDelete={(c) => setCatDelete(c as VisaCategory)} />
            <NamedManager title="Countries" subtitle="Used in visitor filter dropdowns and visa country labels." draft={countryDraft} setDraft={setCountryDraft} items={countries} editId={countryEditId} saving={countrySaving}
              onEdit={(c) => { setCountryEditId(c._id); setCountryDraft({ key: c.key, label: c.label, sortOrder: c.sortOrder ?? 0 }); }}
              onCancel={() => { setCountryEditId(null); setCountryDraft({ key: "", label: "", sortOrder: 0 }); }}
              onSave={() => void saveNamed("country")} onDelete={(c) => setCountryDelete(c as VisaCountry)} />
          </div>

          <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-cms-ink">Visa records ({visas.length})</h2>
                <p className="mt-1 text-[12px] text-cms-muted">All information shown on visitor visa cards and detail pages. Click Add/Edit to customize detail content.</p>
              </div>
              <div className="flex gap-2">
                <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
                <CmsButton variant="primary" onClick={() => { resetVisa(); setView("detail"); }}>+ Add visa</CmsButton>
              </div>
            </div>
            {!loaded ? <p className="text-[13px] text-cms-muted">Loading visas...</p> : !visas.length ? <p className="text-[13px] text-cms-muted">No visas yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead><tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                    <th className="pb-2 pr-3">City / Country</th><th className="pb-2 pr-3">Category</th><th className="pb-2 pr-3">Slug</th><th className="pb-2 pr-3">Detail</th><th className="pb-2 text-right">Actions</th>
                  </tr></thead>
                  <tbody>
                    {visas.map((v) => (
                      <tr key={v._id || v.slug} className="border-b border-cms-line last:border-0">
                        <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{v.city || "-"} <span className="ml-1 font-normal text-cms-muted">{v.country || labelForCountry(v.countryKey)}</span></td>
                        <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{v.type || labelForCat(v.categoryKey)}</td>
                        <td className="py-2.5 pr-3 text-[12px] text-cms-muted">{v.slug}</td>
                        <td className="py-2.5 pr-3 text-[12px] text-cms-muted">{(v.documentGroups?.length || v.feeGroups?.length || v.extraSections?.length) ? "Custom" : "Card only"}</td>
                        <td className="py-2.5 text-right"><span className="inline-flex gap-1.5">
                          <CmsButton size="sm" variant="secondary" onClick={() => editVisa(v)}>Edit</CmsButton>
                          <CmsButton size="sm" variant="danger" onClick={() => setVisaDelete(v)}>Delete</CmsButton>
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {view === "detail" && (
        <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-semibold text-cms-ink">{editingId ? "Edit visa" : "Add visa"}</h2>
            <div className="flex gap-2">
              <CmsButton variant="secondary" onClick={() => { resetVisa(); setView("records"); }}>Back to list</CmsButton>
              {editingId && <CmsButton variant="secondary" onClick={resetVisa}>New visa</CmsButton>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_1px_320px]">
            <div className="flex flex-col gap-5">
              <div className={subcard}>
                <h3 className="mb-3 text-[14px] font-semibold text-cms-ink">Card & basics</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="City (card title)"><input className={input} value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value, slug: d.slug || slugify(e.target.value) }))} placeholder="Dubai" /></Field>
                  <Field label="Slug (URL)"><input className={input} value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} placeholder="dubai" /></Field>
                  <Field label="Country">
                    <CmsSelect value={draft.countryKey} onChange={(val) => setDraft((d) => ({ ...d, countryKey: val, country: countries.find((c) => c.key === val)?.label || d.country }))} placeholder="Select country" options={countries.map((c) => ({ value: c.key, label: c.label }))} />
                  </Field>
                  <Field label="Category / type">
                    <CmsSelect value={draft.categoryKey} onChange={(val) => setDraft((d) => ({ ...d, categoryKey: val, type: categories.find((c) => c.key === val)?.label || d.type }))} placeholder="Select category" options={categories.map((c) => ({ value: c.key, label: c.label }))} />
                  </Field>
                  <Field label="Country name override"><input className={input} value={draft.country} onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))} placeholder="Auto from country" /></Field>
                  <Field label="Type label override"><input className={input} value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))} placeholder="Auto from category" /></Field>
                  <Field label="Sort order"><input className={input} type="number" value={draft.sortOrder ?? 0} onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) || 0 }))} /></Field>
                </div>
              </div>

              <div className={subcard}>
                <h3 className="mb-3 text-[14px] font-semibold text-cms-ink">Detail hero & summary</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Field label="Summary / intro (detail page)"><textarea className={area} rows={4} value={draft.summary || ""} onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))} /></Field>
                  <Field label="Warning / note"><textarea className={area} rows={3} value={draft.warning || ""} onChange={(e) => setDraft((d) => ({ ...d, warning: e.target.value }))} placeholder="Shown as an important note on the detail page" /></Field>
                </div>
              </div>

              <ArrayEditor title="Facts (hero chips)" hint="Icon + label, shown as chips on the visa detail hero." items={draft.facts || []} blank={() => ({ icon: "schedule", label: "" })} columns={["icon", "label"]} labels={{ icon: "Icon", label: "Label" }}
                onChange={(facts) => setDraft((d) => ({ ...d, facts }))} />
              <GroupEditor title="Document groups (requirements)" hint="Matches the detail page 'What you'll need' checklist." groups={draft.documentGroups || []}
                onChange={(documentGroups) => setDraft((d) => ({ ...d, documentGroups }))} />
              <FeeEditor groups={draft.feeGroups || []} onChange={(feeGroups) => setDraft((d) => ({ ...d, feeGroups }))} />
              <ExtraSectionsEditor sections={draft.extraSections || []} onChange={(extraSections) => setDraft((d) => ({ ...d, extraSections }))} />
            </div>

            <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] xl:block" />

            <div className="flex flex-col gap-4 xl:sticky xl:top-4 xl:self-start">
              <ImageUpload label="Card / hero image" hint="JPEG, PNG, WebP or GIF - up to 5MB" value={draft.image || ""} uploading={uploading === "image"} progress={uploading === "image" ? uploadProgress : undefined} error={uploading === "image" ? uploadError : ""}
                onFile={(f) => void upload("image", f)} onRemove={() => setDraft((d) => ({ ...d, image: "" }))} />
              <ImageUpload label="Flag image (optional)" hint="Small flag shown next to title" value={draft.flag || ""} uploading={uploading === "flag"} progress={uploading === "flag" ? uploadProgress : undefined} error={uploading === "flag" ? uploadError : ""}
                height="h-[140px]" onFile={(f) => void upload("flag", f)} onRemove={() => setDraft((d) => ({ ...d, flag: "" }))} />
              {uploadError && !uploading && <p className="text-[12px] text-[#d42a45]">{uploadError}</p>}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cms-line pt-4">
            <CmsButton variant="primary" disabled={savingVisa || uploading !== null} onClick={() => void saveVisa()}>{savingVisa ? "Saving..." : editingId ? "Update visa" : "Create visa"}</CmsButton>
            <CmsButton variant="secondary" onClick={() => { resetVisa(); setView("records"); }}>Cancel</CmsButton>
            <span className="text-[12px] text-cms-muted">Detail page is shown when the visa has document groups, fees, or extra sections.</span>
          </div>
        </section>
      )}

      {view === "page" && (
        <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
          <div className="mb-4">
            <h2 className="text-[16px] font-semibold text-cms-ink">Visa listing page content</h2>
            <p className="mt-1 text-[12px] text-cms-muted">Customize visitor-facing headings and content for outbound, Sri Lanka visit/residence, and steps sections.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className={subcard}><h3 className="mb-3 text-[14px] font-semibold">Outbound section</h3>
              <Field label="Eyebrow"><input className={input} value={page.outboundEyebrow} onChange={(e) => setPage((p) => ({ ...p, outboundEyebrow: e.target.value }))} /></Field>
              <Field label="Title"><input className={input} value={page.outboundTitle} onChange={(e) => setPage((p) => ({ ...p, outboundTitle: e.target.value }))} /></Field>
            </div>
            <div className={subcard}><h3 className="mb-3 text-[14px] font-semibold">Steps section</h3>
              <Field label="Eyebrow"><input className={input} value={page.stepsEyebrow} onChange={(e) => setPage((p) => ({ ...p, stepsEyebrow: e.target.value }))} /></Field>
              <Field label="Title"><input className={input} value={page.stepsTitle} onChange={(e) => setPage((p) => ({ ...p, stepsTitle: e.target.value }))} /></Field>
            </div>
            <div className={`${subcard} lg:col-span-2`}>
              <h3 className="mb-3 text-[14px] font-semibold">Sri Lanka visit section</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Eyebrow"><input className={input} value={page.inboundEyebrow} onChange={(e) => setPage((p) => ({ ...p, inboundEyebrow: e.target.value }))} /></Field>
                <Field label="Title"><input className={input} value={page.inboundTitle} onChange={(e) => setPage((p) => ({ ...p, inboundTitle: e.target.value }))} /></Field>
              </div>
              <Field label="Intro"><textarea className={area} rows={3} value={page.inboundIntro} onChange={(e) => setPage((p) => ({ ...p, inboundIntro: e.target.value }))} /></Field>
            </div>
            <div className={`${subcard} lg:col-span-2`}>
              <h3 className="mb-3 text-[14px] font-semibold">Residence section</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Eyebrow"><input className={input} value={page.residenceEyebrow} onChange={(e) => setPage((p) => ({ ...p, residenceEyebrow: e.target.value }))} /></Field>
                <Field label="Title"><input className={input} value={page.residenceTitle} onChange={(e) => setPage((p) => ({ ...p, residenceTitle: e.target.value }))} /></Field>
                <div className="sm:col-span-2"><Field label="Description"><textarea className={area} rows={3} value={page.residenceDescription} onChange={(e) => setPage((p) => ({ ...p, residenceDescription: e.target.value }))} /></Field></div>
                <Field label="Renewal title"><input className={input} value={page.residenceRenewalTitle} onChange={(e) => setPage((p) => ({ ...p, residenceRenewalTitle: e.target.value }))} /></Field>
                <Field label="Renewal text"><input className={input} value={page.residenceRenewalText} onChange={(e) => setPage((p) => ({ ...p, residenceRenewalText: e.target.value }))} /></Field>
              </div>
            </div>
            <div className={`${subcard} lg:col-span-2`}><Field label="Rules note"><textarea className={area} rows={3} value={page.rulesNote} onChange={(e) => setPage((p) => ({ ...p, rulesNote: e.target.value }))} /></Field></div>
          </div>

          <StepsEditor steps={page.steps} onChange={(steps) => setPage((p) => ({ ...p, steps }))} />
          <SriLankaEditor items={page.sriLankaVisas} onChange={(sriLankaVisas) => setPage((p) => ({ ...p, sriLankaVisas }))} />
          <ResidenceEditor items={page.residenceCategories} onChange={(residenceCategories) => setPage((p) => ({ ...p, residenceCategories }))} />

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cms-line pt-4">
            <CmsButton variant="primary" disabled={savingPage} onClick={() => void savePageContent()}>{savingPage ? "Saving..." : "Save page content"}</CmsButton>
          </div>
        </section>
      )}

      <DeleteConfirmModal open={catDelete !== null} title="Delete category?" message={`"${catDelete?.label ?? ""}" will be removed.`} busy={catDeleting} onConfirm={() => void confirmDeleteNamed("category")} onCancel={() => { if (!catDeleting) setCatDelete(null); }} />
      <DeleteConfirmModal open={countryDelete !== null} title="Delete country?" message={`"${countryDelete?.label ?? ""}" will be removed.`} busy={countryDeleting} onConfirm={() => void confirmDeleteNamed("country")} onCancel={() => { if (!countryDeleting) setCountryDelete(null); }} />
      <DeleteConfirmModal open={visaDelete !== null} title="Delete visa?" message={`"${visaDelete?.city || visaDelete?.slug || ""}" will be permanently removed.`} busy={visaDeleting} onConfirm={() => void confirmDeleteVisa()} onCancel={() => { if (!visaDeleting) setVisaDelete(null); }} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}

function NamedManager({ title, subtitle, draft, setDraft, items, editId, saving, onEdit, onCancel, onSave, onDelete }: {
  title: string; subtitle: string; draft: NamedDraft; setDraft: (d: NamedDraft) => void; items: Named[]; editId: string | null; saving: boolean;
  onEdit: (i: Named) => void; onCancel: () => void; onSave: () => void; onDelete: (i: Named) => void;
}) {
  const valid = draft.key.trim() && draft.label.trim();
  return (
    <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
      <div className="mb-4"><h2 className="text-[16px] font-semibold text-cms-ink">{title}</h2><p className="mt-1.5 text-[12px] text-cms-muted">{subtitle}</p></div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className={subcard}>
          <h3 className="text-[13px] font-semibold text-cms-ink">{editId ? "Edit" : "Add"}</h3>
          <div className="mt-3 grid gap-3">
            <Field label="Key (slug)"><input className={input} value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} placeholder="tourist-visa" /></Field>
            <Field label="Label"><input className={input} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Tourist Visa" /></Field>
            <Field label="Sort order"><input className={input} type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <CmsButton variant="primary" disabled={!valid || saving} onClick={onSave}>{saving ? "Saving..." : editId ? "Update" : "Add"}</CmsButton>
            {editId && <CmsButton variant="secondary" onClick={onCancel}>Cancel</CmsButton>}
          </div>
        </div>
        <div className={subcard}>
          <h3 className="text-[13px] font-semibold text-cms-ink">Existing</h3>
          {!items.length ? <p className="mt-3 text-[12.5px] text-cms-muted">None yet.</p> : (
            <div className="mt-3 overflow-x-auto"><table className="w-full border-collapse text-left"><tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-cms-line last:border-0">
                  <td className="py-2 pr-2 text-[13px] font-medium text-cms-ink">{item.label}<div className="text-[11px] font-normal text-cms-muted">{item.key}</div></td>
                  <td className="py-2 text-right"><span className="inline-flex gap-1.5"><CmsButton size="sm" variant="secondary" onClick={() => onEdit(item)}>Edit</CmsButton><CmsButton size="sm" variant="danger" onClick={() => onDelete(item)}>Delete</CmsButton></span></td>
                </tr>
              ))}
            </tbody></table></div>
          )}
        </div>
      </div>
    </section>
  );
}

function ArrayEditor<T extends Record<string, string>>({ title, hint, items, blank, columns, labels, onChange }: {
  title: string; hint: string; items: T[]; blank: () => T; columns: (keyof T & string)[]; labels: Record<string, string>; onChange: (v: T[]) => void;
}) {
  return (
    <div className={subcard}>
      <div className="mb-2 flex items-center justify-between gap-2"><div><h3 className="text-[14px] font-semibold text-cms-ink">{title}</h3><p className="text-[12px] text-cms-muted">{hint}</p></div><CmsButton size="sm" variant="secondary" onClick={() => onChange([...items, blank()])}>+ Add</CmsButton></div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className={`grid grid-cols-1 gap-2 rounded-[10px] border border-cms-line p-3 ${columns.length >= 2 ? "sm:grid-cols-[140px_1fr_auto]" : "sm:grid-cols-[1fr_auto]"}`}>
            {columns.map((col) => <input key={col} className={input} placeholder={labels[col] || col} value={item[col] || ""} onChange={(e) => onChange(items.map((it, idx) => idx === i ? ({ ...it, [col]: e.target.value } as T) : it))} />)}
            <button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
        ))}
        {!items.length && <p className="text-[12px] text-cms-muted">None yet.</p>}
      </div>
    </div>
  );
}

function GroupEditor({ title, hint, groups, onChange }: { title: string; hint: string; groups: { title: string; items: { title: string; note?: string }[] }[]; onChange: (g: { title: string; items: { title: string; note?: string }[] }[]) => void; }) {
  return (
    <div className={subcard}>
      <div className="mb-2 flex items-center justify-between gap-2"><div><h3 className="text-[14px] font-semibold text-cms-ink">{title}</h3><p className="text-[12px] text-cms-muted">{hint}</p></div><CmsButton size="sm" variant="secondary" onClick={() => onChange([...groups, { title: "", items: [] }])}>+ Add group</CmsButton></div>
      <div className="flex flex-col gap-3">
        {groups.map((g, gi) => (
          <div key={gi} className="rounded-[10px] border border-cms-line p-3">
            <div className="mb-2 flex items-center gap-2"><input className={input} placeholder="Group title" value={g.title} onChange={(e) => onChange(groups.map((x, i) => i === gi ? { ...x, title: e.target.value } : x))} /><button className="shrink-0 text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(groups.filter((_, i) => i !== gi))}>Remove group</button></div>
            <div className="flex flex-col gap-2">
              {g.items.map((it, ii) => (
                <div key={ii} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input className={input} placeholder="Document title" value={it.title} onChange={(e) => onChange(groups.map((x, i) => i === gi ? { ...x, items: x.items.map((y, j) => j === ii ? { ...y, title: e.target.value } : y) } : x))} />
                  <input className={input} placeholder="Note (optional)" value={it.note || ""} onChange={(e) => onChange(groups.map((x, i) => i === gi ? { ...x, items: x.items.map((y, j) => j === ii ? { ...y, note: e.target.value } : y) } : x))} />
                  <button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(groups.map((x, i) => i === gi ? { ...x, items: x.items.filter((_, j) => j !== ii) } : x))}>Remove</button>
                </div>
              ))}
              <div><button className="text-[12px] font-semibold text-cms-primary" type="button" onClick={() => onChange(groups.map((x, i) => i === gi ? { ...x, items: [...x.items, { title: "", note: "" }] } : x))}>+ Add document</button></div>
            </div>
          </div>
        ))}
        {!groups.length && <p className="text-[12px] text-cms-muted">No document groups yet. Add groups to show a detail checklist page.</p>}
      </div>
    </div>
  );
}

function FeeEditor({ groups, onChange }: { groups: { title: string; items: { label: string; value: string; note?: string }[] }[]; onChange: (g: { title: string; items: { label: string; value: string; note?: string }[] }[]) => void; }) {
  return (
    <div className={subcard}>
      <div className="mb-2 flex items-center justify-between gap-2"><div><h3 className="text-[14px] font-semibold text-cms-ink">Fees & charges (optional)</h3><p className="text-[12px] text-cms-muted">Shown on the detail page when provided.</p></div><CmsButton size="sm" variant="secondary" onClick={() => onChange([...groups, { title: "", items: [] }])}>+ Add group</CmsButton></div>
      <div className="flex flex-col gap-3">
        {groups.map((g, gi) => (
          <div key={gi} className="rounded-[10px] border border-cms-line p-3">
            <div className="mb-2 flex items-center gap-2"><input className={input} placeholder="Group title (e.g. Visa fees)" value={g.title} onChange={(e) => onChange(groups.map((x, i) => i === gi ? { ...x, title: e.target.value } : x))} /><button className="shrink-0 text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(groups.filter((_, i) => i !== gi))}>Remove group</button></div>
            {g.items.map((it, ii) => (
              <div key={ii} className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <input className={input} placeholder="Label" value={it.label} onChange={(e) => onChange(groups.map((x, i) => i === gi ? { ...x, items: x.items.map((y, j) => j === ii ? { ...y, label: e.target.value } : y) } : x))} />
                <input className={input} placeholder="Value / amount" value={it.value} onChange={(e) => onChange(groups.map((x, i) => i === gi ? { ...x, items: x.items.map((y, j) => j === ii ? { ...y, value: e.target.value } : y) } : x))} />
                <input className={input} placeholder="Note (optional)" value={it.note || ""} onChange={(e) => onChange(groups.map((x, i) => i === gi ? { ...x, items: x.items.map((y, j) => j === ii ? { ...y, note: e.target.value } : y) } : x))} />
                <button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(groups.map((x, i) => i === gi ? { ...x, items: x.items.filter((_, j) => j !== ii) } : x))}>Remove</button>
              </div>
            ))}
            <button className="text-[12px] font-semibold text-cms-primary" type="button" onClick={() => onChange(groups.map((x, i) => i === gi ? { ...x, items: [...x.items, { label: "", value: "", note: "" }] } : x))}>+ Add fee item</button>
          </div>
        ))}
        {!groups.length && <p className="text-[12px] text-cms-muted">No fee groups.</p>}
      </div>
    </div>
  );
}

function ExtraSectionsEditor({ sections, onChange }: { sections: { title: string; body?: string; items?: { title: string; note?: string }[] }[]; onChange: (s: { title: string; body?: string; items?: { title: string; note?: string }[] }[]) => void; }) {
  return (
    <div className={subcard}>
      <div className="mb-2 flex items-center justify-between gap-2"><div><h3 className="text-[14px] font-semibold text-cms-ink">Additional sections (optional)</h3><p className="text-[12px] text-cms-muted">Extra detail-page sections with text and/or bullet items.</p></div><CmsButton size="sm" variant="secondary" onClick={() => onChange([...sections, { title: "", body: "", items: [] }])}>+ Add section</CmsButton></div>
      <div className="flex flex-col gap-3">
        {sections.map((s, si) => (
          <div key={si} className="rounded-[10px] border border-cms-line p-3">
            <div className="mb-2 flex items-center gap-2"><input className={input} placeholder="Section title" value={s.title} onChange={(e) => onChange(sections.map((x, i) => i === si ? { ...x, title: e.target.value } : x))} /><button className="shrink-0 text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(sections.filter((_, i) => i !== si))}>Remove</button></div>
            <textarea className={area} rows={3} placeholder="Section body (optional)" value={s.body || ""} onChange={(e) => onChange(sections.map((x, i) => i === si ? { ...x, body: e.target.value } : x))} />
            {(s.items || []).map((it, ii) => (
              <div key={ii} className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input className={input} placeholder="Item title" value={it.title} onChange={(e) => onChange(sections.map((x, i) => i === si ? { ...x, items: (x.items || []).map((y, j) => j === ii ? { ...y, title: e.target.value } : y) } : x))} />
                <input className={input} placeholder="Note (optional)" value={it.note || ""} onChange={(e) => onChange(sections.map((x, i) => i === si ? { ...x, items: (x.items || []).map((y, j) => j === ii ? { ...y, note: e.target.value } : y) } : x))} />
                <button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(sections.map((x, i) => i === si ? { ...x, items: (x.items || []).filter((_, j) => j !== ii) } : x))}>Remove</button>
              </div>
            ))}
            <button className="mt-2 text-[12px] font-semibold text-cms-primary" type="button" onClick={() => onChange(sections.map((x, i) => i === si ? { ...x, items: [...(x.items || []), { title: "", note: "" }] } : x))}>+ Add item</button>
          </div>
        ))}
        {!sections.length && <p className="text-[12px] text-cms-muted">No additional sections.</p>}
      </div>
    </div>
  );
}

function StepsEditor({ steps, onChange }: { steps: VisaStep[]; onChange: (s: VisaStep[]) => void }) {
  return (
    <div className={`${subcard} mt-5`}>
      <div className="mb-2 flex items-center justify-between"><h3 className="text-[14px] font-semibold">Steps</h3><CmsButton size="sm" variant="secondary" onClick={() => onChange([...steps, { title: "", text: "" }])}>+ Add step</CmsButton></div>
      {steps.map((s, i) => (
        <div key={i} className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
          <input className={input} placeholder="Title" value={s.title} onChange={(e) => onChange(steps.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
          <input className={input} placeholder="Text" value={s.text} onChange={(e) => onChange(steps.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x))} />
          <button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(steps.filter((_, idx) => idx !== i))}>Remove</button>
        </div>
      ))}
    </div>
  );
}

function SriLankaEditor({ items, onChange }: { items: SriLankaVisa[]; onChange: (v: SriLankaVisa[]) => void }) {
  return (
    <div className={`${subcard} mt-5`}>
      <div className="mb-2 flex items-center justify-between"><h3 className="text-[14px] font-semibold">Sri Lanka visit visa cards</h3><CmsButton size="sm" variant="secondary" onClick={() => onChange([...items, { name: "", short: "", icon: "beach_access", image: "", text: "", purposes: [], facts: [] }])}>+ Add card</CmsButton></div>
      <div className="flex flex-col gap-3">
        {items.map((v, i) => (
          <div key={i} className="rounded-[10px] border border-cms-line p-3">
            <div className="mb-2 flex justify-end"><button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>Remove card</button></div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input className={input} placeholder="Name" value={v.name} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} />
              <input className={input} placeholder="Short name" value={v.short} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, short: e.target.value } : x))} />
              <input className={input} placeholder="Icon" value={v.icon} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x))} />
              <input className={input} placeholder="Image path/URL" value={v.image} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, image: e.target.value } : x))} />
            </div>
            <textarea className={`${area} mt-2`} rows={2} placeholder="Description" value={v.text} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x))} />
            <Field label="Purposes (comma-separated)"><input className={input} value={(v.purposes || []).join(", ")} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, purposes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } : x))} /></Field>
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between"><span className="text-[12.5px] font-semibold">Facts</span><button className="text-[12px] font-semibold text-cms-primary" type="button" onClick={() => onChange(items.map((x, idx) => idx === i ? { ...x, facts: [...(x.facts || []), { label: "", value: "" }] } : x))}>+ Add fact</button></div>
              {(v.facts || []).map((f, fi) => (
                <div key={fi} className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input className={input} placeholder="Label" value={f.label} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, facts: x.facts.map((y, j) => j === fi ? { ...y, label: e.target.value } : y) } : x))} />
                  <input className={input} placeholder="Value" value={f.value} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, facts: x.facts.map((y, j) => j === fi ? { ...y, value: e.target.value } : y) } : x))} />
                  <button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(items.map((x, idx) => idx === i ? { ...x, facts: x.facts.filter((_, j) => j !== fi) } : x))}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResidenceEditor({ items, onChange }: { items: ResidenceCategory[]; onChange: (v: ResidenceCategory[]) => void }) {
  return (
    <div className={`${subcard} mt-5`}>
      <div className="mb-2 flex items-center justify-between"><h3 className="text-[14px] font-semibold">Residence categories</h3><CmsButton size="sm" variant="secondary" onClick={() => onChange([...items, { title: "", icon: "badge", text: "", highlight: "" }])}>+ Add</CmsButton></div>
      {items.map((r, i) => (
        <div key={i} className="mb-2 grid grid-cols-1 gap-2 rounded-[10px] border border-cms-line p-3 sm:grid-cols-2">
          <input className={input} placeholder="Title" value={r.title} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
          <input className={input} placeholder="Icon" value={r.icon} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x))} />
          <input className={`${input} sm:col-span-2`} placeholder="Text" value={r.text} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x))} />
          <input className={input} placeholder="Highlight (optional)" value={r.highlight || ""} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, highlight: e.target.value } : x))} />
          <div className="sm:col-span-2 flex justify-end"><button className="text-[12px] font-semibold text-[#d42a45]" type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>Remove</button></div>
        </div>
      ))}
    </div>
  );
}
