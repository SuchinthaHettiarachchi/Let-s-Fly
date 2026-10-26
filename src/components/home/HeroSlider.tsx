"use client";

import { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { contact } from "@/data/site";
import { heroSlides } from "@/data/home";

const AUTOPLAY_MS = 2000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const count = heroSlides.length;
  const { openInquiry } = useInquiry();

  // Slides change on their own; there are no controls.
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured holidays"
      className="relative h-[600px] overflow-hidden bg-navy-900 sm:h-[640px] lg:h-[660px]"
    >
      {heroSlides.map((s, i) => {
        // Art direction: phones get the portrait photo, `sm` (40rem) and up the landscape one.
        const first = i === 0;
        const common = {
          alt: "",
          fill: true,
          sizes: "100vw",
          loading: first ? "eager" : "lazy",
          fetchPriority: first ? "high" : "auto",
        } as const;
        const { props: { srcSet: landscape } } = getImageProps({ ...common, src: s.image });
        const { props: portrait } = getImageProps({ ...common, src: s.mobileImage });
        return (
          <picture key={s.image}>
            <source media="(min-width: 40rem)" srcSet={landscape} sizes="100vw" />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes from getImageProps */}
            <img
              {...portrait}
              // The showing photo slowly zooms in (a gentle Ken Burns effect).
              className={`object-cover transition-[opacity,scale] ease-out ${
                i === index ? "scale-110 opacity-100 duration-[800ms,3000ms]" : "scale-100 opacity-0 duration-[800ms,0ms] [transition-delay:0ms,800ms]"
              }`}
            />
          </picture>
        );
      })}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,37,69,.94)_0%,rgba(11,37,69,.78)_35%,rgba(19,87,155,.35)_70%,rgba(19,87,155,.1)_100%)]" />

      <Container className="relative flex h-full flex-col justify-center gap-[22px] pb-16 text-white">
        <Eyebrow onDark className="animate-rise tracking-[0.28em]">
          Your journey · Our passion
        </Eyebrow>
        <h1 className="max-w-[640px] animate-rise [animation-delay:120ms] text-[40px] leading-[1.08] font-bold tracking-[-0.02em] text-pretty sm:text-[52px] lg:text-[64px]">
          Plan your next trip with us today
        </h1>
        <p className="max-w-[520px] animate-rise text-base [animation-delay:240ms] leading-[1.6] text-white/85 sm:text-lg">
          Discover cheap flights, visa assistance, customised holiday tours, and complete travel management
          solutions.
        </p>
        <div className="flex animate-rise items-center gap-2 text-sm text-white/80 [animation-delay:340ms]">
          <Icon name="verified" size={20} fill className="text-sun-400" />
          Most trusted travel agency in Sri Lanka
        </div>
        <div className="mt-1.5 flex animate-rise flex-wrap gap-3.5 [animation-delay:440ms]">
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
            size="xl"
            icon="forum"
          >
            Ask Let&apos;s Fly
          </ButtonLink>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-6 lg:bottom-9">
        <Container className="flex items-center">
          <div aria-hidden="true" className="flex items-center gap-2.5">
            {heroSlides.map((s, i) => (
              <span
                key={s.title}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-sun-400" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
