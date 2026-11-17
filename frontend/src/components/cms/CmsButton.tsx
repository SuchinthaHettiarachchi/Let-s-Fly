"use client";

import type { ComponentPropsWithRef } from "react";

/*
 * Shared CMS button — compact, themed, consistent across every CMS section.
 * Variants: primary (save/create), secondary (cancel/edit/refresh),
 *           muted (low-emphasis: remove, add-on, arrows), danger (delete).
 */
export type CmsButtonVariant = "primary" | "secondary" | "muted" | "danger";
export type CmsButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-1.5 pt-1 whitespace-nowrap rounded-[8px] border font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<CmsButtonVariant, string> = {
  primary: "border-transparent bg-cms-primary text-white hover:bg-[#150cb0] dark:hover:bg-[#7d74ff]",
  secondary:
    "border-cms-line bg-cms-card text-cms-ink hover:border-[#cfcce8] hover:bg-[#f6f6fb] dark:hover:border-[#41478c] dark:hover:bg-[#1f2353]",
  muted:
    "border-transparent bg-transparent text-cms-muted hover:bg-cms-card2 hover:text-cms-ink",
  danger: "border-transparent bg-[#d42a45] text-white hover:bg-[#b71f37]",
};

const sizes: Record<CmsButtonSize, string> = {
  sm: "h-7 px-2.5 text-[11px] py-2 pt-3",
  md: "h-8 px-3 text-[12px] py-2 pt-3",
  lg: "h-9 px-4 text-[12.5px] py-2 pt-3",
  icon: "size-8 p-0 text-[18px] leading-none py-3",
};

/** Class string for the shared button (use on <label> file-pickers etc.). */
export function cmsButtonClasses(
  variant: CmsButtonVariant = "secondary",
  size: CmsButtonSize = "md",
  extra = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

type Props = {
  variant?: CmsButtonVariant;
  size?: CmsButtonSize;
} & ComponentPropsWithRef<"button">;

export function CmsButton({
  variant = "secondary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: Props) {
  return <button type={type} className={cmsButtonClasses(variant, size, className)} {...props} />;
}
