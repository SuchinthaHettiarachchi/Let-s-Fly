/**
 * Background photos the home hero cycles through; the title labels each slide dot.
 * `image` is the landscape photo from `sm` up; `mobileImage` is a 9:16 photo for phones.
 */
export type HeroSlide = { image: string; mobileImage: string; title: string };

export const heroSlides: HeroSlide[] = [
  { image: "/images/hero/maldives-beach.jpg", mobileImage: "/images/hero/mobile/maldives-beach.jpg", title: "Maldives Beach Retreat" },
  { image: "/images/hero/dubai.jpg", mobileImage: "/images/hero/mobile/dubai.jpg", title: "Dubai Family Escape" },
  { image: "/images/hero/hill-country-rail.jpg", mobileImage: "/images/hero/mobile/hill-country-rail.jpg", title: "Hill Country by Rail" },
];

export const stats = [
  { value: "14+", label: "Years of service" },
  { value: "5,000+", label: "Happy travellers" },
  { value: "40+", label: "Destinations" },
];

/** A service card links to `href`, or opens the inquiry form for `inquiry` when it has no page yet. */
export type Service = {
  icon: string;
  title: string;
  line: string;
  link: string;
  linkIcon: string;
  href?: string;
  inquiry?: string;
};

export const services: Service[] = [
  { icon: "landscape", title: "Travel Sri Lanka", line: "Trending and seasonal island packages designed for everyone, with drivers, guides and stays.", link: "Explore Packages", linkIcon: "arrow_forward", href: "/holidays/sri-lanka" },
  { icon: "hotel", title: "Hotel Bookings", line: "Search, compare and self-book hotels at the best rates through our online portal.", link: "Book a Hotel", linkIcon: "north_east", href: "/holidays/sri-lanka#hotels" },
  { icon: "travel_explore", title: "Outbound Travels", line: "Group and private holidays to Asia, the Middle East and Europe, fully planned.", link: "See Destinations", linkIcon: "arrow_forward", href: "/holidays/outbound" },
  { icon: "flight", title: "Air Tickets", line: "Self-book flights on our portal or send requirements and we'll book for you.", link: "Book Flights", linkIcon: "arrow_forward", href: "/air-tickets" },
  { icon: "train", title: "Trains + Cruises", line: "Reserved seats on Sri Lanka's scenic rail routes and ocean cruises across Asia.", link: "View Options", linkIcon: "arrow_forward", href: "/holidays/trains-cruises" },
  { icon: "description", title: "Visa Services", line: "Document checks and application submissions for 30+ countries, handled by our visa team.", link: "Check Requirements", linkIcon: "arrow_forward", href: "/visa" },
  { icon: "health_and_safety", title: "Travel Insurance", line: "Medical, baggage and trip-delay cover for every journey, arranged well before you fly.", link: "Get a Quote", linkIcon: "arrow_forward", inquiry: "Travel insurance" },
];

export const howItWorks = [
  { icon: "chat", title: "Tell Us Your Plans", text: "Share your destination, preferences and budget." },
  { icon: "map", title: "We Plan Your Trip", text: "Our travel experts build the itinerary around you." },
  { icon: "luggage", title: "Enjoy Your Trip", text: "We take care of flights, visas, hotels and transportation." },
];

export const rentalPerks = [
  "Airport pick-up & drop-off island-wide",
  "English-speaking chauffeur guides",
  "Daily, weekly & monthly rates",
];

export const rentalTypes = [
  { label: "Cars", icon: "directions_car", image: "/images/rentals/car.jpg", price: "LKR 8,500 / day" },
  { label: "Vans", icon: "airport_shuttle", image: "/images/rentals/van.jpg", price: "LKR 14,000 / day" },
  { label: "Bikes", icon: "two_wheeler", image: "/images/rentals/bike.jpg", price: "LKR 4,500 / day" },
  { label: "Scooters", icon: "moped", image: "/images/rentals/scooter.jpg", price: "LKR 3,000 / day" },
];

/**
 * Real Google reviews of Let's Fly.lk (5.0 from 25 reviews). Long reviews are trimmed to word-for-word
 * excerpts, with "…" where text was left out. `topic` is what the review is about.
 */
export const googleRating = { score: "5.0", count: 25 };

export const reviews = [
  {
    name: "Harsha Jayakody",
    topic: "Schengen visa",
    quote:
      "Let’s Fly provided an excellent and stress-free experience for my family's Schengen visa application. … A special thanks to Kasun and the team, who were incredibly supportive, responsive, and knowledgeable throughout the Schengen visa process.",
  },
  {
    name: "Aashna Lalka",
    topic: "7-day Sri Lanka family tour",
    quote:
      "We had an amazing and unforgettable 7-day family trip to Sri Lanka planned by them. … Their ability to manage a large family, be flexible with the weather, and ensure we had a great experience was exceptional.",
  },
  {
    name: "Britney Francis",
    topic: "Maldives air tickets",
    quote:
      "They arranged my Maldives trip tickets within just two days, and the whole process was smooth and hassle-free. … I also really appreciated that they offered the Koko installment option, which made paying for my tickets much more convenient.",
  },
  {
    name: "Huangao Huang",
    topic: "Yala National Park trip",
    quote:
      "We have a wonderful experience with Let’s Fly in Yala National Park. The driver was very friendly and responsible throughout the trip, even taking us to the beach on the way back. … A very professional team.",
  },
  {
    name: "Saman Hettige",
    topic: "UK visa",
    quote:
      "The entire process was handled with professionalism, attention to detail, and genuine care. Mr. Kasun personally guided us step by step, ensuring our documentation was perfect and every requirement was met.",
  },
  {
    name: "Alfred Torcal",
    topic: "Sri Lanka tour",
    quote:
      "Highly recommended. We had the best possible guide on the most important trip of our life, the best possible driver, and definitely the best agency! Letsfly's service is incredible.",
  },
  {
    name: "Prabhu Nilanga Udawatte",
    topic: "Air tickets",
    quote:
      "I have been using Let's Fly for several years, and the service has always been exceptional. … I highly recommend Kasun and his company for anyone looking for reliable and cost-effective ticketing services.",
  },
  {
    name: "Denista Perera",
    topic: "Visa application",
    quote:
      "Took all the hustle of prepping docs and applying for visa on to their shoulders, all we had to do was make the visit to the visa center. … To top it all off we got the visas as well. Highly recommended.",
  },
  {
    name: "Chandramali Premaratne",
    topic: "Visa consultation",
    quote:
      "Let'sFly.lk provided very professional service on visa consultation to us. Keen and particular about all documents. Very helpful and friendly staff. Recommended for all.",
  },
  {
    name: "Iraj Darshana",
    topic: "Parents' visa",
    quote:
      "Your assistance made a big difference, and we deeply appreciate the way you guided us step by step until we achieved this happy outcome.",
  },
];

/** Airline partner logos for the home page carousel (from letsfly.lk). */
export const airlines = [
  { name: "SriLankan Airlines", logo: "/images/airlines/srilankan.jpg" },
  { name: "Thai Airways", logo: "/images/airlines/thai.jpg" },
  { name: "Qatar Airways", logo: "/images/airlines/qatar.jpg" },
  { name: "Etihad Airways", logo: "/images/airlines/etihad.jpg" },
  { name: "China Airlines", logo: "/images/airlines/china-airlines.jpg" },
  { name: "FitsAir", logo: "/images/airlines/fitsair.jpg" },
  { name: "Emirates", logo: "/images/airlines/emirates.jpg" },
  { name: "Singapore Airlines", logo: "/images/airlines/singapore.jpg" },
  { name: "Malaysia Airlines", logo: "/images/airlines/malaysia.jpg" },
  { name: "Virgin Atlantic", logo: "/images/airlines/virgin-atlantic.jpg" },
  { name: "Cathay Pacific", logo: "/images/airlines/cathay-pacific.jpg" },
  { name: "Qantas", logo: "/images/airlines/qantas.jpg" },
  { name: "Turkish Airlines", logo: "/images/airlines/turkish.jpg" },
  { name: "British Airways", logo: "/images/airlines/british-airways.jpg" },
  { name: "Saudia", logo: "/images/airlines/saudia.jpg" },
  { name: "Air New Zealand", logo: "/images/airlines/air-new-zealand.jpg" },
  { name: "Gulf Air", logo: "/images/airlines/gulf-air.jpg" },
];
