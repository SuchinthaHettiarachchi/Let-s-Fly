/** About Us page content. Items marked "draft" were not readable in the design and need confirming. */

export const aboutParagraphs = [
  "Let's Fly started in a small Rajagiriya office with one simple idea: planning a trip abroad shouldn't feel harder than the trip itself.",
  "Today we're a team of travel consultants, visa specialists and ticketing experts. We book flights, prepare visa files, find the right hotel, build tour packages and look after companies whose people travel for work. But what people remember is the person who answered the phone, checked their documents twice and messaged them on the morning of their flight.",
  "We're here for first-time travellers and seasoned ones, for families, students and business teams, anyone who wants a trip planned properly by people who care about getting it right.",
];

export const founderQuote = {
  initials: "KB",
  quote: "Every booking is someone's plan, savings and hopes. We treat it that way.",
  name: "Kasun Bulathsinhala",
  role: "Chief Executive Officer, Let's Fly.lk",
};

// Draft — the five approach cards are images in the design; confirm wording.
export const approach = [
  { icon: "person_check", title: "One consultant, start to finish", text: "The person who quotes your trip is the one who sees it through." },
  { icon: "fact_check", title: "Documents checked twice", text: "Every visa file is reviewed by a second specialist before it goes in." },
  { icon: "receipt_long", title: "Honest, all-in pricing", text: "Clear quotes in LKR, with what's included and what isn't spelled out." },
  { icon: "tune", title: "Planned around you", text: "Your dates, your budget and your pace — not a one-size-fits-all package." },
  { icon: "chat", title: "Always reachable", text: "A real person on WhatsApp before, during and after your trip." },
];

export const journeysThisYear = [
  { image: "/images/packages/dubai-family-escape.jpg", place: "Dubai", caption: "Family holidays" },
  { image: "/images/packages/maldives-overwater-villa.jpg", place: "Maldives", caption: "Honeymoons" },
  { image: "/images/packages/kandy-ella-rail.jpg", place: "Kandy → Ella", caption: "Scenic rail" },
  { image: "/images/packages/bangkok-phuket.jpg", place: "Bangkok", caption: "Incentive trips" },
  { image: "/images/packages/singapore-malaysia-cruise.jpg", place: "Singapore", caption: "School tours" },
];

export const underOneRoof = [
  { icon: "flight", title: "Air tickets" },
  { icon: "description", title: "Visa services" },
  { icon: "hotel", title: "Hotel bookings" },
  { icon: "travel_explore", title: "Tour packages" },
  { icon: "directions_car", title: "Car & bike rental" },
  { icon: "business_center", title: "Corporate travel" },
];

export const commitments = [
  { title: "Reliable service", text: "Licensed, accredited and backed by long-standing airline and hotel partners." },
  { title: "Clear communication", text: "Straight answers on prices, timelines and requirements, with no hidden extras." },
  { title: "Convenient planning", text: "Plan over WhatsApp, a call or a visit, whichever suits you." },
  { title: "Professional support", text: "Specialists for every service, and a reply within two working hours." },
  { title: "Customer satisfaction", text: "We follow up after every trip and use what you tell us to do better next time." },
  { title: "Long-term relationships", text: "Most of our travellers come back, and many bring their families and colleagues." },
];

export const aboutStats = [
  { value: "15,000+", label: "Happy travellers" },
  { value: "30+", label: "Visa countries" },
  { value: "4.9", label: "Average rating" },
  { value: "24/7", label: "Travel support" },
];

export type TeamMember = { name: string; role: string; photo?: string };

// Draft — only the CEO is named in the design. Replace placeholders with real names and photos.
export const team: { department: string; members: TeamMember[] }[] = [
  {
    department: "Leadership",
    members: [
      { name: "Kasun Bulathsinhala", role: "Chief Executive Officer" },
      { name: "Name to confirm", role: "Head of Operations" },
    ],
  },
  {
    department: "Visa & Travel Counselors",
    members: [
      { name: "Name to confirm", role: "Senior Visa Counselor" },
      { name: "Name to confirm", role: "Travel Counselor" },
    ],
  },
  {
    department: "Airline Ticketing & Reservations",
    members: [
      { name: "Name to confirm", role: "Ticketing Manager" },
      { name: "Name to confirm", role: "Reservations Executive" },
    ],
  },
  {
    department: "Inbound & Outbound Tours",
    members: [
      { name: "Name to confirm", role: "Tours Manager" },
      { name: "Name to confirm", role: "Tour Coordinator" },
    ],
  },
  {
    department: "Finance & Operations",
    members: [{ name: "Name to confirm", role: "Finance Executive" }],
  },
];

export const visionPoints = [
  "More destinations and visa services every year",
  "Simpler online planning, with a real person behind it",
  "Travel within reach for more families and businesses",
];
