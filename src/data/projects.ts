/*
 * CSR, events and group journeys. Only the Dubai conference has full copy in
 * the design; the others use their card summary until the team writes more.
 * Dates other than September 2026 are drafts (the design only shows one).
 */

export type ProjectCategory = "events" | "csr" | "other";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** YYYY-MM, used for sorting and the date label. */
  date: string;
  summary: string;
  image?: string;
  body?: string[];
  /** Photos we have; the gallery pads up to `photoCount` with placeholders. */
  gallery?: string[];
  photoCount?: number;
};

export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: "events", label: "Events" },
  { id: "csr", label: "CSR" },
  { id: "other", label: "Other" },
];

export const projects: Project[] = [
  {
    slug: "annual-regional-conference-dubai",
    title: "Annual Regional Conference in Dubai",
    category: "events",
    date: "2026-09",
    summary:
      "Flights, visas, hotel blocks and venue logistics for 140 delegates from four countries, with on-site coordinators from arrival to the closing dinner.",
    body: [
      "When a regional technology distributor brought its partners together for its annual conference, it needed one team to handle everything from first booking to the closing dinner. Over three days in Dubai, we hosted 140 delegates travelling from Sri Lanka, the Maldives, Bangladesh and Nepal.",
      "We arranged group air tickets on three airlines, processed every UAE visa and secured a block of 75 rooms within walking distance of the venue. Our team managed the conference hall, stage and audio-visual setup, and coordinated daily coach transfers between the hotel and the venue.",
      "Four Let’s Fly coordinators travelled with the group and staffed a help desk in the hotel lobby throughout the event. On the final evening, we hosted an awards dinner on a dhow cruise along Dubai Marina, followed by an optional desert safari the next day for delegates staying on.",
      "Every delegate arrived and departed on schedule, and the client has already asked us to plan next year’s conference in Singapore.",
    ],
    gallery: ["/images/hero/dubai.jpg"],
    photoCount: 7,
  },
  {
    slug: "beach-clean-up-mount-lavinia",
    title: "Beach Clean-up at Mount Lavinia",
    category: "csr",
    date: "2026-08",
    summary:
      "Our team and 120 volunteers cleared over 600 kg of plastic from the shoreline and sorted it for recycling with a local partner.",
  },
  {
    slug: "sales-incentive-trip-bangkok",
    title: "Sales Incentive Trip to Bangkok",
    category: "other",
    date: "2026-07",
    summary:
      "A four-day reward trip for 85 top performers, with chartered seats, a river cruise and a gala dinner overlooking the Chao Phraya.",
    image: "/images/packages/bangkok-phuket.jpg",
  },
  {
    slug: "corporate-awards-night-colombo",
    title: "Corporate Awards Night in Colombo",
    category: "events",
    date: "2026-06",
    summary:
      "Venue, stage production and guest travel for a 300-guest annual awards ceremony, including out-of-town transfers and hotel stays.",
  },
  {
    slug: "back-to-school-monaragala",
    title: "Back-to-School Packs for Monaragala Students",
    category: "csr",
    date: "2026-05",
    summary:
      "We delivered bags, books and stationery to 450 children in three rural schools, and funded new library shelves for the smallest.",
  },
  {
    slug: "singapore-science-tour",
    title: "Singapore Science Tour for Students",
    category: "other",
    date: "2026-04",
    summary:
      "Five days of museums, labs and Sentosa for 60 students and teachers, with 24/7 on-trip coordinators and parent updates every evening.",
    image: "/images/packages/singapore-malaysia-cruise.jpg",
  },
  {
    slug: "travel-fair-2026",
    title: "Let’s Fly Stand at Travel Fair 2026",
    category: "events",
    date: "2026-03",
    summary:
      "Our team met more than 2,000 visitors over three days, launching new Maldives and Japan packages with on-the-spot booking offers.",
  },
  {
    slug: "sinharaja-tree-planting",
    title: "Tree Planting at the Sinharaja Buffer Zone",
    category: "csr",
    date: "2026-02",
    summary:
      "Working with a local conservation group, we planted 1,000 native saplings to help restore forest cover around the reserve.",
  },
  {
    slug: "buddhist-circuit-india",
    title: "Buddhist Circuit Pilgrimage to India",
    category: "other",
    date: "2026-01",
    summary:
      "A guided nine-day pilgrimage for 110 devotees to Bodh Gaya, Sarnath and Kushinagar, with flights, visas and ground transport arranged.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectDate = (p: Project) =>
  new Date(`${p.date}-01T00:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export const categoryLabel = (c: ProjectCategory) => projectCategories.find((x) => x.id === c)!.label;
