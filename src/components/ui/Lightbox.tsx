"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "./Icon";

type LightboxProps = {
  images: string[];
  start: number;
  title: string;
  /** Optional caption per image (same order as images). */
  captions?: string[];
  onClose: () => void;
};

/** Full-screen photo viewer with arrow-key and Escape support. */
export function Lightbox({ images, start, title, captions, onClose }: LightboxProps) {
  const [index, setIndex] = useState(start);
  const count = images.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const roundBtn =
    "flex size-12 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/50 bg-navy-900/30 text-white hover:bg-white hover:text-navy-900";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-100 flex flex-col bg-navy-900/95"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-small text-white/80">
        <span>
          {index + 1} / {count}
          {captions?.[index] && <span className="ml-3 text-white">{captions[index]}</span>}
        </span>
        <button type="button" aria-label="Close" onClick={onClose} className={roundBtn}>
          <Icon name="close" />
        </button>
      </div>
      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <Image src={images[index]} alt={`${title}, photo ${index + 1}`} fill sizes="100vw" className="object-contain" />
      </div>
      {count > 1 && (
        <div className="flex justify-center gap-3 p-4" onClick={(e) => e.stopPropagation()}>
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={roundBtn}>
            <Icon name="chevron_left" size={24} />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={roundBtn}>
            <Icon name="chevron_right" size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
