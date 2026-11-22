/** Package data types. Records come from the CMS/backend. */

export type Highlight = { icon: string; label: string };

export type ItineraryDay = {
  category: string;
  title: string;
  /** Short facts under the title, e.g. location, duration. Not shown on the page at the moment. */
  meta?: { icon: string; label: string }[];
  body: string;
};

export type InclusionItem = { title: string; note?: string };

export type PaymentMethod = { icon: string; title: string; text: string };
export type PaymentStep = { title: string; text: string };
export type PackagePayment = {
  methods: PaymentMethod[];
  steps: PaymentStep[];
  note: string;
};

export type SriLankaTheme = "cultural" | "hill-country" | "beaches" | "wildlife";
export type OutboundRegion = "middle-east" | "asia" | "europe" | "maldives";

export type Package = {
  slug: string;
  title: string;
  /** Short region label for cards, e.g. "UAE". */
  region: string;
  /** Longer location label for the detail page, e.g. "UAE · Dubai". */
  location: string;
  category: "outbound" | "sri-lanka";
  /** Outbound only: which "Where to next?" region it belongs to. */
  outboundRegion?: OutboundRegion;
  /** Sri Lanka only: dynamic category keys used by the filter chips. */
  themes?: string[];
  /** Places shown on the card tag, e.g. "Sigiriya · Dambulla". Falls back to region. */
  area?: string;
  badge?: string;
  /** Shown in the Home page carousel. */
  featured?: boolean;
  days: number;
  nights: number;
  /** Price per person in LKR. */
  price: number;
  /** Card photo. Missing photos render as a placeholder. */
  image?: string;

  priceNote?: string;
  flightsIncluded?: boolean;
  rating?: { score: number; count: number };
  gallery?: string[];
  brochureUrl?: string;
  overview?: { summary: string; highlights: Highlight[] };
  itinerary?: {
    /** e.g. "Colombo ⇄ Dubai" */
    endpoints: string;
    route: string[];
    footnote: string;
    days: ItineraryDay[];
  };
  inclusions?: { intro: string; included: InclusionItem[]; excluded: InclusionItem[] };
  payment?: PackagePayment;
  related?: string[];
};
