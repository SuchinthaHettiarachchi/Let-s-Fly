import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { stats } from "@/data/home";
import { CountUp } from "./CountUp";

const reviewerAvatars = [
  "/images/people/reviewer-1.jpg",
  "/images/people/reviewer-2.jpg",
  "/images/people/reviewer-3.jpg",
];

export function AboutIntro() {
  return (
    <section className="py-16 lg:py-20">
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-[72px]">
        <div data-reveal className="relative">
          {/* Brand film placeholder — swap for the real video embed once it's produced. */}
          <div className="flex h-[300px] flex-col items-center justify-center gap-3.5 rounded-2xl border-2 border-dashed border-sand-400 bg-sand-100 text-ink-400 sm:h-[440px]">
            <div className="relative flex size-[84px] items-center justify-center">
              {/* Soft ripple that keeps pulsing out from the play button. */}
              <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-ocean-600/25" />
              <span className="relative flex size-full items-center justify-center rounded-full bg-ocean-600 text-white shadow-lf-ring transition-transform duration-300 hover:scale-110">
                <Icon name="play_arrow" size={44} />
              </span>
            </div>
            <div className="font-mono text-[13px] font-semibold tracking-[0.12em]">VIDEO</div>
            <div className="text-xs">Brand film · 60–90 sec · 16:9</div>
          </div>
          <div className="absolute -bottom-7 right-4 flex animate-float items-center gap-3.5 rounded-xl bg-white px-5 py-4 shadow-lf-md sm:-right-6">
            <div className="flex">
              {reviewerAvatars.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={38}
                  height={38}
                  className={`size-[38px] rounded-full border-2 border-white bg-sand-200 object-cover ${i ? "-ml-2.5" : ""}`}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">4.9 on Google</span>
              <span className="text-xs text-ink-400">from 800+ reviews</span>
            </div>
          </div>
        </div>

        <div data-reveal="150" className="flex flex-col gap-5">
          <Eyebrow>Who we are</Eyebrow>
          <h2 className="text-[30px] leading-[1.18] font-bold tracking-[-0.01em] text-pretty sm:text-[36px] lg:text-[42px]">
            Sri Lankan travel experts who plan every detail for you
          </h2>
          <p className="text-base leading-[1.75] text-ink-600">
            From a weekend in Ella to a family week in Dubai, our Rajagiriya team handles your tickets, visas, hotels
            and transfers — so all you have to do is pack.
          </p>
          <div className="mt-2.5 mb-2 grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative flex flex-col gap-0.5 overflow-hidden rounded-xl bg-sand-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lf-card-hover sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-ocean-600 transition-transform duration-300 group-hover:scale-x-100"
                />
                <CountUp
                  value={s.value}
                  className="text-2xl font-bold text-ocean-600 tabular-nums transition-transform duration-300 group-hover:scale-105 sm:text-[32px]"
                />
                <span className="text-xs text-ink-600 sm:text-[13px]">{s.label}</span>
              </div>
            ))}
          </div>
          <ButtonLink href="/about" variant="primary" size="lg" icon="arrow_forward" className="self-start">
            About Us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
