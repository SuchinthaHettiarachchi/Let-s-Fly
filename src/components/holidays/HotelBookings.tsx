"use client";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { bookingPortals } from "@/data/site";

const stats = [
  { value: "2,000+", label: "Hotels & villas" },
  { value: "Best rate", label: "Partner pricing" },
];

export function HotelBookings() {
  const { openInquiry } = useInquiry();
  const portal = bookingPortals.hotels;

  return (
    <section id="hotels" className="scroll-mt-[110px] lg:scroll-mt-[156px] pb-20 lg:pb-[110px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 rounded-2xl border border-sand-300 bg-sand-50 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div className="flex flex-col gap-5">
            <Eyebrow rule>Hotel bookings</Eyebrow>
            <h2 className="text-[30px] leading-[1.18] font-bold tracking-[-0.01em] text-pretty sm:text-[36px]">
              Stay somewhere special, anywhere in Sri Lanka
            </h2>
            <p className="text-[15px] leading-[1.75] text-ink-600">
              From boutique villas in Galle to tea-estate bungalows in Ella, book 2,000+ hand-checked hotels at our
              partner rates, instantly, through our booking portal.
            </p>
            <div className="flex gap-6">
              {stats.map((s, i) => (
                <div key={s.label} className={`flex flex-col ${i ? "border-l border-sand-300 pl-6" : ""}`}>
                  <span className="text-[26px] font-bold text-ocean-600">{s.value}</span>
                  <span className="text-xs text-ink-400">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {portal ? (
                <>
                  <ButtonLink href={portal} target="_blank" rel="noopener noreferrer" variant="primary" size="lg" icon="north_east">
                    Book Hotel
                  </ButtonLink>
                  <span className="flex items-center gap-1.5 text-xs text-ink-400">
                    <Icon name="open_in_new" size={16} />
                    Opens our booking portal
                  </span>
                </>
              ) : (
                <Button variant="primary" size="lg" icon="arrow_forward" onClick={() => openInquiry({ service: "Hotels" })}>
                  Book Hotel
                </Button>
              )}
            </div>
          </div>

          {/* Two overlapping photos + price tag. Placeholders until hotel photos are supplied. */}
          <div className="relative h-[340px] sm:h-[380px]">
            <Placeholder label="HOTEL PHOTO" className="absolute top-0 right-0 h-[220px] w-[78%] rounded-2xl bg-white shadow-lf-md" />
            <Placeholder
              label="HOTEL PHOTO"
              className="absolute bottom-0 left-0 h-[200px] w-[62%] rounded-2xl border-4 border-solid border-white bg-sand-100 shadow-lf-md"
            />
            <div className="absolute right-4 bottom-6 flex flex-col rounded-xl bg-sun-400 px-4 py-3 text-navy-900 shadow-lf-md">
              <span className="text-[11px] font-medium">Rooms from</span>
              <span className="text-xl font-bold">LKR 18,500</span>
              <span className="text-[11px] font-medium">per night</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
