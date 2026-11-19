import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { buttonClasses } from "@/components/ui/Button";
import { contact } from "@/data/site";
import { formatLKR } from "@/lib/package-format";
import type { AirTicketRoute } from "@/lib/air-tickets-api";

/** "Top fares from Colombo": photo cards from CMS with WhatsApp CTA per route. */
export function FareGrid({ fares }: { fares: AirTicketRoute[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {fares.map((f, i) => {
        const from = f.startLocation || "Colombo";
        const to = f.endLocation || "Destination";
        const whatsappText = `Hi Let's Fly, I'm interested in an air ticket from ${from} to ${to} (from ${formatLKR(f.pricePerPerson)} per person). Please share available options.`;
        const whatsappHref = `${contact.whatsappHref}?text=${encodeURIComponent(whatsappText)}`;
        return (
          <li
            key={f._id ?? `${from}-${to}-${i}`}
            data-reveal={(i % 3) * 100}
            className="group relative h-[220px] overflow-hidden rounded-xl bg-navy-900 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lf-card-hover"
          >
            {f.image ? (
              <Image
                src={f.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
            )}
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,0)_35%,rgba(11,37,69,.88)_100%)]" />
            <div className="absolute top-3.5 right-3.5 flex gap-2 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "md", "h-10 px-3 text-caption lg:h-8")}
              >
                Inquire on WhatsApp
                <Icon name="chat" size={14} />
              </a>
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white">
              <div className="flex flex-col">
                <span className="text-caption font-normal text-white/75">{from}</span>
                <span className="flex items-center gap-1.5 text-h4">
                  <Icon name="flight" size={20} className="text-sun-400" />
                  {to}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-caption font-normal text-white/75">from</span>
                <span className="num text-h4 font-bold">{formatLKR(f.pricePerPerson)}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
