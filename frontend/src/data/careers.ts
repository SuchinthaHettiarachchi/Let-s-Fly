/** Open roles shown in "Build your career with us" on the Contact page. */

export type Job = {
  id: string;
  title: string;
  icon: string;
  status: "Hiring" | "Soon" | "Open";
  meta: { icon: string; label: string }[];
  text: string;
  posted: string;
};

export const jobs: Job[] = [
  {
    id: "travel-consultant",
    title: "Travel Consultant",
    icon: "support_agent",
    status: "Hiring",
    meta: [
      { icon: "work", label: "Full-time" },
      { icon: "location_on", label: "Rajagiriya" },
      { icon: "schedule", label: "1 to 3 yrs" },
    ],
    text: "Plan holidays, quote packages and look after travellers from first inquiry to safe return. Strong English and customer service skills required.",
    posted: "Posted 3 days ago",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Executive",
    icon: "campaign",
    status: "Hiring",
    meta: [
      { icon: "work", label: "Full-time" },
      { icon: "location_on", label: "Rajagiriya" },
      { icon: "schedule", label: "1 to 2 yrs" },
    ],
    text: "Run our social channels, ads and email campaigns, and create content that inspires Sri Lankans to travel more.",
    posted: "Posted 1 week ago",
  },
  {
    id: "tour-operations",
    title: "Tour Operations Coordinator",
    icon: "map",
    status: "Soon",
    meta: [
      { icon: "work", label: "Full-time" },
      { icon: "location_on", label: "Rajagiriya" },
      { icon: "schedule", label: "2+ yrs" },
    ],
    text: "Coordinate drivers, hotels and guides for inbound and outbound tours, and keep every itinerary running on time.",
    posted: "Opening soon",
  },
  {
    id: "internship",
    title: "Internship Programme",
    icon: "school",
    status: "Open",
    meta: [
      { icon: "work", label: "6 months" },
      { icon: "location_on", label: "Rajagiriya" },
      { icon: "schedule", label: "Students" },
    ],
    text: "Learn ticketing, visas and tour planning alongside our team. Ideal for tourism and business management students.",
    posted: "Applications open",
  },
];

export const officeHours = [
  { days: "Monday to Friday", hours: "9.00am to 6.00pm" },
  { days: "Saturday", hours: "9.00am to 1.00pm" },
  { days: "Sunday & Poya days", hours: "Closed" },
];
