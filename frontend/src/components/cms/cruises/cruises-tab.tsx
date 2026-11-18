"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { apiUrl } from "@/lib/api-url";
import type { Journey } from "@/lib/journey-api";

const JOURNEYS_API = apiUrl("/journey-categories");
const UPLOAD = apiUrl("/upload");

const inputShell = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = Math.max(1, Math.round(image.naturalHeight * (1600 / image.naturalWidth)));
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

async function uploadImageToR2(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be 5MB or smaller.");
  const prepared = await prepareImage(file);
  const response = await fetch(UPLOAD, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: prepared, folder: "cruises" }),
  });
  const data: { url?: string; message?: string } = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
  return data.url;
}

type DeleteTarget = { kind: "journey"; id: string; label: string };

export default function CruisesTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");

  const [draft, setDraft] = useState<JourneyDraft>(blankJourney());
  const [chipsInput, setChipsInput] = useState("");
  const [draftEditingId, setDraftEditingId] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);

  const [stops, setStops] = useState<string[]>([]);
  const [stopInput, setStopInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async (): Promise<Journey[]> => {
    const res = await fetch(JOURNEYS_API, { credentials: "include" });
    if (!res.ok) throw new Error("load failed");
    const data: { journeys?: Journey[] } = await res.json();
    return Array.isArray(data.journeys) ? data.journeys : [];
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
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save journey.");
      setNotice(draftEditingId ? "Journey updated." : "Journey added.");
      setDraft(blankJourney());
      setChipsInput("");
      setDraftEditingId(null);
      setStops([]);
      setStopInput("");
      setUploadError("");
      await load();
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
          <h1 className="text-[24px] font-semibold text-cms-ink">Cruises</h1>
          <p className="mt-1.5 text-[13px] text-cms-muted">Manage cruise holiday packages.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Cruises" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice}</span>
      </div>

      {/* ── Journey form ───────────────────────────────────────────── */}
      <section className="mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4">
          <h2 className="text-[16px] font-semibold text-cms-ink">Add New Cruise Journey</h2>
          <p className="mt-1.5 text-[12px] text-cms-muted">Fill in all fields.</p>
        </div>

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
              <Field label="Stops">
                <div className="mt-2 space-y-2">
                  {stops.map((stop) => (
                    <div key={stop} className="flex items-center gap-2 rounded border border-cms-line px-2 py-1 text-[12px] text-cms-ink dark:border-[#2a2e63] dark:bg-[#101435]">
                      <span className="flex-1 truncate">{stop}</span>
                      <CmsButton
                        size="icon"
                        variant="danger"
                        aria-label="Remove stop"
                        onClick={() => removeStop(stop)}
                      >
                        ×
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
                      onClick={() => {
                        addStop(stopInput);
                        setStopInput("");
                      }}
                    >
                      +
                    </CmsButton>
                  </div>
                </div>
                <span className="mt-1.5 block text-[11px] text-cms-muted">Maximum 10 stops</span>
              </Field>
            </div>
          </div>

          <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block" />

          <div className="lg:sticky lg:top-4">
            <ImageUpload
              label="Image"
              hint="JPEG, PNG, WebP or GIF · up to 5MB"
              value={draft.image}
              uploading={uploading}
              error={uploadError}
              onFile={(file) => {
                void (async () => {
                  setUploading(true);
                  setUploadError("");
                  try {
                    const url = await uploadImageToR2(file);
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
      </section>

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
                  <th className="pb-2 pr-3">Name</th>
                  <th className="pb-2 starting-point">Starting Point</th>
                  <th className="pb-2 stops">Stops</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {journeys.map((j) => (
                  <tr className="border-b border-cms-line last:border-0" key={j.id}>
                    <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{j.name}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{j.startingPoint || "—"}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">
                      {j.stops.length > 0 ? j.stops.join(" → ") : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex gap-1.5">
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
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}