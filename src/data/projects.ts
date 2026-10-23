/*
 * MICE projects: meetings, incentives, conferences and exhibitions. These are
 * sample entries until the client adds the real ones. Only the Dubai conference
 * has full copy; the others use their card summary.
 */

export type ProjectCategory = "meetings" | "incentives" | "conferences" | "exhibitions";

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
  { id: "meetings", label: "Meetings" },
  { id: "incentives", label: "Incentives" },
  { id: "conferences", label: "Conferences" },
  { id: "exhibitions", label: "Exhibitions" },
];

export const projects: Project[] = [
  {
    slug: "annual-regional-conference-dubai",
    title: "Annual Regional Conference in Dubai",
    category: "conferences",
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
    slug: "leadership-offsite-kandy",
    title: "Leadership Offsite in Kandy",
    category: "meetings",
    date: "2026-08",
    summary:
      "Two days of strategy sessions for 40 senior managers at a hill-country resort, with meeting rooms, team dinners and transfers from Colombo.",
  },
  {
    slug: "sales-incentive-trip-bangkok",
    title: "Sales Incentive Trip to Bangkok",
    category: "incentives",
    date: "2026-07",
    summary:
      "A four-day reward trip for 85 top performers, with chartered seats, a river cruise and a gala dinner overlooking the Chao Phraya.",
    image: "/images/packages/bangkok-phuket.jpg",
  },
  {
    slug: "corporate-awards-night-colombo",
    title: "Corporate Awards Night in Colombo",
    category: "meetings",
    date: "2026-06",
    summary:
      "Venue, stage production and guest travel for a 300-guest annual awards ceremony, including out-of-town transfers and hotel stays.",
  },
  {
    slug: "partner-summit-colombo",
    title: "Partner Summit in Colombo",
    category: "conferences",
    date: "2026-05",
    summary:
      "A one-day summit for 250 regional partners, with venue booking, keynote stage set-up, delegate registration and hotel stays.",
  },
  {
    slug: "singapore-science-tour",
    title: "Singapore Science Tour for Students",
    category: "incentives",
    date: "2026-04",
    summary:
      "Five days of museums, labs and Sentosa for 60 students and teachers, with 24/7 on-trip coordinators and parent updates every evening.",
    image: "/images/packages/singapore-malaysia-cruise.jpg",
  },
  {
    slug: "travel-fair-2026",
    title: "Let’s Fly Stand at Travel Fair 2026",
    category: "exhibitions",
    date: "2026-03",
    summary:
      "Our team met more than 2,000 visitors over three days, launching new Maldives and Japan packages with on-the-spot booking offers.",
  },
  {
    slug: "itb-asia-pavilion",
    title: "Sri Lanka Pavilion at ITB Asia",
    category: "exhibitions",
    date: "2026-02",
    summary:
      "Stand design, shipping and travel for eight exhibitors sharing a Sri Lanka pavilion at the trade show in Singapore.",
  },
  {
    slug: "buddhist-circuit-india",
    title: "Buddhist Circuit Pilgrimage to India",
    category: "incentives",
    date: "2026-01",
    summary:
      "A guided nine-day pilgrimage for 110 devotees to Bodh Gaya, Sarnath and Kushinagar, with flights, visas and ground transport arranged.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectDate = (p: Project) =>
  new Date(`${p.date}-01T00:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export const categoryLabel = (c: ProjectCategory) => projectCategories.find((x) => x.id === c)!.label;
