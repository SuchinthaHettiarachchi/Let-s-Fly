"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { contact, holidayLinks, moreLinks, type NavKey, type NavLink } from "@/data/site";

function activeKey(pathname: string): NavKey | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/air-tickets")) return "air";
  if (pathname.startsWith("/holidays") || pathname.startsWith("/packages")) return "holidays";
  if (pathname.startsWith("/visa")) return "visa";
  if (pathname.startsWith("/rentals")) return "rentals";
  if (moreLinks.some((l) => pathname.startsWith(l.href))) return "more";
  return null;
}

const navItem =
  "flex items-center gap-1 border-b-[3px] px-3.5 py-2.5 transition-colors hover:text-ocean-600";
const navState = (on: boolean) =>
  on ? "border-sun-400 text-ocean-600" : "border-transparent text-ink-900";

export function Header() {
  const pathname = usePathname();
  const active = activeKey(pathname);
  const { openInquiry } = useInquiry();
  // The menu remembers the path it was opened on, so navigating closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const mobileOpen = menuPath === pathname;
  const setMobileOpen = (open: boolean) => setMenuPath(open ? pathname : null);

  return (
    <div className="sticky top-0 z-50 md:-top-[42px]">
      <TopBar />
      <header className="border-b border-sand-300 bg-white shadow-lf-header">
        <Container className="flex h-[88px] items-center justify-between lg:h-[136px]">
          <Link href="/" aria-label="Let's Fly.lk home" className="flex items-center">
            <Image
              src="/images/logo.jpg"
              alt="Let's Fly.lk"
              width={120}
              height={120}
              preload
              className="size-[72px] rounded-full bg-sun-400 lg:size-[120px]"
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 text-[14.5px] font-medium lg:flex">
            <Link href="/" className={`${navItem} ${navState(active === "home")}`}>
              Home
            </Link>
            <Link href="/air-tickets" className={`${navItem} ${navState(active === "air")}`}>
              Air Tickets
              <Icon name="north_east" size={15} />
            </Link>
            <Dropdown label="Holidays" links={holidayLinks} on={active === "holidays"} width="w-[260px]" />
            <Link href="/visa" className={`${navItem} ${navState(active === "visa")}`}>
              Visa Services
            </Link>
            <Link href="/rentals" className={`${navItem} ${navState(active === "rentals")}`}>
              Rentals
            </Link>
            <Dropdown label="More" links={moreLinks} on={active === "more"} width="w-[220px]" alignRight />
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button
                variant="primary"
                size="md"
                icon="arrow_forward"
                onClick={() => openInquiry()}
                className="shadow-[0_6px_16px_rgba(19,87,155,.3)]"
              >
                Inquire Now
              </Button>
            </div>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-navy-900 hover:bg-sand-50 lg:hidden"
            >
              <Icon name={mobileOpen ? "close" : "menu"} size={28} />
            </button>
          </div>
        </Container>

        {mobileOpen && <MobileMenu active={active} onInquire={() => openInquiry()} />}
      </header>
    </div>
  );
}

function TopBar() {
  return (
    <div className="hidden bg-navy-900 text-[13px] text-white/85 md:block">
      <Container className="flex h-[42px] items-center">
        <div className="flex items-center gap-7">
          <a href={contact.phoneHref} className="flex items-center gap-1.5 text-white/85 hover:text-white">
            <Icon name="call" size={17} className="text-sun-400" />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-white/85 hover:text-white">
            <Icon name="mail" size={17} className="text-sun-400" />
            {contact.email}
          </a>
          <span className="hidden items-center gap-1.5 lg:flex">
            <Icon name="location_on" size={17} className="text-sun-400" />
            {contact.addressShort}
          </span>
        </div>
      </Container>
    </div>
  );
}

function Dropdown({
  label,
  links,
  on,
  width,
  alignRight = false,
}: {
  label: string;
  links: NavLink[];
  on: boolean;
  width: string;
  alignRight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      {/* Click only opens: a mouse click also fires mouseenter, so toggling would shut it again. */}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(true)}
        className={`${navItem} ${navState(on)} cursor-pointer gap-0.5 font-medium`}
      >
        {label}
        <Icon name="expand_more" size={20} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute top-full z-10 pt-2.5 ${alignRight ? "right-0" : "left-0"}`}>
          <div className={`${width} flex flex-col rounded-xl border border-sand-300 bg-white p-2 shadow-lf-md`}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-ink-900 hover:bg-sand-50 hover:text-ocean-600"
              >
                {l.icon && <Icon name={l.icon} className="text-ocean-600" />}
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({ active, onInquire }: { active: NavKey | null; onInquire: () => void }) {
  const item = (on: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium ${
      on ? "bg-sand-50 text-ocean-600" : "text-ink-900 hover:bg-sand-50"
    }`;
  return (
    <nav aria-label="Mobile" className="max-h-[calc(100dvh-88px)] overflow-y-auto border-t border-sand-300 bg-white lg:hidden">
      <Container className="flex flex-col gap-1 py-4">
        <Link href="/" className={item(active === "home")}>Home</Link>
        <Link href="/air-tickets" className={item(active === "air")}>Air Tickets</Link>
        <div className="mt-2 px-3 text-xs font-semibold tracking-[0.2em] text-ink-400">HOLIDAYS</div>
        {holidayLinks.map((l) => (
          <Link key={l.href} href={l.href} className={item(false)}>
            {l.icon && <Icon name={l.icon} className="text-ocean-600" />}
            {l.label}
          </Link>
        ))}
        <div className="my-2 h-px bg-sand-300" />
        <Link href="/visa" className={item(active === "visa")}>Visa Services</Link>
        <Link href="/rentals" className={item(active === "rentals")}>Rentals</Link>
        {moreLinks.map((l) => (
          <Link key={l.href} href={l.href} className={item(false)}>
            {l.label}
          </Link>
        ))}
        <Button variant="primary" size="lg" icon="arrow_forward" onClick={onInquire} className="mt-3 w-full">
          Inquire Now
        </Button>
        <a href={contact.phoneHref} className="mt-2 flex items-center justify-center gap-2 py-2 text-sm">
          <Icon name="call" size={18} />
          {contact.phone}
        </a>
      </Container>
    </nav>
  );
}
