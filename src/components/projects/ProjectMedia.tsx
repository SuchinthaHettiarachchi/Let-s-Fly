"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { Lightbox } from "@/components/ui/Lightbox";

type Props = { images: string[]; total: number; title: string };

/** Large cover photo with a "View all photos" button. */
export function ProjectCover({ images, total, title }: Props) {
  const [open, setOpen] = useState(false);
  const cover = images[0];
  return (
    <>
      <div className="relative h-[260px] overflow-hidden rounded-2xl border-t-[6px] border-ocean-600 bg-sand-200 shadow-lf-lg sm:h-[380px] lg:h-[460px]">
        {cover ? (
          <Image src={cover} alt={title} fill preload sizes="(min-width: 1232px) 1200px, 100vw" className="object-cover" />
        ) : (
          <Placeholder label="COVER PHOTO" className="absolute inset-0 rounded-none border-0" />
        )}
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute right-4 bottom-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink-900 shadow-lf-md hover:text-ocean-600"
          >
            <Icon name="open_in_full" size={16} />
            View all {total} photos
          </button>
        )}
      </div>
      {open && <Lightbox images={images} start={0} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}

// Mosaic pattern for the gallery grid: wide, narrow / narrow, wide / three narrow, then repeat.
const spans = ["sm:col-span-2", "", "", "sm:col-span-2", "", "", ""];

/** Photo mosaic; slots without a photo yet show placeholders. */
export function ProjectGallery({ images, total, title }: Props) {
  const [viewing, setViewing] = useState<number | null>(null);
  const slots = Array.from({ length: Math.max(total, images.length) }, (_, i) => images[i]);
  return (
    <>
      <ul className="grid auto-rows-[200px] grid-cols-1 gap-3 sm:grid-cols-3 sm:auto-rows-[220px]">
        {slots.map((src, i) => (
          <li key={i} className={`relative overflow-hidden rounded-xl bg-sand-200 ${spans[i % spans.length]}`}>
            {src ? (
              <button
                type="button"
                onClick={() => setViewing(i)}
                aria-label={`View photo ${i + 1}`}
                className="group absolute inset-0 cursor-zoom-in"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ) : (
              <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
            )}
          </li>
        ))}
      </ul>
      {viewing !== null && <Lightbox images={images} start={viewing} title={title} onClose={() => setViewing(null)} />}
    </>
  );
}
