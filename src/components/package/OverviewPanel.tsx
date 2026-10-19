import { Icon } from "@/components/ui/Icon";
import type { Package } from "@/data/packages";

export function OverviewPanel({ overview }: { overview: NonNullable<Package["overview"]> }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px] leading-[1.8] text-ink-600">{overview.summary}</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {overview.highlights.map((h) => (
          <li key={h.label} className="flex items-center gap-3 rounded-lg bg-sand-50 px-4 py-3.5 text-sm font-medium">
            <Icon name={h.icon} className="text-ocean-600" />
            {h.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
