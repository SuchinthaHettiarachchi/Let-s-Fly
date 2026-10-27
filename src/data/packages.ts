/*
 * Tour packages. Every package needs the card fields; the detail fields
 * (overview, itinerary, inclusions) are optional and a package only gets a
 * /packages/[slug] page once it has them. This file stands in for the CMS.
 */

export type Highlight = { icon: string; label: string };

export type ItineraryDay = {
  category: string;
  title: string;
  /** Short facts under the title, e.g. location, duration. Not shown on the page at the moment. */
  meta?: { icon: string; label: string }[];
  body: string;
};

export type InclusionItem = { title: string; note?: string };

export type SriLankaTheme = "cultural" | "hill-country" | "beaches" | "wildlife";
export type OutboundRegion = "middle-east" | "asia" | "europe" | "maldives";

export type Package = {
  slug: string;
  title: string;
  /** Short region label for cards, e.g. "UAE". */
  region: string;
  /** Longer location label for the detail page, e.g. "UAE · Dubai". */
  location: string;
  category: "outbound" | "sri-lanka";
  /** Outbound only: which "Where to next?" region it belongs to. */
  outboundRegion?: OutboundRegion;
  /** Sri Lanka only: themes used by the filter chips. */
  themes?: SriLankaTheme[];
  /** Places shown on the card tag, e.g. "Sigiriya · Dambulla". Falls back to region. */
  area?: string;
  badge?: string;
  /** Shown in the Home page carousel. */
  featured?: boolean;
  days: number;
  nights: number;
  /** Price per person in LKR. */
  price: number;
  /** Card photo. Missing photos render as a placeholder. */
  image?: string;

  priceNote?: string;
  flightsIncluded?: boolean;
  rating?: { score: number; count: number };
  gallery?: string[];
  brochureUrl?: string;
  overview?: { summary: string; highlights: Highlight[] };
  itinerary?: {
    /** e.g. "Colombo ⇄ Dubai" */
    endpoints: string;
    route: string[];
    footnote: string;
    days: ItineraryDay[];
  };
  inclusions?: { intro: string; included: InclusionItem[]; excluded: InclusionItem[] };
  related?: string[];
};

const sriLankaFootnote =
  "Driving times are indicative and the order of visits may change with weather, train schedules and availability. Your final itinerary is confirmed with your booking.";

const outboundFootnote =
  "Flight times are indicative and the order of activities may change with weather, schedules and availability. Your final itinerary is confirmed with your booking.";

export const packages: Package[] = [
  {
    slug: "dubai-family-escape",
    title: "Dubai Family Escape",
    region: "UAE",
    location: "UAE · Dubai",
    category: "outbound",
    outboundRegion: "middle-east",
    badge: "Best seller",
    featured: true,
    days: 6,
    nights: 5,
    price: 150000,
    image: "/images/packages/dubai-family-escape.jpg",
    priceNote: "Twin share · flights, hotel & visa",
    flightsIncluded: true,
    rating: { score: 4.9, count: 128 },
    // Only two real photos so far; the gallery fills the remaining slots with placeholders.
    gallery: ["/images/hero/dubai.jpg", "/images/hero/maldives-beach.jpg"],
    overview: {
      summary:
        "A relaxed six-day trip built for families: a desert safari with BBQ dinner, the Burj Khalifa at sunset, a full day at a theme park and a dhow cruise along Dubai Marina. Five nights in a 4★ hotel with breakfast, private airport transfers and your UAE visa, all arranged from Colombo.",
      highlights: [
        { icon: "landscape", label: "Desert safari & BBQ dinner" },
        { icon: "apartment", label: "Burj Khalifa at the Top" },
        { icon: "attractions", label: "Full-day theme park pass" },
        { icon: "sailing", label: "Marina dhow dinner cruise" },
        { icon: "airport_shuttle", label: "Private airport transfers" },
        { icon: "description", label: "UAE tourist visa" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Dubai",
      route: ["Colombo", "Downtown Dubai", "Desert Conservation Reserve", "Yas Island", "Dubai Marina", "Colombo"],
      footnote:
        "Flight times are indicative and the order of activities may change with weather, park schedules and availability. Your final itinerary is confirmed with your booking.",
      days: [
        {
          category: "Arrival",
          title: "Colombo to Dubai, check in & Dubai Mall evening",
          meta: [
            { icon: "location_on", label: "Downtown Dubai" },
            { icon: "hotel", label: "4★ hotel" },
          ],
          body: "Fly out of Bandaranaike International on a morning flight and land in Dubai by early afternoon. Our representative meets you at arrivals and drives you to your hotel. After a rest, head to The Dubai Mall for the aquarium tunnel and the Dubai Fountain show, a gentle first evening that kids love.",
        },
        {
          category: "City sightseeing",
          title: "Old Dubai, Dubai Frame & Burj Khalifa at sunset",
          meta: [
            { icon: "location_on", label: "Al Fahidi · Deira · Downtown" },
            { icon: "schedule", label: "Half-day tour" },
          ],
          // Draft copy: not in the design; confirm with the travel team.
          body: "Start in the Al Fahidi historic district, cross the creek by abra to the Deira spice and gold souks, then stop at the Dubai Frame for views of old and new Dubai. After an afternoon break at the hotel, ride up to the Burj Khalifa observation deck in time for sunset.",
        },
        {
          category: "Adventure",
          title: "Desert safari with dune bashing & BBQ dinner",
          meta: [
            { icon: "location_on", label: "Dubai Desert Conservation Reserve" },
            { icon: "schedule", label: "Afternoon & evening" },
          ],
          // Draft copy: not in the design; confirm with the travel team.
          body: "A free morning to enjoy the pool. In the afternoon a 4×4 picks you up for dune bashing, sandboarding and a short camel ride, then dinner at a desert camp with a BBQ buffet, henna and live shows under the stars.",
        },
        {
          category: "Theme park",
          title: "Full day at Ferrari World or Warner Bros. World",
          meta: [
            { icon: "location_on", label: "Yas Island, Abu Dhabi" },
            { icon: "schedule", label: "Full day" },
          ],
          // Draft copy: not in the design; confirm with the travel team.
          body: "A private transfer takes you to Yas Island in Abu Dhabi. Choose Ferrari World for record-breaking rides or Warner Bros. World for the younger ones. Your pass covers a full day of entry. Back to Dubai in the evening.",
        },
        {
          category: "Leisure & cruise",
          title: "Beach morning, Palm Jumeirah & Marina dhow dinner cruise",
          meta: [
            { icon: "location_on", label: "JBR · Palm · Dubai Marina" },
            { icon: "schedule", label: "2-hour cruise" },
          ],
          // Draft copy: not in the design; confirm with the travel team.
          body: "Spend the morning at JBR beach, then drive out along the Palm Jumeirah for photos at the Atlantis. In the evening, board a traditional dhow for a two-hour dinner cruise past the lights of Dubai Marina.",
        },
        {
          category: "Departure",
          title: "Last-minute shopping & flight home to Colombo",
          meta: [
            { icon: "location_on", label: "Dubai → Colombo" },
            { icon: "flight", label: "Return flight" },
          ],
          // Draft copy: not in the design; confirm with the travel team.
          body: "Check out after breakfast and fit in some last-minute shopping before your private transfer to Dubai International for the flight back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro:
        "Everything below is covered in the package price of LKR 150,000 per person. Items under “Not included” can be paid locally or added to your booking. Ask us for a quote.",
      included: [
        { title: "Return economy flights Colombo ⇄ Dubai", note: "Direct flights with 30 kg checked baggage per person" },
        { title: "5 nights in a 4★ hotel", note: "Rove Downtown or similar, twin-share family room" },
        { title: "Daily breakfast" },
        { title: "Private airport transfers" },
        { title: "Desert safari with BBQ dinner", note: "Dune bashing, sandboarding, camel ride and live shows" },
        { title: "Burj Khalifa “At the Top” tickets", note: "Levels 124 & 125, sunset time slot" },
        {
          title: "Full-day theme park pass & Marina dhow dinner cruise",
          note: "Choice of Ferrari World or Warner Bros. World, Abu Dhabi",
        },
        { title: "UAE 30-day tourist visa" },
      ],
      excluded: [
        { title: "Travel insurance", note: "Strongly recommended; we can arrange a policy" },
        { title: "Dubai Tourism Dirham fee", note: "Paid directly at the hotel, approx. AED 15 per room per night" },
        { title: "Lunches and dinners not mentioned in the itinerary" },
        { title: "Personal expenses" },
        {
          title: "Optional tours and room upgrades",
          note: "e.g. Burj Khalifa Level 148, Atlantis Aquaventure, sea-view rooms",
        },
        { title: "Tips and gratuities for guides and drivers" },
      ],
    },
    related: ["maldives-overwater-villa", "singapore-malaysia-cruise", "bangkok-phuket"],
  },
  {
    slug: "abu-dhabi-dubai-combo", title: "Abu Dhabi & Dubai Combo", region: "UAE", location: "UAE · Abu Dhabi · Dubai",
    category: "outbound", outboundRegion: "middle-east", badge: "New", flightsIncluded: true, days: 6, nights: 5, price: 178000,
    image: "/images/packages/abu-dhabi-dubai-combo.jpg",
    // Outbound detail copy below is draft; confirm hotels, timings and inclusions with the travel team.
    priceNote: "Twin share · flights, hotels & visa",
    overview: {
      summary:
        "Two emirates in one trip: two nights in Abu Dhabi for the Sheikh Zayed Grand Mosque, the Louvre and Yas Island, then three nights in Dubai for the Burj Khalifa, a desert safari and the Marina. Flights from Colombo, 4★ hotels, transfers between the cities and your UAE visa are all arranged.",
      highlights: [
        { icon: "mosque", label: "Sheikh Zayed Grand Mosque" },
        { icon: "museum", label: "Louvre Abu Dhabi" },
        { icon: "attractions", label: "Yas Island theme park" },
        { icon: "apartment", label: "Burj Khalifa at the Top" },
        { icon: "landscape", label: "Desert safari & BBQ dinner" },
        { icon: "description", label: "UAE tourist visa" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Abu Dhabi · Dubai",
      route: ["Colombo", "Abu Dhabi", "Yas Island", "Dubai", "Colombo"],
      footnote: outboundFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Abu Dhabi & Corniche evening",
          body: "Fly to Abu Dhabi, where our representative meets you and drives you to your hotel. In the evening, walk along the Corniche and watch the city lights over the water.",
        },
        {
          category: "City sightseeing",
          title: "Grand Mosque, Louvre Abu Dhabi & Qasr Al Watan",
          body: "Start at the Sheikh Zayed Grand Mosque, then see the Louvre Abu Dhabi under its famous dome and the presidential palace at Qasr Al Watan.",
        },
        {
          category: "Theme park",
          title: "Yas Island, then transfer to Dubai",
          body: "Spend the day at Ferrari World or Warner Bros. World on Yas Island, then take a private transfer to your Dubai hotel in the evening.",
        },
        {
          category: "City sightseeing",
          title: "Old Dubai, souks & Burj Khalifa at sunset",
          body: "Cross the creek by abra to the gold and spice souks, visit the Dubai Frame, and ride up the Burj Khalifa in time for sunset.",
        },
        {
          category: "Adventure",
          title: "Desert safari with dune bashing & BBQ dinner",
          body: "A free morning, then a 4×4 picks you up for dune bashing, sandboarding and a camel ride, with dinner and live shows at a desert camp.",
        },
        {
          category: "Departure",
          title: "Dubai Marina & flight home",
          body: "Walk along Dubai Marina and JBR for some last shopping before your transfer to the airport and the flight back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 178,000 per person.",
      included: [
        { title: "Return economy flights Colombo ⇄ UAE", note: "30 kg checked baggage per person" },
        { title: "2 nights in Abu Dhabi and 3 nights in Dubai", note: "4★ hotels, twin share" },
        { title: "Daily breakfast" },
        { title: "Airport and intercity transfers" },
        { title: "Abu Dhabi city tour with Louvre entry" },
        { title: "Theme park day pass", note: "Ferrari World or Warner Bros. World" },
        { title: "Burj Khalifa tickets and desert safari with BBQ dinner" },
        { title: "UAE 30-day tourist visa" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Tourism Dirham fee", note: "Paid at the hotels" },
        { title: "Lunches and dinners not mentioned" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["dubai-family-escape", "muscat-desert-coast", "maldives-overwater-villa"],
  },
  {
    slug: "muscat-desert-coast", title: "Muscat Desert & Coast", region: "Oman", location: "Oman · Muscat",
    category: "outbound", outboundRegion: "middle-east", badge: "Adventure", flightsIncluded: true, days: 5, nights: 4, price: 165000,
    image: "/images/packages/muscat-desert-coast.jpg",
    priceNote: "Twin share · flights, hotel & visa",
    overview: {
      summary:
        "Oman's quieter side in five days: Muscat's grand mosque and old souk, a night under the stars in the Wahiba Sands, swimming in the turquoise pools of Wadi Shab and a dolphin cruise along the coast. Flights from Colombo, hotels, a desert camp, a driver-guide and your Oman e-visa are included.",
      highlights: [
        { icon: "mosque", label: "Sultan Qaboos Grand Mosque" },
        { icon: "storefront", label: "Mutrah Souk & Corniche" },
        { icon: "landscape", label: "Wahiba Sands desert camp" },
        { icon: "water", label: "Wadi Shab swim & hike" },
        { icon: "sailing", label: "Dolphin-watching cruise" },
        { icon: "description", label: "Oman e-visa" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Muscat",
      route: ["Colombo", "Muscat", "Wahiba Sands", "Wadi Shab", "Muscat", "Colombo"],
      footnote: outboundFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Muscat & Mutrah Corniche",
          body: "Fly to Muscat and transfer to your hotel. In the evening, stroll the Mutrah Corniche and browse the lanes of the old souk.",
        },
        {
          category: "City sightseeing",
          title: "Grand Mosque, Royal Opera House & Old Muscat",
          body: "Visit the Sultan Qaboos Grand Mosque in the morning, then the Royal Opera House and the forts and palace of Old Muscat.",
        },
        {
          category: "Adventure",
          title: "Wadi Bani Khalid & a night in the Wahiba Sands",
          body: "Drive inland for a swim at Wadi Bani Khalid, then 4×4 into the Wahiba Sands for dune driving, sunset on the dunes and dinner at a desert camp.",
        },
        {
          category: "Nature",
          title: "Wadi Shab, Bimmah Sinkhole & back to Muscat",
          body: "Follow the coast road to the Bimmah Sinkhole and hike into Wadi Shab to swim in its green pools, before returning to Muscat for the night.",
        },
        {
          category: "Departure",
          title: "Dolphin cruise & flight home",
          body: "An early boat trip to watch dolphins off the Muscat coast, then transfer to the airport for your flight back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 165,000 per person.",
      included: [
        { title: "Return economy flights Colombo ⇄ Muscat" },
        { title: "3 nights in a 4★ Muscat hotel and 1 night in a desert camp", note: "Twin share" },
        { title: "Daily breakfast and dinner at the desert camp" },
        { title: "Private 4×4 with driver-guide" },
        { title: "Dolphin-watching cruise" },
        { title: "Oman e-visa" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Lunches and other dinners" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["dubai-family-escape", "abu-dhabi-dubai-combo", "maldives-overwater-villa"],
  },
  {
    slug: "maldives-overwater-villa", title: "Maldives Overwater Villa", region: "Maldives", location: "Maldives",
    category: "outbound", outboundRegion: "maldives", featured: true, days: 4, nights: 3, price: 185000,
    image: "/images/packages/maldives-overwater-villa.jpg",
    priceNote: "Twin share · flights, villa & transfers",
    flightsIncluded: true,
    overview: {
      summary:
        "A short island escape an hour's flight from Colombo: three nights in an overwater villa with a ladder straight into the lagoon, half board, a snorkelling trip to the house reef and a sunset cruise. Flights, speedboat transfers and the Maldives arrival visa are covered.",
      highlights: [
        { icon: "cottage", label: "Overwater villa stay" },
        { icon: "scuba_diving", label: "Guided snorkelling trip" },
        { icon: "sailing", label: "Sunset dolphin cruise" },
        { icon: "restaurant", label: "Half board meals" },
        { icon: "directions_boat", label: "Speedboat transfers" },
        { icon: "description", label: "Free arrival visa" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Malé",
      route: ["Colombo", "Malé", "Resort island", "Colombo"],
      footnote: outboundFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Malé & speedboat to your resort",
          body: "A short flight to Malé, where the resort team meets you for the speedboat ride. Check in to your overwater villa and spend the afternoon in the lagoon.",
        },
        {
          category: "Ocean",
          title: "Snorkelling on the house reef",
          body: "Join a guided snorkelling trip to see reef fish, turtles and rays, then relax on the beach or at the spa.",
        },
        {
          category: "Leisure & cruise",
          title: "Free day & sunset dolphin cruise",
          body: "A day at your own pace, ending with a sunset cruise to look for spinner dolphins.",
        },
        {
          category: "Departure",
          title: "Breakfast in the villa & flight home",
          body: "A slow breakfast over the water, then the speedboat back to Malé for your flight to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 185,000 per person.",
      included: [
        { title: "Return economy flights Colombo ⇄ Malé" },
        { title: "3 nights in an overwater villa", note: "Twin share" },
        { title: "Breakfast and dinner daily" },
        { title: "Return speedboat transfers" },
        { title: "Guided snorkelling trip and sunset cruise" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Green tax", note: "Paid at the resort, approx. USD 6 per person per night" },
        { title: "Lunches, drinks and spa treatments" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["bali-honeymoon", "dubai-family-escape", "singapore-malaysia-cruise"],
  },
  // Sri Lanka tours. All detail copy below is draft; confirm hotels, timings and inclusions with the travel team.
  {
    slug: "kandy-ella-rail", title: "Kandy to Ella Rail Journey", region: "Sri Lanka", area: "Kandy · Ella", location: "Sri Lanka · Hill Country",
    category: "sri-lanka", themes: ["hill-country"], featured: true, days: 3, nights: 2, price: 48000,
    image: "/images/packages/kandy-ella-rail.jpg",
    priceNote: "Twin share · hotels, train seats & driver",
    overview: {
      summary:
        "Ride one of the world's most scenic train lines through misty tea country. Start with the Temple of the Tooth in Kandy, take reserved seats on the hill-country train to Ella, then walk to the Nine Arch Bridge and Little Adam's Peak. A private driver-guide meets you in Colombo and handles every transfer.",
      highlights: [
        { icon: "temple_buddhist", label: "Temple of the Tooth, Kandy" },
        { icon: "train", label: "Reserved hill-country train seats" },
        { icon: "landscape", label: "Nine Arch Bridge" },
        { icon: "hiking", label: "Little Adam's Peak hike" },
        { icon: "water", label: "Ravana Falls" },
        { icon: "directions_car", label: "Private driver-guide" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Ella",
      route: ["Colombo", "Kandy", "Nanu Oya", "Ella", "Colombo"],
      footnote: sriLankaFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Kandy, Temple of the Tooth & cultural show",
          meta: [
            { icon: "location_on", label: "Kandy" },
            { icon: "hotel", label: "Hill-view hotel" },
          ],
          body: "Your driver-guide picks you up in Colombo for the drive to Kandy, stopping at the Pinnawala area on the way. In the evening visit the Temple of the Tooth Relic for the puja ceremony, then watch a Kandyan dance performance by the lake.",
        },
        {
          category: "Scenic rail",
          title: "Kandy to Ella by train through tea country",
          meta: [
            { icon: "train", label: "Kandy → Ella" },
            { icon: "schedule", label: "Approx. 7 hours" },
          ],
          body: "Board the morning train with reserved seats and wind up through tea estates, waterfalls and cloud forest past Nanu Oya and Haputale. Your driver meets you at Ella station and takes you to your hotel for a relaxed evening in town.",
        },
        {
          category: "Ella & departure",
          title: "Nine Arch Bridge, Little Adam's Peak & drive home",
          meta: [
            { icon: "location_on", label: "Ella → Colombo" },
            { icon: "hiking", label: "Easy morning walks" },
          ],
          body: "Walk to the Nine Arch Bridge in time to see a train cross, then climb Little Adam's Peak for views over Ella Gap. After lunch, stop at Ravana Falls on the way back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 48,000 per person.",
      included: [
        { title: "2 nights' accommodation", note: "Kandy and Ella, twin share" },
        { title: "Daily breakfast and dinner" },
        { title: "Reserved train seats Kandy → Ella" },
        { title: "Private air-conditioned car with driver-guide", note: "From Colombo and back" },
        { title: "Temple of the Tooth entrance & Kandyan dance show" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Lunches and drinks" },
        { title: "Other entrance fees" },
        { title: "Tips for your driver-guide" },
        { title: "Personal expenses" },
      ],
    },
    related: ["little-england-weekend", "cultural-triangle-explorer", "yala-wildlife-safari"],
  },
  {
    slug: "yala-wildlife-safari", title: "Yala Wildlife Safari", region: "Sri Lanka", area: "Yala", location: "Sri Lanka · Yala",
    category: "sri-lanka", themes: ["wildlife"], featured: true, days: 2, nights: 1, price: 36500,
    image: "/images/packages/yala-safari.jpg",
    priceNote: "Twin share · lodge, safaris & transport",
    overview: {
      summary:
        "Two jeep safaris in Yala, home to one of the highest densities of leopards in the world. Spend the night at a safari lodge on the edge of the park, with an afternoon drive on arrival and a dawn drive when the animals are most active.",
      highlights: [
        { icon: "pets", label: "Leopards, elephants & sloth bears" },
        { icon: "directions_car", label: "Two private jeep safaris" },
        { icon: "cottage", label: "Safari lodge stay" },
        { icon: "wb_twilight", label: "Dawn game drive" },
        { icon: "local_dining", label: "All meals at the lodge" },
        { icon: "confirmation_number", label: "Park entrance fees" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Yala",
      route: ["Colombo", "Southern Expressway", "Tissamaharama", "Yala National Park", "Colombo"],
      footnote: sriLankaFootnote,
      days: [
        {
          category: "Arrival & safari",
          title: "Drive to Yala and afternoon game drive",
          meta: [
            { icon: "location_on", label: "Yala National Park" },
            { icon: "schedule", label: "3-hour safari" },
          ],
          body: "Leave Colombo early on the Southern Expressway and check in at your lodge near Tissamaharama by lunch. At 2.30pm your jeep and tracker collect you for an afternoon safari looking for leopards, elephants, crocodiles and peacocks.",
        },
        {
          category: "Dawn safari & departure",
          title: "Sunrise game drive & return to Colombo",
          meta: [
            { icon: "wb_twilight", label: "5.30am start" },
            { icon: "location_on", label: "Yala → Colombo" },
          ],
          body: "Head back into the park at first light, the best time to spot leopards on the move. Return to the lodge for a late breakfast, then drive back to Colombo in the afternoon.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 36,500 per person.",
      included: [
        { title: "1 night at a safari lodge", note: "Twin share, full board" },
        { title: "Two private jeep safaris with tracker" },
        { title: "Yala National Park entrance fees" },
        { title: "Private air-conditioned transport from Colombo" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Drinks" },
        { title: "Tips for the tracker and driver" },
        { title: "Personal expenses" },
      ],
    },
    related: ["southern-coast-getaway", "east-coast-whale-watch", "kandy-ella-rail"],
  },
  {
    slug: "cultural-triangle-explorer", title: "Cultural Triangle Explorer", region: "Sri Lanka", area: "Sigiriya · Dambulla", location: "Sri Lanka · Cultural Triangle",
    category: "sri-lanka", themes: ["cultural"], days: 4, nights: 3, price: 68000,
    priceNote: "Twin share · hotel, entrances & driver",
    overview: {
      summary:
        "Four days among Sri Lanka's ancient kingdoms: climb Sigiriya Rock Fortress, explore the painted caves of Dambulla and cycle through the ruins of Polonnaruwa. Finish with an elephant safari in Minneriya and a sunrise climb up Pidurangala, all with a private driver-guide.",
      highlights: [
        { icon: "landscape", label: "Sigiriya Rock Fortress" },
        { icon: "temple_buddhist", label: "Dambulla Cave Temple" },
        { icon: "account_balance", label: "Polonnaruwa ancient city" },
        { icon: "pets", label: "Minneriya elephant safari" },
        { icon: "agriculture", label: "Village tour & lunch" },
        { icon: "wb_twilight", label: "Pidurangala sunrise" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Sigiriya",
      route: ["Colombo", "Dambulla", "Sigiriya", "Polonnaruwa", "Minneriya", "Colombo"],
      footnote: sriLankaFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Dambulla Cave Temple",
          meta: [
            { icon: "location_on", label: "Dambulla · Sigiriya" },
            { icon: "hotel", label: "Hotel near Sigiriya" },
          ],
          body: "Drive north from Colombo to Dambulla and explore the five cave shrines filled with ancient Buddha statues and murals. Continue to your hotel near Sigiriya for the evening.",
        },
        {
          category: "Sigiriya",
          title: "Climb Sigiriya Rock & village tour",
          meta: [
            { icon: "landscape", label: "Sigiriya" },
            { icon: "schedule", label: "Morning climb" },
          ],
          body: "Climb Sigiriya early to beat the heat, passing the frescoes and Lion's Paw on the way to the summit palace. In the afternoon, take a bullock-cart and catamaran village tour with a traditional lunch.",
        },
        {
          category: "Ancient city & safari",
          title: "Polonnaruwa ruins & Minneriya elephant safari",
          meta: [
            { icon: "account_balance", label: "Polonnaruwa" },
            { icon: "pets", label: "Afternoon jeep safari" },
          ],
          body: "Cycle or drive through the royal palace, Gal Vihara statues and temples of Polonnaruwa. In the afternoon, a jeep safari in Minneriya to see wild elephants gathering by the reservoir.",
        },
        {
          category: "Departure",
          title: "Pidurangala sunrise & drive home",
          meta: [
            { icon: "wb_twilight", label: "Pidurangala" },
            { icon: "location_on", label: "Sigiriya → Colombo" },
          ],
          body: "An optional early climb up Pidurangala for sunrise views of Sigiriya. After breakfast, drive back to Colombo with a stop at a spice garden in Matale.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 68,000 per person.",
      included: [
        { title: "3 nights' accommodation near Sigiriya", note: "Twin share" },
        { title: "Daily breakfast and dinner" },
        { title: "Entrance tickets", note: "Sigiriya, Dambulla Cave Temple and Polonnaruwa" },
        { title: "Minneriya jeep safari" },
        { title: "Village tour with traditional lunch" },
        { title: "Private air-conditioned car with driver-guide" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Lunches not mentioned in the itinerary" },
        { title: "Bicycle hire in Polonnaruwa" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["kandy-ella-rail", "east-coast-whale-watch", "yala-wildlife-safari"],
  },
  {
    slug: "southern-coast-getaway", title: "Southern Coast Getaway", region: "Sri Lanka", area: "Mirissa · Galle", location: "Sri Lanka · South Coast",
    category: "sri-lanka", themes: ["beaches"], days: 4, nights: 3, price: 55000,
    priceNote: "Twin share · beach hotel & driver",
    overview: {
      summary:
        "Slow down on the south coast: wander the ramparts of Galle Fort, watch the stilt fishermen at Koggala and spend lazy days on Mirissa beach. In season, head out at dawn to see blue whales. A private driver-guide handles every transfer from Colombo.",
      highlights: [
        { icon: "fort", label: "Galle Fort walking tour" },
        { icon: "sailing", label: "Mirissa whale watching" },
        { icon: "beach_access", label: "Beachfront hotel" },
        { icon: "phishing", label: "Koggala stilt fishermen" },
        { icon: "eco", label: "Turtle hatchery visit" },
        { icon: "directions_car", label: "Private driver-guide" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Mirissa",
      route: ["Colombo", "Bentota", "Galle", "Mirissa", "Colombo"],
      footnote: sriLankaFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Bentota & Galle Fort",
          meta: [
            { icon: "location_on", label: "Bentota · Galle" },
            { icon: "schedule", label: "Afternoon walk" },
          ],
          body: "Drive down the coast with a stop at a turtle hatchery near Bentota. In the afternoon, walk the ramparts, lighthouse and old streets of Galle Fort, then continue to your beach hotel in Mirissa.",
        },
        {
          category: "Whale watching",
          title: "Dawn whale watching & beach afternoon",
          meta: [
            { icon: "sailing", label: "Mirissa harbour" },
            { icon: "schedule", label: "Approx. 4 hours" },
          ],
          body: "Head out from Mirissa harbour at dawn to look for blue whales, sperm whales and dolphins (November to April). Spend the afternoon on the beach and catch sunset from Coconut Tree Hill.",
        },
        {
          category: "Leisure",
          title: "Koggala, stilt fishermen & free time",
          meta: [
            { icon: "location_on", label: "Koggala · Weligama" },
            { icon: "beach_access", label: "Free afternoon" },
          ],
          body: "A morning trip to see the stilt fishermen and a boat ride on Koggala Lake. The rest of the day is yours: surf lessons at Weligama, a spa treatment or simply the pool.",
        },
        {
          category: "Departure",
          title: "Beach morning & drive home",
          meta: [{ icon: "location_on", label: "Mirissa → Colombo" }],
          body: "Enjoy a last swim and breakfast by the sea before your driver takes you back to Colombo on the Southern Expressway.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 55,000 per person.",
      included: [
        { title: "3 nights at a beachfront hotel in Mirissa", note: "Twin share" },
        { title: "Daily breakfast and dinner" },
        { title: "Whale-watching boat trip", note: "November to April; swapped for a lagoon safari off season" },
        { title: "Galle Fort walking tour" },
        { title: "Private air-conditioned car with driver-guide" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Lunches and drinks" },
        { title: "Surf lessons, spa treatments and other optional activities" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["yala-wildlife-safari", "east-coast-whale-watch", "kandy-ella-rail"],
  },
  {
    slug: "little-england-weekend", title: "Little England Weekend", region: "Sri Lanka", area: "Nuwara Eliya", location: "Sri Lanka · Nuwara Eliya",
    category: "sri-lanka", themes: ["hill-country"], days: 2, nights: 1, price: 32000,
    priceNote: "Twin share · bungalow stay & driver",
    overview: {
      summary:
        "A cool-climate weekend in Nuwara Eliya, Sri Lanka's 'Little England'. Visit a working tea factory, boat on Gregory Lake and stay in a colonial-era bungalow, with waterfalls and tea estates all along the drive up from Colombo.",
      highlights: [
        { icon: "emoji_food_beverage", label: "Tea factory tour & tasting" },
        { icon: "cottage", label: "Colonial bungalow stay" },
        { icon: "rowing", label: "Gregory Lake" },
        { icon: "water", label: "Ramboda Falls" },
        { icon: "park", label: "Victoria Park" },
        { icon: "directions_car", label: "Private driver-guide" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Nuwara Eliya",
      route: ["Colombo", "Ramboda", "Nuwara Eliya", "Colombo"],
      footnote: sriLankaFootnote,
      days: [
        {
          category: "Arrival",
          title: "Drive up to Nuwara Eliya via Ramboda Falls",
          meta: [
            { icon: "location_on", label: "Ramboda · Nuwara Eliya" },
            { icon: "hotel", label: "Colonial bungalow" },
          ],
          body: "Leave Colombo in the morning and wind up into the hills, stopping at Ramboda Falls and a tea factory for a tour and tasting. Check in to your bungalow and spend the evening by Gregory Lake.",
        },
        {
          category: "Departure",
          title: "Town walk, Victoria Park & drive home",
          meta: [{ icon: "location_on", label: "Nuwara Eliya → Colombo" }],
          body: "After breakfast, walk past the old post office and Hill Club, then through Victoria Park. Pick up fresh strawberries and vegetables at the market before driving back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 32,000 per person.",
      included: [
        { title: "1 night in a colonial-style bungalow", note: "Twin share" },
        { title: "Breakfast and dinner" },
        { title: "Tea factory tour & tasting" },
        { title: "Private air-conditioned car with driver-guide" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Lunches and drinks" },
        { title: "Boat rides and park entrance fees" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["kandy-ella-rail", "cultural-triangle-explorer", "southern-coast-getaway"],
  },
  {
    slug: "east-coast-whale-watch", title: "East Coast Whale Watch", region: "Sri Lanka", area: "Trincomalee", location: "Sri Lanka · Trincomalee",
    category: "sri-lanka", themes: ["beaches", "wildlife"], days: 3, nights: 2, price: 44000,
    priceNote: "Twin share · beach hotel, boat trips & driver",
    overview: {
      summary:
        "Sri Lanka's east coast at its best: blue whales and dolphins off Trincomalee, snorkelling with reef sharks at Pigeon Island and long white beaches at Nilaveli. Add Koneswaram Temple on its clifftop and you have an easy three-day escape.",
      highlights: [
        { icon: "sailing", label: "Whale & dolphin watching" },
        { icon: "scuba_diving", label: "Pigeon Island snorkelling" },
        { icon: "beach_access", label: "Nilaveli beach hotel" },
        { icon: "temple_hindu", label: "Koneswaram Temple" },
        { icon: "fort", label: "Fort Frederick" },
        { icon: "directions_car", label: "Private driver-guide" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Trincomalee",
      route: ["Colombo", "Habarana", "Trincomalee", "Nilaveli", "Colombo"],
      footnote: sriLankaFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Trincomalee & Koneswaram Temple",
          meta: [
            { icon: "location_on", label: "Trincomalee" },
            { icon: "hotel", label: "Nilaveli beach hotel" },
          ],
          body: "Drive across the island via Habarana to Trincomalee. Visit Fort Frederick and Koneswaram Temple on Swami Rock at sunset, then check in at your hotel on Nilaveli beach.",
        },
        {
          category: "Whales & reef",
          title: "Whale watching & Pigeon Island snorkelling",
          meta: [
            { icon: "sailing", label: "Trincomalee Bay" },
            { icon: "scuba_diving", label: "Pigeon Island National Park" },
          ],
          body: "An early boat trip into Trincomalee Bay to look for blue whales and spinner dolphins (March to August). After lunch, snorkel the coral reef at Pigeon Island, home to black-tip reef sharks and turtles.",
        },
        {
          category: "Departure",
          title: "Beach morning & drive home",
          meta: [{ icon: "location_on", label: "Nilaveli → Colombo" }],
          body: "A last swim at Nilaveli, then drive back to Colombo, stopping at the Kanniya hot wells on the way.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 44,000 per person.",
      included: [
        { title: "2 nights at a beach hotel in Nilaveli", note: "Twin share" },
        { title: "Daily breakfast and dinner" },
        { title: "Whale-watching boat trip", note: "March to August" },
        { title: "Pigeon Island boat transfer & snorkel gear" },
        { title: "Private air-conditioned car with driver-guide" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Pigeon Island park entrance fee" },
        { title: "Lunches and drinks" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["southern-coast-getaway", "yala-wildlife-safari", "cultural-triangle-explorer"],
  },
  {
    slug: "bali-honeymoon", title: "Bali Honeymoon Special", region: "Indonesia", location: "Indonesia · Bali",
    category: "outbound", outboundRegion: "asia", featured: true, days: 6, nights: 5, price: 210000,
    image: "/images/packages/bali-honeymoon.jpg",
    priceNote: "Per person · flights, villa & visa",
    flightsIncluded: true,
    overview: {
      summary:
        "Six days in Bali made for two: a private pool villa in Ubud among the rice terraces, a candlelit dinner, a couples' spa session and sunset at Uluwatu, then beach days in Seminyak. Flights from Colombo, private transfers and your Indonesia visa on arrival are arranged.",
      highlights: [
        { icon: "pool", label: "Private pool villa in Ubud" },
        { icon: "spa", label: "Couples' Balinese massage" },
        { icon: "restaurant", label: "Candlelit dinner" },
        { icon: "temple_hindu", label: "Uluwatu sunset & Kecak dance" },
        { icon: "landscape", label: "Tegallalang rice terraces" },
        { icon: "description", label: "Visa on arrival" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Denpasar",
      route: ["Colombo", "Ubud", "Uluwatu", "Seminyak", "Colombo"],
      footnote: outboundFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Bali & check in to your Ubud villa",
          body: "Fly to Denpasar, where a private driver takes you up to Ubud. Settle in to your pool villa with a welcome drink and flower bath.",
        },
        {
          category: "Culture",
          title: "Rice terraces, Tirta Empul & Ubud market",
          body: "See the Tegallalang rice terraces and the holy spring temple of Tirta Empul, then browse Ubud's art market. A couples' massage ends the day.",
        },
        {
          category: "Leisure",
          title: "A free day & candlelit dinner",
          body: "A slow day by the pool or a swing over the jungle, followed by a private candlelit dinner at the villa.",
        },
        {
          category: "Sightseeing",
          title: "Move to Seminyak & sunset at Uluwatu",
          body: "Check in to your Seminyak hotel, then drive to the clifftop Uluwatu temple for sunset and the Kecak fire dance.",
        },
        {
          category: "Beach",
          title: "Beach day in Seminyak",
          body: "Spend the day on the beach and in Seminyak's cafés and boutiques, with sunset drinks by the sea.",
        },
        {
          category: "Departure",
          title: "Flight home to Colombo",
          body: "Check out after breakfast and transfer to the airport for your flight back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 210,000 per person.",
      included: [
        { title: "Return economy flights Colombo ⇄ Denpasar" },
        { title: "3 nights in a private pool villa in Ubud and 2 nights in Seminyak", note: "Double room" },
        { title: "Daily breakfast" },
        { title: "Private airport and hotel transfers" },
        { title: "Couples' massage and candlelit dinner" },
        { title: "Ubud and Uluwatu tours with entry fees" },
        { title: "Indonesia visa on arrival" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Bali tourist levy", note: "Approx. IDR 150,000 per person, paid online" },
        { title: "Lunches and other dinners" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["maldives-overwater-villa", "bangkok-phuket", "singapore-malaysia-cruise"],
  },
  {
    slug: "bangkok-phuket", title: "Bangkok & Phuket Highlights", region: "Thailand", location: "Thailand",
    category: "outbound", outboundRegion: "asia", featured: true, days: 7, nights: 6, price: 175000,
    image: "/images/packages/bangkok-phuket.jpg",
    priceNote: "Twin share · flights & hotels",
    flightsIncluded: true,
    overview: {
      summary:
        "Seven days split between Bangkok and Phuket: temples, river boats and night markets in the city, then a domestic flight south for beaches and a speedboat day to the Phi Phi Islands. Flights from Colombo, 4★ hotels and all transfers are included.",
      highlights: [
        { icon: "temple_buddhist", label: "Grand Palace & Wat Pho" },
        { icon: "sailing", label: "Chao Phraya river cruise" },
        { icon: "storefront", label: "Night markets" },
        { icon: "beach_access", label: "Phuket beach stay" },
        { icon: "directions_boat", label: "Phi Phi Islands speedboat" },
        { icon: "flight", label: "Bangkok to Phuket flight" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Bangkok · Phuket",
      route: ["Colombo", "Bangkok", "Phuket", "Phi Phi Islands", "Colombo"],
      footnote: outboundFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Bangkok & evening river cruise",
          body: "Fly to Bangkok and transfer to your hotel. In the evening, board a dinner cruise along the Chao Phraya past the lit-up temples.",
        },
        {
          category: "City sightseeing",
          title: "Grand Palace, Wat Pho & Wat Arun",
          body: "See the Grand Palace and the Emerald Buddha, the reclining Buddha at Wat Pho, and cross the river to Wat Arun.",
        },
        {
          category: "Shopping",
          title: "Free day for markets & malls",
          body: "Shop at Chatuchak weekend market or the malls around Siam, with the evening free for a night market.",
        },
        {
          category: "Beach",
          title: "Fly to Phuket & sunset at Promthep Cape",
          body: "A short domestic flight to Phuket and check in to your beach hotel. Watch the sunset from Promthep Cape.",
        },
        {
          category: "Island tour",
          title: "Speedboat to the Phi Phi Islands",
          body: "A full day by speedboat to Maya Bay, Pileh Lagoon and Bamboo Island, with snorkelling and lunch on board.",
        },
        {
          category: "Leisure",
          title: "Old Phuket Town & beach time",
          body: "Walk the colourful streets of Old Phuket Town, visit the Big Buddha, and spend the afternoon on the beach.",
        },
        {
          category: "Departure",
          title: "Flight home to Colombo",
          body: "Check out after breakfast and transfer to Phuket airport for your flight back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 175,000 per person.",
      included: [
        { title: "Return economy flights Colombo ⇄ Thailand and the Bangkok to Phuket flight" },
        { title: "3 nights in Bangkok and 3 nights in Phuket", note: "4★ hotels, twin share" },
        { title: "Daily breakfast" },
        { title: "All airport transfers" },
        { title: "Chao Phraya dinner cruise and Bangkok temples tour" },
        { title: "Phi Phi Islands speedboat tour with lunch" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "National park fees", note: "Paid on the Phi Phi tour" },
        { title: "Lunches and dinners not mentioned" },
        { title: "Tips and personal expenses" },
      ],
    },
    related: ["singapore-malaysia-cruise", "bali-honeymoon", "dubai-family-escape"],
  },
  {
    slug: "singapore-malaysia-cruise", title: "Singapore & Malaysia Cruise", region: "Singapore", location: "Singapore · Malaysia",
    category: "outbound", outboundRegion: "asia", featured: true, days: 5, nights: 4, price: 240000,
    image: "/images/packages/singapore-malaysia-cruise.jpg",
    priceNote: "Twin share · flights, hotel & cruise",
    flightsIncluded: true,
    overview: {
      summary:
        "Two nights in Singapore for Gardens by the Bay, Sentosa and the Marina Bay lights, then a two-night cruise to Penang in Malaysia with meals and shows on board. Flights from Colombo, a 4★ city hotel, an ocean-view cabin and transfers are arranged.",
      highlights: [
        { icon: "park", label: "Gardens by the Bay" },
        { icon: "attractions", label: "Sentosa Island" },
        { icon: "directions_boat", label: "2-night cruise to Penang" },
        { icon: "bed", label: "Ocean-view cabin" },
        { icon: "restaurant", label: "Meals on board" },
        { icon: "airport_shuttle", label: "All transfers" },
      ],
    },
    itinerary: {
      endpoints: "Colombo ⇄ Singapore",
      route: ["Colombo", "Singapore", "Penang", "Singapore", "Colombo"],
      footnote: outboundFootnote,
      days: [
        {
          category: "Arrival",
          title: "Colombo to Singapore & Marina Bay lights",
          body: "Fly to Singapore and transfer to your hotel. In the evening, watch the Spectra light and water show at Marina Bay.",
        },
        {
          category: "City sightseeing",
          title: "Gardens by the Bay & Sentosa",
          body: "Explore the Flower Dome and Supertree Grove at Gardens by the Bay, then take the cable car to Sentosa for the afternoon.",
        },
        {
          category: "Cruise",
          title: "Board your cruise ship",
          body: "Check out and transfer to Marina Bay Cruise Centre. Settle into your ocean-view cabin as the ship sails for Malaysia.",
        },
        {
          category: "Shore day",
          title: "A day in Penang",
          body: "Go ashore in George Town for its street art, temples and hawker food, then back on board for dinner and the evening show.",
        },
        {
          category: "Departure",
          title: "Back in Singapore & flight home",
          body: "The ship returns to Singapore in the morning. Transfer to Changi for your flight back to Colombo.",
        },
      ],
    },
    inclusions: {
      intro: "Everything below is covered in the package price of LKR 240,000 per person.",
      included: [
        { title: "Return economy flights Colombo ⇄ Singapore" },
        { title: "2 nights in a 4★ Singapore hotel", note: "Twin share, with breakfast" },
        { title: "2-night cruise in an ocean-view cabin", note: "All main meals and shows on board" },
        { title: "Gardens by the Bay and Sentosa cable car tickets" },
        { title: "Airport, hotel and port transfers" },
      ],
      excluded: [
        { title: "Travel insurance", note: "We can arrange a policy" },
        { title: "Singapore visa fee", note: "We handle the application" },
        { title: "Cruise gratuities and drinks packages" },
        { title: "Shore excursions and personal expenses" },
      ],
    },
    related: ["bangkok-phuket", "bali-honeymoon", "maldives-overwater-villa"],
  },
];

export const featuredPackages = () => packages.filter((p) => p.featured);

export const sriLankaThemes: { id: SriLankaTheme; label: string }[] = [
  { id: "cultural", label: "Cultural Triangle" },
  { id: "hill-country", label: "Hill Country" },
  { id: "beaches", label: "Beaches" },
  { id: "wildlife", label: "Wildlife" },
];

export const outboundRegions: { id: OutboundRegion; label: string; image?: string }[] = [
  { id: "middle-east", label: "Middle East", image: "/images/hero/dubai.jpg" },
  { id: "asia", label: "Asia", image: "/images/packages/bangkok-phuket.jpg" },
  { id: "europe", label: "Europe" },
  { id: "maldives", label: "Maldives", image: "/images/packages/maldives-overwater-villa.jpg" },
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}

/** Packages that have enough content for a detail page. */
export function detailPackages() {
  return packages.filter((p) => p.overview);
}

export function relatedPackages(pkg: Package) {
  return (pkg.related ?? []).map(getPackage).filter((p): p is Package => Boolean(p));
}

export const formatLKR = (n: number) => `LKR ${n.toLocaleString("en-US")}`;

export const durationLabel = (p: Pick<Package, "days" | "nights">) =>
  `${p.days} Days / ${p.nights} ${p.nights === 1 ? "Night" : "Nights"}`;

export const durationShort = (p: Pick<Package, "days" | "nights">) => `${p.days}D / ${p.nights}N`;

/** Breadcrumb parent for a package. */
export const categoryCrumb = {
  outbound: { label: "Outbound Travels", href: "/holidays/outbound" },
  "sri-lanka": { label: "Travel Sri Lanka", href: "/holidays/sri-lanka" },
} as const;
