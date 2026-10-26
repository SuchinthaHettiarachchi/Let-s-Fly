import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { contact } from "@/data/site";

type CtaBandProps = {
  title?: string;
  text?: string;
  /** Background of the strip behind the band; match the section above it. "clear" lets a page background show through. */
  tone?: "white" | "sand" | "clear";
};

const toneClass = { white: "bg-white", sand: "bg-sand-50", clear: "" };

/** The yellow "Ready to plan your next trip?" band that sits above the footer. */
export function CtaBand({
  title = "Ready to plan your next trip?",
  text = "Tell us where you want to go and we'll send you a quote within the day.",
  tone = "white",
}: CtaBandProps) {
  return (
    <section className={`pb-16 lg:pb-[100px] ${toneClass[tone]}`}>
      <Container>
        <div data-reveal className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl bg-sun-400 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-16 lg:py-14">
          <div
            aria-hidden="true"
            className="absolute -top-[90px] -right-[60px] size-[300px] rounded-full border-[40px] border-navy-900/6"
          />
          <div className="relative flex flex-col gap-2.5">
            <h2 className="text-[28px] font-bold tracking-[-0.01em] text-navy-900 sm:text-[34px] lg:text-[40px]">
              {title}
            </h2>
            <p className="text-base text-navy-900">{text}</p>
          </div>
          <div className="relative flex flex-none flex-wrap gap-3.5">
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
        </div>
      </Container>
    </section>
  );
}
