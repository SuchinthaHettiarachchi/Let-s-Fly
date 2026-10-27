"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Lightbox } from "@/components/ui/Lightbox";
import { galleryCategories, type GalleryCategory, type GalleryPhoto } from "@/data/gallery";

const PAGE_SIZE = 12;
// Alternating tile heights give the masonry rhythm.
const heights = ["h-[260px]", "h-[200px]", "h-[320px]", "h-[220px]"];

export function PhotoWall({ photos }: { photos: GalleryPhoto[] }) {
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [viewing, setViewing] = useState<number | null>(null);

  const filtered = category === "all" ? photos : photos.filter((p) => p.category === category);
  const shown = filtered.slice(0, limit);
  // The lightbox only steps through real photos.
  const withImages = filtered.filter((p): p is GalleryPhoto & { image: string } => Boolean(p.image));

  const chips = [{ id: "all" as const, label: "All" }, ...galleryCategories];

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
                className={`h-10 flex-none cursor-pointer rounded-full border-[1.5px] px-[18px] text-small font-medium transition-colors ${
                  on ? "border-ocean-600 bg-ocean-600 text-white" : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <span aria-live="polite" className="text-small text-ink-400">
          {filtered.length} photos
        </span>
      </div>

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-4">
        {shown.map((p, i) => {
          const tile = `relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-sand-200 ${heights[i % heights.length]}`;
          const caption = (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-caption text-ink-900">
              <Icon name="location_on" size={14} className="text-ocean-600" />
              {p.place}
            </span>
          );
          return (
            <li key={p.place} data-reveal={(i % 4) * 80} className="break-inside-avoid">
              {p.image ? (
                <button
                  type="button"
                  onClick={() => setViewing(withImages.findIndex((w) => w.place === p.place))}
                  aria-label={`View photo: ${p.place}`}
                  className={`${tile} group cursor-zoom-in`}
                >
                  <Image
                    src={p.image}
                    alt={p.place}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {caption}
                </button>
              ) : (
                <div className={tile}>
                  <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
                  {caption}
                </div>
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
          images={withImages.map((w) => w.image)}
          captions={withImages.map((w) => w.place)}
          start={viewing}
          title="Travellers Gallery"
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
