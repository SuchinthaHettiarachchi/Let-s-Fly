import { apiUrl } from "@/lib/api-url";

export type HotelBookingStat = { value: string; label: string };

export type HotelBookingContent = {
  eyebrow: string;
  title: string;
  description: string;
  stats: HotelBookingStat[];
  ctaLabel: string;
  ctaUrl: string;
  ctaNote: string;
  whatsappMessage: string;
  imagePrimary: string;
  imageSecondary: string;
  priceLabel: string;
  priceAmount: string;
  priceSuffix: string;
};

// Mirrors backend/data/hotelBookingDefaults.js - shown when the API is unreachable.
export const defaultHotelBooking: HotelBookingContent = {
  eyebrow: "Hotel bookings",
  title: "Stay somewhere special, anywhere in Sri Lanka",
  description:
    "From boutique villas in Galle to tea-estate bungalows in Ella, book 2,000+ hand-checked hotels at our partner rates, instantly, through our booking portal.",
  stats: [
    { value: "2,000+", label: "Hotels & villas" },
    { value: "Best rate", label: "Partner pricing" },
  ],
  ctaLabel: "Book Hotel",
  ctaUrl: "",
  ctaNote: "Opens our booking portal",
  whatsappMessage: "Hi Let's Fly, I'd like to book a hotel.",
  imagePrimary: "",
  imageSecondary: "",
  priceLabel: "Rooms from",
  priceAmount: "LKR 18,500",
  priceSuffix: "per night",
};

export async function getHotelBooking(): Promise<HotelBookingContent> {
  try {
    const response = await fetch(apiUrl("/hotel-booking"), { next: { revalidate: 60 } });
    if (!response.ok) return defaultHotelBooking;
    const data: { content?: Partial<HotelBookingContent> } = await response.json();
    if (!data.content || typeof data.content !== "object") return defaultHotelBooking;
    const merged = { ...defaultHotelBooking, ...data.content };
    if (!Array.isArray(merged.stats)) merged.stats = defaultHotelBooking.stats;
    return merged;
  } catch {
    return defaultHotelBooking;
  }
}
