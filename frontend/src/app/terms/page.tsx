import type { Metadata } from "next";
import { LegalList, LegalP, LegalPage, LegalSection } from "@/components/legal/Legal";
import { leisureTerms, termsAcknowledgement } from "@/data/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "General terms and conditions for leisure travel, tours, visas and bookings arranged by Let's Fly.lk, Rajagiriya, Sri Lanka.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" intro="Terms and conditions applicable to travel services provided by Let’s Fly.lk.">
      <LegalSection title="Leisure travel: general terms and conditions">
        <LegalList ordered items={leisureTerms} />
      </LegalSection>
      <LegalSection title="Acknowledgement and acceptance">
        <LegalP>{termsAcknowledgement}</LegalP>
      </LegalSection>
    </LegalPage>
  );
}
