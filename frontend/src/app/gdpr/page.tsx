import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/Legal";
import { GdprForm } from "@/components/legal/GdprForm";

export const metadata: Metadata = {
  title: "GDPR Compliance",
  description:
    "Ask Let's Fly.lk to amend or delete the personal data you've shared with us through this website. Requests are handled within 24 hours.",
};

export default function GdprPage() {
  return (
    <LegalPage
      title="GDPR Compliance"
      intro={
        <>
          As per the General Data Protection Regulation (GDPR), you have the right to amend or delete any personal data
          or information you may have previously shared with us and which is stored on our website. This deletion or
          amendment will be carried out within a 24-hour period. Please note that only information collected through
          our website is removed, not information collected by any other means (for example, booking records held with
          airlines, hotels or embassies).
        </>
      }
    >
      <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-sand-300 bg-white p-6 shadow-lf-md sm:p-8">
        <GdprForm />
      </div>
      <p className="text-center text-small text-ink-600">
        Read how we handle your data in our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
