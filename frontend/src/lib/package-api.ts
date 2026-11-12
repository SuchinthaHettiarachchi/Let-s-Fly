import type { Package } from "@/data/packages";

const API = `${process.env.NEXT_PUBLIC_API_URL}/packages`;

export async function getPackagesByCategory(category: Package["category"]): Promise<Package[]> {
  try {
    const response = await fetch(`${API}?category=${category}`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data: { packages?: Package[] } = await response.json();
    return Array.isArray(data.packages) ? data.packages : [];
  } catch {
    return [];
  }
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  try {
    const response = await fetch(`${API}/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!response.ok) return undefined;
    const data: { package?: Package } = await response.json();
    return data.package;
  } catch {
    return undefined;
  }
}
