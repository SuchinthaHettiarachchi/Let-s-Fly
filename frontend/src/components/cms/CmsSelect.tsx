"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type CmsSelectOption = {
  value: string;
  label: string;
  /** Material Symbols glyph rendered before the label. */
  icon?: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: CmsSelectOption[];
  /** Shown when nothing is selected ("" value). */
  placeholder?: string;
  id?: string;
  /** Extra classes merged onto the trigger (matches CMS input shells). */
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

/**
 * Compact custom dropdown matching the CMS theme — replaces the native
 * <select> look. Options can show an icon + label; menu padding stays tight.
 */
export function CmsSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  id,
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative w-full" ref={wrapRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-left text-[13px] text-cms-ink transition-colors hover:border-[#c4c0e8] focus:border-cms-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#2a2e63] dark:bg-[#101435] dark:hover:border-[#41478c] ${className}`}
        disabled={disabled}
        id={id}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon && <Icon className="flex-none text-cms-primary" name={selected.icon} size={18} />}
          <span className={`truncate ${selected ? "" : "text-cms-muted"}`}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <Icon
          className={`flex-none text-cms-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          name="expand_more"
          size={18}
        />
      </button>
      {open && (
        <ul
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-[9px] border border-cms-line bg-cms-card p-1 shadow-[0_14px_34px_rgba(16,10,80,0.16)] dark:shadow-none"
          role="listbox"
        >
          {options.length === 0 && (
            <li className="px-2.5 py-2 text-[12px] text-cms-muted">No options</li>
          )}
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  aria-selected={isSelected}
                  className={`flex w-full items-center gap-2 rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] transition-colors ${
                    isSelected
                      ? "bg-cms-card2 font-semibold text-cms-primary"
                      : "text-cms-ink hover:bg-cms-card2 hover:text-cms-ink"
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  {option.icon && (
                    <Icon
                      className={isSelected ? "text-cms-primary" : "text-cms-muted"}
                      name={option.icon}
                      size={17}
                    />
                  )}
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Icon className="ml-auto flex-none text-cms-primary" name="check" size={15} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
