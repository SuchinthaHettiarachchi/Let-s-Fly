import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PaymentLogo } from "@/components/ui/PaymentLogo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Newsletter } from "@/components/layout/Newsletter";
import { contact, footerColumns, paymentMethodsAccepted, socials } from "@/data/site";

/** Small uppercase label over each footer block. */
function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 eyebrow text-white/50">{children}</div>;
}

const [quickLinks, legalLinks] = footerColumns;
const half = Math.ceil(quickLinks.links.length / 2);
const linkColumns = [quickLinks.links.slice(0, half), quickLinks.links.slice(half)];

/**
 * Newsletter card, then a Sigiriya photo scene with the tagline and Contact Us, fading into navy behind
 * contact details, quick links, the map, payments and socials. Legal links sit in the bottom bar.
 */
export function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="on-dark relative isolate overflow-hidden bg-navy-900 text-small text-white/75">
        {/* Covers the top 640px on phones so the rock stays in frame; from 900px it covers the whole footer. */}
        <div className="absolute inset-x-0 top-0 -z-20 h-[640px] min-[900px]:h-full">
          <Image
            src="/images/footer/sigiriya.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[58%_top] min-[900px]:object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-navy-900 min-[900px]:hidden" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,37,69,.3)_0%,rgba(11,37,69,0)_12%,rgba(11,37,69,.18)_28%,rgba(11,37,69,.55)_46%,rgba(11,37,69,.85)_64%,rgba(11,37,69,.97)_78%,#0b2545_100%),linear-gradient(90deg,rgba(11,37,69,.45)_0%,rgba(11,37,69,0)_55%)]"
        />

        <section aria-label="Smart travel starts here">
          <Container className="pt-14 pb-9 sm:pt-16 sm:pb-12">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <h2 className="m-0 max-w-[620px] text-h1 text-white">Smart travel starts here.</h2>
              <Link
                href="/contact"
                className="shrink-0 rounded-lg bg-white px-[26px] py-[13px] text-small font-semibold tracking-[0.06em] text-navy-900! uppercase transition-[background-color,scale] duration-200 hover:bg-sand-100 press"
              >
                Contact Us
              </Link>
            </div>
            <p className="mt-4 max-w-[460px] text-body text-white/85">
              Flights, visas, hotels and holidays, planned with care and a personal touch.
            </p>
          </Container>
        </section>

        <Container className="grid grid-cols-1 gap-11 pt-6 pb-12 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.25fr_1.15fr] lg:gap-16 lg:pb-14">
          <div className="flex flex-col gap-[22px]">
            <Image src="/images/logo.png" alt="Let's Fly.lk" width={96} height={96} className="size-[96px]" />
            <div className="grid gap-[18px]">
              <div>
                <Label>Address</Label>
                <a href={contact.mapHref} target="_blank" rel="noopener noreferrer" className="text-white hover:text-sun-400">
                  <address className="max-w-[260px] not-italic">{contact.address}</address>
                </a>
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
          </div>

          <nav aria-label="Quick links">
            <Label>Quick links</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-x-7">
              {linkColumns.map((links, i) => (
                <ul key={i} className="flex flex-col gap-3.5 border-l-2 border-sun-400/55 py-0.5 pl-4">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-white/80 transition-colors duration-200 hover:text-sun-400">
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
              <Label>Find us</Label>
              <iframe
                src={contact.mapEmbedHref}
                title="Let's Fly.lk office on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mt-1 h-[150px] w-full rounded-xl border-0 saturate-90"
              />
              <a
                href={contact.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-white/75 hover:text-sun-400"
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
              <div className="mt-1.5 flex gap-4">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="text-white transition-opacity hover:text-white hover:opacity-70"
                  >
                    <SocialIcon name={s.name} size={28} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>

        <div className="border-t border-white/14">
          <Container className="flex flex-col items-start gap-3 py-5 text-white/70 lg:flex-row lg:items-center lg:justify-between">
            <span>© {new Date().getFullYear()} Let&apos;s Fly.lk · All rights reserved.</span>
            <nav aria-label={legalLinks.title} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {legalLinks.links.map((l, i) => (
                <Fragment key={l.href}>
                  {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-white/30" />}
                  <Link href={l.href} className="inline-block py-1.5 text-white/70 transition-colors duration-200 hover:text-sun-400">
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
    </>
  );
}
