"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Lightbox } from "@/components/ui/Lightbox";

const SLOTS = 5;

/** One large photo plus four tiles; missing photos show as placeholders. Opens a lightbox. */
export function PackageGallery({ images, title }: { images: string[]; title: string }) {
  const [viewing, setViewing] = useState<number | null>(null);
  const slots = Array.from({ length: SLOTS }, (_, i) => images[i]);

  return (
    <>
      <div className="relative grid h-[280px] grid-cols-2 grid-rows-[1fr_100px] gap-2 overflow-hidden rounded-2xl sm:h-[380px] lg:h-[440px] lg:grid-cols-[2fr_1fr_1fr] lg:grid-rows-2">
        {slots.map((src, i) => {
          const tile = `relative overflow-hidden bg-sand-200 ${
            i === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : i > 2 ? "max-lg:hidden" : ""
          }`;
          return src ? (
            <button
              key={i}
              type="button"
              onClick={() => setViewing(i)}
              aria-label={`View photo ${i + 1} of ${images.length}`}
              className={`${tile} group cursor-zoom-in`}
            >
              <Image
                src={src}
                alt={i === 0 ? title : ""}
                fill
                preload={i === 0}
                sizes={i === 0 ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 300px, 50vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ) : (
            <Placeholder key={i} label="PHOTO" icon="image" className={`${tile} rounded-none border-0`} />
          );
        })}
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => setViewing(0)}
            className="absolute right-3.5 bottom-3.5 flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-ink-900 shadow-lf-md hover:text-ocean-600"
          >
            <Icon name="photo_library" size={18} />
            All {images.length} photos
          </button>
        )}
      </div>

      {viewing !== null && (
        <Lightbox images={images} start={viewing} title={title} onClose={() => setViewing(null)} />
      )}
    </>
  );
}
