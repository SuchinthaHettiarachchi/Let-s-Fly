"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ArrowButton, Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { contact } from "@/data/site";
import { heroSlides } from "@/data/home";

const AUTOPLAY_MS = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = heroSlides.length;
  const { openInquiry } = useInquiry();

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured holidays"
      className="relative h-[600px] overflow-hidden bg-navy-900 sm:h-[640px] lg:h-[660px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heroSlides.map((s, i) => (
        <Image
          key={s.image}
          src={s.image}
          alt=""
          fill
          sizes="100vw"
          preload={i === 0}
          className={`object-cover transition-opacity duration-800 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,37,69,.94)_0%,rgba(11,37,69,.78)_35%,rgba(19,87,155,.35)_70%,rgba(19,87,155,.1)_100%)]" />

      <Container className="relative flex h-full flex-col justify-center gap-[22px] pb-16 text-white">
        <Eyebrow onDark className="tracking-[0.28em]">
          Your journey · Our passion
        </Eyebrow>
        <h1 className="max-w-[640px] text-[40px] leading-[1.08] font-bold tracking-[-0.02em] text-pretty sm:text-[52px] lg:text-[64px]">
          Plan your ultimate travel experience today
        </h1>
        <p className="max-w-[520px] text-base leading-[1.6] text-white/85 sm:text-lg">
          Discover cheap flights, visa assistance, customised holiday tours, and complete travel management
          solutions.
        </p>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Icon name="verified" size={20} fill className="text-sun-400" />
          Most trusted travel agency in Sri Lanka
        </div>
        <div className="mt-1.5 flex flex-wrap gap-3.5">
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
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {heroSlides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Show ${s.title}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-sun-400" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
            <span className="ml-3.5 text-[13px] text-white/70">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
          <div className="flex gap-2.5">
            <ArrowButton direction="prev" tone="dark" onClick={() => setIndex((i) => (i + count - 1) % count)} />
            <ArrowButton direction="next" tone="dark" onClick={() => setIndex((i) => (i + 1) % count)} />
          </div>
        </Container>
      </div>
    </section>
  );
}
