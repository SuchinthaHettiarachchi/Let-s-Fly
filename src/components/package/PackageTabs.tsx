"use client";

import { useRef, useSyncExternalStore } from "react";

export type Tab = { id: string; label: string; content: React.ReactNode };

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

/**
 * Tabs whose selection lives in the URL hash (#itinerary), so a tab can be
 * linked to directly. All panels stay in the HTML; inactive ones are hidden, and
 * a panel rises in again each time it is shown.
 */
export function PackageTabs({ tabs }: { tabs: Tab[] }) {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => "",
  );
  const active = tabs.some((t) => t.id === hash) ? hash : tabs[0].id;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(id: string) {
    history.replaceState(null, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    tabRefs.current[tabs.findIndex((t) => t.id === id)]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + tabs.length) % tabs.length;
    select(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Package details" className="no-scrollbar sticky top-[88px] z-20 flex overflow-x-auto border-b border-sand-300 bg-white lg:top-[136px]">
        {tabs.map((t, i) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`-mb-px cursor-pointer rounded-t-lg border-b-[3px] px-4 py-3.5 text-[0.9375rem] whitespace-nowrap transition-[color,background-color,border-color] duration-200 ${
                on
                  ? "border-ocean-600 bg-sand-50 font-semibold text-ocean-600"
                  : "border-transparent font-medium text-ink-600 hover:border-sand-300 hover:bg-sand-50/60 hover:text-ocean-600"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          className="animate-rise pt-7 [animation-duration:500ms]"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
