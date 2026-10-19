import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { bookingPortals, contact } from "@/data/site";
import { portalSteps } from "@/data/flights";

/** "Book your flight on our booking portal" card that overlaps the hero. */
export function PortalCard() {
  const portal = bookingPortals.flights;
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-sand-300 bg-white shadow-lf-lg lg:grid-cols-[1fr_1.35fr]">
      <div className="relative min-h-[220px] bg-sand-100 p-6">
        <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
        <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-900 shadow-lf-md">
          <span className="flex size-5 items-center justify-center rounded-full bg-ocean-600 text-white">
            <Icon name="check" size={14} />
          </span>
          E-ticket confirmed
        </span>
      </div>
      <div className="flex flex-col gap-5 p-6 sm:p-10">
        <span className="self-start rounded-full bg-sand-50 px-3 py-1 text-xs font-semibold text-ocean-600">
          Self-booking · By Let&apos;s Fly.lk
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-[-0.01em] sm:text-[28px]">Book your flight on our booking portal</h2>
          <p className="text-[15px] leading-relaxed text-ink-600">
            Built by the Let&apos;s Fly.lk team, our portal lets you compare live fares, pick seats and pay securely, all
            in one place.
          </p>
        </div>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {portalSteps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-1.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-ocean-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-semibold">{s.title}</span>
              <span className="text-xs text-ink-400">{s.text}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {portal ? (
            <ButtonLink href={portal} target="_blank" rel="noopener noreferrer" variant="primary" size="lg" icon="north_east">
              Search &amp; Book Flights
            </ButtonLink>
          ) : (
            <ButtonLink href="#flight-inquiry" variant="primary" size="lg" icon="arrow_downward">
              Search &amp; Book Flights
            </ButtonLink>
          )}
          <a href="#flight-inquiry" className="text-sm font-semibold">
            Prefer we book it for you? Send an inquiry ↓
          </a>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-sand-300 pt-4 text-xs text-ink-600">
          <li className="flex items-center gap-1.5">
            <Icon name="verified" size={16} className="text-ocean-600" />
            IATA-accredited ticketing
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="lock" size={16} className="text-ocean-600" />
            Secure payments on our portal
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="call" size={16} className="text-ocean-600" />
            Need a person? Call&nbsp;<a href={contact.phoneHref}>{contact.phone}</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
