/** Air Tickets page content. Fares are indicative return prices per person, incl. taxes. */

export type Fare = { city: string; price: number; image?: string };

export const topFares: Fare[] = [
  { city: "Dubai", price: 118000, image: "/images/packages/dubai-family-escape.jpg" },
  { city: "Malé", price: 62500, image: "/images/packages/maldives-overwater-villa.jpg" },
  { city: "Bangkok", price: 96000, image: "/images/packages/bangkok-phuket.jpg" },
  { city: "Singapore", price: 104000, image: "/images/packages/singapore-malaysia-cruise.jpg" },
  { city: "Paris", price: 265000 },
  { city: "Tokyo", price: 238000 },
];

export const portalSteps = [
  { title: "Search", text: "Enter your route and dates" },
  { title: "Compare", text: "See live fares from 40+ airlines" },
  { title: "Book & pay", text: "Get your e-ticket by email" },
];

export const flightFeatures = [
  { icon: "search", title: "Best-fare search", text: "We check GDS, low-cost carriers and group fares together." },
  { icon: "event_repeat", title: "Easy date changes", text: "Re-issues and cancellations handled by our desk." },
  { icon: "luggage", title: "Baggage & seats", text: "Extra baggage, meals and seat selection added for you." },
  { icon: "support_agent", title: "24/7 travel support", text: "A real person on WhatsApp if plans change mid-trip." },
];

export const cabinClasses = ["Economy", "Premium Economy", "Business", "First"];
