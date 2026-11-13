import type { Package } from "@/data/packages";
import { apiUrl } from "@/lib/api-url";

export async function getPackagesByCategory(category: Package["category"]): Promise<Package[]> {
  try {
    const response = await fetch(`${apiUrl("/packages")}?category=${category}`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data: { packages?: Package[] } = await response.json();
    return Array.isArray(data.packages) ? data.packages : [];
  } catch {
    return [];
  }
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  try {
    const response = await fetch(apiUrl(`/packages/${encodeURIComponent(slug)}`), { next: { revalidate: 60 } });
    if (!response.ok) return undefined;
    const data: { package?: Package } = await response.json();
    return data.package;
  } catch {
    return undefined;
  }
}
