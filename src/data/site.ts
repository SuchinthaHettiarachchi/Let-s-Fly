export const contact = {
  phone: "+94 77 831 6020",
  phoneHref: "tel:+94778316020",
  email: "info@letsfly.lk",
  whatsappHref: "https://wa.me/94778316020",
  addressShort: "Rajagiriya, Sri Lanka",
  address: "3rd floor, No. 246/2/2, Nawala Road, Rajagiriya",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=246%2F2%2F2+Nawala+Road+Rajagiriya",
  hours: "Mon–Sat · 9.00am – 6.00pm",
  /** Searches Google Maps for the business. Swap for the Google Business Profile reviews link once it's confirmed. */
  googleReviewsHref: "https://www.google.com/maps/search/?api=1&query=Let%27s+Fly.lk+Rajagiriya",
  /** Opens the "write a review" box. Needs the business's Place ID: https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID */
  googleWriteReviewHref: "https://www.google.com/maps/search/?api=1&query=Let%27s+Fly.lk+Rajagiriya",
};

/**
 * External booking portals (partner: Aahaas). Leave null until the real URLs
 * are confirmed; buttons fall back to opening the inquiry form.
 */
export const bookingPortals: { hotels: string | null; flights: string | null } = {
  hotels: null,
  flights: null,
};

export const socials = [
  { label: "f", name: "Facebook", href: "#" },
  { label: "ig", name: "Instagram", href: "#" },
  { label: "tt", name: "TikTok", href: "#" },
  { label: "yt", name: "YouTube", href: "#" },
];

export type NavKey = "home" | "air" | "holidays" | "visa" | "rentals" | "more";

export type NavLink = { label: string; href: string; icon?: string };

export const holidayLinks: NavLink[] = [
  { label: "Travel Sri Lanka + Hotels", href: "/holidays/sri-lanka", icon: "landscape" },
  { label: "Outbound Travels", href: "/holidays/outbound", icon: "travel_explore" },
  { label: "Trains + Cruises", href: "/holidays/trains-cruises", icon: "directions_boat" },
];

export const moreLinks: NavLink[] = [
  { label: "Our Projects", href: "/projects" },
  { label: "Travellers Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Holidays",
    links: [
      ...holidayLinks,
      { label: "Visa Services", href: "/visa" },
      { label: "Air Tickets", href: "/air-tickets" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Projects", href: "/projects" },
      { label: "Travellers Gallery", href: "/gallery" },
      { label: "Rentals", href: "/rentals" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
