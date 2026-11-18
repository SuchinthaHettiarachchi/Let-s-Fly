import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { contact } from "@/data/site";
import { defaultHotelBooking, type HotelBookingContent } from "@/lib/hotel-booking-api";

export function HotelBookings({ content }: { content: HotelBookingContent }) {
  return (
    <section id="hotels" className="scroll-mt-[110px] lg:scroll-mt-[156px] pb-20 lg:pb-[110px]">
      <Container data-reveal>
        <HotelBookingCard content={content} />
      </Container>
    </section>
  );
}

/** The hotel promo card shown on the Travel Sri Lanka page and home filters. */
export function HotelBookingCard({ content = defaultHotelBooking }: { content?: HotelBookingContent }) {
  const ctaHref = content.ctaUrl || `${contact.whatsappHref}?text=${encodeURIComponent(content.whatsappMessage || "Hi Let's Fly, I'd like to book a hotel.")}`;
  const external = /^https?:\/\//i.test(ctaHref);
  const stats = content.stats.filter((s) => s.value || s.label).slice(0, 4);
  const showPrice = content.priceLabel || content.priceAmount || content.priceSuffix;

  return (
    <div className="grid grid-cols-1 items-center gap-10 rounded-2xl border border-sand-300 bg-sand-50 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
      <div className="flex flex-col gap-5">
        {content.eyebrow && <Eyebrow>{content.eyebrow}</Eyebrow>}
        <h2>{content.title}</h2>
        <p className="max-w-[62ch] text-lead text-ink-600">{content.description}</p>

        {stats.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {stats.map((s, i) => (
              <div key={`${s.label}-${i}`} className={`flex flex-col ${i ? "border-l border-sand-300 pl-6" : ""}`}>
                {s.value && <span className="num text-stat text-ocean-600">{s.value}</span>}
                {s.label && <span className="text-caption font-normal text-ink-400">{s.label}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-4">
          <ButtonLink
            href={ctaHref}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            variant="primary"
            size="lg"
            icon={external ? "north_east" : "arrow_forward"}
          >
            {content.ctaLabel || "Book Hotel"}
          </ButtonLink>
          {content.ctaNote && (
            <span className="flex items-center gap-1.5 text-caption font-normal text-ink-400">
              {external && <Icon name="open_in_new" size={16} />}
              {content.ctaNote}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-[320px] sm:h-[380px] lg:h-[420px]">
        {content.imagePrimary ? (
          <div className="absolute top-0 right-0 h-[65%] w-[78%] overflow-hidden rounded-2xl bg-white shadow-lf-md">
            <Image src={content.imagePrimary} alt="" fill sizes="(min-width: 1024px) 420px, 80vw" className="object-cover" />
          </div>
        ) : (
          <Placeholder label="HOTEL PHOTO" className="absolute top-0 right-0 h-[65%] w-[78%] rounded-2xl bg-white shadow-lf-md" />
        )}
        {content.imageSecondary ? (
          <div className="absolute bottom-0 left-0 h-[58%] w-[62%] overflow-hidden rounded-2xl border-4 border-solid border-white bg-sand-100 shadow-lf-md">
            <Image src={content.imageSecondary} alt="" fill sizes="(min-width: 1024px) 320px, 60vw" className="object-cover" />
          </div>
        ) : (
          <Placeholder
            label="HOTEL PHOTO"
            className="absolute bottom-0 left-0 h-[58%] w-[62%] rounded-2xl border-4 border-solid border-white bg-sand-100 shadow-lf-md"
          />
        )}
        {showPrice && (
          <div className="absolute right-4 bottom-6 flex flex-col rounded-xl bg-sun-400 px-4 py-3 text-navy-900 shadow-lf-md">
            {content.priceLabel && <span className="text-caption font-medium">{content.priceLabel}</span>}
            {content.priceAmount && <span className="num text-h4 font-bold">{content.priceAmount}</span>}
            {content.priceSuffix && <span className="text-caption font-medium">{content.priceSuffix}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
