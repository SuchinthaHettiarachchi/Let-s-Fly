import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { TeamSection } from "@/components/about/TeamSection";
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
  visionPoints,
} from "@/data/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "A Sri Lankan travel team that handles the tickets, the visas and the hundred small details, so you can focus on the trip itself.",
};

const gradient =
  "bg-[linear-gradient(90deg,rgba(11,37,69,.94)_0%,rgba(11,37,69,.78)_35%,rgba(19,87,155,.35)_70%,rgba(19,87,155,.1)_100%)]";

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <Image src="/images/hero/dubai.jpg" alt="" fill preload sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 ${gradient}`} />
        <Container className="relative flex min-h-[520px] flex-col justify-center gap-5 py-16 text-white lg:min-h-[600px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} onDark />
          <Eyebrow onDark rule>
            About Us
          </Eyebrow>
          <h1 className="max-w-[860px] text-[34px] leading-[1.1] font-bold tracking-[-0.02em] text-pretty sm:text-[48px] lg:text-[60px]">
            We don&apos;t just plan journeys. We help people experience the world with confidence.
          </h1>
          <p className="max-w-[560px] text-base leading-relaxed text-white/85 sm:text-lg">
            A Sri Lankan travel team that handles the tickets, the visas and the hundred small details, so you can focus on
            the trip itself.
          </p>
          <span className="flex items-center gap-2 self-start rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm">
            <Icon name="groups" size={18} className="text-sun-400" />
            15,000+ travellers since 2016
          </span>
        </Container>
      </section>

      {/* 2. Who we are */}
      <section className="py-16 lg:py-24">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-5">
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
          <div className="relative mx-auto w-full max-w-[500px] pb-16 sm:pb-20">
            <Placeholder label="TEAM PHOTO" icon="groups" className="aspect-[4/5] w-[92%] rounded-2xl" />
            <div className="absolute bottom-0 left-0 size-[46%] overflow-hidden rounded-2xl border-[6px] border-white shadow-lf-md">
              <Image src="/images/packages/kandy-ella-rail.jpg" alt="" fill sizes="230px" className="object-cover" />
            </div>
            <div className="absolute top-8 right-0 flex flex-col rounded-xl bg-white px-5 py-4 shadow-lf-md">
              <span className="text-[32px] font-bold text-ocean-600">14+</span>
              <span className="text-xs leading-snug text-ink-600">
                years helping
                <br />
                Sri Lankans travel
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Our approach */}
      <section className="bg-sand-50 py-16 lg:py-24">
        <Container className="flex flex-col gap-12">
          <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3 text-center">
            <SectionHeading eyebrow="Our approach" title="Travel, The Way It Should Be" centered />
            <p className="text-[15px] leading-relaxed text-ink-600">
              Five things guide every trip we plan, whether it&apos;s a weekend in Malé or a three-week tour of Europe.
            </p>
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {approach.map((a, i) => (
              <li key={a.title} className="flex flex-col gap-3 rounded-xl border border-sand-300 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-tile bg-sand-200 text-ocean-600">
                    <Icon name={a.icon} size={22} />
                  </span>
                  <span className="text-2xl font-bold text-sand-300">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="text-base font-semibold">{a.title}</span>
                <span className="text-[13px] leading-relaxed text-ink-600">{a.text}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 4. Why we do it */}
      <section className="relative overflow-hidden bg-navy-900">
        <Image src="/images/hero/hill-country-rail.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 ${gradient}`} />
        <Container className="relative flex min-h-[460px] flex-col justify-center gap-5 py-16 text-white">
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
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-xl font-bold sm:text-2xl">The journeys we&apos;ve helped with this year</h3>
            <span className="hidden text-[13px] text-ink-400 sm:block lg:hidden">Swipe to see more →</span>
          </div>
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0">
            {journeysThisYear.map((j) => (
              <li key={j.place} className="relative h-[300px] w-[220px] flex-none snap-start overflow-hidden rounded-xl bg-navy-900 lg:w-auto">
                <Image src={j.image} alt="" fill sizes="240px" className="object-cover" />
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

      {/* 5. Under one roof */}
      <section className="bg-sand-50 py-16 lg:py-24">
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-[620px] flex-col gap-3">
            <SectionHeading eyebrow="What we bring together" title="Everything You Need, Under One Roof" />
            <p className="text-[15px] leading-relaxed text-ink-600">
              Each part of your trip is handled by a specialist, and all of it is coordinated by one team that knows your
              plans.
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[1fr_300px_1fr]">
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {underOneRoof.slice(0, 3).map((s) => (
                <RoofItem key={s.title} {...s} />
              ))}
            </ul>
            <div className="mx-auto flex size-[260px] flex-col items-center justify-center gap-2 rounded-full border-[10px] border-white bg-navy-900 text-center text-white shadow-lf-lg">
              <span className="text-2xl font-bold">
                Let&apos;s<span className="text-sun-400">Fly</span>
              </span>
              <span className="text-sm text-white/80">One team. One plan.</span>
              <span className="mt-2 rounded-full bg-sun-400 px-3 py-1 text-xs font-semibold text-navy-900">Your journey</span>
            </div>
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {underOneRoof.slice(3).map((s) => (
                <RoofItem key={s.title} {...s} />
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 6. Commitment */}
      <section className="py-16 lg:py-24">
        <Container className="flex flex-col gap-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col gap-4">
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
                <li key={c.title} className="flex gap-4">
                  <span className="text-sm font-bold text-ocean-600">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] font-semibold">{c.title}</span>
                    <span className="text-[13px] leading-relaxed text-ink-600">{c.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-sand-300 lg:grid-cols-4">
            {aboutStats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center gap-1 p-6 text-center ${i % 2 ? "border-l border-sand-300" : ""} ${
                  i > 1 ? "border-t border-sand-300 lg:border-t-0" : ""
                } ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dt className="order-2 text-[13px] text-ink-600">{s.label}</dt>
                <dd className="text-[34px] font-bold text-ocean-600">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 7. Team */}
      <section className="bg-sand-50 py-16 lg:py-24">
        <Container className="flex flex-col gap-10">
          <div className="mx-auto flex max-w-[620px] flex-col items-center gap-3 text-center">
            <SectionHeading eyebrow="The people behind your trip" title="Meet Our Team" centered />
            <p className="text-[15px] leading-relaxed text-ink-600">
              Behind every journey is a team that cares about getting the details right.
            </p>
          </div>
          <TeamSection team={team} />
        </Container>
      </section>

      {/* 8. Vision */}
      <section className="relative overflow-hidden bg-navy-900">
        <Image src="/images/hero/maldives-beach.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 ${gradient}`} />
        <Container className="relative py-20 text-white lg:py-28">
          <div className="flex max-w-[560px] flex-col gap-5">
            <Eyebrow onDark>Our vision</Eyebrow>
            <h2 className="text-[32px] leading-[1.15] font-bold tracking-[-0.01em] sm:text-[44px]">Where We&apos;re Going</h2>
            <p className="text-base leading-relaxed text-white/85">
              We want to be the travel partner Sri Lankans recommend first, the team people call whenever they think about
              going somewhere. That means going further while keeping the personal service we started with.
            </p>
            <ul className="flex flex-col gap-3">
              {visionPoints.map((v) => (
                <li key={v} className="flex items-center gap-3 text-[15px]">
                  <Icon name="check_circle" size={22} fill className="text-sun-400" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 9. Closing CTA */}
      <section className="relative overflow-hidden bg-sun-400 py-20 lg:py-24">
        <span aria-hidden="true" className="absolute -top-[200px] -left-[160px] size-[640px] rounded-full border-[60px] border-navy-900/5" />
        <span aria-hidden="true" className="absolute -right-[120px] -bottom-[240px] size-[480px] rounded-full border-[50px] border-navy-900/5" />
        <Container className="relative flex flex-col items-center gap-6 text-center text-navy-900">
          <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">Your story, next</span>
          <h2 className="max-w-[780px] text-[34px] leading-[1.1] font-bold tracking-[-0.01em] sm:text-[52px]">
            Ready to Plan Your Next Journey?
          </h2>
          <p className="max-w-[520px] text-base leading-relaxed">
            Tell us where you&apos;re dreaming of going. We&apos;ll handle the planning and send you a tailored quote
            within the day.
          </p>
          <div aria-hidden="true" className="flex w-full max-w-[520px] items-center gap-3 font-mono text-sm font-semibold">
            <span>CMB</span>
            <span className="h-px flex-1 border-t-2 border-dashed border-navy-900/40" />
            <Icon name="flight" size={22} className="rotate-90" />
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
    </>
  );
}

function RoofItem({ icon, title }: { icon: string; title: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-sand-300 bg-white p-4">
      <span className="flex size-10 flex-none items-center justify-center rounded-tile bg-sand-200 text-ocean-600">
        <Icon name={icon} size={20} />
      </span>
      <span className="text-sm font-semibold">{title}</span>
    </li>
  );
}
