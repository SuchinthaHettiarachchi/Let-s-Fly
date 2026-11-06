"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1600;

/**
 * Renders a stat like "5,000+" and counts it up from 0 the first time it scrolls into view.
 * The server renders the final value, and the count runs on the DOM text, so there is no
 * layout jump and nothing changes for visitors who prefer reduced motion.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^([\d,]+)(.*)$/);
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Number(match[1].replace(/,/g, ""));
    const suffix = match[2];
    const format = (n: number) => `${n.toLocaleString("en-US")}${suffix}`;
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(Math.round(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        el.textContent = format(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
