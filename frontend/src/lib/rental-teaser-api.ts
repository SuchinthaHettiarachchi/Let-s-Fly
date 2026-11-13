import { apiUrl } from "@/lib/api-url";

export type RentalSlotId = "cars" | "vans" | "bikes" | "scooters";

export type RentalSlot = {
  id: RentalSlotId;
  image: string;
  line1: string;
  line2: string;
};

export type RentalTeaserContent = {
  slots: RentalSlot[];
};

export const rentalSlotIds: RentalSlotId[] = ["cars", "vans", "bikes", "scooters"];

/** Fixed chrome for the four category buttons (not CMS-editable). */
export const rentalSlotMeta: Record<RentalSlotId, { label: string; icon: string; aspect: string; format: string }> = {
  cars: { label: "Cars", icon: "directions_car", aspect: "3:2", format: "JPEG/PNG/WebP" },
  vans: { label: "Vans", icon: "airport_shuttle", aspect: "≈1.4:1", format: "JPEG/PNG/WebP" },
  bikes: { label: "Bikes", icon: "two_wheeler", aspect: "3:2", format: "JPEG/PNG/WebP" },
  scooters: { label: "Scooters", icon: "moped", aspect: "2:3", format: "JPEG/PNG/WebP" },
};

/** Mirrors backend/data/rentalTeaserDefaults.js — shown when the API is unreachable. */
export const defaultRentalTeaser: RentalTeaserContent = {
  slots: [
    { id: "cars", image: "/images/rentals/car.jpg", line1: "Cars from", line2: "LKR 8,500 / day" },
    { id: "vans", image: "/images/rentals/van.jpg", line1: "Vans from", line2: "LKR 14,000 / day" },
    { id: "bikes", image: "/images/rentals/bike.jpg", line1: "Bikes from", line2: "LKR 4,500 / day" },
    { id: "scooters", image: "/images/rentals/scooter.jpg", line1: "Scooters from", line2: "LKR 3,000 / day" },
  ],
};

const URL_API = apiUrl("/rental-teaser");

export async function getRentalTeaser(): Promise<RentalTeaserContent> {
  try {
    const response = await fetch(URL_API, { next: { revalidate: 60 } });
    if (!response.ok) return defaultRentalTeaser;
    const data: { content?: Partial<RentalTeaserContent> } = await response.json();
    if (!data.content || !Array.isArray(data.content.slots) || data.content.slots.length !== 4) {
      return defaultRentalTeaser;
    }
    return { slots: data.content.slots };
  } catch {
    return defaultRentalTeaser;
  }
}
