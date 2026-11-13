import { aboutParagraphs, founderQuote } from "@/data/about";
import { apiUrl } from "@/lib/api-url";

export type WhoWeAreContent = {
  eyebrow: string;
  headingLead: string;
  headingHighlight: string;
  paragraphs: string[];
  quote: { initials: string; quote: string; name: string; role: string };
  statValue: string;
  statLabel: string;
  mainImage: string;
  insetImage: string;
  video: string;
};

// Mirrors backend/data/whoWeAreDefaults.js — shown when the API is unreachable.
export const defaultWhoWeAre: WhoWeAreContent = {
  eyebrow: "Who we are",
  headingLead: "More Than ",
  headingHighlight: "Just Travel",
  paragraphs: aboutParagraphs,
  quote: {
    initials: founderQuote.initials,
    quote: founderQuote.quote,
    name: founderQuote.name,
    role: founderQuote.role,
  },
  statValue: "14+",
  statLabel: "years helping\nSri Lankans travel",
  mainImage: "",
  insetImage: "/images/packages/kandy-ella-rail.jpg",
  video: "",
};

export async function getWhoWeAre(): Promise<WhoWeAreContent> {
  try {
    const response = await fetch(apiUrl("/who-we-are"), { next: { revalidate: 60 } });
    if (!response.ok) return defaultWhoWeAre;
    const data: { content?: Partial<WhoWeAreContent> } = await response.json();
    if (!data.content || typeof data.content !== "object") return defaultWhoWeAre;
    return { ...defaultWhoWeAre, ...data.content };
  } catch {
    return defaultWhoWeAre;
  }
}
