"use client";

import { getImageProps } from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { contact } from "@/data/site";
import { heroSlides } from "@/data/home";
import { apiUrl } from "@/lib/api-url";

const AUTOPLAY_MS = 2000;

type Slide = { desktop: string; mobile: string; title: string; link: string; optimized: boolean };

interface AdminSlide {
  id: string;
  title: string;
  link: string;
  active: boolean;
  desktop: string;
  mobile: string;
}

// The built-in slides: static image paths the Next optimizer can handle.
const staticSlides: Slide[] = heroSlides.map((s) => ({
  desktop: s.image,
  mobile: s.mobileImage,
  title: s.title,
  link: "",
  optimized: true,
}));

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(staticSlides);
  const count = slides.length;
  const hasLinks = slides.some((s) => s.link);
  const { openInquiry } = useInquiry();

  // CMS-managed slides replace the built-in set once they load. If the API is
  // unreachable or has nothing usable, visitors keep the static slides.
  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl("/hero"))
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (cancelled || !data || typeof data !== "object") return;
        const raw = (data as { slides?: unknown }).slides;
        if (!Array.isArray(raw)) return;
        const usable = (raw as AdminSlide[]).filter((s) => s && s.active && s.desktop && s.mobile);
        if (!usable.length) return;
        setSlides(usable.map((s) => ({
          desktop: s.desktop,
          mobile: s.mobile,
          title: s.title,
          link: s.link,
          optimized: false,
        })));
        setIndex(0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Slides change on their own; there are no controls.
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured holidays"
      className="on-dark relative min-h-[560px] overflow-hidden bg-navy-900 sm:h-[640px] lg:h-[660px]"
    >
      {slides.map((s, i) => {
        const first = i === 0;
        // The showing photo slowly zooms in (a gentle Ken Burns effect).
        const layer = `object-cover transition-[opacity,scale] ease-out ${
          i === index ? "scale-110 opacity-100 duration-[800ms,3000ms]" : "scale-100 opacity-0 duration-[800ms,0ms] [transition-delay:0ms,800ms]"
        }`;
        const content = s.optimized ? (
          (() => {
            // Art direction: phones get the portrait photo, `sm` (40rem) and up the landscape one.
            const common = {
              alt: "",
              fill: true,
              sizes: "100vw",
              loading: first ? "eager" : "lazy",
              fetchPriority: first ? "high" : "auto",
            } as const;
            const { props: { srcSet: landscape } } = getImageProps({ ...common, src: s.desktop });
            const { props: portrait } = getImageProps({ ...common, src: s.mobile });
            return (
              <picture>
                <source media="(min-width: 40rem)" srcSet={landscape} sizes="100vw" />
                {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes from getImageProps */}
                <img {...portrait} className={layer} />
              </picture>
            );
          })()
        ) : (
          // Admin uploads are base64 WebP (not optimizer paths), so both files are
          // stacked and swapped in CSS at the same 40rem breakpoint as <picture>.
          <>
            <img alt={s.title} className={`hidden min-[40rem]:block absolute inset-0 h-full w-full ${layer}`} loading={first ? "eager" : "lazy"} src={s.desktop} />
            <img alt={s.title} className={`block min-[40rem]:hidden absolute inset-0 h-full w-full ${layer}`} loading={first ? "eager" : "lazy"} src={s.mobile} />
          </>
        );
        return s.link ? (
          <a key={`${s.title}-${i}`} className="absolute inset-0" href={s.link}>{content}</a>
        ) : (
          <Fragment key={`${s.title}-${i}`}>{content}</Fragment>
        );
      })}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,.5)_0%,rgba(11,37,69,.9)_100%)] sm:bg-[linear-gradient(90deg,rgba(11,37,69,.94)_0%,rgba(11,37,69,.78)_35%,rgba(19,87,155,.35)_70%,rgba(19,87,155,.1)_100%)]" />

      <Container className={`relative flex h-full min-h-[560px] flex-col justify-center gap-5 py-16 text-white sm:min-h-0 sm:gap-[22px] sm:pt-0${hasLinks ? " pointer-events-none" : ""}`}>
        <Eyebrow onDark className="animate-rise">
          Your journey · Our passion
        </Eyebrow>
        <h1 className="max-w-[18ch] animate-rise [animation-delay:120ms] text-display">
          Plan your next trip with us today
        </h1>
        <p className="max-w-[52ch] animate-rise text-lead [animation-delay:240ms] text-white/85">
          Discover cheap flights, visa assistance, customised holiday tours, and complete travel management
          solutions.
        </p>
        <div className="flex animate-rise items-center gap-2 text-small text-white/80 [animation-delay:340ms]">
          <Icon name="verified" size={20} fill className="text-sun-400" />
          Most trusted travel agency in Sri Lanka
        </div>
        <div className={`mt-1.5 flex animate-rise flex-col gap-3 *:w-full [animation-delay:440ms] sm:flex-row sm:flex-wrap sm:gap-3.5 sm:*:w-auto${hasLinks ? " pointer-events-auto" : ""}`}>
          <Button
            variant="primary"
            size="xl"
            icon="arrow_forward"
            className="px-[30px] shadow-[0_8px_24px_rgba(0,0,0,.25)]"
            onClick={() => openInquiry()}
          >
            Plan My Trip
          </Button>
          <ButtonLink href="/air-tickets" variant="ghostOnDark" size="xl" leadingIcon="flight">
            Book a Flight
          </ButtonLink>
          <ButtonLink
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="sand"
            className="max-sm:hidden"
            size="xl"
            icon="forum"
          >
            Ask Let&apos;s Fly
          </ButtonLink>
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 lg:bottom-9">
        <Container className="flex items-center">
          <div aria-hidden="true" className="flex items-center gap-2.5">
            {slides.map((s, i) => (
              <span
                key={`${s.title}-${i}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-sun-400" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
