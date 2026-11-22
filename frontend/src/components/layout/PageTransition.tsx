"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades each new page in on navigation. Keyed by pathname, so it replays on every route change
 * (template.tsx only remounts when the top-level segment changes) but not on #hash jumps.
 * Opacity only: a transform here would break the fixed mobile bar and sticky tabs mid-animation.
 *
 * Also: a link to the page you're already on (About Us while on /about, the logo on the home page)
 * scrolls smoothly back to the top instead of doing nothing. Links with a #hash still jump to it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || !a.href || a.hasAttribute("download") || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      if (url.search !== location.search || url.hash) return;

      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Capture phase, so it runs before next/link, which then sees defaultPrevented and stays put.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div key={pathname} className="animate-page">
      {children}
    </div>
  );
}
