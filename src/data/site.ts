export const contact = {
  phone: "+94 77 831 6020",
  phoneHref: "tel:+94778316020",
  email: "info@letsfly.lk",
  whatsappHref: "https://wa.me/94778316020",
  addressShort: "Rajagiriya, Sri Lanka",
  address: "3rd floor, No. 246/2/2, Nawala Road, Rajagiriya",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=Let%27s+Fly.lk+246%2F2%2F2+Nawala+Road+Rajagiriya",
  /** Keyless Google Maps embed of the office, used on Contact and in the footer. */
  mapEmbedHref:
    "https://maps.google.com/maps?q=Let%27s+Fly.lk+Rajagiriya&z=16&output=embed",
  hours: "Mon to Sat, 9.00am to 6.00pm",
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

export type SocialName = "Facebook" | "Instagram" | "TikTok" | "LinkedIn";

// Shown in the top bar and the footer. TikTok is still "#" until its link is confirmed.
export const socials: { name: SocialName; href: string }[] = [
  { name: "Facebook", href: "https://www.facebook.com/Letsfly.lk" },
  { name: "Instagram", href: "https://www.instagram.com/letsfly.lk/" },
  { name: "TikTok", href: "#" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/letsfly-lk" },
];

export type NavLink = { label: string; href: string; icon?: string };

export type NavGroup = { key: string; label: string; links: NavLink[] };

/** Dropdowns in the main menu, between Home and Contact Us. */
export const navGroups: NavGroup[] = [
  {
    key: "sri-lanka",
    label: "Travel Sri Lanka",
    links: [
      { label: "Sri Lanka Tours", href: "/holidays/sri-lanka", icon: "landscape" },
      { label: "Hotel Bookings", href: "/holidays/sri-lanka#hotels", icon: "hotel" },
      { label: "Car & Bike Rentals", href: "/rentals", icon: "directions_car" },
    ],
  },
  {
    key: "outbound",
    label: "Outbound Travel",
    links: [
      { label: "Outbound Packages", href: "/holidays/outbound", icon: "travel_explore" },
      { label: "Air Tickets", href: "/air-tickets", icon: "flight" },
      { label: "Visa Services", href: "/visa", icon: "description" },
    ],
  },
  {
    key: "more",
    label: "More Travel",
    links: [
      { label: "Trains & Cruise Adventures", href: "/holidays/trains-cruises", icon: "directions_boat" },
      { label: "Our Projects", href: "/projects", icon: "work" },
      { label: "Travellers Gallery", href: "/gallery", icon: "photo_library" },
      { label: "About Us", href: "/about", icon: "info" },
    ],
  },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Quick Links & Services",
    links: [
      { label: "Home", href: "/" },
      { label: "Visa Services", href: "/visa" },
      { label: "Air Ticket Booking", href: "/air-tickets" },
      { label: "Travellers Gallery", href: "/gallery" },
      { label: "Our Projects", href: "/projects" },
      { label: "About Us", href: "/about" },
      { label: "Join Our Team", href: "/contact#careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    // /privacy, /terms and /gdpr exist; FAQ and Refund Policy still need pages before launch.
    title: "Legal & Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "FAQ", href: "/faq" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "GDPR Compliance", href: "/gdpr" },
    ],
  },
];

export type PaymentMark = "Visa" | "Mastercard" | "Amex" | "Koko";

/** Payment marks shown in the footer. */
export const paymentMethodsAccepted: PaymentMark[] = ["Visa", "Mastercard", "Amex", "Koko"];
