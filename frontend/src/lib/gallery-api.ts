import { apiUrl, backendTimeout } from "@/lib/api-url";

export type GalleryCategory = {
  _id: string;
  name: string;
  sortOrder?: number;
};

export type GalleryMediaType = "image" | "video";

export type GalleryItem = {
  _id: string;
  caption: string;
  /** GalleryCategory id. */
  category: string;
  /** Cloudflare R2 public URL of the image or video. */
  media: string;
  mediaType: GalleryMediaType;
  sortOrder?: number;
};

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    const response = await fetch(apiUrl("/gallery-categories"), { next: { revalidate: 60 }, signal: backendTimeout() });
    if (!response.ok) return [];
    const data: { categories?: GalleryCategory[] } = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch {
    return [];
  }
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const response = await fetch(apiUrl("/gallery-items"), { next: { revalidate: 60 }, signal: backendTimeout() });
    if (!response.ok) return [];
    const data: { items?: GalleryItem[] } = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}
