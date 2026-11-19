"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CmsButton } from "@/components/cms/CmsButton";
import { Icon } from "@/components/ui/Icon";

/*
 * Shared read-only detail dialog for CMS listing rows. Callers pass prepared
 * sections so each listing can display every field of its own record without
 * duplicating modal markup, styling or keyboard/scroll-lock behavior.
 */
export type CmsViewField = {
  label: string;
  value?: ReactNode;
  /** Stretch across both columns on wider screens (long text, lists). */
  wide?: boolean;
};

export type CmsViewSection = {
  title?: string;
  fields: CmsViewField[];
};

type CmsViewModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  image?: string;
  sections: CmsViewSection[];
  onClose: () => void;
};

/** Small pill list for array values such as stops, chips, themes or routes. */
export function ViewPills({ items, empty = "—" }: { items?: string[]; empty?: string }) {
  if (!items?.length) return <span className="font-normal text-cms-muted">{empty}</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <span
          className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-cms-ink dark:bg-[#171a42]"
          key={`${item}-${index}`}
        >
          {item}
        </span>
      ))}
    </span>
  );
}

/** Titled list for nested records such as highlights, itinerary days or steps. */
export function ViewLines({
  items,
  empty = "—",
}: {
  items?: { title: string; note?: string }[];
  empty?: string;
}) {
  if (!items?.length) return <span className="font-normal text-cms-muted">{empty}</span>;
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li className="text-[12.5px] font-normal leading-snug text-cms-ink" key={`${item.title}-${index}`}>
          <span className="font-semibold">{item.title}</span>
          {item.note && <span className="text-cms-muted"> — {item.note}</span>}
        </li>
      ))}
    </ul>
  );
}

export function CmsViewModal({
  open,
  title,
  subtitle,
  badge,
  image,
  sections,
  onClose,
}: CmsViewModalProps) {
  const headingId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(10,4,70,.48)] p-3 backdrop-blur-[3px] sm:p-5"
      onClick={onClose}
    >
      <section
        aria-labelledby={headingId}
        aria-modal="true"
        className="flex max-h-[min(88dvh,860px)] w-[min(100%,680px)] flex-col overflow-hidden rounded-2xl border border-cms-line bg-cms-card shadow-[0_24px_60px_rgba(10,4,70,.22)] dark:shadow-none"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-cms-line px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-semibold text-cms-ink" id={headingId}>{title}</h2>
              {badge}
            </div>
            {subtitle && <p className="mt-1 text-[12px] text-cms-muted wrap-anywhere">{subtitle}</p>}
          </div>
          <CmsButton aria-label="Close" className="shrink-0" onClick={onClose} ref={closeRef} size="icon" variant="secondary">
            <Icon name="close" size={18} />
          </CmsButton>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {image && (
            <div className="mb-4 h-44 w-full overflow-hidden rounded-[10px] bg-[#eef1ff] dark:bg-[#101435]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="h-full w-full object-cover" src={image} />
            </div>
          )}
          {sections.map((section, sectionIndex) => (
            <section className="mb-5 last:mb-0" key={`${section.title ?? "section"}-${sectionIndex}`}>
              {section.title && (
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                  {section.title}
                </h3>
              )}
              <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div
                    className={`rounded-[9px] bg-cms-card2 px-3 py-2.5 ${field.wide ? "sm:col-span-2" : ""}`}
                    key={field.label}
                  >
                    <dt className="text-[11px] text-cms-muted">{field.label}</dt>
                    <dd className="mt-1 text-[13px] font-medium text-cms-ink wrap-anywhere">
                      {field.value ?? "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <footer className="flex justify-end gap-2 border-t border-cms-line px-5 py-3.5">
          <CmsButton onClick={onClose} variant="secondary">Close</CmsButton>
        </footer>
      </section>
    </div>
  );
}

export default CmsViewModal;
