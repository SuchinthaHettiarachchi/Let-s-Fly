import Link from "next/link";
import { Icon } from "./Icon";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, onDark = false }: { items: Crumb[]; onDark?: boolean }) {
  const muted = onDark ? "text-white/70 hover:text-white" : "text-ink-400 hover:text-ocean-600";
  const current = onDark ? "text-white" : "text-ink-900";
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-[13px]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link href={item.href} className={muted}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`font-medium ${current}`}>
                  {item.label}
                </span>
              )}
              {!last && <Icon name="chevron_right" size={16} className={onDark ? "text-white/50" : "text-ink-400"} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
