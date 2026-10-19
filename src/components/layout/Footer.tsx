import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { contact, footerColumns, socials } from "@/data/site";

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
            Air tickets, tour packages and visa services — planned in Sri Lanka, for Sri Lankans and the world.
          </p>
          <div className="flex items-start gap-1.5 leading-relaxed">
            <Icon name="location_on" size={18} className="text-sun-400" />
            {contact.address}
          </div>
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white transition-colors hover:bg-sun-400 hover:text-navy-900"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="mt-1 flex gap-2.5">
            <Placeholder label="AWARD" icon="workspace_premium" dark className="size-[72px]" />
            <Placeholder label="AWARD" icon="workspace_premium" dark className="size-[72px]" />
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
          <a href={contact.mapHref} target="_blank" rel="noopener noreferrer" className="mt-1 block hover:text-white">
            <Placeholder label="GOOGLE MAP" icon="map" dark className="h-[120px] w-full" />
          </a>
        </div>
      </Container>

      <div className="border-t border-white/12">
        <Container className="flex flex-col items-start justify-between gap-2 py-5 text-[13px] text-white/60 sm:h-16 sm:flex-row sm:items-center sm:py-0">
          <span>© {new Date().getFullYear()} Let&apos;s Fly.lk · All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/60 hover:text-sun-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-sun-400">
              Terms &amp; Conditions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
