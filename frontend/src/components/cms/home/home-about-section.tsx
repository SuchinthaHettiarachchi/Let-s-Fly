"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api-url";
import type { HomeAboutContent } from "@/lib/home-about-api";

const URL_API = apiUrl("/home-about");
const UPLOAD_API = apiUrl("/upload");
const VIDEO_API = apiUrl("/upload/video");

const inputShell =
  "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[14px] text-cms-ink outline-none placeholder:text-cms-muted focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const areaShell = `${inputShell} min-h-[92px] py-2.5 leading-[1.55] resize-y`;
const btnBase = "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[9px] px-[14px] text-[12.5px] font-semibold transition-[background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost = `${btnBase} border border-cms-line bg-cms-card text-cms-ink hover:not-disabled:border-[#e2e2ea] hover:not-disabled:bg-[#f5f5f7] dark:hover:not-disabled:border-[#4a4f8f] dark:hover:not-disabled:bg-[#101435]`;
const btnPrimary = `${btnBase} border border-transparent bg-cms-primary text-white hover:bg-[#150cb0] dark:hover:bg-[#7d74ff]`;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4", "video/webm"];

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

export default function HomeAboutSection() {
  const [content, setContent] = useState<HomeAboutContent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState<"video" | "videoPoster" | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [dropping, setDropping] = useState<"video" | "videoPoster" | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(URL_API)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { content?: HomeAboutContent }) => {
        if (!cancelled && data.content) {
          setContent(data.content);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotice("Could not load content — start the backend and reload.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof HomeAboutContent>(field: K, value: HomeAboutContent[K]) {
    setContent((current) => (current ? { ...current, [field]: value } : current));
    setDirty(true);
  }

  function setStat(index: number, field: "value" | "label", value: string) {
    setContent((current) => {
      if (!current) return current;
      const stats = current.stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat));
      return { ...current, stats };
    });
    setDirty(true);
  }

  function addStat() {
    setContent((current) => (current ? { ...current, stats: [...current.stats, { value: "", label: "" }] } : current));
    setDirty(true);
  }

  function removeStat(index: number) {
    setContent((current) => (current ? { ...current, stats: current.stats.filter((_, i) => i !== index) } : current));
    setDirty(true);
  }

  async function uploadPoster(file?: File | null) {
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
    setUploading("videoPoster");
    try {
      const prepared = await prepareImage(file);
      const res = await fetch(UPLOAD_API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: prepared, folder: "home-about" }),
      });
      const data: { url?: string; message?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
      update("videoPoster", data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function uploadVideo(file?: File | null) {
    if (!file) return;
    setUploadError("");
    if (!VIDEO_TYPES.includes(file.type)) {
      setUploadError("Choose an MP4 or WebM video file.");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setUploadError("Video must be 100MB or smaller.");
      return;
    }
    setUploading("video");
    try {
      const res = await fetch(VIDEO_API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data: { url?: string; message?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
      update("video", data.url);
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
    const heading = content.heading.trim();
    const paragraph = content.paragraph.trim();
    const stats = content.stats
      .map((stat) => ({ value: stat.value.trim(), label: stat.label.trim() }))
      .filter((stat) => stat.value || stat.label);
    if (!heading) {
      setNotice("Heading is required.");
      return;
    }
    if (!paragraph) {
      setNotice("Paragraph is required.");
      return;
    }
    if (!stats.length) {
      setNotice("Keep at least one stat.");
      return;
    }
    if (stats.some((stat) => !stat.value || !stat.label)) {
      setNotice("Every stat needs both a value and a label.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch(URL_API, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, heading, paragraph, stats }),
      });
      const data: { content?: HomeAboutContent; message?: string } | null = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice(
          res.status === 401
            ? "Your session expired — sign in again."
            : data?.message ?? "Could not save the home Who we are section.",
        );
        return;
      }
      if (data?.content) setContent(data.content);
      setDirty(false);
      setNotice("Home Who we are section saved");
    } catch {
      setNotice("Could not reach the server — nothing was saved.");
    } finally {
      setSaving(false);
    }
  }

  if (!content) {
    return (
      <section aria-label="Home who we are" className="mt-9 rounded-[14px] border border-cms-line bg-cms-card p-[22px] shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none max-[760px]:p-4">
        <h2 className="text-[16px] font-semibold text-cms-ink">Home — Who We Are</h2>
        <p className="mt-1 text-[12.5px] text-cms-muted" aria-live="polite">{notice || "Loading section content…"}</p>
        <div aria-hidden="true" className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-10 rounded-[9px] bg-[#f5f5f7] dark:bg-[#101435]" />
          <div className="h-10 rounded-[9px] bg-[#f5f5f7] dark:bg-[#101435]" />
          <div className="h-[92px] rounded-[9px] bg-[#f5f5f7] sm:col-span-2 dark:bg-[#101435]" />
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Home who we are" className="mt-9 rounded-[14px] border border-cms-line bg-cms-card p-[22px] shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none max-[760px]:p-4">
      <div className="mb-4 flex justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-cms-ink">Home — Who We Are</h2>
          <p className="mt-[2px] max-w-[760px] text-[12.5px] leading-[1.5] text-cms-muted">
            The “Who we are” section on the website home page — eyebrow, heading, paragraph, stat cards, brand video (autoplay) and the Google rating card.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-[12.5px] font-semibold text-cms-text">
          Eyebrow
          <input className={inputShell} maxLength={60} placeholder="Who we are" value={content.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} />
        </label>
        <label className="block text-[12.5px] font-semibold text-cms-text sm:col-span-2 lg:col-span-2">
          Heading
          <input className={inputShell} maxLength={160} placeholder="Your journey, our expertise…" value={content.heading} onChange={(event) => update("heading", event.target.value)} />
        </label>
      </div>

      <label className="mt-4 block text-[12.5px] font-semibold text-cms-text">
        Paragraph
        <textarea className={areaShell} maxLength={2000} placeholder="Section paragraph…" rows={3} value={content.paragraph} onChange={(event) => update("paragraph", event.target.value)} />
      </label>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12.5px] font-semibold text-cms-text">Stats (shown under the paragraph)</span>
          <button className={btnGhost} disabled={content.stats.length >= 6} onClick={addStat} type="button">+ Add stat</button>
        </div>
        <div className="mt-2 grid gap-3">
          {content.stats.map((stat, index) => (
            <div className="flex items-start gap-2" key={index}>
              <label className="block flex-1 text-[12.5px] font-semibold text-cms-text">
                Value
                <input className={inputShell} maxLength={20} placeholder="14+" value={stat.value} onChange={(event) => setStat(index, "value", event.target.value)} />
              </label>
              <label className="block flex-[2] text-[12.5px] font-semibold text-cms-text">
                Label
                <input className={inputShell} maxLength={80} placeholder="Years of service" value={stat.label} onChange={(event) => setStat(index, "label", event.target.value)} />
              </label>
              <button
                aria-label={`Remove stat ${index + 1}`}
                className={`${btnGhost} mt-1.5 shrink-0`}
                disabled={content.stats.length <= 1}
                onClick={() => removeStat(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-[12.5px] font-semibold text-cms-text">
          Google rating score
          <input className={inputShell} maxLength={10} placeholder="5.0" value={content.ratingScore} onChange={(event) => update("ratingScore", event.target.value)} />
        </label>
        <label className="block text-[12.5px] font-semibold text-cms-text">
          Google review count
          <input className={inputShell} maxLength={12} placeholder="25" value={content.ratingCount} onChange={(event) => update("ratingCount", event.target.value)} />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[12px] border border-dashed border-cms-line bg-[#f5f5f7] p-3 dark:border-[#2a2e63] dark:bg-[#101435]">
          <b className="text-[13px] text-cms-text">Video poster (16:9)</b>
          <p className="mt-0.5 text-[12px] text-cms-muted">Shown before the film plays. Optional.</p>
          <div
            className={`mt-2 grid h-[130px] place-items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed bg-center bg-cover bg-no-repeat text-center text-[12.5px] font-medium transition-[border-color,box-shadow] duration-[180ms] ease-out ${dropping === "videoPoster" ? "border-[#6f6e80] shadow-[0_0_0_4px_rgba(110,110,130,.16)] dark:border-[#8a8ab0]" : "border-cms-line bg-white text-cms-muted dark:border-[#2a2e63] dark:bg-[#171a42]"}`}
            style={content.videoPoster ? { backgroundImage: `url("${content.videoPoster}")` } : undefined}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
              setDropping("videoPoster");
            }}
            onDragLeave={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
              setDropping(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDropping(null);
              void uploadPoster(event.dataTransfer.files?.[0]);
            }}
          >{content.videoPoster || uploading === "videoPoster" ? "" : <span>Drop image here</span>}</div>
          <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
            <label className={`${btnGhost} ${uploading === "videoPoster" ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
              {uploading === "videoPoster" ? "Uploading…" : content.videoPoster ? "Replace" : "Choose image"}
              <input accept="image/*" disabled={uploading === "videoPoster"} hidden onChange={(event) => void uploadPoster(event.target.files?.[0])} type="file" />
            </label>
            {content.videoPoster && uploading !== "videoPoster" && (
              <button className={btnGhost} onClick={() => update("videoPoster", "")} type="button">Remove</button>
            )}
          </div>
        </div>

        <div className="rounded-[12px] border border-dashed border-cms-line bg-[#f5f5f7] p-3 dark:border-[#2a2e63] dark:bg-[#101435]">
          <b className="text-[13px] text-cms-text">Brand video — 16:9 · MP4 or WebM · up to 100MB</b>
          <p className="mt-0.5 text-[12px] text-cms-muted">Plays silently on a loop in the section.</p>
          <div
            className={`mt-2 grid h-[130px] place-items-center gap-1.5 overflow-hidden rounded-[10px] border-[1.5px] border-dashed text-center text-[12.5px] font-medium transition-[border-color,box-shadow] duration-[180ms] ease-out ${dropping === "video" ? "border-[#6f6e80] shadow-[0_0_0_4px_rgba(110,110,130,.16)] dark:border-[#8a8ab0]" : "border-cms-line bg-white text-cms-muted dark:border-[#2a2e63] dark:bg-[#171a42]"}`}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
              setDropping("video");
            }}
            onDragLeave={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
              setDropping(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDropping(null);
              void uploadVideo(event.dataTransfer.files?.[0]);
            }}
          >
            {content.video && uploading !== "video" ? (
              <video className="h-full w-full bg-navy-900" controls preload="metadata" src={content.video} />
            ) : uploading === "video" ? (
              <span>Uploading video…</span>
            ) : (
              <span>Drop an MP4 or WebM video here</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
            <label className={`${btnGhost} ${uploading === "video" ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
              {uploading === "video" ? "Uploading…" : content.video ? "Replace video" : "Choose video"}
              <input accept="video/mp4,video/webm" disabled={uploading === "video"} hidden onChange={(event) => void uploadVideo(event.target.files?.[0])} type="file" />
            </label>
            {content.video && uploading !== "video" && (
              <button className={btnGhost} onClick={() => update("video", "")} type="button">Remove</button>
            )}
          </div>
          <span className="mt-1.5 block truncate text-[11.5px] text-cms-muted" title={content.video}>{content.video || "No video yet"}</span>
        </div>
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
