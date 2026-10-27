"use client";

import { useEffect, useRef, useState } from "react";

type Props = { items: { title: string; text: string }[] };

/**
 * Big principle words that open one at a time on desktop: the one in the middle of the
 * screen, or the one under the mouse. On smaller screens every principle stays open.
 */
export function ApproachList({ items }: Props) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(refs.current.indexOf(e.target as HTMLLIElement));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <ol className="border-t border-sand-300">
      {items.map((p, i) => {
        const open = i === active;
        return (
          <li
            key={p.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onMouseEnter={() => setActive(i)}
            className="grid grid-cols-[44px_1fr] gap-x-4 border-b border-sand-300 py-6 sm:grid-cols-[56px_1fr] sm:gap-x-[18px]"
          >
            <span className="pt-3 text-small font-bold text-ocean-600">{String(i + 1).padStart(2, "0")}</span>
            <h3
              className={`text-h2 transition-colors duration-300 ${
                open ? "text-ink-900" : "text-ink-900 lg:text-sand-300"
              }`}
            >
              {p.title}
            </h3>
            <p
              className={`col-start-2 mt-2 max-w-[480px] overflow-hidden text-body text-ink-600 transition-[max-height,opacity,margin] duration-500 ${
                open ? "lg:max-h-[120px] lg:opacity-100" : "lg:mt-0 lg:max-h-0 lg:opacity-0"
              }`}
            >
              {p.text}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
