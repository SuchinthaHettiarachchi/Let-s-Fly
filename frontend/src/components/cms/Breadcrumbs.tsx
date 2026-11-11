import type { ReactNode } from "react";

export type Crumb = { label: string; href?: string; id?: string };

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0 text-cms-muted opacity-60"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function HomeGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

/**
 * Modern CMS breadcrumb trail. Colors come from the cms theme tokens, which
 * auto-flip under html.dark. When onNavigate is provided it intercepts crumb
 * clicks (so the frame's unsaved-changes guard runs); otherwise crumbs fall
 * back to plain #hash links.
 */
export function Breadcrumbs({
  items,
  onNavigate,
  className = "",
}: {
  items: Crumb[];
  onNavigate?: (section: string) => void;
  className?: string;
}): ReactNode {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={`text-[12px] leading-none ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const clickable = Boolean(item.href) && !isLast;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
              {index > 0 && <Chevron />}
              {clickable ? (
                <a
                  href={item.href}
                  onClick={(event) => {
                    if (onNavigate && item.id) {
                      event.preventDefault();
                      onNavigate(item.id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-cms-muted transition-colors duration-150 hover:text-cms-primary"
                >
                  {index === 0 && <HomeGlyph />}
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 ${
                    isLast ? "font-medium text-cms-ink" : "text-cms-muted"
                  }`}
                >
                  {index === 0 && <HomeGlyph />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
