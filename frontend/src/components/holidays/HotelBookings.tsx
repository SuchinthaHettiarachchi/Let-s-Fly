"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { contact } from "@/data/site";
import { defaultHotelBooking, type HotelBookingContent } from "@/lib/hotel-booking-api";

export function HotelBookings({ content = defaultHotelBooking }: { content?: HotelBookingContent }) {
  return (
    <section id="hotels" className="scroll-mt-[110px] lg:scroll-mt-[156px] pb-20 lg:pb-[110px]">
      <Container data-reveal>
        <HotelBookingCard content={content} />
      </Container>
    </section>
  );
}

/** The hotel promo card, also shown under the home page's "Hotel bookings" filter. */
export function HotelBookingCard({ content = defaultHotelBooking }: { content?: HotelBookingContent }) {
  const ctaHref =
    content.ctaUrl ||
    `${contact.whatsappHref}?text=${encodeURIComponent(content.whatsappMessage || "Hi Let's Fly, I'd like to book a hotel.")}`;
  const external = /^https?:\/\//i.test(ctaHref);
  const stats = content.stats?.length ? content.stats : defaultHotelBooking.stats;

  return (
    <div className="grid grid-cols-1 items-center gap-12 rounded-2xl border border-sand-300 bg-sand-50 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
      <div className="flex flex-col gap-5">
        <Eyebrow>{content.eyebrow || defaultHotelBooking.eyebrow}</Eyebrow>
        <h2>{content.title || defaultHotelBooking.title}</h2>
        <p className="text-lead text-ink-600">{content.description || defaultHotelBooking.description}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {stats.map((s, i) => (
            <div key={`${s.label}-${i}`} className={`flex flex-col ${i ? "border-l border-sand-300 pl-6" : ""}`}>
              <span className="num text-stat text-ocean-600">{s.value}</span>
              <span className="text-caption font-normal text-ink-400">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
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
          {(content.ctaNote || external) && (
            <span className="flex items-center gap-1.5 text-caption font-normal text-ink-400">
              {external && <Icon name="open_in_new" size={16} />}
              {content.ctaNote || (external ? "Opens our booking portal" : "")}
            </span>
          )}
        </div>
      </div>

      {/* Two overlapping photos + price tag. */}
      <div className="relative h-[340px] sm:h-[380px]">
        {content.imagePrimary ? (
          <div className="absolute top-0 right-0 h-[220px] w-[78%] overflow-hidden rounded-2xl bg-white shadow-lf-md">
            <Image src={content.imagePrimary} alt="" fill sizes="(min-width: 1024px) 420px, 78vw" className="object-cover" />
          </div>
        ) : (
          <Placeholder label="HOTEL PHOTO" className="absolute top-0 right-0 h-[220px] w-[78%] rounded-2xl bg-white shadow-lf-md" />
        )}
        {content.imageSecondary ? (
          <div className="absolute bottom-0 left-0 h-[200px] w-[62%] overflow-hidden rounded-2xl border-4 border-solid border-white bg-sand-100 shadow-lf-md">
            <Image src={content.imageSecondary} alt="" fill sizes="(min-width: 1024px) 320px, 62vw" className="object-cover" />
          </div>
        ) : (
          <Placeholder
            label="HOTEL PHOTO"
            className="absolute bottom-0 left-0 h-[200px] w-[62%] rounded-2xl border-4 border-solid border-white bg-sand-100 shadow-lf-md"
          />
        )}
        <div className="absolute right-4 bottom-6 flex flex-col rounded-xl bg-sun-400 px-4 py-3 text-navy-900 shadow-lf-md">
          <span className="text-caption font-medium">{content.priceLabel || "Rooms from"}</span>
          <span className="num text-h4 font-bold">{content.priceAmount || "LKR 18,500"}</span>
          <span className="text-caption font-medium">{content.priceSuffix || "per night"}</span>
        </div>
      </div>
    </div>
  );
}
