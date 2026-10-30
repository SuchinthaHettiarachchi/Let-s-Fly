"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const COLUMNS = 6;
const STAGGER = 60; // ms between columns
const SWEEP = 500; // ms for one column to grow or shrink
const TOTAL = SWEEP + STAGGER * (COLUMNS - 1);

type Phase = "idle" | "cover" | "covered" | "reveal";

/**
 * Page-to-page wipe: navy columns rise from the bottom one after another with the logo in the
 * middle, the route changes behind them, then they lift away from the top to show the new page.
 * Internal link clicks are caught in the capture phase, before next/link sees them; back/forward,
 * new tabs, hash jumps and reduced-motion visitors navigate as normal.
 */
export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const timers = useRef<number[]>([]);

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (phaseRef.current !== "idle") return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || !a.href || a.hasAttribute("download") || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page, e.g. #hash or ?query
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      go("cover");
      later(() => {
        go("covered");
        router.push(url.pathname + url.search + url.hash);
        // If the route never arrives (error, same page), don't leave the screen covered.
        later(() => phaseRef.current === "covered" && reveal(), 5000);
      }, TOTAL);
    }

    document.addEventListener("click", onClick, true);
    const pending = timers.current;
    return () => {
      document.removeEventListener("click", onClick, true);
      pending.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function reveal() {
    go("reveal");
    later(() => go("idle"), TOTAL + 50);
  }

  // New page is on screen behind the columns: give it a beat to paint, then lift them.
  useEffect(() => {
    if (phaseRef.current === "covered") later(reveal, 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const shown = phase === "cover" || phase === "covered";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[1000] flex ${phase === "idle" ? "pointer-events-none invisible" : ""}`}
    >
      {Array.from({ length: COLUMNS }, (_, i) => (
        <span
          key={i}
          className={`h-full flex-1 bg-navy-900 ${phase === "reveal" ? "origin-top" : "origin-bottom"} ${
            shown ? "scale-y-100" : "scale-y-0"
          } ${phase === "idle" ? "" : "transition-[scale] ease-[cubic-bezier(0.76,0,0.24,1)]"}`}
          // A hairline overlap hides sub-pixel gaps between columns.
          style={{
            marginRight: -1,
            ...(phase !== "idle" && { transitionDuration: `${SWEEP}ms`, transitionDelay: `${i * STAGGER}ms` }),
          }}
        />
      ))}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-300 ${
          shown ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ transitionDelay: phase === "cover" ? `${TOTAL - 250}ms` : "0ms" }}
      >
        <Image src="/images/logo.png" alt="" width={140} height={140} priority className="size-28 md:size-36" />
      </span>
    </div>
  );
}
