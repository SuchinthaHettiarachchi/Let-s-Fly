import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/contact/ContactForm";
import type { serviceOptions } from "@/components/forms/styles";
import { contact } from "@/data/site";

type MessageSectionProps = {
  /** Pre-filled for each page so the team knows where the message came from. */
  subject: string;
  service: (typeof serviceOptions)[number];
  title?: string;
  text?: string;
  id?: string;
  className?: string;
};

const reach = [
  { icon: "call", label: "Call us", value: contact.phone, href: contact.phoneHref },
  { icon: "mail", label: "Email us", value: contact.email, href: `mailto:${contact.email}` },
  { icon: "schedule", label: "Office hours", value: contact.hours },
];

/** "Send a message / How can we help?" block: short intro and contact details beside the message form. */
export function MessageSection({
  subject,
  service,
  title = "How can we help?",
  text = "Send us your questions or plans and our team will get back to you, usually within two working hours.",
  id = "send-message",
  className = "bg-sand-50",
}: MessageSectionProps) {
  return (
    <section id={id} className={`scroll-mt-[110px] py-16 lg:scroll-mt-[156px] lg:py-20 ${className}`}>
      <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div data-reveal className="flex flex-col gap-4 lg:sticky lg:top-[170px]">
          <Eyebrow>Send a message</Eyebrow>
          <h2>{title}</h2>
          <p className="text-lead text-ink-600">{text}</p>
          <ul className="mt-2 flex flex-col gap-3">
            {reach.map((r) => {
              const body = (
                <>
                  <span className="flex size-11 flex-none items-center justify-center rounded-full bg-ocean-600 text-white">
                    <Icon name={r.icon} size={20} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-caption font-normal text-ink-400">{r.label}</span>
                    <span className="text-h5 text-ink-900 group-hover:text-ocean-600">{r.value}</span>
                  </span>
                </>
              );
              return (
                <li key={r.label}>
                  {r.href ? (
                    <a href={r.href} className="group flex items-center gap-3.5">
                      {body}
                    </a>
                  ) : (
                    <span className="flex items-center gap-3.5">{body}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div data-reveal="150" className="rounded-2xl border border-sand-300 bg-white p-6 shadow-lf-md sm:p-8">
          <ContactForm subject={subject} service={service} />
        </div>
      </Container>
    </section>
  );
}
