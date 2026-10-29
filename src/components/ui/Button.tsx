import Link from "next/link";
import type { ComponentProps } from "react";
import { Icon } from "./Icon";

/*
 * Button variants follow the approved usage rules:
 *  - primary:      ocean bg, white text, hover ocean-500
 *  - primaryOnDark ocean bg, white text, hover navy (dark sections)
 *  - outline:      white bg, sand border, ocean text, border → ocean on hover
 *  - ghostOnDark:  translucent outline for imagery / navy backgrounds
 *  - navy:         the yellow CTA band's button; inverts to white on hover
 *  - outlineNavy:  secondary button inside the yellow CTA band
 *  - sand:         soft tertiary button on imagery (home hero)
 * Yellow is never a button colour.
 */
const variants = {
  primary: "bg-ocean-600 text-white hover:bg-ocean-500 hover:text-white hover:shadow-[0_8px_20px_rgba(19,87,155,0.28)]",
  primaryOnDark: "bg-ocean-600 text-white hover:bg-navy-900 hover:text-white",
  outline:
    "bg-white text-ocean-600 border-[1.5px] border-sand-300 hover:border-ocean-600 hover:text-ocean-600",
  ghostOnDark:
    "text-white border-[1.5px] border-white/80 hover:bg-white/12 hover:text-white",
  navy: "bg-navy-900 text-white hover:bg-white hover:text-navy-900",
  outlineNavy:
    "text-navy-900 border-[1.5px] border-navy-900 hover:bg-navy-900 hover:text-white",
  sand: "bg-sand-200 text-navy-900 hover:bg-white hover:text-navy-900",
} as const;

const sizes = {
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-[50px] px-[26px] text-[0.9375rem]",
  xl: "h-[54px] px-7 text-[0.9375rem]",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function buttonClasses(variant: Variant = "primary", size: Size = "lg", className = "") {
  return `group/btn inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-[background-color,border-color,color,box-shadow,translate,scale] duration-200 ease-lf hover:-translate-y-px press disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;
}

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: string;
  leadingIcon?: string;
};

export function ButtonLink({
  variant,
  size,
  icon,
  leadingIcon,
  className,
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {leadingIcon && <Icon name={leadingIcon} />}
      {children}
      {icon && <Icon name={icon} className="transition-transform duration-200 ease-lf group-hover/btn:translate-x-0.5" />}
    </Link>
  );
}

export function Button({
  variant,
  size,
  icon,
  leadingIcon,
  className,
  children,
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {leadingIcon && <Icon name={leadingIcon} />}
      {children}
      {icon && <Icon name={icon} className="transition-transform duration-200 ease-lf group-hover/btn:translate-x-0.5" />}
    </button>
  );
}

/** Round prev/next arrow used by the carousels. */
export function ArrowButton({
  direction,
  tone = "light",
  ...props
}: { direction: "prev" | "next"; tone?: "light" | "dark" } & ComponentProps<"button">) {
  const isNext = direction === "next";
  const look =
    tone === "dark"
      ? isNext
        ? "size-[52px] bg-ocean-600 text-white hover:bg-ocean-500"
        : "size-[52px] border-[1.5px] border-white/50 bg-navy-900/30 text-white hover:bg-white hover:text-navy-900"
      : isNext
        ? "size-12 bg-ocean-600 text-white hover:bg-navy-900"
        : "size-12 border-[1.5px] border-sand-300 bg-white text-ocean-600 hover:border-ocean-600";
  return (
    <button
      type="button"
      aria-label={isNext ? "Next" : "Previous"}
      className={`flex items-center justify-center rounded-full cursor-pointer transition-[background-color,border-color,color,scale] duration-200 ease-lf press ${look}`}
      {...props}
    >
      <Icon name={isNext ? "chevron_right" : "chevron_left"} size={24} />
    </button>
  );
}
