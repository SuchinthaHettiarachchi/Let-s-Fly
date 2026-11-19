/** Static visitor-facing content for the Visa Services listing page. */

export const visaSteps = [
  { title: "Share details", text: "Tell us your destination and travel dates." },
  { title: "Document check", text: "We review everything and flag gaps." },
  { title: "We submit", text: "Forms, fees and appointment, all handled." },
  { title: "Visa in hand", text: "Track progress on WhatsApp until approval." },
];

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
