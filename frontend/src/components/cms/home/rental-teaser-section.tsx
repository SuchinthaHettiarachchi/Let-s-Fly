"use client";

import { useEffect, useState } from "react";
import { cmsButtonClasses } from "@/components/cms/CmsButton";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { apiUrl } from "@/lib/api-url";
import { uploadMediaFile } from "@/lib/cms-upload";
import {
  defaultRentalTeaser,
  rentalSlotIds,
  rentalSlotMeta,
  type RentalSlot,
  type RentalSlotId,
  type RentalTeaserContent,
} from "@/lib/rental-teaser-api";

const URL_API = apiUrl("/rental-teaser");
const inputShell =
  "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[14px] font-normal text-cms-ink outline-none placeholder:text-cms-muted focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";

const btnPrimary = cmsButtonClasses("primary");

export default function RentalTeaserSection() {
  const [content, setContent] = useState<RentalTeaserContent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState<RentalSlotId | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

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
    setUploading(id);
    setUploadProgress(0);
    try {
      const url = await uploadMediaFile(file, { folder: "rentals", kind: "image", onProgress: setUploadProgress });
      updateSlot(id, { image: url });
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
        <p className="mt-1.5 text-[12.5px] text-cms-muted" aria-live="polite">{notice || "Loading section content."}</p>
      </section>
    );
  }

  return (
    <section aria-label="Car and bike rental" className="mt-9 rounded-[14px] border border-cms-line bg-cms-card p-[22px] shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none max-[760px]:p-4">
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold text-cms-ink">Car &amp; bike rental</h2>
        <p className="mt-1.5 max-w-[760px] text-[12.5px] leading-[1.5] text-cms-muted">
          Homepage teaser - four category slots. Each slot: one image plus the two text lines that overlap the photo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
        {rentalSlotIds.map((id, index) => {
          const meta = rentalSlotMeta[id];
          const slot = content.slots.find((item) => item.id === id);
          if (!slot) return null;
          const card = (
            <div className="rounded-[12px] border border-dashed border-cms-line bg-[#f5f5f7] p-3 dark:border-[#2a2e63] dark:bg-[#101435]" key={id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-[13px] text-cms-text">{meta.label}</b>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-cms-muted dark:bg-[#171a42]">
                  {meta.aspect} · {meta.format}
                </span>
              </div>

              <ImageUpload
                accept="image/*"
                className="mt-2"
                height="h-[300px]"
                onFile={(file) => void uploadImage(id, file)}
                onRemove={() => updateSlot(id, { image: "" })}
                uploading={uploading === id}
                progress={uploading === id ? uploadProgress : undefined}
                value={slot.image}
              />

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
          if (index === 0) {
            return [card, <div key="rental-sep" aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block lg:row-span-2" />];
          }
          return card;
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
