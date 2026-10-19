import { Icon } from "@/components/ui/Icon";
import type { InclusionItem, Package } from "@/data/packages";

export function InclusionsPanel({ inclusions }: { inclusions: NonNullable<Package["inclusions"]> }) {
  return (
    <div className="flex flex-col gap-9">
      <p className="text-[15px] leading-[1.8] text-ink-600">{inclusions.intro}</p>
      <InclusionList title="What's included" items={inclusions.included} included />
      <InclusionList title="Not included" items={inclusions.excluded} included={false} />
    </div>
  );
}

function InclusionList({ title, items, included }: { title: string; items: InclusionItem[]; included: boolean }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2.5 text-[15px] font-semibold">
          <span
            className={`flex size-6 items-center justify-center rounded-full ${
              included ? "bg-ocean-600 text-white" : "bg-sand-200 text-ink-600"
            }`}
          >
            <Icon name={included ? "check" : "close"} size={16} />
          </span>
          {title}
        </h3>
        <span className="rounded-full bg-sand-50 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600">
          {items.length} items
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3 rounded-lg bg-sand-50 px-4 py-3.5">
            <Icon
              name={included ? "check" : "close"}
              size={18}
              className={`mt-px ${included ? "text-ocean-600" : "text-ink-400"}`}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.title}</span>
              {item.note && <span className="text-[12.5px] leading-relaxed text-ink-400">{item.note}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
