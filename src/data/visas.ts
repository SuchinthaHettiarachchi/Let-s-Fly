/** Visa services. A visa gets a /visa/[slug] page once it has a document checklist. */

export type VisaDocument = { title: string; note?: string };

export type Visa = {
  slug: string;
  country: string;
  /** City shown on the card, e.g. "Dubai". */
  city: string;
  type: "Tourist Visa" | "Business Visa" | "Travel Visa";
  image?: string;
  flag?: string;
  summary?: string;
  facts?: { icon: string; label: string }[];
  documentGroups?: { title: string; items: VisaDocument[] }[];
  warning?: string;
};

export const visas: Visa[] = [
  {
    slug: "dubai",
    country: "United Arab Emirates",
    city: "Dubai",
    type: "Tourist Visa",
    image: "/images/hero/dubai.jpg",
    flag: "/images/flags/ae.svg",
    summary:
      "UAE tourist visa for holidays and family visits to Dubai. We check your documents, apply on your behalf and send your eVisa straight to WhatsApp.",
    facts: [
      { icon: "schedule", label: "Processing 3 to 5 working days" },
      { icon: "calendar_month", label: "30 or 60 day stay" },
      { icon: "badge", label: "eVisa · single entry" },
    ],
    documentGroups: [
      {
        title: "General Requirements",
        items: [
          { title: "Valid passport", note: "At least 6 months' validity from your arrival date in the UAE" },
          { title: "Colour scan of the passport bio page", note: "Clear and uncropped, with no glare on the photo" },
          { title: "Recent passport-size photograph", note: "White background, taken within the last 6 months" },
          { title: "National Identity Card (NIC) copy" },
          { title: "Confirmed return flight ticket" },
          {
            title: "Hotel booking or host address in the UAE",
            note: "If staying with family, a copy of the host's Emirates ID and residence visa",
          },
          { title: "Personal bank statements for the last 3 months" },
          { title: "Employment letter on company letterhead", note: "Stating position, salary and approved leave dates" },
        ],
      },
      {
        title: "If Applicant Is Self Employed",
        items: [
          { title: "Business Registration Certificate", note: "Certified copy, in place of the employment letter" },
          { title: "Business bank statements for the last 3 months" },
          { title: "Form 1 / Form 20 (for companies)", note: "Showing directors and shareholding" },
          { title: "Income tax file or latest tax payment receipt" },
          { title: "Letter on business letterhead confirming travel dates", note: "Signed by the applicant as owner or director" },
        ],
      },
    ],
    warning:
      "UAE immigration can ask for extra documents or a refundable deposit. Talk to us before you book non-refundable travel.",
  },
  { slug: "maldives", country: "Maldives", city: "Malé", type: "Travel Visa", image: "/images/packages/maldives-overwater-villa.jpg" },
  { slug: "thailand", country: "Thailand", city: "Bangkok", type: "Travel Visa", image: "/images/packages/bangkok-phuket.jpg" },
];

export const getVisa = (slug: string) => visas.find((v) => v.slug === slug);

/** Visas with enough content for their own page. */
export const detailVisas = () => visas.filter((v) => v.documentGroups?.length);

export const visaSteps = [
  { title: "Share details", text: "Tell us your destination and travel dates." },
  { title: "Document check", text: "We review everything and flag gaps." },
  { title: "We submit", text: "Forms, fees and appointment, all handled." },
  { title: "Visa in hand", text: "Track progress on WhatsApp until approval." },
];

/** Visas for foreign nationals coming to Sri Lanka (the "Visas for Sri Lanka" tab). */
export type SriLankaVisa = {
  name: string;
  short: string;
  icon: string;
  image: string;
  text: string;
  purposes: string[];
  facts: { label: string; value: string }[];
};

export const sriLankaVisas: SriLankaVisa[] = [
  {
    name: "Tourist Visit Visa",
    short: "Tourist Visa",
    icon: "beach_access",
    image: "/images/hero/pexels-marina-zvada-844583049-35606862.jpg",
    text: "For holidays and leisure travel across the island.",
    purposes: ["Holidays & sightseeing", "Visiting family or friends", "Yoga & Ayurvedic treatment", "Sporting & cultural events"],
    facts: [
      { label: "Standard ETA", value: "30 days" },
      { label: "Entries", value: "Double" },
      { label: "Extendable up to", value: "270 days" },
    ],
  },
  {
    name: "Business Purpose Visa",
    short: "Business Visa",
    icon: "work",
    image: "/images/visa/business-conference.jpg",
    text: "For short business visits to Sri Lanka.",
    purposes: ["Business meetings", "Negotiations", "Conferences & symposiums", "Short-term training"],
    facts: [
      { label: "Purpose", value: "Business" },
      { label: "Training length", value: "< 1 month" },
      { label: "Application", value: "ETA" },
    ],
  },
];

export const residenceCategories: { title: string; icon: string; text: string; highlight?: string }[] = [
  {
    title: "Employment Category",
    icon: "badge",
    text: "For personnel working on Board of Investment (BOI) projects, banks, or approved private sector organisations.",
  },
  {
    title: "Investor Category",
    icon: "trending_up",
    text: "For foreign nationals making qualifying capital investments in Sri Lanka.",
    highlight: "From USD 100,000 · 5-year visa",
  },
  {
    title: "Student Category",
    icon: "school",
    text: "For approved courses at educational institutions, or recognised volunteer and intern programmes.",
  },
  {
    title: "Family / Spouse Category",
    icon: "family_restroom",
    text: "For spouses and dependents of Sri Lankan citizens or primary visa holders.",
  },
  {
    title: "Digital Nomad Visa",
    icon: "laptop_mac",
    text: "Lets remote workers legally live in Sri Lanka while working for foreign employers.",
  },
];
