import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { howItWorks } from "@/data/home";

export function HowItWorks() {
  return (
    <section className="pb-20 lg:pb-[110px]">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
        <div data-reveal className="flex flex-col gap-4">
          <Eyebrow>How it works</Eyebrow>
          <h2>
            We make travel <em className="text-ocean-600">simple for you</em>
          </h2>
          <p className="text-lead text-ink-600">From the first call to the flight home, we handle the bookings.</p>
          <Link href="/about" className="flex items-center gap-1.5 self-start text-body font-semibold">
            Learn more about us
            <Icon name="arrow_forward" />
          </Link>
        </div>

        <ol data-reveal="150" className="grid grid-cols-1 divide-y divide-sand-300 overflow-hidden rounded-2xl border border-sand-300 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {howItWorks.map((step, i) => (
            <li
              key={step.title}
              className="group relative flex flex-col gap-3 p-6 transition-colors duration-300 hover:bg-sand-50 lg:p-7"
            >
              {/* Accent bar that grows along the top edge on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-ocean-600 transition-transform duration-300 group-hover:scale-x-100"
              />
              <span
                className={`flex size-9 items-center justify-center rounded-full text-small font-semibold transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 ${
                  i === 1 ? "bg-sun-400 text-navy-900" : "bg-navy-900 text-white"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon
                name={step.icon}
                size={30}
                className="self-start text-ocean-600 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
              />
              <span className="text-h4 transition-colors duration-300 group-hover:text-ocean-600">{step.title}</span>
              <span className="text-small text-ink-600">{step.text}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
