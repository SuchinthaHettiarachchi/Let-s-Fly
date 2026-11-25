import { googleRating, stats } from "@/data/home";
import { apiUrl, backendTimeout } from "@/lib/api-url";

export type HomeStat = { value: string; label: string };

export type HomeAboutContent = {
  eyebrow: string;
  heading: string;
  paragraph: string;
  stats: HomeStat[];
  video: string;
  videoPoster: string;
  ratingScore: string;
  ratingCount: string;
};

// Mirrors backend/data/homeAboutDefaults.js - shown when the API is unreachable.
export const defaultHomeAbout: HomeAboutContent = {
  eyebrow: "Who we are",
  heading: "Your journey, our expertise. Smart travel starts here.",
  paragraph:
    "At Let's Fly, we bring every travel need under one roof. Our team handles your corporate trip, family holiday or luxury escape from start to finish for air tickets, visas, hotels, tour packages and transfers.",
  stats,
  video: "https://pub-964aaf148d3f409d99da8fedff2d543c.r2.dev/home-about/1794981403601-f7bd28419e7a.mp4",
  videoPoster: "https://pub-964aaf148d3f409d99da8fedff2d543c.r2.dev/home-about/1794981416255-14dc6f29b0e7.jpg",
  ratingScore: googleRating.score,
  ratingCount: String(googleRating.count),
};

export async function getHomeAbout(): Promise<HomeAboutContent> {
  try {
    const response = await fetch(apiUrl("/home-about"), { next: { revalidate: 60 }, signal: backendTimeout() });
    if (!response.ok) return defaultHomeAbout;
    const data: { content?: Partial<HomeAboutContent> } = await response.json();
    if (!data.content || typeof data.content !== "object") return defaultHomeAbout;
    const merged = { ...defaultHomeAbout, ...data.content };
    if (!Array.isArray(merged.stats) || !merged.stats.length) merged.stats = defaultHomeAbout.stats;
    return merged;
  } catch {
    return defaultHomeAbout;
  }
}
