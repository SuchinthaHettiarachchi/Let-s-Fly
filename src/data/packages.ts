/*
 * Tour packages. Every package needs the card fields; the detail fields
 * (overview, itinerary, inclusions) are optional and a package only gets a
 * /packages/[slug] page once it has them. This file stands in for the CMS.
 */

export type Highlight = { icon: string; label: string };

export type ItineraryDay = {
  category: string;
  title: string;
  /** Short facts under the title, e.g. location, duration. */
  meta: { icon: string; label: string }[];
  body: string;
};

export type InclusionItem = { title: string; note?: string };

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
  /** Sri Lanka only: themes used by the filter chips. */
  themes?: SriLankaTheme[];
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
  related?: string[];
};

export const packages: Package[] = [
  {
    slug: "dubai-family-escape",
    title: "Dubai Family Escape",
    region: "UAE",
    location: "UAE · Dubai",
    category: "outbound",
    outboundRegion: "middle-east",
    badge: "Best seller",
    featured: true,
    days: 6,
    nights: 5,
    price: 150000,
    image: "/images/packages/dubai-family-escape.jpg",
    priceNote: "Twin share · flights, hotel & visa",
    flightsIncluded: true,
    rating: { score: 4.9, count: 128 },
    // Only two real photos so far; the gallery fills the remaining slots with placeholders.
    gallery: ["/images/hero/dubai.jpg", "/images/hero/maldives-beach.jpg"],
    overview: {
      summary:
        "A relaxed six-day trip built for families: a desert safari with BBQ dinner, the Burj Khalifa at sunset, a full day at a theme park and a dhow cruise along Dubai Marina. Five nights in a 4★ hotel with breakfast, private airport transfers and your UAE visa — all arranged from Colombo.",
      highlights: [
        { icon: "landscape", label: "Desert safari & BBQ dinner" },
        { icon: "apartment", label: "Burj Khalifa at the Top" },
        { icon: "attractions", label: "Full-day theme park pass" },
        { icon: "sailing", label: "Marina dhow dinner cruise" },
        { icon: "airport_shuttle", label: "Private airport transfers" },
        { icon: "description", label: "UAE tourist visa" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Dubai",
      route: ["Colombo", "Downtown Dubai", "Desert Conservation Reserve", "Yas Island", "Dubai Marina", "Colombo"],
      footnote:
        "Flight times are indicative and the order of activities may change with weather, park schedules and availability. Your final itinerary is confirmed with your booking.",
      days: [
        {
          category: "Arrival",
          title: "Colombo to Dubai – check in & Dubai Mall evening",
          meta: [
            { icon: "location_on", label: "Downtown Dubai" },
            { icon: "hotel", label: "4★ hotel" },
          ],
          body: "Fly out of Bandaranaike International on a morning flight and land in Dubai by early afternoon. Our representative meets you at arrivals and drives you to your hotel. After a rest, head to The Dubai Mall for the aquarium tunnel and the Dubai Fountain show, a gentle first evening that kids love.",
        },
        {
          category: "City sightseeing",
          title: "Old Dubai, Dubai Frame & Burj Khalifa at sunset",
          meta: [
            { icon: "location_on", label: "Al Fahidi · Deira · Downtown" },
            { icon: "schedule", label: "Half-day tour" },
          ],
          // Draft copy — not in the design; confirm with the travel team.
          body: "Start in the Al Fahidi historic district, cross the creek by abra to the Deira spice and gold souks, then stop at the Dubai Frame for views of old and new Dubai. After an afternoon break at the hotel, ride up to the Burj Khalifa observation deck in time for sunset.",
        },
        {
          category: "Adventure",
          title: "Desert safari with dune bashing & BBQ dinner",
          meta: [
            { icon: "location_on", label: "Dubai Desert Conservation Reserve" },
            { icon: "schedule", label: "Afternoon & evening" },
          ],
          // Draft copy — not in the design; confirm with the travel team.
          body: "A free morning to enjoy the pool. In the afternoon a 4×4 picks you up for dune bashing, sandboarding and a short camel ride, then dinner at a desert camp with a BBQ buffet, henna and live shows under the stars.",
        },
        {
          category: "Theme park",
          title: "Full day at Ferrari World or Warner Bros. World",
          meta: [
            { icon: "location_on", label: "Yas Island, Abu Dhabi" },
            { icon: "schedule", label: "Full day" },
          ],
          // Draft copy — not in the design; confirm with the travel team.
          body: "A private transfer takes you to Yas Island in Abu Dhabi. Choose Ferrari World for record-breaking rides or Warner Bros. World for the younger ones — your pass covers a full day of entry. Back to Dubai in the evening.",
        },
        {
          category: "Leisure & cruise",
          title: "Beach morning, Palm Jumeirah & Marina dhow dinner cruise",
          meta: [
            { icon: "location_on", label: "JBR · Palm · Dubai Marina" },
            { icon: "schedule", label: "2-hour cruise" },
          ],
          // Draft copy — not in the design; confirm with the travel team.
          body: "Spend the morning at JBR beach, then drive out along the Palm Jumeirah for photos at the Atlantis. In the evening, board a traditional dhow for a two-hour dinner cruise past the lights of Dubai Marina.",
        },
        {
          category: "Departure",
          title: "Last-minute shopping & flight home to Colombo",
          meta: [
            { icon: "location_on", label: "Dubai → Colombo" },
            { icon: "flight", label: "Return flight" },
          ],
          // Draft copy — not in the design; confirm with the travel team.
          body: "Check out after breakfast and fit in some last-minute shopping before your private transfer to Dubai International for the flight back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro:
        "Everything below is covered in the package price of LKR 150,000 per person. Items under “Not included” can be paid locally or added to your booking. Ask us for a quote.",
      included: [
        { title: "Return economy flights Colombo ⇄ Dubai", note: "Direct flights with 30 kg checked baggage per person" },
        { title: "5 nights in a 4★ hotel", note: "Rove Downtown or similar, twin-share family room" },
        { title: "Daily breakfast" },
        { title: "Private airport transfers" },
        { title: "Desert safari with BBQ dinner", note: "Dune bashing, sandboarding, camel ride and live shows" },
        { title: "Burj Khalifa “At the Top” tickets", note: "Levels 124 & 125, sunset time slot" },
        {
          title: "Full-day theme park pass & Marina dhow dinner cruise",
          note: "Choice of Ferrari World or Warner Bros. World, Abu Dhabi",
        },
        { title: "UAE 30-day tourist visa" },
      ],
      excluded: [
        { title: "Travel insurance", note: "Strongly recommended; we can arrange a policy" },
        { title: "Dubai Tourism Dirham fee", note: "Paid directly at the hotel, approx. AED 15 per room per night" },
        { title: "Lunches and dinners not mentioned in the itinerary" },
        { title: "Personal expenses" },
        {
          title: "Optional tours and room upgrades",
          note: "e.g. Burj Khalifa Level 148, Atlantis Aquaventure, sea-view rooms",
        },
        { title: "Tips and gratuities for guides and drivers" },
      ],
    },
    related: ["maldives-overwater-villa", "singapore-malaysia-cruise", "bangkok-phuket"],
  },
  {
    slug: "abu-dhabi-dubai-combo", title: "Abu Dhabi & Dubai Combo", region: "UAE", location: "UAE · Abu Dhabi · Dubai",
    category: "outbound", outboundRegion: "middle-east", badge: "New", flightsIncluded: true, days: 6, nights: 5, price: 178000,
  },
  {
    slug: "muscat-desert-coast", title: "Muscat Desert & Coast", region: "Oman", location: "Oman · Muscat",
    category: "outbound", outboundRegion: "middle-east", badge: "Adventure", flightsIncluded: true, days: 5, nights: 4, price: 165000,
  },
  {
    slug: "maldives-overwater-villa", title: "Maldives Overwater Villa", region: "Maldives", location: "Maldives",
    category: "outbound", outboundRegion: "maldives", featured: true, days: 4, nights: 3, price: 185000,
    image: "/images/packages/maldives-overwater-villa.jpg",
  },
  {
    slug: "kandy-ella-rail", title: "Kandy to Ella Rail Journey", region: "Sri Lanka", area: "Kandy · Ella", location: "Sri Lanka · Hill Country",
    category: "sri-lanka", themes: ["hill-country"], featured: true, days: 3, nights: 2, price: 48000,
    image: "/images/packages/kandy-ella-rail.jpg",
  },
  {
    slug: "yala-wildlife-safari", title: "Yala Wildlife Safari", region: "Sri Lanka", area: "Yala", location: "Sri Lanka · Yala",
    category: "sri-lanka", themes: ["wildlife"], featured: true, days: 2, nights: 1, price: 36500,
    image: "/images/packages/yala-safari.jpg",
  },
  {
    slug: "cultural-triangle-explorer", title: "Cultural Triangle Explorer", region: "Sri Lanka", area: "Sigiriya · Dambulla", location: "Sri Lanka · Cultural Triangle",
    category: "sri-lanka", themes: ["cultural"], days: 4, nights: 3, price: 68000,
  },
  {
    slug: "southern-coast-getaway", title: "Southern Coast Getaway", region: "Sri Lanka", area: "Mirissa · Galle", location: "Sri Lanka · South Coast",
    category: "sri-lanka", themes: ["beaches"], days: 4, nights: 3, price: 55000,
  },
  {
    slug: "little-england-weekend", title: "Little England Weekend", region: "Sri Lanka", area: "Nuwara Eliya", location: "Sri Lanka · Nuwara Eliya",
    category: "sri-lanka", themes: ["hill-country"], days: 2, nights: 1, price: 32000,
  },
  {
    slug: "east-coast-whale-watch", title: "East Coast Whale Watch", region: "Sri Lanka", area: "Trincomalee", location: "Sri Lanka · Trincomalee",
    category: "sri-lanka", themes: ["beaches", "wildlife"], days: 3, nights: 2, price: 44000,
  },
  {
    slug: "bali-honeymoon", title: "Bali Honeymoon Special", region: "Indonesia", location: "Indonesia · Bali",
    category: "outbound", outboundRegion: "asia", featured: true, days: 6, nights: 5, price: 210000,
    image: "/images/packages/bali-honeymoon.jpg",
  },
  {
    slug: "bangkok-phuket", title: "Bangkok & Phuket Highlights", region: "Thailand", location: "Thailand",
    category: "outbound", outboundRegion: "asia", featured: true, days: 7, nights: 6, price: 175000,
    image: "/images/packages/bangkok-phuket.jpg",
  },
  {
    slug: "singapore-malaysia-cruise", title: "Singapore–Malaysia Cruise", region: "Singapore", location: "Singapore · Malaysia",
    category: "outbound", outboundRegion: "asia", featured: true, days: 5, nights: 4, price: 240000,
    image: "/images/packages/singapore-malaysia-cruise.jpg",
  },
];

export const featuredPackages = () => packages.filter((p) => p.featured);

export const sriLankaThemes: { id: SriLankaTheme; label: string }[] = [
  { id: "cultural", label: "Cultural Triangle" },
  { id: "hill-country", label: "Hill Country" },
  { id: "beaches", label: "Beaches" },
  { id: "wildlife", label: "Wildlife" },
];

export const outboundRegions: { id: OutboundRegion; label: string; image?: string }[] = [
  { id: "middle-east", label: "Middle East", image: "/images/hero/dubai.jpg" },
  { id: "asia", label: "Asia", image: "/images/packages/bangkok-phuket.jpg" },
  { id: "europe", label: "Europe" },
  { id: "maldives", label: "Maldives", image: "/images/packages/maldives-overwater-villa.jpg" },
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}

/** Packages that have enough content for a detail page. */
export function detailPackages() {
  return packages.filter((p) => p.overview);
}

export function relatedPackages(pkg: Package) {
  return (pkg.related ?? []).map(getPackage).filter((p): p is Package => Boolean(p));
}

export const formatLKR = (n: number) => `LKR ${n.toLocaleString("en-US")}`;

export const durationLabel = (p: Pick<Package, "days" | "nights">) =>
  `${p.days} Days / ${p.nights} ${p.nights === 1 ? "Night" : "Nights"}`;

export const durationShort = (p: Pick<Package, "days" | "nights">) => `${p.days}D / ${p.nights}N`;

/** Breadcrumb parent for a package. */
export const categoryCrumb = {
  outbound: { label: "Outbound Travels", href: "/holidays/outbound" },
  "sri-lanka": { label: "Travel Sri Lanka", href: "/holidays/sri-lanka" },
} as const;
