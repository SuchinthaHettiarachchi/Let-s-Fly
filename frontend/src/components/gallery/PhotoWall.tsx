"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Lightbox } from "@/components/ui/Lightbox";
import type { GalleryCategory, GalleryItem } from "@/lib/gallery-api";

const PAGE_SIZE = 12;
// Alternating tile heights give the masonry rhythm.
const heights = ["h-[180px] sm:h-[260px]", "h-[140px] sm:h-[200px]", "h-[220px] sm:h-[320px]", "h-[160px] sm:h-[220px]"];

export function PhotoWall({ items, categories }: { items: GalleryItem[]; categories: GalleryCategory[] }) {
  const [category, setCategory] = useState<string>("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [viewing, setViewing] = useState<number | null>(null);

  const filtered = category === "all" ? items : items.filter((p) => p.category === category);
  const shown = filtered.slice(0, limit);
  // The lightbox only steps through photos; videos play in place.
  const withImages = filtered.filter((p) => p.mediaType === "image" && Boolean(p.media));

  const chips = [{ id: "all", label: "All" }, ...categories.map((c) => ({ id: c._id, label: c.name }))];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter photos" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {chips.map((c) => {
            const on = c.id === category;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setCategory(c.id);
                  setLimit(PAGE_SIZE);
                }}
                className={`h-11 flex-none sm:h-10 cursor-pointer rounded-full border-[1.5px] px-[18px] text-small font-medium transition-[color,background-color,border-color,scale] duration-200 press ${
                  on ? "border-ocean-600 bg-ocean-600 text-white" : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <span aria-live="polite" className="text-small text-ink-400">
          {filtered.length} photos &amp; videos
        </span>
      </div>

      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-4">
        {shown.map((p, i) => {
          const tile = `relative mb-3 block w-full sm:mb-4 break-inside-avoid overflow-hidden rounded-xl ${heights[i % heights.length]}`;
          const caption = (
            <span className="absolute bottom-2 left-2 z-10 flex max-w-[calc(100%-1rem)] items-center gap-1 truncate sm:bottom-3 sm:left-3 rounded-full bg-white/95 px-2.5 py-1 text-caption text-ink-900">
              <Icon name="location_on" size={14} className="text-ocean-600" />
              {p.caption}
            </span>
          );
          return (
            <li key={p._id} data-reveal={(i % 4) * 80} className="break-inside-avoid">
              {p.mediaType === "video" ? (
                <div className={`${tile} bg-black`}>
                  <video
                    className="absolute inset-0 h-full w-full bg-black object-contain"
                    autoPlay
                    controls
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src={p.media}
                  />
                  {caption}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewing(withImages.findIndex((w) => w._id === p._id))}
                  aria-label={`View photo: ${p.caption}`}
                  className={`${tile} bg-sand-200 group cursor-zoom-in`}
                >
                  <Image
                    src={p.media}
                    alt={p.caption}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {caption}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {filtered.length > limit && (
        <div className="flex justify-center">
          <Button variant="outline" size="lg" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
            Show More
          </Button>
        </div>
      )}

      {viewing !== null && viewing >= 0 && (
        <Lightbox
          images={withImages.map((w) => w.media)}
          captions={withImages.map((w) => w.caption)}
          start={viewing}
          title="Travellers Gallery"
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
