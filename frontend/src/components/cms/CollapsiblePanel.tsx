"use client";

import { useId, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/*
 * Shared collapsible card used across CMS sections. The header stays visible
 * with a toggle chevron; the body is rendered only while expanded.
 */
export type CollapsiblePanelProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** Override the outer card classes (padding/margins differ in some tabs). */
  className?: string;
  /** Controls rendered beside the toggle (e.g. Cancel edit, size hints). */
  headerExtra?: ReactNode;
  ariaLabel?: string;
};

const DEFAULT_CARD =
  "mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none";

export function CollapsiblePanel({
  title,
  subtitle,
  count,
  open,
  onToggle,
  children,
  className = DEFAULT_CARD,
  headerExtra,
  ariaLabel,
}: CollapsiblePanelProps) {
  const bodyId = useId();
  return (
    <section aria-label={ariaLabel} className={className}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          aria-controls={bodyId}
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-start justify-between gap-3 text-left"
          onClick={onToggle}
          type="button"
        >
          <span className="min-w-0">
            <span className="block text-[16px] font-semibold text-cms-ink">{title}</span>
            {subtitle && <span className="mt-1.5 block text-[12px] text-cms-muted">{subtitle}</span>}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {count !== undefined && (
              <span className="rounded-full bg-cms-card2 px-2 py-0.5 text-[11px] font-semibold text-cms-muted">
                {count}
              </span>
            )}
            <Icon className="text-cms-muted" name={open ? "expand_less" : "expand_more"} size={20} />
          </span>
        </button>
        {headerExtra && <div className="flex shrink-0 flex-wrap items-center gap-2">{headerExtra}</div>}
      </div>
      {open && <div className="mt-4" id={bodyId}>{children}</div>}
    </section>
  );
}

export default CollapsiblePanel;
