"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { cmsButtonClasses } from "@/components/cms/CmsButton";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { Icon } from "@/components/ui/Icon";
import { browserApiUrl } from "@/lib/api-url";
import { uploadMediaFile } from "@/lib/cms-upload";
import { defaultHotelBooking, type HotelBookingContent, type HotelBookingStat } from "@/lib/hotel-booking-api";

const URL_API = browserApiUrl("/hotel-booking");
const inputShell =
  "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] font-normal text-cms-ink outline-none placeholder:text-cms-muted focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const areaShell = `${inputShell} min-h-[100px] py-2.5 leading-[1.55] resize-y`;
const btnGhost = cmsButtonClasses("secondary");
const btnPrimary = cmsButtonClasses("primary");

export default function HotelBookingTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [content, setContent] = useState<HotelBookingContent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState<"imagePrimary" | "imageSecondary" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(URL_API)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { content?: HotelBookingContent }) => {
        if (cancelled) return;
        setContent({
          ...defaultHotelBooking,
          ...(data.content || {}),
          stats: Array.isArray(data.content?.stats) && data.content.stats.length ? data.content.stats : defaultHotelBooking.stats,
        });
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setContent(defaultHotelBooking);
          setLoaded(true);
          setNotice("Could not load saved content. Showing defaults until the backend is reachable.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof HotelBookingContent>(field: K, value: HotelBookingContent[K]) {
    setContent((current) => (current ? { ...current, [field]: value } : current));
    setDirty(true);
  }

  function setStat(index: number, field: keyof HotelBookingStat, value: string) {
    setContent((current) => {
      if (!current) return current;
      const stats = current.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s));
      return { ...current, stats };
    });
    setDirty(true);
  }

  function addStat() {
    setContent((current) => (current && current.stats.length < 4 ? { ...current, stats: [...current.stats, { value: "", label: "" }] } : current));
    setDirty(true);
  }

  function removeStat(index: number) {
    setContent((current) => (current ? { ...current, stats: current.stats.filter((_, i) => i !== index) } : current));
    setDirty(true);
  }

  async function uploadImage(field: "imagePrimary" | "imageSecondary", file?: File | null) {
    if (!file) return;
    setUploadError("");
    setUploading(field);
    setUploadProgress(0);
    try {
      const url = await uploadMediaFile(file, { folder: "hotel-booking", kind: "image", onProgress: setUploadProgress });
      update(field, url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    if (!content || !loaded) return;
    const title = content.title.trim();
    const description = content.description.trim();
    if (!title) { setNotice("Title is required."); return; }
    if (!description) { setNotice("Description is required."); return; }
    const stats = content.stats.map((s) => ({ value: s.value.trim(), label: s.label.trim() })).filter((s) => s.value || s.label);
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch(URL_API, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, title, description, stats }),
      });
      const data: { content?: HotelBookingContent; message?: string } | null = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice(res.status === 401 ? "Your session expired. Sign in again." : data?.message ?? "Could not save hotel booking content.");
        return;
      }
      if (data?.content) setContent({ ...defaultHotelBooking, ...data.content, stats: data.content.stats ?? [] });
      setDirty(false);
      setNotice("Hotel booking section saved.");
    } catch {
      setNotice("Could not reach the server. Nothing was saved.");
    } finally {
      setSaving(false);
    }
  }

  if (!content) {
    return (
      <div className="w-full">
        <div className="mb-7">
          <h1 className="text-[24px] font-semibold text-cms-ink">Hotel Bookings</h1>
          <p className="mt-1.5 text-[13px] text-cms-muted">Loading section content...</p>
        </div>
      </div>
    );
  }

  const visibleStats = content.stats.filter((s) => s.value || s.label);

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">Hotel Bookings</h1>
          <p className="mt-1.5 max-w-3xl text-[13px] leading-[1.6] text-cms-muted">
            Customize the hotel booking promo on the Travel Sri Lanka visitor page. The editor below is organized to match the visitor layout: message and action on the left, images and price badge on the right.
          </p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Hotel Bookings" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice || (dirty ? "Unsaved changes" : "All changes saved")}</span>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="flex flex-col gap-5">
          <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
            <div className="mb-4">
              <h2 className="text-[16px] font-semibold text-cms-ink">Message (left side)</h2>
              <p className="mt-1 text-[12px] leading-[1.5] text-cms-muted">Headline copy shown at the top-left of the visitor promo card.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Field label="Eyebrow"><input className={inputShell} maxLength={60} value={content.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} placeholder="Hotel bookings" /></Field>
              <Field label="Title"><input className={inputShell} maxLength={160} value={content.title} onChange={(e) => update("title", e.target.value)} placeholder="Stay somewhere special, anywhere in Sri Lanka" /></Field>
              <Field label="Description"><textarea className={areaShell} maxLength={1200} rows={4} value={content.description} onChange={(e) => update("description", e.target.value)} placeholder="Explain what visitors can book and why it is convenient." /></Field>
            </div>
          </section>

          <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-cms-ink">Highlights</h2>
                <p className="mt-1 text-[12px] leading-[1.5] text-cms-muted">Short value/trust stats shown under the description. Use up to 4.</p>
              </div>
              <button className={btnGhost} type="button" disabled={content.stats.length >= 4} onClick={addStat}>+ Add stat</button>
            </div>
            <div className="grid gap-3">
              {content.stats.map((stat, index) => (
                <div key={index} className="grid grid-cols-1 gap-3 rounded-[11px] border border-cms-line bg-cms-bg p-3 dark:bg-[#101435] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)_auto] sm:items-end">
                  <Field label="Value"><input className={inputShell} maxLength={30} value={stat.value} onChange={(e) => setStat(index, "value", e.target.value)} placeholder="2,000+" /></Field>
                  <Field label="Label"><input className={inputShell} maxLength={60} value={stat.label} onChange={(e) => setStat(index, "label", e.target.value)} placeholder="Hotels & villas" /></Field>
                  <button className={cmsButtonClasses("danger", "md")} type="button" onClick={() => removeStat(index)}>Remove</button>
                </div>
              ))}
              {!content.stats.length && <p className="text-[12px] text-cms-muted">No highlights yet. Add one or two clear stats if helpful.</p>}
            </div>
          </section>

          <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
            <div className="mb-4">
              <h2 className="text-[16px] font-semibold text-cms-ink">Call to action</h2>
              <p className="mt-1 text-[12px] leading-[1.5] text-cms-muted">Controls the button visitors click. Leave the URL empty to open WhatsApp with your message.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Button label"><input className={inputShell} maxLength={60} value={content.ctaLabel} onChange={(e) => update("ctaLabel", e.target.value)} placeholder="Book Hotel" /></Field>
              <Field label="Button note"><input className={inputShell} maxLength={120} value={content.ctaNote} onChange={(e) => update("ctaNote", e.target.value)} placeholder="Opens our booking portal" /></Field>
              <div className="sm:col-span-2"><Field label="Button URL (optional)"><input className={inputShell} maxLength={1000} value={content.ctaUrl} onChange={(e) => update("ctaUrl", e.target.value)} placeholder="https://booking.example.com or /contact" /></Field></div>
              <div className="sm:col-span-2"><Field label="WhatsApp fallback message"><textarea className={areaShell} maxLength={300} rows={3} value={content.whatsappMessage} onChange={(e) => update("whatsappMessage", e.target.value)} placeholder="Hi Let's Fly, I'd like to book a hotel." /></Field></div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
            <div className="mb-4">
              <h2 className="text-[16px] font-semibold text-cms-ink">Images & price badge (right side)</h2>
              <p className="mt-1 text-[12px] leading-[1.5] text-cms-muted">Matches the visitor layout: large image top-right, smaller overlapping image bottom-left, and a price badge.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ImageUpload
                accept="image/*"
                error={uploading === "imagePrimary" ? uploadError : ""}
                height="h-[200px]"
                hint="Primary (large) image - JPEG, PNG, WebP or GIF, up to 5MB"
                label="Primary image"
                onFile={(file) => void uploadImage("imagePrimary", file)}
                onRemove={() => update("imagePrimary", "")}
                uploading={uploading === "imagePrimary"}
                progress={uploading === "imagePrimary" ? uploadProgress : undefined}
                value={content.imagePrimary}
              />
              <ImageUpload
                accept="image/*"
                error={uploading === "imageSecondary" ? uploadError : ""}
                height="h-[180px]"
                hint="Secondary (overlapping) image - JPEG, PNG, WebP or GIF, up to 5MB"
                label="Secondary image"
                onFile={(file) => void uploadImage("imageSecondary", file)}
                onRemove={() => update("imageSecondary", "")}
                uploading={uploading === "imageSecondary"}
                progress={uploading === "imageSecondary" ? uploadProgress : undefined}
                value={content.imageSecondary}
              />
              {uploadError && !uploading && <p className="text-[12px] text-[#d42a45] dark:text-[#ff9aa8]">{uploadError}</p>}
              <div className="rounded-[11px] border border-cms-line bg-cms-bg p-3 dark:bg-[#101435]">
                <p className="mb-2 text-[12.5px] font-semibold text-cms-text">Price badge</p>
                <p className="mb-3 text-[12px] text-cms-muted">Shown on the image side. Leave all fields empty to hide it.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Label"><input className={inputShell} maxLength={40} value={content.priceLabel} onChange={(e) => update("priceLabel", e.target.value)} placeholder="Rooms from" /></Field>
                  <Field label="Amount"><input className={inputShell} maxLength={40} value={content.priceAmount} onChange={(e) => update("priceAmount", e.target.value)} placeholder="LKR 18,500" /></Field>
                  <Field label="Suffix"><input className={inputShell} maxLength={40} value={content.priceSuffix} onChange={(e) => update("priceSuffix", e.target.value)} placeholder="per night" /></Field>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-semibold text-cms-ink">Layout preview</h2>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-cms-muted">Visitor mapping</span>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-[#e6e0d6] bg-[#f8f4ec] p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
                <div className="min-w-0">
                  {content.eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4b6b8f]">{content.eyebrow}</p>}
                  <p className="mt-1 text-[16px] font-semibold leading-[1.25] text-[#10213a]">{content.title || "Section title"}</p>
                  <p className="mt-2 line-clamp-3 text-[12px] leading-[1.55] text-[#475569]">{content.description || "Section description appears here."}</p>
                  {visibleStats.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {visibleStats.slice(0, 3).map((s, i) => (
                        <div key={i} className={i ? "border-l border-[#d8cfbf] pl-4" : ""}>
                          <div className="text-[13px] font-bold text-[#13579b]">{s.value || "—"}</div>
                          <div className="text-[10px] text-[#64748b]">{s.label || "Label"}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#13579b] px-3 py-2 text-[11px] font-semibold text-white">
                    {content.ctaLabel || "Book Hotel"}
                    <Icon name={content.ctaUrl ? "north_east" : "arrow_forward"} size={14} />
                  </div>
                  {content.ctaNote && <p className="mt-1.5 text-[10px] text-[#64748b]">{content.ctaNote}</p>}
                </div>
                <div className="relative mx-auto aspect-[4/3] w-full max-w-[260px]">
                  <div className="absolute right-0 top-0 h-[64%] w-[76%] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                    {content.imagePrimary ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={content.imagePrimary} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] font-medium text-[#94a3b8]">Primary image</div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 h-[56%] w-[60%] overflow-hidden rounded-xl border-2 border-white bg-[#efe7d8] shadow-sm">
                    {content.imageSecondary ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={content.imageSecondary} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] font-medium text-[#94a3b8]">Secondary</div>
                    )}
                  </div>
                  {(content.priceLabel || content.priceAmount || content.priceSuffix) && (
                    <div className="absolute bottom-3 right-1 rounded-lg bg-[#f6c445] px-2.5 py-2 text-[#10213a] shadow-sm">
                      {content.priceLabel && <div className="text-[9px] font-medium">{content.priceLabel}</div>}
                      {content.priceAmount && <div className="text-[11px] font-bold">{content.priceAmount}</div>}
                      {content.priceSuffix && <div className="text-[9px] font-medium">{content.priceSuffix}</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-[14px] border border-cms-line bg-cms-card px-4 py-3">
        <span className="mr-auto text-[12.5px] text-cms-muted" aria-live="polite">{notice || (dirty ? "Unsaved changes" : "All changes saved")}</span>
        <button className={btnPrimary} disabled={!loaded || saving || uploading !== null} onClick={() => void save()} type="button">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}
