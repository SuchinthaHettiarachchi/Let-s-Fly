import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PaymentLogo } from "@/components/ui/PaymentLogo";
import { SocialIcon, socialBrandClass } from "@/components/ui/SocialIcon";
import { contact, footerColumns, paymentMethodsAccepted, socials } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-sm text-white/75">
      <Container className="grid grid-cols-1 gap-12 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:pt-20 lg:pb-14">
        <div className="flex flex-col gap-[18px]">
          <Image
            src="/images/logo.jpg"
            alt="Let's Fly.lk"
            width={84}
            height={84}
            className="size-[84px] rounded-full bg-sun-400"
          />
          <p className="max-w-[280px] leading-[1.7]">
            Air tickets, tour packages and visa services, planned in Sri Lanka for Sri Lankans and the world.
          </p>
          <div className="flex items-start gap-1.5 leading-relaxed">
            <Icon name="location_on" size={18} className="text-sun-400" />
            {contact.address}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-semibold text-white">Follow us</span>
            <div className="flex gap-2.5">
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
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-semibold text-white">We accept</span>
            <ul className="flex flex-wrap gap-2">
              {paymentMethodsAccepted.map((m) => (
                <li key={m}>
                  <PaymentLogo name={m} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3.5">
            <div className="mb-1.5 text-base font-semibold text-white">{col.title}</div>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href} className="text-white/75 hover:text-sun-400">
                {l.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3.5">
          <div className="mb-1.5 text-base font-semibold text-white">Contact</div>
          <a href={contact.phoneHref} className="flex items-center gap-2.5 text-white/75 hover:text-sun-400">
            <Icon name="call" size={18} className="text-sun-400" />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-white/75 hover:text-sun-400">
            <Icon name="mail" size={18} className="text-sun-400" />
            {contact.email}
          </a>
          <div className="flex items-center gap-2.5">
            <Icon name="schedule" size={18} className="text-sun-400" />
            {contact.hours}
          </div>
          <iframe
            src={contact.mapEmbedHref}
            title="Let's Fly.lk office on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-1 h-[160px] w-full rounded-xl border-0"
          />
          <a
            href={contact.mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-white/75 hover:text-sun-400"
          >
            Open in Google Maps
            <Icon name="north_east" size={16} />
          </a>
        </div>
      </Container>

      <div className="border-t border-white/12">
        <Container className="flex flex-col items-start justify-between gap-2 py-5 text-[13px] text-white/60 sm:h-16 sm:flex-row sm:items-center sm:py-0">
          <span>© {new Date().getFullYear()} Let&apos;s Fly.lk · All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy#cookies" className="text-white/60 hover:text-sun-400">
              Cookies consent
            </Link>
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
          </div>
        </Container>
      </div>
    </footer>
  );
}
