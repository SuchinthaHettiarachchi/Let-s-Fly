import { categoryLabel, type ProjectCategory } from "@/data/projects";

const styles: Record<ProjectCategory, string> = {
  meetings: "bg-sand-50 text-ocean-600",
  incentives: "bg-sun-400/30 text-navy-900",
  conferences: "bg-ocean-600/10 text-ocean-600",
  exhibitions: "bg-navy-900/8 text-navy-900",
};

export function CategoryPill({ category }: { category: ProjectCategory }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-caption font-bold tracking-[0.12em] uppercase ${styles[category]}`}>
      {categoryLabel(category)}
    </span>
  );
}
