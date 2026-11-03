import { contact } from "./site";

export type Faq = { q: string; a: string };

// Draft: answers use only what the site already states (payments, hours, visa processing).
// Confirm with the travel team before launch.
export const faqGroups: { title: string; items: Faq[] }[] = [
  {
    title: "Booking with us",
    items: [
      {
        q: "How do I book a trip with Let’s Fly.lk?",
        a: "Send us an enquiry from any package or service page, message us on WhatsApp, call us or visit our Rajagiriya office. A travel consultant will reply with options and a quotation, and your booking is confirmed once the deposit is paid.",
      },
      {
        q: "Can you change a package to suit me?",
        a: "Yes. Every package can be tailored. Tell us your dates, budget, hotel preferences and anything you’d like to add or skip, and we’ll adjust the itinerary and price for you.",
      },
      {
        q: "Are you a registered travel agency?",
        a: "Yes. Let’s Fly.lk is an SLTDA-registered travel agency based in Rajagiriya, Colombo, with IATA-accredited air ticketing.",
      },
      {
        q: "When can I reach you?",
        a: `Our office is open ${contact.hours}. Our customer service line, ${contact.phone}, is available 24 hours a day for travellers who need help on the road.`,
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "How can I pay?",
        a: "By bank transfer in LKR, by Visa or Mastercard at our office or through a secure payment link, or in cash at our office. Instalment options, including KOKO, are available on many bookings.",
      },
      {
        q: "Do I have to pay the full amount upfront?",
        a: "No. A deposit holds your flights, hotels and seats, and the balance is due before you travel, by the deadline on your booking. We tell you both amounts with your quotation.",
      },
      {
        q: "Can prices change after I book?",
        a: "Package prices can be affected by exchange rates and supplier price increases where your booking terms allow it. If that happens, we tell you before any additional amount is charged.",
      },
    ],
  },
  {
    title: "Visas",
    items: [
      {
        q: "Which visas can you help with?",
        a: "We prepare visa applications for popular destinations such as the UAE, Thailand, the Maldives, Schengen countries and the UK, and help visitors with Sri Lankan visas. Our team checks your documents before anything is submitted.",
      },
      {
        q: "How long does a visa take?",
        a: "It depends on the country and the embassy. For example, a Dubai visa usually takes 3 to 5 working days. We give you the expected time when we review your documents.",
      },
      {
        q: "Can you guarantee my visa will be approved?",
        a: "No agency can. Decisions are made only by the embassy, consulate or immigration authority. What we do is make sure your application is complete and correct, which gives it the best chance.",
      },
      {
        q: "Is the visa fee refunded if my visa is refused?",
        a: "Visa fees and related charges are generally non-refundable, even if the application is refused. See our Refund Policy for how other bookings are handled if a visa is refused.",
      },
    ],
  },
  {
    title: "Changes and cancellations",
    items: [
      {
        q: "Can I change my travel dates?",
        a: "Often, yes, depending on the airline’s fare rules and the hotel’s policy. Changes may carry a fee. Contact us as early as possible and we’ll tell you what’s possible for your booking.",
      },
      {
        q: "What happens if I cancel?",
        a: "Cancellations follow the conditions sent with your booking and each supplier’s own rules. We refund every amount we can recover from airlines, hotels and other suppliers. Our Refund Policy explains this in full.",
      },
      {
        q: "Should I buy travel insurance?",
        a: "We strongly recommend it. Comprehensive travel insurance covers medical emergencies, lost baggage and cancellation costs that suppliers won’t refund.",
      },
    ],
  },
];
