"use client";

import { useCallback, useRef } from "react";

/**
 * Prev/next controls for a horizontal scroll-snap track.
 * Moves by one card; "next" wraps to the start once the end is reached.
 */
export function useScroller<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const step = useCallback(() => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return first.offsetWidth + gap;
  }, []);

  const prev = useCallback(() => {
    ref.current?.scrollBy({ left: -step(), behavior: "smooth" });
  }, [step]);

  const next = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: step(), behavior: "smooth" });
  }, [step]);

  return { ref, prev, next };
}
