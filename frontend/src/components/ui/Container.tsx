import type { ComponentProps } from "react";

/** 1200px content column with a 16px gutter on small screens. */
export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-[1232px] px-4 ${className}`} {...props} />;
}
