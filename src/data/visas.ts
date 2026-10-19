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
      { icon: "schedule", label: "Processing 3–5 working days" },
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
  { title: "We submit", text: "Forms, fees and appointment — handled." },
  { title: "Visa in hand", text: "Track progress on WhatsApp until approval." },
];
