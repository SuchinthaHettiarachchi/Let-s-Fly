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
};

export const journeys: Journey[] = [
  {
    id: "kandy-ella",
    kind: "train",
    label: "Most scenic",
    title: "Kandy → Ella",
    text: "Seven hours through tea estates, tunnels and the Nine Arches Bridge. Observation and 1st-class seats.",
    chips: ["6h 50m", "Observation car", "Daily"],
    price: 4500,
    priceNote: "per seat, one way",
    image: "/images/packages/kandy-ella-rail.jpg",
  },
  {
    id: "colombo-galle",
    kind: "train",
    label: "Coastal",
    title: "Colombo → Galle",
    text: "Ride right along the Indian Ocean, then explore the Dutch fort with our local guide.",
    chips: ["2h 30m", "1st class A/C", "Daily"],
    price: 2800,
    priceNote: "per seat, one way",
    image: "/images/hero/maldives-beach.jpg",
  },
  {
    id: "colombo-kandy",
    kind: "train",
    label: "Classic",
    title: "Colombo → Kandy",
    text: "The historic hill climb up the Kadugannawa pass, the perfect start to a hill-country tour.",
    chips: ["3h 00m", "Intercity Express", "Twice daily"],
    price: 2200,
    priceNote: "per seat, one way",
  },
  // Draft cruises: the design has no Cruises content yet. Confirm routes and prices with the team.
  {
    id: "singapore-penang-phuket",
    kind: "cruise",
    label: "Southeast Asia",
    title: "Singapore → Penang → Phuket",
    text: "Five nights on a modern cruise ship with stops in Penang and Phuket, plus flights from Colombo.",
    chips: ["5 nights", "Balcony cabins", "Monthly sailings"],
    price: 240000,
    priceNote: "per person, twin cabin",
    image: "/images/packages/singapore-malaysia-cruise.jpg",
  },
  {
    id: "dubai-muscat-doha",
    kind: "cruise",
    label: "Arabian Gulf",
    title: "Dubai → Muscat → Doha",
    text: "A week around the Gulf with a night in Dubai before boarding. Ideal for families in the cooler months.",
    chips: ["7 nights", "All meals on board", "Nov – Mar"],
    price: 285000,
    priceNote: "per person, twin cabin",
    image: "/images/packages/dubai-family-escape.jpg",
  },
];

export const journeyPerks = [
  { icon: "confirmation_number", title: "We queue, you relax", text: "Tickets delivered to your hotel or by e-ticket." },
  { icon: "luggage", title: "Luggage transfers", text: "Send big bags ahead by car while you ride." },
  { icon: "photo_camera", title: "Best-side seating", text: "We request the view side for photos." },
];
