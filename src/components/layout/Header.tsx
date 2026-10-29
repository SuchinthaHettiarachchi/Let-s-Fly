"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { contact, navGroups, socials, type NavLink } from "@/data/site";

/** "home", "contact" or the key of the menu group whose links include this page. */
function activeKey(pathname: string): string | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/contact")) return "contact";
  const group = navGroups.find((g) =>
    g.links.some((l) => {
      const path = l.href.split("#")[0];
      return pathname === path || pathname.startsWith(`${path}/`);
    }),
  );
  return group?.key ?? null;
}

const navItem =
  "flex items-center gap-1 border-b-[3px] px-3.5 py-2.5 transition-[color,border-color] duration-200 hover:text-ocean-600";
const navState = (on: boolean) =>
  on ? "border-sun-400 text-ocean-600" : "border-transparent text-ink-900 hover:border-sand-300";

export function Header() {
  const pathname = usePathname();
  const active = activeKey(pathname);
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
              src="/images/logo.png"
              alt="Let's Fly.lk"
              width={120}
              height={120}
              preload
              className="size-[76px] lg:size-[120px]"
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 text-[0.9375rem] font-medium lg:flex">
            <Link href="/" aria-current={active === "home" ? "page" : undefined} className={`${navItem} ${navState(active === "home")}`}>
              Home
            </Link>
            {navGroups.map((g) => (
              <Dropdown key={g.key} label={g.label} links={g.links} on={active === g.key} pathname={pathname} width="w-[250px]" />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ButtonLink
                href="/contact"
                variant="primary"
                size="md"
                icon="arrow_forward"
                className="shadow-[0_6px_16px_rgba(19,87,155,.3)]"
              >
                Contact Us
              </ButtonLink>
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

        {mobileOpen && <MobileMenu active={active} pathname={pathname} />}
      </header>
    </div>
  );
}

function TopBar() {
  return (
    <div className="on-dark hidden bg-navy-900 text-small text-white/85 md:block">
      <Container className="flex h-[42px] items-center justify-between gap-6">
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
            {contact.address}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 hidden lg:inline">Follow us</span>
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              title={s.name}
              className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-sun-400 hover:text-navy-900"
            >
              <SocialIcon name={s.name} size={14} />
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}

function Dropdown({
  label,
  links,
  on,
  pathname,
  width,
}: {
  label: string;
  links: NavLink[];
  on: boolean;
  pathname: string;
  width: string;
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
        <div className={`absolute top-full z-10 pt-2.5 left-0`}>
          <div className={`${width} flex flex-col rounded-xl border border-sand-300 bg-white p-2 shadow-lf-md`}>
            {links.map((l) => {
              const here = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={here ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-3 text-[0.9375rem] transition-colors duration-150 ${
                    here
                      ? "bg-sand-50 font-semibold text-ocean-600 shadow-[inset_3px_0_0_var(--color-ocean-600)]"
                      : "text-ink-900 hover:bg-sand-50 hover:text-ocean-600"
                  }`}
                >
                  {l.icon && <Icon name={l.icon} className="text-ocean-600" />}
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({ active, pathname }: { active: string | null; pathname: string }) {
  const item = (on: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-3 text-body font-medium ${
      on ? "bg-sand-50 font-semibold text-ocean-600 shadow-[inset_3px_0_0_var(--color-ocean-600)]" : "text-ink-900 hover:bg-sand-50"
    }`;
  return (
    <nav aria-label="Mobile" className="max-h-[calc(100dvh-88px)] overflow-y-auto border-t border-sand-300 bg-white lg:hidden">
      <Container className="flex flex-col gap-1 py-4">
        <Link href="/" className={item(active === "home")}>Home</Link>
        {navGroups.map((g) => (
          <div key={g.key} className="flex flex-col gap-1">
            <div className="mt-3 px-3 eyebrow text-ink-400">{g.label}</div>
            {g.links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} className={item(pathname === l.href)}>
                {l.icon && <Icon name={l.icon} className="text-ocean-600" />}
                {l.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="my-2 h-px bg-sand-300" />
        <ButtonLink href="/contact" variant="primary" size="lg" icon="arrow_forward" className="mt-3 w-full">
          Contact Us
        </ButtonLink>
        <a href={contact.phoneHref} className="mt-2 flex items-center justify-center gap-2 py-2 text-small font-semibold">
          <Icon name="call" size={18} />
          {contact.phone}
        </a>
        <div className="mt-2 mb-20 flex flex-col items-center gap-3 border-t border-sand-300 pt-5">
          <span className="eyebrow text-ink-400">Follow us</span>
          <SocialLinks />
        </div>
      </Container>
    </nav>
  );
}
