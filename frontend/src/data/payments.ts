/**
 * How customers pay for a package. Shared by every package page's
 * "Payment Methods" tab. Draft copy: confirm methods, deposit and
 * deadlines with the travel team before launch.
 */

export type PaymentMethod = { icon: string; title: string; text: string };
export type PaymentStep = { title: string; text: string };

export const paymentMethods: PaymentMethod[] = [
  {
    icon: "account_balance",
    title: "Bank transfer",
    text: "Transfer in LKR to our company account. Account details are sent with your confirmed quote.",
  },
  {
    icon: "credit_card",
    title: "Credit or debit card",
    text: "Visa and Mastercard accepted at our office or through a secure payment link.",
  },
  {
    icon: "payments",
    title: "Cash at our office",
    text: "Pay in person at our Rajagiriya office and get a receipt on the spot.",
  },
  {
    icon: "calendar_month",
    title: "Instalments",
    text: "Split the balance into easy payments before you travel. Ask us about the options for your trip.",
  },
];

export const paymentSteps: PaymentStep[] = [
  {
    title: "Pay a deposit to confirm",
    text: "A deposit holds your hotels, seats and flights. We tell you the amount with your quote.",
  },
  {
    title: "Pay the balance before you travel",
    text: "The remaining amount is due before your travel date, by the deadline on your booking.",
  },
  {
    title: "Get your travel documents",
    text: "Once paid in full, we send your vouchers, tickets and final itinerary by email or WhatsApp.",
  },
];

export const paymentNote =
  "Prices are per person in LKR. Card payments may carry a bank charge. Cancellation and refund terms depend on the hotels and airlines in your package and are shared before you pay.";
