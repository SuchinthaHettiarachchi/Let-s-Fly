import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/contact/ContactForm";
import { contact } from "@/data/site";
import { jobs, officeHours, type Job } from "@/data/careers";

export const metadata: Metadata = {
  title: { absolute: "Contact Let's Fly | Travel Agency in Colombo, Sri Lanka" },
  description:
    "Call, email or visit our team for air tickets, visas and inbound or outbound tours. Each service has its own dedicated specialist, ready to help.",
};

const contactCards = [
  { icon: "call", label: "Call us", value: contact.phone, href: contact.phoneHref },
  { icon: "mail", label: "Email us", value: contact.email, href: `mailto:${contact.email}` },
  { icon: "location_on", label: "Visit us", value: contact.address, href: contact.mapHref },
];

const statusStyle: Record<Job["status"], string> = {
  Hiring: "bg-sand-50 text-ocean-600",
  Soon: "bg-sun-400/25 text-navy-900",
  Open: "bg-ocean-600/10 text-ocean-600",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact us"
        title="Let's plan your next trip together today"
        sub="Call, message or visit our office for flights, visas and tours. We usually reply within two working hours."
        overlap="md"
      />

      <Container className="relative -mt-16">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {contactCards.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.icon === "location_on" ? "_blank" : undefined}
                rel={c.icon === "location_on" ? "noopener noreferrer" : undefined}
                className="group flex h-full items-center gap-4 overflow-hidden rounded-xl border border-sand-300 border-b-[5px] border-b-sun-400 bg-white p-5 text-ink-900 shadow-lf-md transition-transform hover:-translate-y-1 hover:text-ink-900"
              >
                <span className="flex size-12 flex-none items-center justify-center rounded-full bg-ocean-600 text-white">
                  <Icon name={c.icon} size={22} />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-ink-400">{c.label}</span>
                  <span className="text-[15px] font-semibold group-hover:text-ocean-600">{c.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>

      <section id="careers" className="scroll-mt-[110px] lg:scroll-mt-[156px] py-16 lg:py-24">
        <Container className="flex flex-col gap-10">
          <div className="mx-auto flex max-w-[620px] flex-col items-center gap-3 text-center">
            <SectionHeading eyebrow="Join our team" title="Build your career with us" centered />
            <p className="text-[15px] leading-relaxed text-ink-600">
              We&apos;re always looking for passionate, talented people to join the Let&apos;s Fly.lk family. Find a role
              below and send us your application.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white transition-[border-color,box-shadow] hover:border-ocean-600 hover:shadow-lf-card-hover"
              >
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-tile bg-sand-200 text-ocean-600">
                      <Icon name={job.icon} size={22} />
                    </span>
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${statusStyle[job.status]}`}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {job.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
                    {job.meta.map((m) => (
                      <li key={m.label} className="flex items-center gap-1">
                        <Icon name={m.icon} size={15} className="text-ocean-600" />
                        {m.label}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[13.5px] leading-relaxed text-ink-600">{job.text}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-sand-300 pt-4">
                    <span className="text-xs text-ink-400">{job.posted}</span>
                    <ButtonLink
                      href={`mailto:${contact.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      variant="primary"
                      size="md"
                      icon="arrow_forward"
                      className="h-10 px-4 text-[13.5px]"
                    >
                      Apply Now
                    </ButtonLink>
                  </div>
                </div>
                <div className="h-1.5 bg-sun-400" />
              </li>
            ))}
          </ul>
          <p className="flex items-center justify-center gap-2 text-sm text-ink-600">
            <Icon name="mail" size={18} className="text-ocean-600" />
            Don&apos;t see your role? Send your CV to{" "}
            <a href={`mailto:${contact.email}?subject=CV`} className="font-semibold">
              {contact.email}
            </a>
          </p>
        </Container>
      </section>

      <section className="bg-sand-50 py-16 lg:py-24">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-sand-300 bg-white p-6 sm:p-8">
            <Eyebrow>Send a message</Eyebrow>
            <h2 className="mt-2 mb-6 text-[26px] font-bold tracking-[-0.01em]">How can we help?</h2>
            <ContactForm />
          </div>
          <div className="flex flex-col gap-5">
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-sand-300 bg-white">
              <iframe
                src={contact.mapEmbedHref}
                title="Let's Fly.lk office on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-full min-h-[300px] w-full border-0"
              />
              <a
                href={contact.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold shadow-lf-md"
              >
                Open in Google Maps
                <Icon name="north_east" size={16} />
              </a>
            </div>
            <div className="rounded-2xl border border-sand-300 bg-white p-6">
              <h3 className="mb-3 text-base font-semibold">Office hours</h3>
              <dl className="flex flex-col">
                {officeHours.map((o) => (
                  <div key={o.days} className="flex justify-between border-b border-sand-300 py-3 text-sm last:border-0">
                    <dt className="text-ink-600">{o.days}</dt>
                    <dd className="font-semibold">{o.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
