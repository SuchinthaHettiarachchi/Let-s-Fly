"use client";

import { useMemo, useState } from "react";
import { PackageCard } from "@/components/package/PackageCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { sriLankaThemes, type Package, type SriLankaTheme } from "@/data/packages";

const PAGE_SIZE = 6;

const sorts = {
  popular: { label: "Popular", fn: () => 0 },
  "price-asc": { label: "Price: low to high", fn: (a: Package, b: Package) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a: Package, b: Package) => b.price - a.price },
  duration: { label: "Shortest first", fn: (a: Package, b: Package) => a.days - b.days },
} as const;
type SortKey = keyof typeof sorts;

/** Sri Lanka tours with theme chips, sort and "Show more". */
export function TourGrid({ tours }: { tours: Package[] }) {
  const [theme, setTheme] = useState<SriLankaTheme | "all">("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const visible = useMemo(() => {
    const filtered = theme === "all" ? tours : tours.filter((t) => t.themes?.includes(theme));
    // Array order is the "popular" order; sort is stable so ties keep it.
    return [...filtered].sort(sorts[sort].fn);
  }, [tours, theme, sort]);

  const chips: { id: SriLankaTheme | "all"; label: string }[] = [{ id: "all", label: "All" }, ...sriLankaThemes];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-xl bg-sand-50 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by theme" className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 lg:mx-0 lg:px-0">
          {chips.map((c) => {
            const on = c.id === theme;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setTheme(c.id);
                  setLimit(PAGE_SIZE);
                }}
                className={`h-11 flex-none sm:h-10 cursor-pointer rounded-full border-[1.5px] px-[18px] text-small font-medium transition-[color,background-color,border-color,scale] duration-200 press ${
                  on ? "border-ocean-600 bg-ocean-600 text-white" : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-4 px-1 lg:justify-end">
          <span aria-live="polite" className="text-small text-ink-400">
            {visible.length} {visible.length === 1 ? "tour" : "tours"}
          </span>
          <label className="relative flex items-center">
            <span className="sr-only">Sort tours</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 cursor-pointer appearance-none rounded-lg sm:h-10 border border-sand-300 bg-white pr-9 pl-3.5 font-medium text-ink-900 focus:border-ocean-600 focus:outline-none"
            >
              {Object.entries(sorts).map(([key, s]) => (
                <option key={key} value={key}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
            <Icon name="expand_more" size={18} className="pointer-events-none absolute right-2.5 text-ink-400" />
          </label>
        </div>
      </div>

      {visible.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.slice(0, limit).map((t, i) => (
            <div key={t.slug} data-reveal={(i % 3) * 90}>
              <PackageCard pkg={t} />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-ink-600">No tours match this filter yet. Ask us and we&apos;ll build one.</p>
      )}

      {visible.length > limit && (
        <div className="flex justify-center">
          <Button variant="outline" size="lg" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
            Show more
          </Button>
        </div>
      )}
    </div>
  );
}
