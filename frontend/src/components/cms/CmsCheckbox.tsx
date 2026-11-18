"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked" | "className"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  boxClassName?: string;
};

export function CmsCheckbox({
  checked,
  onChange,
  label,
  labelClassName = "",
  containerClassName = "",
  boxClassName = "",
  disabled,
  id,
  ...rest
}: Props) {
  const control = (
    <span className={`relative inline-flex size-[18px] shrink-0 ${boxClassName}`}>
      <input
        {...rest}
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="size-[18px] rounded-[6px] border-[1.5px] border-[#c8c4e0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-150 peer-checked:border-cms-primary peer-checked:bg-cms-primary peer-focus-visible:shadow-[0_0_0_3px_rgba(58,63,187,0.18)] peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:border-[#3a3f75] dark:bg-[#101435] dark:shadow-none dark:peer-checked:border-cms-primary dark:peer-checked:bg-cms-primary"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
        fill="none"
      >
        <path d="M2.5 6.2L5 8.7L9.5 3.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );

  if (label == null) return control;

  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer select-none items-center gap-2 ${disabled ? "cursor-not-allowed opacity-60" : ""} ${containerClassName}`}
    >
      {control}
      <span className={labelClassName || "text-[13px] font-normal text-cms-text"}>{label}</span>
    </label>
  );
}
