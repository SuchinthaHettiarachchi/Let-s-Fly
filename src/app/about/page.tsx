import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { TeamSection } from "@/components/about/TeamSection";
import { ApproachList } from "@/components/about/ApproachList";
import { CountUp } from "@/components/home/CountUp";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { contact } from "@/data/site";
import {
  aboutParagraphs,
  aboutStats,
  approach,
  commitments,
  founderQuote,
  journeysThisYear,
  team,
  underOneRoof,
  visionMission,
} from "@/data/about";

export const metadata: Metadata = {
  title: { absolute: "About Us | Trusted Travel Agency in Colombo | Let's Fly" },
  description:
    "Meet the Let's Fly team, a Colombo-based, SLTDA-registered travel agency helping Sri Lankans and visitors plan flights, tours, visas and corporate travel.",
};

const gradient =
  "bg-[linear-gradient(90deg,rgba(11,37,69,.94)_0%,rgba(11,37,69,.78)_35%,rgba(19,87,155,.35)_70%,rgba(19,87,155,.1)_100%)]";

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <Image src="/images/hero/dubai.jpg" alt="" fill preload sizes="100vw" className="animate-zoom object-cover" />
        <div className={`absolute inset-0 ${gradient}`} />
        <Container className="relative flex min-h-[600px] flex-col justify-center gap-5 py-14 text-white sm:min-h-[640px] lg:min-h-[660px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} onDark />
          <Eyebrow onDark className="animate-rise">
            About Us
          </Eyebrow>
          <h1 className="max-w-[860px] animate-rise text-[34px] [animation-delay:120ms] leading-[1.1] font-bold tracking-[-0.02em] text-pretty sm:text-[48px] lg:text-[60px]">
            Sri Lankan travel experts who plan everything
          </h1>
          <p className="max-w-[560px] animate-rise text-base leading-relaxed text-white/85 [animation-delay:240ms] sm:text-lg">
            A Sri Lankan team handling your flights, visas, hotels and tours with professionalism, efficiency and a personal touch.
          </p>
          <span className="flex animate-rise items-center gap-2 self-start rounded-full [animation-delay:360ms] border border-white/25 bg-white/12 px-4 py-2 text-sm">
            <Icon name="groups" size={18} className="text-sun-400" />
            15,000+ travellers since 2016
          </span>
        </Container>
      </section>

      {/* 2. Vision & Mission: two photo panels side by side, text over a navy fade */}
      <section className="pt-16 lg:pt-24">
        <Container className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {visionMission.map((v, i) => (
            <div
              key={v.title}
              data-reveal={i * 120}
              className="group relative flex min-h-[420px] items-end overflow-hidden rounded-2xl bg-navy-900 text-white lg:min-h-[520px]"
            >
              <Image
                src={v.image}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,.15)_0%,rgba(11,37,69,.55)_45%,rgba(11,37,69,.94)_100%)]" />
              <div className="relative flex flex-col gap-4 p-7 sm:p-10">
                <Eyebrow onDark>Our</Eyebrow>
                <h2 className="text-[38px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[48px]">{v.title}</h2>
                <p className="text-base leading-[1.75] text-white/88">{v.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* 3. Who we are */}
      <section className="py-16 lg:py-24">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div data-reveal className="flex flex-col gap-5">
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="text-[32px] leading-[1.15] font-bold tracking-[-0.01em] sm:text-[42px]">
              More Than <span className="text-ocean-600">Just Travel</span>
            </h2>
            {aboutParagraphs.map((p) => (
              <p key={p.slice(0, 20)} className="text-[15px] leading-[1.8] text-ink-600">
                {p}
              </p>
            ))}
            <figure className="mt-2 flex gap-4 border-t border-sand-300 pt-6">
              <span className="flex size-12 flex-none items-center justify-center rounded-full bg-ocean-600 text-sm font-bold text-white">
                {founderQuote.initials}
              </span>
              <div className="flex flex-col gap-2">
                <blockquote className="text-[16px] leading-relaxed font-medium text-ink-900">
                  “{founderQuote.quote}”
                </blockquote>
                <figcaption className="text-sm">
                  <span className="font-semibold">{founderQuote.name}</span>
                  <span className="block text-xs text-ink-400">{founderQuote.role}</span>
                </figcaption>
              </div>
            </figure>
          </div>
          <div data-reveal="150" className="relative mx-auto w-full max-w-[500px] pb-16 sm:pb-20">
            <Placeholder label="TEAM PHOTO" icon="groups" className="aspect-[4/5] w-[92%] rounded-2xl" />
            <div className="absolute bottom-0 left-0 size-[46%] overflow-hidden rounded-2xl border-[6px] border-white shadow-lf-md">
              <Image src="/images/packages/kandy-ella-rail.jpg" alt="" fill sizes="230px" className="object-cover" />
            </div>
            <div className="absolute top-8 right-0 flex animate-float flex-col rounded-xl bg-white px-5 py-4 shadow-lf-md">
              <CountUp value="14+" className="text-[32px] font-bold text-ocean-600" />
              <span className="text-xs leading-snug text-ink-600">
                years helping
                <br />
                Sri Lankans travel
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Our approach */}
      <section className="bg-sand-50 py-16 lg:py-24">
        <Container className="flex flex-col gap-10 lg:gap-14">
          <div data-reveal className="grid grid-cols-1 items-end gap-4 lg:grid-cols-2 lg:gap-16">
            <SectionHeading eyebrow="Our approach" title="Travel, The Way It Should Be" />
            <p className="text-base leading-relaxed text-ink-600">
              Five things guide every trip we plan, whether it&apos;s a weekend in Malé or a three-week tour of Europe.
            </p>
          </div>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-12 xl:grid-cols-[1fr_420px] xl:gap-[70px]">
            <div data-reveal className="order-2 lg:order-1">
              <ApproachList items={approach} />
            </div>
            <div
              data-reveal="150"
              className="relative order-1 aspect-[16/10] overflow-hidden rounded-2xl lg:sticky lg:top-[170px] lg:order-2 lg:aspect-[3/4]"
            >
              <Image src="/images/about/approach.jpg" alt="A traveller hiking through a green mountain valley" fill sizes="(min-width: 1280px) 420px, (min-width: 1024px) 340px, 100vw" className="object-cover" />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3.5 text-[13px] text-ink-900 backdrop-blur-sm">
                <span className="flex size-9 flex-none items-center justify-center rounded-full bg-sun-400 text-navy-900">
                  <Icon name="check" size={18} />
                </span>
                Every itinerary is reviewed by a second consultant before it reaches you.
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Why we do it */}
      <section className="relative overflow-hidden bg-navy-900">
        <Image src="/images/hero/hill-country-rail.jpg" alt="" fill sizes="100vw" className="animate-zoom object-cover [animation-direction:alternate] [animation-iteration-count:infinite]" />
        <div className={`absolute inset-0 ${gradient}`} />
        <Container data-reveal className="relative flex min-h-[460px] flex-col justify-center gap-5 py-16 text-white">
          <Eyebrow onDark>Why we do it</Eyebrow>
          <h2 className="max-w-[720px] text-[32px] leading-[1.15] font-bold tracking-[-0.01em] sm:text-[48px]">
            Because Every Journey Means Something
          </h2>
          <p className="max-w-[520px] text-base leading-relaxed text-white/85">
            A ticket is never just a ticket. Behind every booking is a reason to go and someone waiting at the other end.
            That&apos;s why we take the details personally.
          </p>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container className="flex flex-col gap-6">
          <div data-reveal className="flex items-end justify-between gap-4">
            <h3 className="text-xl font-bold sm:text-2xl">The journeys we&apos;ve helped with this year</h3>
            <span className="hidden text-[13px] text-ink-400 sm:block lg:hidden">Swipe to see more →</span>
          </div>
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0">
            {journeysThisYear.map((j, i) => (
              <li
                key={j.place}
                data-reveal={(i % 5) * 90}
                className="group relative h-[300px] w-[220px] flex-none snap-start overflow-hidden rounded-xl bg-navy-900 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lf-md lg:w-auto"
              >
                <Image
                  src={j.image}
                  alt=""
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,37,69,0)_45%,rgba(11,37,69,.88)_100%)]" />
                <span className="absolute inset-x-4 bottom-4 flex flex-col text-white">
                  <span className="text-base font-semibold">{j.place}</span>
                  <span className="text-xs text-white/75">{j.caption}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6. Under one roof */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
        {/* Faint orbit rings behind the content */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-[1100px] -translate-1/2 animate-spin-slow rounded-full border border-dashed border-white/10"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-[760px] -translate-1/2 animate-spin-slow rounded-full border border-dashed border-white/[0.07] [animation-direction:reverse]"
        />
        <Container className="relative flex flex-col gap-14">
          <div data-reveal className="mx-auto flex max-w-[680px] flex-col items-center gap-4 text-center">
            <Eyebrow onDark>What we bring together</Eyebrow>
            <h2 className="text-[32px] leading-[1.12] font-bold tracking-[-0.01em] text-balance sm:text-[44px] lg:text-[48px]">
              Everything You Need, Under One Roof
            </h2>
            <p className="text-[15px] leading-relaxed text-white/75 sm:text-base">
              Each part of your trip is handled by a specialist, and all of it is coordinated by one team that knows your
              plans.
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_380px_1fr] lg:gap-0">
            <ul className="order-2 flex flex-col gap-5 lg:order-1">
              {underOneRoof.slice(0, 3).map((s, i) => (
                <RoofItem key={s.title} {...s} side="left" delay={i * 110} />
              ))}
            </ul>
            <div data-reveal className="relative order-1 mx-auto flex size-[290px] items-center justify-center rounded-full bg-white/[0.04] lg:order-2">
              <span aria-hidden="true" className="absolute inset-5 animate-ping rounded-full border border-white/20 [animation-duration:3s]" />
              <div className="relative flex size-[250px] animate-float flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 bg-[radial-gradient(circle_at_50%_35%,var(--color-ocean-500),var(--color-ocean-600)_55%,var(--color-navy-900)_120%)] text-center shadow-[0_24px_60px_rgba(0,0,0,.35)]">
                <Image
                  src="/images/logo.png"
                  alt="Let's Fly.lk"
                  width={76}
                  height={76}
                  className="mb-2 size-[76px] rounded-full"
                />
                <span className="text-lg leading-tight font-bold">
                  One team.
                  <br />
                  One plan.
                </span>
                <span className="text-xs text-white/75">Your journey</span>
              </div>
            </div>
            <ul className="order-3 flex flex-col gap-5">
              {underOneRoof.slice(3).map((s, i) => (
                <RoofItem key={s.title} {...s} side="right" delay={i * 110} />
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 7. Commitment */}
      <section className="py-16 lg:py-24">
        <Container className="flex flex-col gap-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div data-reveal className="flex flex-col gap-4">
              <Eyebrow>Our commitment</Eyebrow>
              <h2 className="text-[32px] leading-[1.15] font-bold tracking-[-0.01em] sm:text-[42px]">
                Your Journey.
                <br />
                <span className="text-ocean-600">Our Responsibility.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-ink-600">
                When you trust us with your travel, we take that seriously. These are the promises we hold ourselves to.
              </p>
            </div>
            <ol className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {commitments.map((c, i) => (
                <li key={c.title} data-reveal={(i % 2) * 110} className="group flex gap-4">
                  <span className="flex size-9 flex-none items-center justify-center rounded-full bg-sand-100 text-sm font-bold text-ocean-600 transition-[background-color,color,scale] duration-300 group-hover:scale-110 group-hover:bg-ocean-600 group-hover:text-white">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] font-semibold transition-colors group-hover:text-ocean-600">{c.title}</span>
                    <span className="text-[13px] leading-relaxed text-ink-600">{c.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <dl data-reveal className="grid grid-cols-2 overflow-hidden rounded-xl border border-sand-300 lg:grid-cols-4">
            {aboutStats.map((s, i) => (
              <div
                key={s.label}
                className={`group flex flex-col items-center gap-1 p-6 text-center transition-colors duration-300 hover:bg-sand-50 ${i % 2 ? "border-l border-sand-300" : ""} ${
                  i > 1 ? "border-t border-sand-300 lg:border-t-0" : ""
                } ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dt className="order-2 text-[13px] text-ink-600">{s.label}</dt>
                <dd className="text-[34px] font-bold text-ocean-600 transition-transform duration-300 group-hover:-translate-y-0.5">
                  {/^[\d,]+\+?$/.test(s.value) ? <CountUp value={s.value} /> : s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 8. Team */}
      <section className="bg-sand-50 py-16 lg:py-24">
        <Container className="flex flex-col gap-10">
          <div data-reveal className="mx-auto flex max-w-[620px] flex-col items-center gap-3 text-center">
            <SectionHeading eyebrow="The people behind your trip" title="Meet Our Team" centered />
            <p className="text-[15px] leading-relaxed text-ink-600">
              Behind every journey is a team that cares about getting the details right.
            </p>
          </div>
          <div data-reveal="120">
            <TeamSection team={team} />
          </div>
        </Container>
      </section>

      {/* 9. Closing CTA */}
      <section className="relative overflow-hidden bg-sun-400 py-20 lg:py-24">
        <span aria-hidden="true" className="absolute -top-[200px] -left-[160px] size-[640px] rounded-full border-[60px] border-navy-900/5" />
        <span aria-hidden="true" className="absolute -right-[120px] -bottom-[240px] size-[480px] rounded-full border-[50px] border-navy-900/5" />
        <Container data-reveal className="relative flex flex-col items-center gap-6 text-center text-navy-900">
          <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">Your story, next</span>
          <h2 className="max-w-[780px] text-[34px] leading-[1.1] font-bold tracking-[-0.01em] sm:text-[52px]">
            Ready to Plan Your Next Journey?
          </h2>
          <p className="max-w-[520px] text-base leading-relaxed">
            Tell us where you&apos;re dreaming of going. We&apos;ll handle the planning and send you a quote
            within the day.
          </p>
          <div aria-hidden="true" className="flex w-full max-w-[520px] items-center gap-3 font-mono text-sm font-semibold">
            <span>CMB</span>
            <span className="h-px flex-1 border-t-2 border-dashed border-navy-900/40" />
            <Icon name="flight" size={22} className="animate-glide rotate-90" />
            <span className="h-px flex-1 border-t-2 border-dashed border-navy-900/40" />
            <span>ANYWHERE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3.5">
            <ButtonLink href="/contact" variant="navy" size="xl" icon="arrow_forward">
              Plan My Trip
            </ButtonLink>
            <ButtonLink
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlineNavy"
              size="xl"
              leadingIcon="chat"
            >
              WhatsApp Us
            </ButtonLink>
          </div>
        </Container>
      </section>

      <RevealOnScroll />
    </>
  );
}

function RoofItem({
  icon,
  title,
  text,
  side,
  delay,
}: {
  icon: string;
  title: string;
  text: string;
  side: "left" | "right";
  delay: number;
}) {
  return (
    <li
      data-reveal={delay}
      className="group relative flex gap-4 rounded-xl border border-white/15 bg-white/[0.04] p-5 transition-[background-color,border-color,translate] duration-300 hover:-translate-y-1 hover:border-sun-400/60 hover:bg-white/[0.08] sm:p-6"
    >
      {/* Dashed connector to the centre circle (desktop only) */}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 hidden w-[60px] border-t border-dashed border-white/30 lg:block ${
          side === "left" ? "-right-[60px]" : "-left-[60px]"
        }`}
      />
      <span className="flex size-12 flex-none items-center justify-center rounded-tile bg-sun-400 text-navy-900 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
        <Icon name={icon} size={24} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[17px] font-semibold">{title}</span>
        <span className="text-[13.5px] leading-relaxed text-white/70">{text}</span>
      </span>
    </li>
  );
}
