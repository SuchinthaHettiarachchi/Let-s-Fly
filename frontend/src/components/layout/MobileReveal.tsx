"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const DURATION_MS = 650;

/** What fades in on phones and tablets: section headings, cards in grids, and the footer blocks. */
const TARGETS = "main section h2, main section .grid > *, footer .grid > *";

/**
 * Phones and tablets only (under 1024px): fades and lifts headings and cards into place as they
 * scroll into view, on every page, without each page having to tag elements with `data-reveal`.
 *
 * Skips anything already handled by RevealOnScroll (`data-reveal`) and anything nested inside another
 * target, and only hides elements that start below the fold, so nothing visible on load flashes.
 * Styles are inline and removed once the element lands. Off with reduced motion and in the CMS.
 */
export function MobileReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/cms") || pathname.startsWith("/login")) return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers: number[] = [];
    const touched = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          // Cards side by side in a grid land one after the other.
          const delay = el.parentElement?.classList.contains("grid")
            ? ([...el.parentElement.children].indexOf(el) % 2) * 90
            : 0;
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
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );

    // Wait a frame so the new page's content is in the DOM after a route change.
    const frame = requestAnimationFrame(() => {
      const found = [...document.querySelectorAll<HTMLElement>(TARGETS)];
      const set = new Set(found);
      for (const el of found) {
        if (el.closest("[data-reveal]") || el.closest("[role=dialog]")) continue;
        // Let the outermost target animate; nested ones ride along with it.
        let parent = el.parentElement;
        let nested = false;
        while (parent && !nested) {
          nested = set.has(parent);
          parent = parent.parentElement;
        }
        if (nested) continue;
        if (el.getBoundingClientRect().top < window.innerHeight) continue;
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        touched.add(el);
        observer.observe(el);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      timers.forEach(clearTimeout);
      // The footer stays across pages: never leave anything hidden or half-animated behind.
      for (const el of touched) {
        el.style.removeProperty("transition");
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      }
    };
  }, [pathname]);

  return null;
}
