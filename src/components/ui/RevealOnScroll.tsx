"use client";

import { useEffect } from "react";

const DURATION_MS = 700;

/**
 * Fades and lifts every `[data-reveal]` element into place as it scrolls into view.
 * `data-reveal="160"` delays that element by 160ms, for staggering cards in a row.
 *
 * Only elements that start below the fold are hidden, so nothing visible on load flashes,
 * and without JavaScript (or with reduced motion) everything simply shows. Styles are set
 * inline and removed once the element lands, so its own hover transitions keep working.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          const delay = Number(el.dataset.reveal) || 0;
          el.style.transition = `opacity ${DURATION_MS}ms ease ${delay}ms, transform ${DURATION_MS}ms cubic-bezier(.2,.7,.2,1) ${delay}ms`;
          el.style.opacity = "1";
          el.style.transform = "none";
          timers.push(
            window.setTimeout(() => {
              el.style.removeProperty("transition");
              el.style.removeProperty("opacity");
              el.style.removeProperty("transform");
            }, delay + DURATION_MS + 50),
          );
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
