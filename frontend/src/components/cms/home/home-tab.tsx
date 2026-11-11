"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";

type HeroKind = "desktop" | "mobile";

interface HeroSlide {
  id: string;
  title: string;
  link: string;
  active: boolean;
  desktop: string;
  mobile: string;
}

interface HeroError {
  [key: string]: string;
}

const HERO_URL = `${process.env.NEXT_PUBLIC_API_URL}/hero`;
const HERO_MAX = 10;
// Sizes taken from the live website's hero assets (public/images/hero).
// Uploads are accepted when the aspect ratio is within RATIO_TOLERANCE of the
// spec and the image is at least 60% of the recommended size (object-cover
// handles the rest), so admins are not forced to crop to exact pixels.
const RATIO_TOLERANCE = 0.05;
const MIN_SIZE = 0.6;
const HERO_SPECS: Record<HeroKind, { width: number; height: number; label: string; ratio: string }> = {
  desktop: { width: 1800, height: 1061, label: "Desktop", ratio: "≈1.7:1" },
  mobile: { width: 1080, height: 1920, label: "Mobile", ratio: "9:16" },
};

const stats = [
  { label: "Travel Packages", value: 24, icon: "outbound", style: "text-cms-muted", trend: "+3", foot: "Outbound & Sri Lanka" },
  { label: "Projects", value: 12, icon: "projects", style: "text-[#8a7700] dark:text-cms-yellow", trend: "+1", foot: "Active this quarter" },
  { label: "Hotels", value: 38, icon: "hotels", style: "text-[#12a36a] dark:text-[#6ee7a8]", trend: "+5", foot: "Partner properties" },
  { label: "Gallery Images", value: 246, icon: "gallery", style: "text-[#d42a6a] dark:text-[#ff9aa8]", trend: "+18", foot: "Across all albums" },
];

const quickLinks = [
  { id: "outbound", title: "Outbound Travels", description: "International tour packages", icon: "outbound" },
  { id: "srilanka", title: "Travel Sri Lanka", description: "Local tours and experiences", icon: "srilanka" },
  { id: "hotels", title: "Hotel Bookings", description: "Hotel listings and rates", icon: "hotels" },
  { id: "gallery", title: "Gallery", description: "Photos and albums", icon: "gallery" },
];

const icons: Record<string, ReactNode> = {
  outbound: <><path d="M2 22h20" /><path d="M6.4 17.4 3 13l2-1 3 2 4-2.5L6 6l2.5-1 8 4 3.6-2a2 2 0 0 1 2 3.4L9 17.4z" /></>,
  projects: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  hotels: <><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" /></>,
  gallery: <><rect height="18" rx="2" width="18" x="3" y="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
  srilanka: <><path d="M12 3c2.5 0 5 2.6 5 7 0 5-2.7 11-5 11s-5-6-5-11c0-4.4 2.5-7 5-7z" /><circle cx="12" cy="10" r="2" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  up: <path d="m7 17 10-10M8 7h9v9" />,
  upload: <><path d="M12 15V3m0 0L8 7m4-4 4 4" /><path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" /></>,
};

const cardShell = "border border-cms-line rounded-[14px] bg-cms-card shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none";
const liftCard = "transition-[box-shadow,transform,border-color] duration-[250ms] hover:-translate-y-0.5 hover:border-[#dedcf0] hover:shadow-[0_8px_24px_rgba(19,8,122,.08)] dark:hover:border-[#4a4f8f] dark:hover:shadow-none";
const btnBase = "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[9px] px-[14px] text-[12.5px] font-semibold transition-[background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost = `${btnBase} border border-cms-line bg-cms-card text-cms-ink hover:not-disabled:border-[#cfcce8] hover:not-disabled:bg-cms-card2 dark:hover:not-disabled:border-[#4a4f8f]`;
const btnPrimary = `${btnBase} border border-transparent bg-cms-primary text-white hover:bg-[#150cb0] dark:hover:bg-[#7d74ff]`;
const cardGrid = "grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4";
const emptyShell = "mb-3 rounded-[14px] border border-dashed border-[#cfcce8] px-[10px] py-[26px] text-center text-cms-muted dark:border-[#2a2e63]";
const stackedMedia = "grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3 max-[760px]:grid-cols-1";
const inputShell =
  "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[14px] text-cms-ink outline-none placeholder:text-cms-muted focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";

function HomeIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      {icons[name]}
    </svg>
  );
}

function makeSlideId() {
  return `hs${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read converted image."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

// Real client-side WebP conversion: draw the image onto a canvas (downscaled
// to the recommended width when oversized) and let the browser encode WebP.
function encodeWebp(image: HTMLImageElement, targetWidth: number): Promise<Blob | null> {
  const scale = image.naturalWidth > targetWidth ? targetWidth / image.naturalWidth : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  try {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return Promise.resolve(null);
      ctx.drawImage(image, 0, 0, width, height);
      return canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);
    ctx.drawImage(image, 0, 0, width, height);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  } catch {
    return Promise.resolve(null);
  }
}

// Any decodable image (JPG/PNG/WebP/…) is accepted: ratio + size are checked
// on the original, then the browser re-encodes it as real WebP (downscaling
// oversized files to the recommended width) before it is stored.
function readHeroFile(file: File, kind: HeroKind): Promise<{ src?: string; error?: string }> {
  const spec = HERO_SPECS[kind];
  const sourceIsWebp = file.type === "image/webp" || /\.webp$/i.test(file.name);

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve({ error: "Could not read the file." });
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        resolve({ error: "Could not read the file." });
        return;
      }
      const original = reader.result;
      const image = new Image();
      image.onerror = () => resolve({ error: "This file is not a valid image." });
      image.onload = () => {
        const actualRatio = image.naturalWidth / image.naturalHeight;
        const specRatio = spec.width / spec.height;
        const ratioOk = Math.abs(actualRatio - specRatio) / specRatio <= RATIO_TOLERANCE;
        const sizeOk = image.naturalWidth >= spec.width * MIN_SIZE && image.naturalHeight >= spec.height * MIN_SIZE;
        if (!ratioOk || !sizeOk) {
          resolve({
            error: `Image is ${image.naturalWidth} × ${image.naturalHeight} px (ratio ${actualRatio.toFixed(2)}:1). ` +
              `${spec.label} banners need ratio ${spec.ratio} (±5%) and at least ${Math.round(spec.width * MIN_SIZE)} × ${Math.round(spec.height * MIN_SIZE)} px — ` +
              `recommended ${spec.width} × ${spec.height} px.`,
          });
          return;
        }
        const oversized = image.naturalWidth > spec.width;
        if (sourceIsWebp && !oversized) {
          resolve({ src: original });
          return;
        }
        encodeWebp(image, spec.width)
          .then(async (blob) => {
            if (blob && blob.type === "image/webp") {
              resolve({ src: await blobToDataUrl(blob) });
              return;
            }
            // Encoder unavailable (e.g. Safari): an already-WebP file can pass through as-is.
            if (sourceIsWebp) {
              resolve({ src: original });
              return;
            }
            resolve({
              error: "This browser cannot convert images to WebP — upload an already-WebP file, or open the CMS in Chrome, Edge or Firefox.",
            });
          })
          .catch(() => {
            if (sourceIsWebp) {
              resolve({ src: original });
              return;
            }
            resolve({
              error: "This browser cannot convert images to WebP — upload an already-WebP file, or open the CMS in Chrome, Edge or Firefox.",
            });
          });
      };
      image.src = original;
    };
    reader.readAsDataURL(file);
  });
}

export default function HomeTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [errors, setErrors] = useState<HeroError>({});
  const [dropping, setDropping] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    let cancelled = false;
    fetch(HERO_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { slides?: HeroSlide[] }) => {
        if (cancelled || !Array.isArray(data.slides)) return;
        setSlides(data.slides);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setNotice("Could not load slides from the server — start the backend and reload.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateSlide(id: string, field: keyof HeroSlide, value: string | boolean) {
    setSlides((current) => current.map((slide) => slide.id === id ? { ...slide, [field]: value } : slide));
    setDirty(true);
  }

  function addSlide() {
    if (slides.length >= HERO_MAX) return;
    setSlides((current) => [...current, {
      id: makeSlideId(),
      title: "",
      link: "",
      active: true,
      desktop: "",
      mobile: "",
    }]);
    setDirty(true);
  }

  function moveSlide(index: number, offset: -1 | 1) {
    const target = index + offset;
    if (target < 0 || target >= slides.length) return;
    setSlides((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  }

  function deleteSlide(id: string) {
    if (!window.confirm("Delete this slot and its images?")) return;
    setSlides((current) => current.filter((slide) => slide.id !== id));
    setErrors((current) => {
      const next = { ...current };
      delete next[`${id}:desktop`];
      delete next[`${id}:mobile`];
      return next;
    });
    setDirty(true);
  }

  async function uploadImage(id: string, kind: HeroKind, file?: File) {
    if (!file) return;
    const key = `${id}:${kind}`;
    const result = await readHeroFile(file, kind);
    if (result.error) {
      setErrors((current) => ({ ...current, [key]: result.error ?? "" }));
      return;
    }
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    updateSlide(id, kind, result.src ?? "");
  }

  function removeImage(id: string, kind: HeroKind) {
    setErrors((current) => {
      const next = { ...current };
      delete next[`${id}:${kind}`];
      return next;
    });
    updateSlide(id, kind, "");
  }

  async function saveSlides() {
    const incomplete = slides.findIndex((slide) => slide.active && (!slide.desktop || !slide.mobile));
    if (incomplete >= 0) {
      setNotice(`Slot ${incomplete + 1} needs both desktop and mobile images (or hide it).`);
      return;
    }
    if (!loaded) {
      setNotice("Slides were not loaded from the server — nothing was saved.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(HERO_URL, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });
      if (!res.ok) {
        const body: { message?: string } | null = await res.json().catch(() => null);
        setNotice(
          res.status === 401
            ? "Your session expired — sign in again."
            : body?.message ?? "Could not save the hero slider.",
        );
        return;
      }
      const body: { slides?: HeroSlide[] } = await res.json();
      if (Array.isArray(body.slides)) setSlides(body.slides);
      setDirty(false);
      setNotice("Hero slider saved");
    } catch {
      setNotice("Could not reach the server — nothing was saved.");
    } finally {
      setSaving(false);
    }
  }

  const date = now?.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }) ?? "";
  const hour = now?.getHours() ?? 0;
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="w-full animate-[cms-home-fade_0.35s_cubic-bezier(.2,.7,.2,1)]">
      <section className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold leading-[1.25] tracking-[-0.4px] text-cms-ink max-[480px]:text-[22px]">{greeting}, Admin !</h1>
          <p className="mt-1 text-[14.5px] text-cms-muted">Welcome to your travel management workspace.</p>
          <Breadcrumbs items={[{ label: "Home" }]} className="mt-3" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-[10px] border border-cms-line bg-[#f5f5f7] px-[14px] py-2 text-[13px] font-medium text-cms-muted max-[480px]:text-[12px] dark:bg-[#101435]">
          <CalendarIcon />
          {date}
        </span>
      </section>

      <section aria-label="Overview" className={cardGrid}>
        {stats.map((stat) => (
          <article className={`p-5 ${cardShell} ${liftCard}`} key={stat.label}>
            <div className="flex items-start justify-between">
              <span className={`grid size-[42px] place-items-center rounded-[12px] bg-cms-card2 ${stat.style}`}><HomeIcon name={stat.icon} /></span>
              <span className="inline-flex items-center gap-1 rounded-full bg-cms-card2 px-2 py-[3px] text-[11.5px] font-semibold text-[#12a36a] dark:text-[#6ee7a8]"><HomeIcon name="up" size={12} />{stat.trend}</span>
            </div>
            <div className="mt-4 text-[13px] font-medium text-cms-muted">{stat.label}</div>
            <div className="mt-[2px] text-[30px] font-bold leading-[1.15] tracking-[-0.8px] text-cms-ink">{stat.value}</div>
            <div className="mt-2 text-[12px] text-cms-muted">{stat.foot}</div>
          </article>
        ))}
      </section>

      <div className="mt-9 mb-3 flex items-baseline justify-between max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-[3px]">
        <h2 className="text-[16px] font-semibold text-cms-ink">Quick Access</h2>
        <span className="text-[12.5px] text-cms-muted">Jump straight into a section</span>
      </div>
      <section className={cardGrid}>
        {quickLinks.map((item) => (
          <button suppressHydrationWarning className={`group flex items-start gap-3 p-4 text-left ${cardShell} ${liftCard}`} key={item.id} onClick={() => onNavigate(item.id)} type="button">
            <span className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-cms-yellow text-cms-navy transition-colors duration-[250ms] group-hover:bg-cms-primary group-hover:text-white"><HomeIcon name={item.icon} size={18} /></span>
            <span className="min-w-0 flex-1">
              <b className="block text-[14px] font-semibold leading-[1.4] text-cms-ink">{item.title}</b>
              <p className="mt-1 text-[12px] leading-[1.5] text-cms-muted">{item.description}</p>
            </span>
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full border border-cms-line bg-cms-card2 text-cms-muted transition-colors duration-[250ms] group-hover:border-cms-primary group-hover:bg-cms-primary group-hover:text-white dark:border-[#2a2e63] dark:bg-[#1f2353]">
              <HomeIcon name="up" size={14} />
            </span>
          </button>
        ))}
      </section>

      <section aria-label="Hero slider" className="mt-9 rounded-[14px] border border-cms-line bg-cms-card p-[22px] shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none max-[760px]:p-4">
        <div className="mb-4 flex justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-cms-ink">Hero Slider</h2>
            <p className="mt-[2px] max-w-[760px] text-[12.5px] leading-[1.5] text-cms-muted">Banners shown at the top of the website home page. Add as many slots as you need (up to {HERO_MAX}); each slot needs a desktop and a mobile image.</p>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-cms-line bg-cms-card2 px-3 py-[5px] text-[12.5px] text-cms-muted">Desktop: <b className="text-cms-ink">1800 × 1061 px</b> (≈1.7:1)</span>
          <span className="rounded-full border border-cms-line bg-cms-card2 px-3 py-[5px] text-[12.5px] text-cms-muted">Mobile: <b className="text-cms-ink">1080 × 1920 px</b> (9:16)</span>
          <span className="rounded-full border border-cms-line bg-cms-card2 px-3 py-[5px] text-[12.5px] text-cms-muted">Format: <b className="text-cms-ink">WebP</b> (auto-converted) · ratio ±5%</span>
        </div>
        {slides.length ? slides.map((slide, index) => (
          <article className="mb-3 rounded-[14px] border border-cms-line bg-cms-card p-4" key={slide.id}>
            <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
              <h3 className="mr-auto text-[14.5px] font-semibold">Slot {index + 1}</h3>
              <label className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold">
                <input className="accent-cms-primary" suppressHydrationWarning checked={slide.active} onChange={(event) => updateSlide(slide.id, "active", event.target.checked)} type="checkbox" /> Visible
              </label>
              <button suppressHydrationWarning className={btnGhost} disabled={index === 0} onClick={() => moveSlide(index, -1)} type="button" aria-label="Move slot up">↑</button>
              <button suppressHydrationWarning className={btnGhost} disabled={index === slides.length - 1} onClick={() => moveSlide(index, 1)} type="button" aria-label="Move slot down">↓</button>
              <button suppressHydrationWarning className={btnGhost} onClick={() => deleteSlide(slide.id)} type="button">Delete</button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
              <label className="block text-[12.5px] font-semibold text-cms-text">Banner title (alt text)<input className={inputShell} suppressHydrationWarning maxLength={120} placeholder="e.g. Summer in Maldives" type="text" value={slide.title} onChange={(event) => updateSlide(slide.id, "title", event.target.value)} /></label>
              <label className="block text-[12.5px] font-semibold text-cms-text">Link URL (optional)<input className={inputShell} suppressHydrationWarning maxLength={500} placeholder="/holidays/maldives" type="text" value={slide.link} onChange={(event) => updateSlide(slide.id, "link", event.target.value)} /></label>
            </div>
            <div className={stackedMedia}>
              {(["desktop", "mobile"] as const).map((kind) => {
                const spec = HERO_SPECS[kind];
                const dropKey = `${slide.id}:${kind}`;
                return (
                  <div className="rounded-[12px] border border-dashed border-[#cfcce8] bg-cms-card2 p-3 dark:border-[#2a2e63]" key={kind}>
                    <b className="text-[13px]">{spec.label} version</b>
                    <p className="mb-2.5 min-h-9 text-[12px] text-cms-muted">Aspect ratio <strong>{spec.ratio}</strong> (±5%) · Recommended <strong>{spec.width} × {spec.height} px</strong> · Output <strong>WebP</strong> (auto-converted)</p>
                    <div
                      className={`grid h-[230px] place-items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed bg-center bg-cover bg-no-repeat text-center text-[12.5px] font-medium transition-[border-color,background-color,box-shadow,color] duration-[180ms] ease-out ${dropping[dropKey] ? "border-cms-primary bg-[#f5f4ff] text-cms-primary shadow-[0_0_0_4px_rgba(27,15,216,.10)] dark:bg-[#232755] dark:shadow-[0_0_0_4px_rgba(106,96,255,.2)]" : "border-[#c4bfee] bg-white text-cms-muted dark:border-[#2a2e63] dark:bg-[#171a42]"}`}
                      style={slide[kind] ? { backgroundImage: `url("${slide[kind]}")` } : undefined}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "copy";
                        setDropping((current) => ({ ...current, [dropKey]: true }));
                      }}
                      onDragLeave={(event) => {
                        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
                        setDropping((current) => ({ ...current, [dropKey]: false }));
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setDropping((current) => ({ ...current, [dropKey]: false }));
                        void uploadImage(slide.id, kind, event.dataTransfer.files?.[0]);
                      }}
                      >{slide[kind] ? "" : (
                        <>
                          <HomeIcon name="upload" size={26} />
                          <span>Drop image here</span>
                        </>
                      )}</div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <label className={`${btnGhost} cursor-pointer`}>
                        {slide[kind] ? "Replace image" : "Upload image"}
                        <input suppressHydrationWarning accept="image/*" hidden onChange={(event) => void uploadImage(slide.id, kind, event.target.files?.[0])} type="file" />
                      </label>
                      {slide[kind] && <button suppressHydrationWarning className={btnGhost} onClick={() => removeImage(slide.id, kind)} type="button">Remove</button>}
                    </div>
                    <span className="mt-1.5 block text-[12px] text-[#d42a45] empty:hidden dark:text-[#ff9aa8]" role="alert">{errors[`${slide.id}:${kind}`] ?? ""}</span>
                  </div>
                );
              })}
            </div>
          </article>
        )) : loaded || notice ? (
          <div className={emptyShell}>No hero slots yet. Add your first slot to get started.</div>
        ) : (
          <div aria-hidden="true" className="mb-3 animate-pulse rounded-[14px] border border-cms-line bg-cms-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-4 w-24 rounded-md bg-cms-card2" />
              <div className="ml-auto h-[38px] w-32 rounded-[9px] bg-cms-card2" />
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
              <div className="h-10 rounded-[9px] bg-cms-card2" />
              <div className="h-10 rounded-[9px] bg-cms-card2" />
            </div>
            <div className={stackedMedia}>
              <div className="h-[230px] rounded-[10px] bg-cms-card2" />
              <div className="h-[230px] rounded-[10px] bg-cms-card2" />
            </div>
          </div>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="mr-auto text-[12.5px] text-cms-muted" aria-live="polite">{notice || (dirty ? "Unsaved changes" : "")}</span>
          <button suppressHydrationWarning className={btnGhost} disabled={slides.length >= HERO_MAX} onClick={addSlide} type="button">+ Add slot</button>
          <button suppressHydrationWarning className={btnPrimary} disabled={!loaded || saving} onClick={() => void saveSlides()} type="button">{saving ? "Saving…" : "Save hero slider"}</button>
        </div>
      </section>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="shrink-0 text-cms-muted" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <rect height="18" rx="2" stroke="currentColor" strokeWidth="2" width="18" x="3" y="4" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
