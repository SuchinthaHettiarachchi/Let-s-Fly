"use client";

import { usePathname } from "next/navigation";

/**
 * Fades each new page in on navigation. Keyed by pathname, so it replays on every route change
 * (template.tsx only remounts when the top-level segment changes) but not on #hash jumps.
 * Opacity only: a transform here would break the fixed mobile bar and sticky tabs mid-animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page">
      {children}
    </div>
  );
}
