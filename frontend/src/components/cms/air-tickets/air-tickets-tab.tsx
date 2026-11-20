"use client";

import { useCallback, useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { CollapsiblePanel } from "@/components/cms/CollapsiblePanel";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { CmsViewModal } from "@/components/cms/CmsViewModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { apiUrl } from "@/lib/api-url";
import { uploadMediaFile } from "@/lib/cms-upload";
import {
  defaultAirTicketContent,
  fetchAirTicketsManage,
  type AirTicketContent,
  type AirTicketRoute,
} from "@/lib/air-tickets-api";

const API = apiUrl("/air-tickets");
const inputShell =
  "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] font-normal text-cms-ink outline-none placeholder:text-cms-muted focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const areaShell = `${inputShell} min-h-[110px] py-2.5 leading-[1.55] resize-y`;

type RouteDraft = {
  startLocation: string;
  endLocation: string;
  pricePerPerson: number;
  image: string;
  sortOrder: number;
};

const blankRoute = (sortOrder = 0): RouteDraft => ({
  startLocation: "Colombo",
  endLocation: "",
  pricePerPerson: 0,
  image: "",
  sortOrder,
});

export default function AirTicketsTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [content, setContent] = useState<AirTicketContent>(defaultAirTicketContent);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [contentDirty, setContentDirty] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [heroError, setHeroError] = useState("");

  const [routes, setRoutes] = useState<AirTicketRoute[]>([]);
  const [routesLoaded, setRoutesLoaded] = useState(false);
  const [routeDraft, setRouteDraft] = useState<RouteDraft>(blankRoute());
  const [routeEditingId, setRouteEditingId] = useState<string | null>(null);
  const [routeUploading, setRouteUploading] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0);
  const [routeError, setRouteError] = useState("");
  const [savingRoute, setSavingRoute] = useState(false);

  const [notice, setNotice] = useState("");
  const [topCardOpen, setTopCardOpen] = useState(false);
  const [routeFormOpen, setRouteFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AirTicketRoute | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState<AirTicketRoute | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchAirTicketsManage();
      setContent(data.content);
      setRoutes(data.routes);
      setContentDirty(false);
    } catch {
      setNotice("Could not load air tickets. Please sign in again or try again.");
    } finally {
      setContentLoaded(true);
      setRoutesLoaded(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  function updateContent<K extends keyof AirTicketContent>(key: K, value: AirTicketContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
    setContentDirty(true);
  }

  async function uploadHero(file?: File | null) {
    if (!file) return;
    setHeroError("");
    setHeroUploading(true);
    setHeroProgress(0);
    try {
      const url = await uploadMediaFile(file, { folder: "air-tickets", kind: "image", onProgress: setHeroProgress });
      updateContent("photo", url);
    } catch (e) {
      setHeroError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setHeroUploading(false);
    }
  }

  async function saveContent() {
    if (!content.title.trim() || !content.description.trim() || !content.phoneNumber.trim()) {
      setNotice("Photo title, description and phone number are required.");
      return;
    }
    setSavingContent(true);
    setNotice("");
    try {
      const res = await fetch(`${API}/content`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; content?: AirTicketContent };
      if (!res.ok) throw new Error(data.message || "Could not save air ticket content.");
      if (data.content) setContent({ ...defaultAirTicketContent, ...data.content });
      setContentDirty(false);
      setNotice("Air ticket card saved.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not save air ticket content.");
    } finally {
      setSavingContent(false);
    }
  }

  async function uploadRouteImage(file?: File | null) {
    if (!file) return;
    setRouteError("");
    setRouteUploading(true);
    setRouteProgress(0);
    try {
      const url = await uploadMediaFile(file, { folder: "air-tickets/routes", kind: "image", onProgress: setRouteProgress });
      setRouteDraft((d) => ({ ...d, image: url }));
    } catch (e) {
      setRouteError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setRouteUploading(false);
    }
  }

  function editRoute(route: AirTicketRoute) {
    setRouteEditingId(route._id);
    setRouteDraft({
      startLocation: route.startLocation || "",
      endLocation: route.endLocation || "",
      pricePerPerson: route.pricePerPerson || 0,
      image: route.image || "",
      sortOrder: route.sortOrder ?? 0,
    });
    setRouteError("");
    setNotice("");
    setRouteFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetRoute() {
    setRouteEditingId(null);
    setRouteDraft(blankRoute());
    setRouteError("");
  }

  async function saveRoute() {
    if (!routeDraft.startLocation.trim() || !routeDraft.endLocation.trim()) {
      setNotice("Start location and end location are required.");
      return;
    }
    if (!Number.isFinite(routeDraft.pricePerPerson) || routeDraft.pricePerPerson < 0) {
      setNotice("Price per person must be 0 or more.");
      return;
    }
    setSavingRoute(true);
    setNotice("");
    try {
      const res = await fetch(routeEditingId ? `${API}/routes/${routeEditingId}` : `${API}/routes`, {
        method: routeEditingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeDraft),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; route?: AirTicketRoute };
      if (!res.ok) throw new Error(data.message || "Could not save route.");
      setNotice(routeEditingId ? "Route updated." : "Route added.");
      if (data.route) {
        setRoutes((prev) => {
          const next = routeEditingId ? prev.map((r) => (r._id === data.route!._id ? data.route! : r)) : [data.route!, ...prev];
          return [...next].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        });
      } else {
        await load();
      }
      resetRoute();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not save route.");
    } finally {
      setSavingRoute(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setNotice("");
    try {
      const res = await fetch(`${API}/routes/${deleteTarget._id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message || "Could not delete route.");
      }
      setRoutes((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      if (routeEditingId === deleteTarget._id) resetRoute();
      setDeleteTarget(null);
      setNotice("Route deleted.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not delete route.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">Air Tickets</h1>
          <p className="mt-1.5 text-[13px] text-cms-muted">
            Manage the Air Tickets visitor page hero card and popular routes. Route cards include a WhatsApp CTA on the website.
          </p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Air Tickets" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice || (contentDirty ? "Unsaved changes" : "All changes saved")}</span>
      </div>

      <CollapsiblePanel
        onToggle={() => setTopCardOpen((current) => !current)}
        open={topCardOpen}
        subtitle="Customize the photo, title, description and phone number shown in the top booking card."
        title="Top card (visitor hero card)"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_1px_360px] lg:items-start">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Title">
              <input className={inputShell} value={content.title} maxLength={200} onChange={(e) => updateContent("title", e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea className={areaShell} value={content.description} maxLength={2000} onChange={(e) => updateContent("description", e.target.value)} />
            </Field>
            <Field label="Phone number">
              <input className={inputShell} value={content.phoneNumber} maxLength={60} onChange={(e) => updateContent("phoneNumber", e.target.value)} placeholder="+94 77 831 6020" />
            </Field>
          </div>
          <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block" />
          <div className="lg:sticky lg:top-4">
            <ImageUpload
              label="Photo"
              hint="JPEG, PNG, WebP or GIF — up to 5MB"
              value={content.photo}
              uploading={heroUploading}
              progress={heroProgress}
              error={heroError}
              onFile={(file) => void uploadHero(file)}
              onRemove={() => updateContent("photo", "")}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-cms-line pt-4">
          <CmsButton variant="primary" disabled={!contentLoaded || savingContent || heroUploading} onClick={() => void saveContent()}>
            {savingContent ? "Saving..." : "Save card"}
          </CmsButton>
          {!contentLoaded && <span className="text-[12px] text-cms-muted">Loading...</span>}
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel
        headerExtra={routeEditingId ? <CmsButton variant="secondary" onClick={resetRoute}>Cancel edit</CmsButton> : undefined}
        onToggle={() => setRouteFormOpen((current) => !current)}
        open={routeFormOpen}
        subtitle="Each route card shows image, start/end location, price per person and a WhatsApp CTA on the visitor page."
        title={routeEditingId ? "Edit route" : "Add popular route"}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_1px_360px] lg:items-start">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Start location">
              <input className={inputShell} value={routeDraft.startLocation} maxLength={120} onChange={(e) => setRouteDraft((d) => ({ ...d, startLocation: e.target.value }))} placeholder="Colombo" />
            </Field>
            <Field label="End location">
              <input className={inputShell} value={routeDraft.endLocation} maxLength={120} onChange={(e) => setRouteDraft((d) => ({ ...d, endLocation: e.target.value }))} placeholder="Dubai" />
            </Field>
            <Field label="Price per person (LKR)">
              <input className={inputShell} type="number" min={0} value={routeDraft.pricePerPerson} onChange={(e) => setRouteDraft((d) => ({ ...d, pricePerPerson: Number(e.target.value) || 0 }))} />
            </Field>
            <Field label="Sort order (optional)">
              <input className={inputShell} type="number" value={routeDraft.sortOrder} onChange={(e) => setRouteDraft((d) => ({ ...d, sortOrder: Number(e.target.value) || 0 }))} />
            </Field>
          </div>
          <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block" />
          <div className="lg:sticky lg:top-4">
            <ImageUpload
              label="Route image"
              hint="JPEG, PNG, WebP or GIF — up to 5MB"
              value={routeDraft.image}
              uploading={routeUploading}
              progress={routeProgress}
              error={routeError}
              onFile={(file) => void uploadRouteImage(file)}
              onRemove={() => setRouteDraft((d) => ({ ...d, image: "" }))}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-cms-line pt-4">
          <CmsButton variant="primary" disabled={savingRoute || routeUploading} onClick={() => void saveRoute()}>
            {savingRoute ? "Saving..." : routeEditingId ? "Update route" : "Add route"}
          </CmsButton>
        </div>
      </CollapsiblePanel>

      <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-cms-ink">Popular routes ({routes.length})</h2>
          <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
        </div>
        {!routesLoaded ? (
          <p className="text-[13px] text-cms-muted">Loading routes...</p>
        ) : !routes.length ? (
          <p className="text-[13px] text-cms-muted">No routes yet. Add routes above (current visitor defaults will be replaced once you add routes).</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                  <th className="pb-2 pr-3">Image</th>
                  <th className="pb-2 pr-3">Route</th>
                  <th className="pb-2 pr-3">Price / person</th>
                  <th className="pb-2 pr-3">Order</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route._id} className="border-b border-cms-line last:border-0">
                    <td className="py-2.5 pr-3">
                      <div className="h-12 w-16 overflow-hidden rounded-md bg-[#eef1ff] dark:bg-[#101435]">
                        {route.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={route.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[10px] text-cms-muted">No image</div>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">
                      {route.startLocation} → {route.endLocation}
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">LKR {route.pricePerPerson.toLocaleString()}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{route.sortOrder ?? 0}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex gap-1.5">
                        <CmsButton size="sm" variant="secondary" onClick={() => setViewTarget(route)}>View</CmsButton>
                        <CmsButton size="sm" variant="secondary" onClick={() => editRoute(route)}>Edit</CmsButton>
                        <CmsButton size="sm" variant="danger" onClick={() => setDeleteTarget(route)}>Delete</CmsButton>
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
        title="Delete route?"
        message={deleteTarget ? `"${deleteTarget.startLocation} → ${deleteTarget.endLocation}" will be permanently removed. This cannot be undone.` : ""}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => { if (!deleting) setDeleteTarget(null); }}
      />

      <CmsViewModal
        open={viewTarget !== null}
        title={viewTarget ? `${viewTarget.startLocation} → ${viewTarget.endLocation}` : ""}
        subtitle="Popular route"
        image={viewTarget?.image}
        sections={viewTarget ? [{
          title: "Route details",
          fields: [
            { label: "From", value: viewTarget.startLocation },
            { label: "To", value: viewTarget.endLocation },
            { label: "Price / person", value: `LKR ${viewTarget.pricePerPerson.toLocaleString()}` },
            { label: "Sort order", value: viewTarget.sortOrder ?? 0 },
            { label: "Record ID", value: viewTarget._id },
            ...(viewTarget.createdAt ? [{ label: "Created", value: viewTarget.createdAt }] : []),
          ],
        }] : []}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}
