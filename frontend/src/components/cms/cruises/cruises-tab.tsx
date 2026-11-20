"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { CollapsiblePanel } from "@/components/cms/CollapsiblePanel";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { CmsViewModal, ViewPills } from "@/components/cms/CmsViewModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { browserApiUrl } from "@/lib/api-url";
import { uploadMediaFile } from "@/lib/cms-upload";
import type { Journey } from "@/lib/journey-api";

const JOURNEYS_API = browserApiUrl("/journey-categories");

const inputShell = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";

type JourneyDraft = {
  name: string;
  label: string;
  text: string;
  price: number;
  priceNote: string;
  image: string;
  chips: string[];
  startingPoint: string;
  stops: string[];
};

const blankJourney = (): JourneyDraft => ({
  name: "",
  label: "",
  text: "",
  price: 0,
  priceNote: "",
  image: "",
  chips: [],
  startingPoint: "",
  stops: [],
});

type DeleteTarget = { kind: "journey"; id: string; label: string };

export default function CruisesTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const [draft, setDraft] = useState<JourneyDraft>(blankJourney());
  const [chipsInput, setChipsInput] = useState("");
  const [draftEditingId, setDraftEditingId] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);

  const [stops, setStops] = useState<string[]>([]);
  const [stopInput, setStopInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState<Journey | null>(null);

  const fetchAll = useCallback(async (): Promise<Journey[]> => {
    const res = await fetch(`${JOURNEYS_API}?kind=cruise`, { credentials: "include" });
    if (!res.ok) throw new Error("load failed");
    const data: { journeys?: Journey[] } = await res.json();
    const list = Array.isArray(data.journeys) ? data.journeys : [];
    return list.filter((j) => j.kind === "cruise");
  }, []);

  const load = useCallback(async () => {
    try {
      const list = await fetchAll();
      setJourneys(list);
    } catch {
      setNotice("Could not load cruises. Please sign in again or try again.");
    } finally {
      setLoaded(true);
    }
  }, [fetchAll]);

  useEffect(() => {
    let cancelled = false;
    fetchAll()
      .then((list) => {
        if (cancelled) return;
        setJourneys(list);
      })
      .catch(() => {
        if (cancelled) return;
        setNotice("Could not load cruises.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchAll]);

  // ── Add/remove stops ──────────────────────────────────────────────
  const addStop = useCallback((name?: string) => {
    const stopName = (name || "").trim();
    if (!stopName) return;
    setStops((prev) => {
      const exists = prev.some((s) => s.toLowerCase() === stopName.toLowerCase());
      if (exists) return prev;
      return [...prev, stopName];
    });
  }, []);

  const removeStop = useCallback((name: string) => {
    setStops((prev) => prev.filter((s) => s !== name));
  }, []);
  const moveStop = useCallback((index: number, direction: -1 | 1) => {
    setStops((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }, []);

  // ── Draft sync ───────────────────────────────────────────────────
  const draftValid =
    draft.name.trim().length > 0 &&
    draft.label.trim().length > 0 &&
    draft.text.trim().length > 0 &&
    draft.price > 0 &&
    draft.priceNote.trim().length > 0 &&
    draft.image.length > 0;

  async function saveJourney() {
    if (!draftValid) return;
    setSavingDraft(true);
    setNotice("");
    try {
      const chips = chipsInput.split(",").map((c) => c.trim()).filter(Boolean);
      const body = {
        kind: "cruise" as const,
        name: draft.name.trim(),
        label: draft.label.trim(),
        text: draft.text.trim(),
        price: draft.price,
        priceNote: draft.priceNote.trim(),
        image: draft.image,
        chips,
        startingPoint: draft.startingPoint.trim(),
        stops,
      };
      const response = await fetch(
        draftEditingId ? `${JOURNEYS_API}/${draftEditingId}` : JOURNEYS_API,
        {
          method: draftEditingId ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data: { message?: string; journey?: Journey } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save journey.");
      setNotice(draftEditingId ? "Journey updated." : "Journey added.");
      const saved = data.journey;
      if (saved && saved.id) {
        setJourneys((prev) =>
          draftEditingId ? prev.map((j) => (j.id === saved.id ? saved : j)) : [saved, ...prev],
        );
      } else {
        await load();
      }
      setDraft(blankJourney());
      setChipsInput("");
      setDraftEditingId(null);
      setStops([]);
      setStopInput("");
      setUploadError("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save journey.");
    } finally {
      setSavingDraft(false);
    }
  }

  function editJourney(j: Journey) {
    setDraftEditingId(j.id);
    setDraft({
      name: j.name,
      label: j.label,
      text: j.text,
      price: j.price,
      priceNote: j.priceNote,
      image: j.image,
      chips: j.chips,
      startingPoint: j.startingPoint,
      stops: j.stops,
    });
    setChipsInput(j.chips.join(", "));
    setNotice("");
    setStops(j.stops);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetDraft() {
    setDraft(blankJourney());
    setChipsInput("");
    setDraftEditingId(null);
    setStops([]);
    setStopInput("");
    setUploadError("");
  }

  // ── Delete ───────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setNotice("");
    try {
      const id = deleteTarget.id;
      const response = await fetch(`${JOURNEYS_API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data: { message?: string } = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Could not delete.");
      }
      setNotice("Journey deleted.");
      if (deleteTarget.kind === "journey" && draftEditingId === deleteTarget.id) resetDraft();
      setJourneys((prev) => prev.filter((j) => j.id !== id));
      setDeleteTarget(null);
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
          <h1 className="text-[24px] font-semibold text-cms-ink">Cruises</h1>
          <p className="mt-1.5 text-[13px] text-cms-muted">Manage cruise holiday packages.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Cruises" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice}</span>
      </div>

      {/* ── Journey form ───────────────────────────────────────────── */}
      <CollapsiblePanel
        onToggle={() => setFormOpen((current) => !current)}
        open={formOpen}
        subtitle="Fill in all fields."
        title="Add New Cruise Journey"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_1px_360px] lg:items-start">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name (e.g. Singapore → Penang → Phuket)">
              <input className={inputShell} placeholder="Singapore → Penang → Phuket" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            </Field>
            <Field label="Label (e.g. Southeast Asia)">
              <input className={inputShell} placeholder="Southeast Asia" value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea className={`${inputShell} h-auto min-h-[96px] py-2.5`} placeholder="Five nights on a modern cruise ship..." value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}></textarea>
              </Field>
            </div>
            <Field label="Price (LKR)">
              <input
                className={inputShell}
                type="number"
                min={0}
                step="100"
                placeholder="240000"
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) || 0 }))}
              />
            </Field>
            <Field label="Price Note">
              <input className={inputShell} placeholder="per person, twin cabin" value={draft.priceNote} onChange={(e) => setDraft((d) => ({ ...d, priceNote: e.target.value }))} />
            </Field>
            <Field label="Chips (features, separated by comma)">
              <input
                className={inputShell}
                placeholder="5 nights, Balcony cabins, Monthly sailings"
                value={chipsInput}
                onChange={(e) => setChipsInput(e.target.value)}
              />
            </Field>
            <Field label="Starting Point">
              <input
                className={inputShell}
                placeholder="Singapore"
                value={draft.startingPoint}
                onChange={(e) => setDraft((d) => ({ ...d, startingPoint: e.target.value }))}
              />
            </Field>
            <div className="sm:col-span-2">
              <div className="block text-[12.5px] font-semibold text-cms-text">
                Stops
                <div className="mt-1.5 space-y-2 font-normal">
                  {stops.map((stop, index) => (
                    <div key={stop} className="flex items-center gap-2 rounded border border-cms-line px-2 py-1 text-[12px] text-cms-ink dark:border-[#2a2e63] dark:bg-[#101435]">
                      <span className="flex-1 truncate">{stop}</span>
                      <CmsButton
                        size="icon"
                        variant="secondary"
                        aria-label="Move stop up"
                        className="shrink-0"
                        disabled={index === 0}
                        onClick={() => moveStop(index, -1)}
                      >
                        ↑
                      </CmsButton>
                      <CmsButton
                        size="icon"
                        variant="secondary"
                        aria-label="Move stop down"
                        className="shrink-0"
                        disabled={index === stops.length - 1}
                        onClick={() => moveStop(index, 1)}
                      >
                        ↓
                      </CmsButton>
                      <CmsButton
                        size="icon"
                        variant="danger"
                        aria-label="Remove stop"
                        className="shrink-0"
                        onClick={() => removeStop(stop)}
                      >
                        x
                      </CmsButton>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 rounded border border-cms-line px-2 py-1 text-[12px] text-cms-ink dark:border-[#2a2e63] dark:bg-[#101435]">
                    <input
                      type="text"
                      className="flex-1 bg-transparent outline-none"
                      placeholder="Add a stop..."
                      value={stopInput}
                      onChange={(e) => setStopInput(e.target.value)}
                      onBlur={() => {
                        if (stopInput.trim()) {
                          addStop(stopInput);
                          setStopInput("");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addStop(stopInput);
                          setStopInput("");
                        }
                      }}
                    />
                    <CmsButton
                      size="icon"
                      variant="primary"
                      type="button"
                      className="shrink-0"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        addStop(stopInput);
                        setStopInput("");
                      }}
                    >
                      +
                    </CmsButton>
                  </div>
                </div>
                <span className="mt-1.5 block text-[11px] font-normal text-cms-muted">Maximum 10 stops</span>
              </div>
            </div>
          </div>

          <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block" />

          <div className="lg:sticky lg:top-4">
            <ImageUpload
              label="Image"
              hint="JPEG, PNG, WebP or GIF · up to 5MB"
              value={draft.image}
              uploading={uploading}
              progress={uploadProgress}
              error={uploadError}
              onFile={(file) => {
                void (async () => {
                  setUploading(true);
                  setUploadProgress(0);
                  setUploadError("");
                  try {
                    const url = await uploadMediaFile(file, { folder: "cruises", kind: "image", onProgress: setUploadProgress });
                    setDraft((d) => ({ ...d, image: url }));
                  } catch (error) {
                    setUploadError(error instanceof Error ? error.message : "Upload failed.");
                  } finally {
                    setUploading(false);
                  }
                })();
              }}
              onRemove={() => setDraft((d) => ({ ...d, image: "" }))}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cms-line pt-4">
          <CmsButton variant="primary" disabled={!draftValid || savingDraft} onClick={() => void saveJourney()}>
            {savingDraft ? "Saving…" : draftEditingId ? "Update journey" : "Add journey"}
          </CmsButton>
          {!draftValid && <span className="text-[12px] text-cms-muted">All fields marked with * are required.</span>}
        </div>
      </CollapsiblePanel>

      {/* ── Journeys list ───────────────────────────────────────────── */}
      <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-cms-ink">Cruises ({journeys.length})</h2>
          <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
        </div>
        {!loaded ? (
          <p className="text-[13px] text-cms-muted">Loading cruises…</p>
        ) : !journeys.length ? (
          <p className="text-[13px] text-cms-muted">No cruise journeys yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                  <th className="pb-2 pr-3">Image</th>
                  <th className="pb-2 pr-3">Name</th>
                  <th className="pb-2 pr-3">Starting Point</th>
                  <th className="pb-2 pr-3">Stops</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {journeys.map((j) => (
                  <tr className="border-b border-cms-line last:border-0" key={j.id}>
                    <td className="py-2.5 pr-3">
                      <div className="h-12 w-16 overflow-hidden rounded-md bg-[#eef1ff] dark:bg-[#101435]">
                        {j.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={j.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[10px] text-cms-muted">No image</div>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{j.name}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{j.startingPoint || "—"}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">
                      {j.stops.length > 0 ? j.stops.join(" → ") : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex gap-1.5">
                        <CmsButton size="sm" variant="secondary" onClick={() => setViewTarget(j)}>View</CmsButton>
                        <CmsButton size="sm" variant="secondary" onClick={() => editJourney(j)}>Edit</CmsButton>
                        <CmsButton
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteTarget({ kind: "journey", id: j.id, label: j.name })}
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
        title="Delete journey?"
        message={
          deleteTarget
            ? `“${deleteTarget.label}” will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />

      <CmsViewModal
        open={viewTarget !== null}
        title={viewTarget?.name ?? ""}
        subtitle={viewTarget?.label}
        image={viewTarget?.image}
        sections={viewTarget ? [{
          title: "Journey details",
          fields: [
            { label: "Label", value: viewTarget.label },
            { label: "Starting point", value: viewTarget.startingPoint || "—" },
            { label: "Stops", value: <ViewPills items={viewTarget.stops} />, wide: true },
            { label: "Price", value: `LKR ${viewTarget.price.toLocaleString("en-LK")}` },
            { label: "Price note", value: viewTarget.priceNote || "—" },
            { label: "Chips", value: <ViewPills items={viewTarget.chips} />, wide: true },
            { label: "Description", value: viewTarget.text || "—", wide: true },
            { label: "Record ID", value: viewTarget.id },
          ],
        }] : []}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}