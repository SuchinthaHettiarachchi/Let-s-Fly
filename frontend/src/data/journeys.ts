/** Scenic rail routes and ocean cruises for the Trains + Cruises page. */

export type Journey = {
  id: string;
  kind: "train" | "cruise";
  /** Small label above the title, e.g. "Most scenic". */
  label: string;
  title: string;
  text: string;
  chips: string[];
  price: number;
  priceNote: string;
  image?: string;
  /** For trains: "Sri Lankan" or "Overseas". */
  country?: "Sri Lankan" | "Overseas";
  /** Starting station/port. */
  startingPoint?: string;
  /** Ordered stops/ports after the starting point. */
  stops?: string[];
};

export const journeyPerks = [
  { icon: "confirmation_number", title: "We queue, you relax", text: "Tickets delivered to your hotel or by e-ticket." },
  { icon: "luggage", title: "Luggage transfers", text: "Send big bags ahead by car while you ride." },
  { icon: "photo_camera", title: "Best-side seating", text: "We request the view side for photos." },
];
