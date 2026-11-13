"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api-url";
import {
  defaultRentalTeaser,
  rentalSlotIds,
  rentalSlotMeta,
  type RentalSlot,
  type RentalSlotId,
  type RentalTeaserContent,
} from "@/lib/rental-teaser-api";

const URL_API = apiUrl("/rental-teaser");
const UPLOAD_API = apiUrl("/upload");

const inputShell =
  "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[14px] text-cms-ink outline-none placeholder:text-cms-muted focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const btnBase = "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[9px] px-[14px] text-[12.5px] font-semibold transition-[background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost = `${btnBase} border border-cms-line bg-cms-card text-cms-ink hover:not-disabled:border-[#e2e2ea] hover:not-disabled:bg-[#f5f5f7] dark:hover:not-disabled:border-[#4a4f8f] dark:hover:not-disabled:bg-[#101435]`;
const btnPrimary = `${btnBase} border border-transparent bg-cms-primary text-white hover:bg-[#150cb0] dark:hover:bg-[#7d74ff]`;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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

export default function RentalTeaserSection() {
  const [content, setContent] = useState<RentalTeaserContent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState<RentalSlotId | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [dropping, setDropping] = useState<RentalSlotId | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(URL_API)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { content?: RentalTeaserContent }) => {
        if (!cancelled && data.content?.slots?.length === 4) {
          setContent({ slots: data.content.slots });
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent(defaultRentalTeaser);
          setLoaded(true);
          setNotice("API unreachable — showing defaults. Start the backend to load saved content.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateSlot(id: RentalSlotId, patch: Partial<RentalSlot>) {
    setContent((current) => {
      if (!current) return current;
      return {
        slots: current.slots.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)),
      };
    });
    setDirty(true);
  }

  async function uploadImage(id: RentalSlotId, file?: File | null) {
    if (!file) return;
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file (JPEG, PNG, WebP or GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError("Image must be 5MB or smaller.");
      return;
    }
    setUploading(id);
    try {
      const prepared = await prepareImage(file);
      const res = await fetch(UPLOAD_API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: prepared, folder: "rentals" }),
      });
      const data: { url?: string; message?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
      updateSlot(id, { image: data.url });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    if (!content || !loaded) {
      setNotice("Content was not loaded from the server — nothing was saved.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch(URL_API, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data: { content?: RentalTeaserContent; message?: string } | null = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice(
          res.status === 401
            ? "Your session expired — sign in again."
            : data?.message ?? "Could not save the Car & bike rental section.",
        );
        return;
      }
      if (data?.content) setContent(data.content);
      setDirty(false);
      setNotice("Car & bike rental section saved");
    } catch {
      setNotice("Could not reach the server — nothing was saved.");
    } finally {
      setSaving(false);
    }
  }

  if (!content) {
    return (
      <section aria-label="Car and bike rental" className="mt-9 rounded-[14px] border border-cms-line bg-cms-card p-[22px] shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none max-[760px]:p-4">
        <h2 className="text-[16px] font-semibold text-cms-ink">Car &amp; bike rental</h2>
        <p className="mt-1 text-[12.5px] text-cms-muted" aria-live="polite">{notice || "Loading section content…"}</p>
      </section>
    );
  }

  return (
    <section aria-label="Car and bike rental" className="mt-9 rounded-[14px] border border-cms-line bg-cms-card p-[22px] shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none max-[760px]:p-4">
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold text-cms-ink">Car &amp; bike rental</h2>
        <p className="mt-[2px] max-w-[760px] text-[12.5px] leading-[1.5] text-cms-muted">
          Homepage teaser — four category slots. Each slot: one image plus the two text lines that overlap the photo.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {rentalSlotIds.map((id) => {
          const meta = rentalSlotMeta[id];
          const slot = content.slots.find((item) => item.id === id);
          if (!slot) return null;
          return (
            <div className="rounded-[12px] border border-dashed border-cms-line bg-[#f5f5f7] p-3 dark:border-[#2a2e63] dark:bg-[#101435]" key={id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-[13px] text-cms-text">{meta.label}</b>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-cms-muted dark:bg-[#171a42]">
                  {meta.aspect} · {meta.format}
                </span>
              </div>

              <div
                className={`mt-2 grid h-[130px] place-items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed bg-center bg-cover bg-no-repeat text-center text-[12.5px] font-medium transition-[border-color,box-shadow] duration-[180ms] ease-out ${dropping === id ? "border-[#6f6e80] shadow-[0_0_0_4px_rgba(110,110,130,.16)] dark:border-[#8a8ab0]" : "border-cms-line bg-white text-cms-muted dark:border-[#2a2e63] dark:bg-[#171a42]"}`}
                style={slot.image ? { backgroundImage: `url("${slot.image}")` } : undefined}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                  setDropping(id);
                }}
                onDragLeave={(event) => {
                  if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
                  setDropping(null);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDropping(null);
                  void uploadImage(id, event.dataTransfer.files?.[0]);
                }}
              >
                {slot.image || uploading === id ? "" : <span>Drop image here</span>}
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
                <label className={`${btnGhost} ${uploading === id ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
                  {uploading === id ? "Uploading…" : slot.image ? "Replace" : "Choose image"}
                  <input accept="image/*" disabled={uploading === id} hidden onChange={(event) => void uploadImage(id, event.target.files?.[0])} type="file" />
                </label>
                {slot.image && uploading !== id && (
                  <button className={btnGhost} onClick={() => updateSlot(id, { image: "" })} type="button">Remove</button>
                )}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-[12.5px] font-semibold text-cms-text">
                  Text line 1 (on image)
                  <input className={inputShell} maxLength={60} placeholder={`${meta.label} from`} value={slot.line1} onChange={(event) => updateSlot(id, { line1: event.target.value })} />
                </label>
                <label className="block text-[12.5px] font-semibold text-cms-text">
                  Text line 2 (on image)
                  <input className={inputShell} maxLength={60} placeholder="LKR 8,500 / day" value={slot.line2} onChange={(event) => updateSlot(id, { line2: event.target.value })} />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <span className="mt-1.5 block text-[12px] text-[#d42a45] empty:hidden dark:text-[#ff9aa8]" role="alert">{uploadError}</span>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-auto text-[12.5px] text-cms-muted" aria-live="polite">{notice || (dirty ? "Unsaved changes" : "")}</span>
        <button className={btnPrimary} disabled={!loaded || saving || uploading !== null} onClick={() => void save()} type="button">
          {saving ? "Saving…" : "Save section"}
        </button>
      </div>
    </section>
  );
}
