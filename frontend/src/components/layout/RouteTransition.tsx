"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const COLUMNS = 6;
const STAGGER = 60; // ms between columns
const SWEEP = 500; // ms for one column to grow or shrink
const TOTAL = SWEEP + STAGGER * (COLUMNS - 1);
const LOAD_MIN = 1600; // ms the loading counter takes at least, so it never just flashes

// "lift" is the reveal after the first-load counter; "reveal" is the one between pages.
type Phase = "loading" | "lift" | "idle" | "cover" | "covered" | "reveal";

/**
 * The navy column wipe, used twice:
 * - On first load it starts fully covering the page (server-rendered, so nothing flashes) with a
 *   0–100% counter. Once the page has loaded the columns lift away. While `data-loading` is on
 *   <html> the page's own entrance animations wait, so they play as it's revealed.
 * - Between pages: columns rise from the bottom one after another with the logo in the middle,
 *   the route changes behind them, then they lift away from the top. Internal link clicks are
 *   caught in the capture phase, before next/link sees them; back/forward, new tabs, hash jumps
 *   and reduced-motion visitors navigate as normal.
 */
export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("loading");
  const phaseRef = useRef<Phase>("loading");
  const timers = useRef<number[]>([]);

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  function reveal(next: "reveal" | "lift" = "reveal") {
    go(next);
    later(() => go("idle"), TOTAL + 50);
  }

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

  // New page is on screen behind the columns: give it a beat to paint, then lift them.
  useEffect(() => {
    if (phaseRef.current === "covered") later(() => reveal(), 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // First load: no scrolling under the loader; release the page's animations as it lifts.
  useEffect(() => {
    if (phase === "loading") {
      document.documentElement.style.overflow = "hidden";
    } else if (phase === "lift" || phase === "idle") {
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-loading");
    }
  }, [phase]);

  const shown = phase === "loading" || phase === "cover" || phase === "covered";

  return (
    <div
      aria-hidden="true"
      data-route-transition
      className={`fixed inset-0 z-[1000] flex ${phase === "idle" ? "pointer-events-none invisible" : ""}`}
    >
      {Array.from({ length: COLUMNS }, (_, i) => (
        <span
          key={i}
          className={`h-full flex-1 bg-navy-900 ${phase === "reveal" || phase === "lift" ? "origin-top" : "origin-bottom"} ${
            shown ? "scale-y-100" : "scale-y-0"
          } ${phase === "idle" || phase === "loading" ? "" : "transition-[scale] ease-[cubic-bezier(0.76,0,0.24,1)]"}`}
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
      {(phase === "loading" || phase === "lift") && (
        <LoadCounter fading={phase === "lift"} onDone={() => phaseRef.current === "loading" && reveal("lift")} />
      )}
    </div>
  );
}

/**
 * Counts 0 → 100 over at least LOAD_MIN, holding at 90 until the window has loaded, then calls
 * onDone. Bottom-left on every screen size, with a thin yellow bar across the bottom.
 */
function LoadCounter({ fading, onDone }: { fading: boolean; onDone: () => void }) {
  const [value, setValue] = useState(0);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    // Slow networks: don't hold the visitor on the loader forever.
    const cap = window.setTimeout(onLoad, 6000);

    const start = performance.now();
    let shown = 0;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / LOAD_MIN, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const target = Math.round(eased * (loaded ? 100 : 90));
      // Never count backwards, and catch up quickly once loading finishes late.
      shown = Math.max(shown, loaded && t === 1 ? Math.min(100, shown + 4) : target);
      setValue(shown);
      if (shown >= 100) {
        window.setTimeout(() => done.current(), 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <span
      className={`absolute inset-x-0 bottom-0 flex flex-col gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-white transition-opacity duration-300 sm:px-8 sm:pb-10 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="flex items-start font-display leading-none font-semibold tabular-nums">
        <span className="text-[64px] tracking-tight sm:text-[96px] lg:text-[128px]">{String(value).padStart(2, "0")}</span>
        <span className="mt-2 text-2xl text-sun-400 sm:mt-3 sm:text-3xl">%</span>
      </span>
      <span className="h-[3px] w-full overflow-hidden rounded-full bg-white/15">
        <span
          className="block h-full origin-left rounded-full bg-sun-400"
          style={{ transform: `scaleX(${value / 100})` }}
        />
      </span>
    </span>
  );
}
