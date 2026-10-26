/** About Us page content. Items marked "draft" were not readable in the design and need confirming. */

import { contact } from "./site";

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

// Draft: the five approach cards are images in the design; confirm wording.
/** Our approach: five words, each opened on hover or when scrolled to the middle of the screen. */
export const approach = [
  { title: "Simple.", text: "One conversation, one point of contact. We turn airline rules, visa forms and hotel options into a clear plan you can actually follow." },
  { title: "Convenient.", text: "Reach us on WhatsApp, by phone or in person. We send documents, tickets and updates to you, so you don't have to chase anything." },
  { title: "Personal.", text: "Your budget, your pace, your family. We ask the right questions first, then plan around the answers." },
  { title: "Reliable.", text: "Trusted airline and hotel partners, licensed operations and a team that answers when plans change at the last minute." },
  { title: "Well planned.", text: "Connections, transfers, check-in times and paperwork checked before you leave, so there are fewer surprises on the way." },
];

export const journeysThisYear = [
  { image: "/images/packages/dubai-family-escape.jpg", place: "Dubai", caption: "Family holidays" },
  { image: "/images/packages/maldives-overwater-villa.jpg", place: "Maldives", caption: "Honeymoons" },
  { image: "/images/packages/kandy-ella-rail.jpg", place: "Kandy → Ella", caption: "Scenic rail" },
  { image: "/images/packages/bangkok-phuket.jpg", place: "Bangkok", caption: "Incentive trips" },
  { image: "/images/packages/singapore-malaysia-cruise.jpg", place: "Singapore", caption: "School tours" },
];

export const underOneRoof = [
  { icon: "flight", title: "Flights", text: "Best-value fares on trusted airlines, with changes handled for you." },
  { icon: "badge", title: "Visas", text: "Document checks, forms and appointments for 30+ countries." },
  { icon: "apartment", title: "Hotels", text: "Stays matched to your budget, with exclusive partner rates." },
  { icon: "explore", title: "Travel Packages", text: "Ready-made or custom tours, from Dubai to Europe." },
  { icon: "business_center", title: "Corporate Travel", text: "Managed bookings, invoicing and support for business teams." },
  { icon: "headset_mic", title: "Travel Support", text: "Insurance, transfers and a real person to message while you're away." },
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

export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
  linkedin?: string;
  email?: string;
  /** Display format, e.g. "+94 77 831 6020"; the tel: link is built from it. */
  phone?: string;
};

// Draft: each member's own email and phone are to be confirmed. Until then every row
// shows the main office contact. Replace per member once the real details arrive.
const contactToConfirm = { email: contact.email, phone: contact.phone };

// Draft: only the CEO is named in the design. Replace placeholders with real names and photos.
export const team: { department: string; members: TeamMember[] }[] = [
  {
    department: "Leadership",
    members: [
      { name: "Kasun Bulathsinhala", role: "Chief Executive Officer", ...contactToConfirm },
      { name: "Name to confirm", role: "Head of Operations", ...contactToConfirm },
    ],
  },
  {
    department: "Visa & Travel Counselors",
    members: [
      { name: "Name to confirm", role: "Senior Visa Counselor", ...contactToConfirm },
      { name: "Name to confirm", role: "Travel Counselor", ...contactToConfirm },
    ],
  },
  {
    department: "Airline Ticketing & Reservations",
    members: [
      { name: "Name to confirm", role: "Ticketing Manager", ...contactToConfirm },
      { name: "Name to confirm", role: "Reservations Executive", ...contactToConfirm },
    ],
  },
  {
    department: "Inbound & Outbound Tours",
    members: [
      { name: "Name to confirm", role: "Tours Manager", ...contactToConfirm },
      { name: "Name to confirm", role: "Tour Coordinator", ...contactToConfirm },
    ],
  },
  {
    department: "Finance & Operations",
    members: [{ name: "Name to confirm", role: "Finance Executive", ...contactToConfirm }],
  },
];

/** Official wording, taken from letsfly.lk/about. */
export const visionMission = [
  {
    title: "Vision",
    image: "/images/about/vision.jpg",
    text: "To be the most trusted and customer-focused service provider, creating unforgettable experiences, delivering exceptional value, and building lasting partnerships based on quality and care.",
  },
  {
    title: "Mission",
    image: "/images/about/mission.jpg",
    text: "To exceed client expectations through innovative, value-driven travel solutions, delivering professional and efficient services while upholding the highest ethical standards and social responsibility.",
  },
];
