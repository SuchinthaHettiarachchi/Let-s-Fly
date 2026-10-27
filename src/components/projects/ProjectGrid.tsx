"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { projectCategories, type Project, type ProjectCategory } from "@/data/projects";
import { CategoryPill } from "./CategoryPill";

type Sort = "newest" | "oldest";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [sort, setSort] = useState<Sort>("newest");

  const visible = useMemo(() => {
    const list = category === "all" ? projects : projects.filter((p) => p.category === category);
    return [...list].sort((a, b) => (sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [projects, category, sort]);

  const chips = [
    { id: "all" as const, label: "All", count: projects.length },
    ...projectCategories.map((c) => ({ ...c, count: projects.filter((p) => p.category === c.id).length })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const on = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setCategory(c.id)}
              className={`flex h-10 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 text-small font-medium transition-colors ${
                on ? "border-ocean-600 bg-ocean-600 text-white" : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
              }`}
            >
              {c.label}
              <span
                className={`rounded-full px-1.5 text-caption ${on ? "bg-white/20 text-white" : "bg-sand-50 text-ink-600"}`}
              >
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2.5 text-small text-ink-400">
          Sort by
          <span className="relative flex items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 cursor-pointer appearance-none rounded-full border-[1.5px] border-sand-300 bg-white pr-9 pl-4 font-medium text-ink-900 focus:border-ocean-600 focus:outline-none"
            >
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
            </select>
            <Icon name="expand_more" size={18} className="pointer-events-none absolute right-3 text-ink-400" />
          </span>
        </label>
        <p aria-live="polite" className="text-small text-ink-400">
          Showing <strong className="text-ink-900">{visible.length}</strong> projects · {sort} first
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <li key={p.slug} data-reveal={(i % 3) * 90}>
            <Link href={`/projects/${p.slug}`} className="group flex flex-col gap-3 text-ink-900 hover:text-ink-900">
              <div className="relative h-[200px] overflow-hidden rounded-xl bg-sand-200">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
                )}
              </div>
              <div className="flex flex-col gap-2 px-1">
                <CategoryPill category={p.category} />
                <h3 className="font-sans text-h4 transition-colors group-hover:text-ocean-600">{p.title}</h3>
                <p className="line-clamp-3 text-small text-ink-600">{p.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
