import type { Metadata } from "next";
import Link from "next/link";
import { LegalP, LegalPage, LegalSection } from "@/components/legal/Legal";
import { Icon } from "@/components/ui/Icon";
import { faqGroups } from "@/data/faq";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about booking flights, tour packages and visas with Let's Fly.lk: payments, instalments, visa times, changes and cancellations.",
};

// FAQPage structured data so search engines can show the answers directly.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) =>
    g.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  ),
};

export default function FaqPage() {
  return (
    <LegalPage title="Frequently Asked Questions" intro="Quick answers about booking, payments, visas and cancellations.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqGroups.map((group) => (
        <LegalSection key={group.title} title={group.title}>
          <div className="flex flex-col border-t border-sand-300">
            {group.items.map((f) => (
              <details key={f.q} className="group border-b border-sand-300">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-body font-semibold text-ink-900 transition-colors hover:text-ocean-600 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon
                    name="add"
                    size={22}
                    className="flex-none text-ocean-600 transition-[rotate] duration-300 group-open:rotate-45"
                  />
                </summary>
                <p className="max-w-[72ch] pb-5 text-body text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
        </LegalSection>
      ))}
      <LegalSection title="Still have a question?">
        <LegalP>
          Call us on <a href={contact.phoneHref}>{contact.phone}</a>, email{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> or <Link href="/contact">send us a message</Link>. You
          can also read our <Link href="/refund-policy">Refund Policy</Link> and{" "}
          <Link href="/terms">Terms &amp; Conditions</Link>.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
