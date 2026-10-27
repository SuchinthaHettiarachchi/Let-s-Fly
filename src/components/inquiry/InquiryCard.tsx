import { InquiryForm, type InquiryPrefill } from "./InquiryForm";

/** Navy → ocean header used by the inquiry modal and the inline inquiry cards. */
export function InquiryHeader({ titleId, children }: { titleId?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 bg-linear-[120deg] from-navy-900 to-ocean-600 px-6 py-6">
      <div className="flex flex-col gap-1.5">
        <div className="eyebrow text-sun-400">PLAN MY TRIP</div>
        <h2 id={titleId} className="text-h3 text-white">
          Send us an inquiry
        </h2>
        <p className="text-small text-white/80">Our travel team replies within 2 working hours.</p>
      </div>
      {children}
    </div>
  );
}

/** Inquiry form in a card, for page sidebars (e.g. visa detail). */
export function InquiryCard({ prefill }: { prefill?: InquiryPrefill }) {
  return (
    <div className="overflow-hidden rounded-xl border border-sand-300 bg-white shadow-lf-md">
      <InquiryHeader />
      <div className="p-5 sm:p-6">
        <InquiryForm prefill={prefill} />
      </div>
    </div>
  );
}
