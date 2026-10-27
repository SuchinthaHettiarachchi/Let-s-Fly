import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PaymentLogo } from "@/components/ui/PaymentLogo";
import { SocialIcon, socialBrandClass } from "@/components/ui/SocialIcon";
import { contact, footerColumns, paymentMethodsAccepted, socials } from "@/data/site";

const [quickLinks, legalLinks] = footerColumns;
const half = Math.ceil(quickLinks.links.length / 2);
const quickLinkColumns = [quickLinks.links.slice(0, half), quickLinks.links.slice(half)];

/** Small uppercase label over each footer block, as on the Walkers Tours footer. */
function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[11.5px] font-semibold tracking-[0.16em] text-white/50 uppercase">{children}</div>;
}

/**
 * Walkers Tours layout on our navy: phone, email and hours on the left, quick links in two columns,
 * then address with the map, payments and socials; legal links sit in the bottom bar.
 */
export function Footer() {
  return (
    <footer className="bg-navy-900 text-sm text-white/75">
      <Container className="grid grid-cols-1 gap-12 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.2fr_1.15fr] lg:gap-16 lg:pt-20 lg:pb-14">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Image src="/images/logo.png" alt="Let's Fly.lk" width={96} height={96} className="size-[96px]" />
            <p className="max-w-[300px] leading-[1.7]">
              Smart travel starts here. Flights, visas, hotels and holidays, planned with care and a personal touch.
            </p>
          </div>
          <div>
            <Label>Phone</Label>
            <a href={contact.phoneHref} className="text-white hover:text-sun-400">
              {contact.phone}
            </a>
          </div>
          <div>
            <Label>Email</Label>
            <a href={`mailto:${contact.email}`} className="text-white hover:text-sun-400">
              {contact.email}
            </a>
          </div>
          <div>
            <Label>Office hours</Label>
            <span className="text-white">{contact.hours}</span>
          </div>
        </div>

        <nav aria-label="Quick links">
          <Label>Quick links</Label>
          <div className="mt-1 grid grid-cols-2 gap-x-8">
            {quickLinkColumns.map((links, i) => (
              <ul key={i} className="flex flex-col gap-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/75 hover:text-sun-400">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-7 sm:col-span-2 lg:col-span-1">
          <div>
            <Label>Address</Label>
            <a
              href={contact.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 leading-relaxed text-white hover:text-sun-400"
            >
              <Icon name="location_on" size={18} className="mt-0.5 flex-none text-sun-400" />
              {contact.address}
            </a>
            <iframe
              src={contact.mapEmbedHref}
              title="Let's Fly.lk office on Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-3 h-[150px] w-full rounded-xl border-0"
            />
            <a
              href={contact.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1.5 text-[13px] text-white/75 hover:text-sun-400"
            >
              Open in Google Maps
              <Icon name="north_east" size={16} />
            </a>
          </div>
          <div>
            <Label>We accept</Label>
            <ul className="mt-1 flex flex-wrap gap-2">
              {paymentMethodsAccepted.map((m) => (
                <li key={m}>
                  <PaymentLogo name={m} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label>Follow us</Label>
            <div className="mt-1 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className={`flex size-10 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5 hover:text-white ${socialBrandClass[s.name]}`}
                >
                  <SocialIcon name={s.name} size={19} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/12">
        <Container className="flex flex-col items-start gap-3 py-5 text-[13px] text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <span>© {new Date().getFullYear()} Let&apos;s Fly.lk · All rights reserved.</span>
          <nav aria-label={legalLinks.title} className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {legalLinks.links.map((l, i) => (
              <Fragment key={l.href}>
                {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-white/30" />}
                <Link href={l.href} className="text-white/60 hover:text-sun-400">
                  {l.label}
                </Link>
              </Fragment>
            ))}
          </nav>
          <span>
            Designed &amp; developed by{" "}
            <a
              href="https://www.karalliyaddaone.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/85 hover:text-sun-400"
            >
              karalliyaddaone
            </a>
          </span>
        </Container>
      </div>
    </footer>
  );
}
