"use client";

import { useRef, useSyncExternalStore } from "react";

export type Tab = { id: string; label: string; content: React.ReactNode };

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

/**
 * Tabs whose selection lives in the URL hash (#itinerary), so a tab can be
 * linked to directly. All panels stay in the HTML; inactive ones are hidden.
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
      <div role="tablist" aria-label="Package details" className="no-scrollbar flex overflow-x-auto border-b border-sand-300">
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
              className={`-mb-px cursor-pointer border-b-2 px-4 py-3.5 text-[14.5px] font-medium whitespace-nowrap transition-colors ${
                on ? "border-ocean-600 text-ocean-600" : "border-transparent text-ink-600 hover:text-ocean-600"
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
          className="pt-7"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
