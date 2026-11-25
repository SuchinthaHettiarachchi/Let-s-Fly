"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

type LightboxProps = {
  images: string[];
  start: number;
  title: string;
  /** Optional caption per image (same order as images). */
  captions?: string[];
  onClose: () => void;
};

/** How far (px) a swipe must travel before it changes photo. */
const SWIPE_PX = 60;

/**
 * Full-screen photo viewer. Photos sit side by side on a strip that follows the finger, so a swipe
 * left or right slides to the next or previous photo; arrow keys and the buttons do the same, and
 * Escape or the cross closes it.
 *
 * It renders into <body> so a parent with an entrance animation (any CSS transform) can't shrink it
 * to that parent's box.
 */
export function Lightbox({ images, start, title, captions, onClose }: LightboxProps) {
  const [index, setIndex] = useState(start);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const count = images.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);
  const touch = useRef<{ x: number; y: number; dx: number; horizontal: boolean | null } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.lightboxOpen = "true";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      delete document.body.dataset.lightboxOpen;
    };
  }, [go, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, horizontal: null };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = touch.current;
    if (!t) return;
    const dx = e.touches[0].clientX - t.x;
    const dy = e.touches[0].clientY - t.y;
    // Decide once per gesture whether it is a sideways swipe; vertical drags are ignored.
    if (t.horizontal === null && Math.abs(dx) + Math.abs(dy) > 8) t.horizontal = Math.abs(dx) > Math.abs(dy);
    if (!t.horizontal) return;
    t.dx = dx;
    // Resist past the first and last photo.
    const atEdge = (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
    setDragging(true);
    setDragX(atEdge ? dx * 0.3 : dx);
  };
  const onTouchEnd = () => {
    const t = touch.current;
    if (t?.horizontal) {
      if (t.dx < -SWIPE_PX && index < count - 1) setIndex(index + 1);
      if (t.dx > SWIPE_PX && index > 0) setIndex(index - 1);
    }
    touch.current = null;
    setDragging(false);
    setDragX(0);
  };

  const roundBtn =
    "flex size-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/50 bg-navy-900/40 text-white backdrop-blur-sm hover:bg-white hover:text-navy-900 transition-[background-color,color,scale] duration-200 press sm:size-12";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[100] flex animate-page flex-col bg-navy-900"
    >
      {/* Counter left, close right, floating over the photo. */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-linear-to-b from-navy-900/80 to-transparent p-4 pt-[max(1rem,env(safe-area-inset-top))] text-small text-white/85">
        <span className="tabular-nums">
          {index + 1} / {count}
          {captions?.[index] && <span className="ml-3 text-white">{captions[index]}</span>}
        </span>
        <button type="button" aria-label="Close" onClick={onClose} className={roundBtn}>
          <Icon name="close" />
        </button>
      </div>

      <div
        className="relative flex-1 touch-pan-y overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div
          className={`flex h-full ${dragging ? "" : "transition-transform duration-[400ms] ease-lf"}`}
          style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
        >
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-full w-full shrink-0" aria-hidden={i !== index}>
              <Image
                src={src}
                alt={`${title}, photo ${i + 1}`}
                fill
                sizes="100vw"
                loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                draggable={false}
                className="object-contain select-none"
              />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={roundBtn}>
            <Icon name="chevron_left" size={24} />
          </button>
          {count <= 12 && (
            <div aria-hidden="true" className="flex items-center gap-1.5">
              {images.map((src, i) => (
                <span
                  key={`${src}-dot-${i}`}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === index ? "w-5 bg-sun-400" : "w-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          )}
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={roundBtn}>
            <Icon name="chevron_right" size={24} />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
