"use client";

import "./home.css";
import { useEffect, useState, type ReactNode } from "react";

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
  { label: "Travel Packages", value: 24, icon: "outbound", style: "home-stat-blue", trend: "+3", foot: "Outbound & Sri Lanka" },
  { label: "Projects", value: 12, icon: "projects", style: "home-stat-purple", trend: "+1", foot: "Active this quarter" },
  { label: "Hotels", value: 38, icon: "hotels", style: "home-stat-green", trend: "+5", foot: "Partner properties" },
  { label: "Gallery Images", value: 246, icon: "gallery", style: "home-stat-orange", trend: "+18", foot: "Across all albums" },
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
    <div className="cms-home">
      <section className="home-hero card" aria-label="Hero slider">
        <div className="home-card-heading">
          <div>
            <h2>Hero Slider</h2>
            <p>Banners shown at the top of the website home page. Add as many slots as you need (up to {HERO_MAX}); each slot needs a desktop and a mobile image.</p>
          </div>
        </div>
        <div className="home-hero-spec">
          <span>Desktop: <b>1800 × 1061 px</b> (≈1.7:1)</span>
          <span>Mobile: <b>1080 × 1920 px</b> (9:16)</span>
          <span>Format: <b>WebP</b> (auto-converted) · ratio ±5%</span>
        </div>
        {slides.length ? slides.map((slide, index) => (
          <article className="home-hero-slot" key={slide.id}>
            <div className="home-slot-heading">
              <h3>Slot {index + 1}</h3>
              <label className="home-visible"><input suppressHydrationWarning checked={slide.active} onChange={(event) => updateSlide(slide.id, "active", event.target.checked)} type="checkbox" /> Visible</label>
              <button suppressHydrationWarning className="home-button home-button-ghost" disabled={index === 0} onClick={() => moveSlide(index, -1)} type="button" aria-label="Move slot up">↑</button>
              <button suppressHydrationWarning className="home-button home-button-ghost" disabled={index === slides.length - 1} onClick={() => moveSlide(index, 1)} type="button" aria-label="Move slot down">↓</button>
              <button suppressHydrationWarning className="home-button home-button-ghost" onClick={() => deleteSlide(slide.id)} type="button">Delete</button>
            </div>
            <div className="home-hero-fields">
              <label>Banner title (alt text)<input suppressHydrationWarning maxLength={120} placeholder="e.g. Summer in Maldives" type="text" value={slide.title} onChange={(event) => updateSlide(slide.id, "title", event.target.value)} /></label>
              <label>Link URL (optional)<input suppressHydrationWarning maxLength={500} placeholder="/holidays/maldives" type="text" value={slide.link} onChange={(event) => updateSlide(slide.id, "link", event.target.value)} /></label>
            </div>
            <div className="home-hero-images">
              {(["desktop", "mobile"] as const).map((kind) => {
                const spec = HERO_SPECS[kind];
                const dropKey = `${slide.id}:${kind}`;
                return (
                  <div className="home-upload" key={kind}>
                    <b>{spec.label} version</b>
                    <p>Aspect ratio <strong>{spec.ratio}</strong> (±5%) · Recommended <strong>{spec.width} × {spec.height} px</strong> · Output <strong>WebP</strong> (auto-converted)</p>
                    <div
                      className={`home-image-preview home-image-${kind}${dropping[dropKey] ? " is-dragging" : ""}`}
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
                    <div className="home-upload-actions">
                      <label className="home-button home-button-ghost">
                        {slide[kind] ? "Replace image" : "Upload image"}
                        <input suppressHydrationWarning accept="image/*" hidden onChange={(event) => void uploadImage(slide.id, kind, event.target.files?.[0])} type="file" />
                      </label>
                      {slide[kind] && <button suppressHydrationWarning className="home-button home-button-ghost" onClick={() => removeImage(slide.id, kind)} type="button">Remove</button>}
                    </div>
                    <span className="home-error" role="alert">{errors[`${slide.id}:${kind}`] ?? ""}</span>
                  </div>
                );
              })}
            </div>
          </article>
        )) : <div className="home-hero-empty">No hero slots yet. Add your first slot to get started.</div>}
        <div className="home-hero-footer">
          <button suppressHydrationWarning className="home-button home-button-ghost" disabled={slides.length >= HERO_MAX} onClick={addSlide} type="button">+ Add slot</button>
          <button suppressHydrationWarning className="home-button home-button-primary" disabled={!loaded || saving} onClick={() => void saveSlides()} type="button">{saving ? "Saving…" : "Save hero slider"}</button>
          <span className="home-hint" aria-live="polite">{notice || (dirty ? "Unsaved changes" : "")}</span>
        </div>
      </section>

      <section className="home-welcome">
        <div>
          <h1>{greeting}, Admin !</h1>
          <p>Welcome to your travel management workspace.</p>
        </div>
        <span className="home-date"><CalendarIcon />{date}</span>
      </section>

      <section className="home-stats" aria-label="Overview">
        {stats.map((stat) => (
          <article className="home-stat card" key={stat.label}>
            <div className="home-stat-top"><span className={`home-stat-icon ${stat.style}`}><HomeIcon name={stat.icon} /></span><span className="home-trend"><HomeIcon name="up" size={12} />{stat.trend}</span></div>
            <div className="home-stat-label">{stat.label}</div>
            <div className="home-stat-value">{stat.value}</div>
            <div className="home-stat-foot">{stat.foot}</div>
          </article>
        ))}
      </section>

      <div className="home-section-heading"><h2>Quick Access</h2><span>Jump straight into a section</span></div>
      <section className="home-quick">
        {quickLinks.map((item) => (
          <button suppressHydrationWarning className="home-quick-card card" key={item.id} onClick={() => onNavigate(item.id)} type="button">
            <span className="home-quick-icon"><HomeIcon name={item.icon} /></span>
            <b>{item.title}</b>
            <p>{item.description}</p>
            <span className="home-quick-go">Open <HomeIcon name="arrow" size={14} /></span>
          </button>
        ))}
      </section>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <rect height="18" rx="2" stroke="currentColor" strokeWidth="2" width="18" x="3" y="4" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
