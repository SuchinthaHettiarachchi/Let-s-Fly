/** Travellers Gallery photos. Entries without an image show a placeholder until real photos arrive. */

export type GalleryCategory = "sri-lanka" | "overseas" | "hotels" | "train-cruise";

export type GalleryPhoto = { place: string; category: GalleryCategory; image?: string };

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "sri-lanka", label: "Travel Sri Lanka" },
  { id: "overseas", label: "Overseas Travel" },
  { id: "hotels", label: "Hotel bookings" },
  { id: "train-cruise", label: "Train & Cruise Adventures" },
];

export const galleryPhotos: GalleryPhoto[] = [
  { place: "Dubai", category: "overseas", image: "/images/packages/dubai-family-escape.jpg" },
  { place: "Ella", category: "train-cruise", image: "/images/packages/kandy-ella-rail.jpg" },
  { place: "Maldives", category: "hotels", image: "/images/packages/maldives-overwater-villa.jpg" },
  { place: "Yala", category: "sri-lanka", image: "/images/packages/yala-safari.jpg" },
  { place: "Bali", category: "overseas", image: "/images/packages/bali-honeymoon.jpg" },
  { place: "Singapore cruise", category: "train-cruise", image: "/images/packages/singapore-malaysia-cruise.jpg" },
  { place: "Bangkok", category: "overseas", image: "/images/packages/bangkok-phuket.jpg" },
  { place: "Mirissa", category: "sri-lanka", image: "/images/hero/maldives-beach.jpg" },
  { place: "Team trip, Phuket", category: "overseas" },
  { place: "Paris", category: "overseas" },
  { place: "Nuwara Eliya", category: "sri-lanka" },
  { place: "Swiss Alps", category: "overseas" },
  { place: "School tour, Singapore", category: "overseas" },
  { place: "Trincomalee", category: "sri-lanka" },
  { place: "Marina Bay", category: "hotels" },
  { place: "Lake Bled", category: "overseas" },
];
