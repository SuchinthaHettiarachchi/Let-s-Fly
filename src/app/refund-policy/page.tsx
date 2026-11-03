import type { Metadata } from "next";
import Link from "next/link";
import { LegalList, LegalP, LegalPage, LegalSection } from "@/components/legal/Legal";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "How cancellations and refunds work for flights, tour packages, hotels and visa services booked with Let's Fly.lk, Rajagiriya, Sri Lanka.",
};

// Draft: written from the cancellation and refund clauses in the client's Terms & Conditions.
// No fixed percentages or deadlines on purpose; confirm any standard charges with the client.
export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="How cancellations and refunds work for travel services booked through Let’s Fly.lk. It should be read together with our Terms & Conditions and the conditions sent with your booking."
    >
      <LegalSection title="1. How refunds work">
        <LegalP>
          Most of what we book for you is provided by airlines, hotels, cruise lines, transport operators, embassies and
          other suppliers. When a booking is cancelled, the amount we can return depends on what those suppliers refund
          to us under their own rules. We pass on every amount we are able to recover, less any charges that have been
          agreed with you.
        </LegalP>
        <LegalP>
          The cancellation conditions for your trip are sent to you with your quotation or booking confirmation. Where
          those conditions differ from this page, the conditions for your booking apply.
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Cancelling a booking">
        <LegalList
          items={[
            "Cancellations must be made in writing, by email or WhatsApp, by the person who made the booking.",
            "The cancellation takes effect on the day we receive it, during office hours.",
            "Deposits, advance payments and amounts already paid to third parties may be non-refundable, depending on the supplier’s terms.",
            "Any administration or service charge that applies will be explained to you before the cancellation is processed.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Air tickets">
        <LegalP>
          Refunds, date changes and name corrections on air tickets follow the fare rules of the airline. Some fares are
          non-refundable; others allow a refund or change for a fee. Refunds are processed only after the airline
          approves them, which can take several weeks depending on the carrier.
        </LegalP>
      </LegalSection>

      <LegalSection title="4. Tour packages and hotels">
        <LegalList
          items={[
            "Package cancellations follow the cancellation conditions communicated at the time of booking and the policies of each hotel, transport provider and supplier included in the package.",
            "Group tours priced on group airfare or shared transport may carry higher cancellation charges, because the arrangements are made for the whole group.",
            "No refund is ordinarily given for any service, excursion, meal, accommodation night or transfer that you choose not to use, or are unable to use, during the tour, unless the supplier’s policy or your booking conditions allow it.",
            "If we have to cancel a tour, for example because a minimum group size is not reached, we will offer you an alternative or a refund in line with the conditions for your booking and applicable law.",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Visa services">
        <LegalP>
          Visa application fees, embassy charges and related service fees are generally non-refundable, including when an
          application is refused or withdrawn. If a visa is refused, cancellation fees or losses on flights,
          accommodation and other confirmed services are handled under each supplier’s cancellation policy, and we
          refund whatever we are able to recover.
        </LegalP>
      </LegalSection>

      <LegalSection title="6. Changes to prices">
        <LegalP>
          If a package price changes because of exchange rate movements or supplier price increases, as allowed by your
          booking terms, we will tell you before any additional amount is charged.
        </LegalP>
      </LegalSection>

      <LegalSection title="7. How and when you are refunded">
        <LegalList
          items={[
            "Refunds are paid to the person who made the booking, using the original payment method where possible, or by bank transfer to an account in their name.",
            "We process a refund as soon as the supplier releases the funds to us, and keep you updated while we wait.",
            "Instalment plans, such as KOKO, are refunded through the provider in line with its own terms.",
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Travel insurance">
        <LegalP>
          We strongly recommend comprehensive travel insurance covering trip cancellation and interruption. It can cover
          costs that suppliers will not refund, such as cancellations because of illness or emergencies.
        </LegalP>
      </LegalSection>

      <LegalSection title="9. Contact us">
        <LegalP>
          To cancel a booking or ask about a refund, email <a href={`mailto:${contact.email}`}>{contact.email}</a>, call{" "}
          <a href={contact.phoneHref}>{contact.phone}</a> or visit us at {contact.address}. See our{" "}
          <Link href="/terms">Terms &amp; Conditions</Link> for the full booking conditions.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
