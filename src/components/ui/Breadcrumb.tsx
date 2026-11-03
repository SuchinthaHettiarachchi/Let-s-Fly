import Link from "next/link";
import { Icon } from "./Icon";

export type Crumb = { label: string; href?: string };

// Vercel sets this to the custom domain once one is attached.
const siteUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "letsfly.lk"}`;

export function Breadcrumb({ items, onDark = false }: { items: Crumb[]; onDark?: boolean }) {
  const muted = onDark ? "text-white/90 hover:text-sun-400" : "text-ink-400 hover:text-ocean-600";
  const current = onDark ? "text-white" : "text-ink-900";
  // BreadcrumbList structured data so search engines can show the trail in results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: new URL(item.href, siteUrl).href }),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className={onDark ? "[text-shadow:0_1px_6px_rgba(11,37,69,.8)]" : ""}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-1 text-small">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !last ? (
                // Negative margins give a 44px tap area without moving anything.
                <Link href={item.href} className={`-mx-1 -my-3 px-1 py-3 ${muted}`}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`font-medium ${current}`}>
                  {item.label}
                </span>
              )}
              {!last && <Icon name="chevron_right" size={16} className={onDark ? "text-white/80" : "text-ink-400"} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
