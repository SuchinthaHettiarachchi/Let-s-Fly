import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { InquiryCard } from "@/components/inquiry/InquiryCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { contact } from "@/data/site";
import { getVisaBySlug } from "@/lib/visa-api";

export async function generateMetadata({ params }: PageProps<"/visa/[slug]">): Promise<Metadata> {
  const visa = await getVisaBySlug((await params).slug);
  if (!visa) return {};
  return { title: `${visa.city} Visa`, description: visa.summary || undefined };
}

export default async function VisaDetailPage({ params }: PageProps<"/visa/[slug]">) {
  const visa = await getVisaBySlug((await params).slug);
  if (!visa) notFound();

  const docGroups = (visa.documentGroups || []).filter((g) => g.title || g.items?.length);
  const feeGroups = (visa.feeGroups || []).filter((g) => g.title || g.items?.length);
  const extraSections = (visa.extraSections || []).filter((s) => s.title || s.body || s.items?.length);
  const hasDetail = docGroups.length || feeGroups.length || extraSections.length || visa.summary || visa.facts?.length || visa.warning;
  if (!hasDetail) notFound();

  const total = docGroups.reduce((n, g) => n + (g.items?.length || 0), 0);
  const facts = (visa.facts || []).filter((f) => f.label || f.icon);

  return (
    <>
      <PageHero
        image={visa.image || undefined}
        crumbs={[{ label: "Home", href: "/" }, { label: "Visa Services", href: "/visa" }, { label: `${visa.city} Visa` }]}
        eyebrow="Visa services"
        title={`${visa.city} Visa`}
        sub={visa.summary || undefined}
        titleIcon={
          visa.flag ? (
            <Image
              src={visa.flag}
              alt={`${visa.country || visa.city} flag`}
              width={56}
              height={28}
              className="h-7 w-14 rounded-sm shadow-lf-sm sm:h-8 sm:w-16"
            />
          ) : undefined
        }
      >
        {facts.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2.5">
            {facts.map((f, i) => (
              <li
                key={`${f.label}-${i}`}
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3.5 py-1.5 text-small text-white"
              >
                {f.icon ? <Icon name={f.icon} size={16} className="text-sun-400" /> : null}
                {f.label}
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <Container className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 lg:py-20">
        <div className="flex flex-col gap-6">
          {docGroups.length > 0 && (
            <>
              <div data-reveal className="flex flex-col gap-2.5">
                <Eyebrow>Documents checklist</Eyebrow>
                <h2>What you&apos;ll need</h2>
                <p className="text-lead text-ink-600">
                  Send us clear scans or photos of the documents below. We&apos;ll check everything and flag any gaps before we
                  submit. <span className="text-ink-400">({total} documents in total)</span>
                </p>
              </div>

              {docGroups.map((group, gi) => (
                <section key={group.title || gi} data-reveal className="rounded-xl border border-sand-300 bg-white p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3 border-b border-sand-300 pb-4">
                    <h3 className="flex items-center gap-3 font-sans text-h4">
                      <span className="flex size-8 flex-none items-center justify-center rounded-full bg-sun-400 text-small font-bold text-navy-900">
                        {gi + 1}
                      </span>
                      {group.title}
                    </h3>
                    <span className="flex-none rounded-full bg-sand-50 px-2.5 py-1 text-caption text-ocean-600">
                      {group.items.length} documents
                    </span>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {group.items.map((item, ii) => (
                      <li key={item.title || ii} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[7px] size-2 flex-none rounded-full bg-ocean-600" />
                        <span className="flex flex-col gap-0.5">
                          <span className="text-body">{item.title}</span>
                          {item.note && <span className="text-caption font-normal text-ink-400">{item.note}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </>
          )}

          {feeGroups.length > 0 && (
            <section data-reveal className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <Eyebrow>Fees & processing</Eyebrow>
                <h2>Charges and timelines</h2>
              </div>
              {feeGroups.map((group, gi) => (
                <div key={group.title || gi} className="rounded-xl border border-sand-300 bg-white p-5 sm:p-6">
                  {group.title ? <h3 className="mb-4 font-sans text-h4">{group.title}</h3> : null}
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {group.items.map((item, ii) => (
                      <div key={item.label || ii} className="rounded-lg bg-sand-50 px-4 py-3">
                        <dt className="text-caption font-normal text-ink-400">{item.label}</dt>
                        <dd className="text-h5 font-bold text-ocean-600">{item.value}</dd>
                        {item.note ? <p className="mt-1 text-caption font-normal text-ink-400">{item.note}</p> : null}
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </section>
          )}

          {extraSections.map((section, si) => (
            <section key={section.title || si} data-reveal className="rounded-xl border border-sand-300 bg-white p-5 sm:p-6">
              {section.title ? <h3 className="mb-3 font-sans text-h4">{section.title}</h3> : null}
              {section.body ? <p className="text-body text-ink-600 whitespace-pre-line">{section.body}</p> : null}
              {section.items?.length ? (
                <ul className="mt-4 flex flex-col gap-3">
                  {section.items.map((item, ii) => (
                    <li key={item.title || ii} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[7px] size-2 flex-none rounded-full bg-ocean-600" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-body">{item.title}</span>
                        {item.note && <span className="text-caption font-normal text-ink-400">{item.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {visa.warning && (
            <p data-reveal className="flex gap-2.5 rounded-lg border-l-4 border-sun-400 bg-sun-400/12 px-4 py-3.5 text-small text-ink-900">
              <Icon name="info" size={18} className="mt-px text-navy-900" />
              {visa.warning}
            </p>
          )}
        </div>

        <aside data-reveal="150" className="flex flex-col gap-3 lg:sticky lg:top-[160px] lg:self-start">
          <InquiryCard prefill={{ subject: `${visa.city} visa`, service: "Visa services", destination: visa.city }} />
          <ButtonLink
            href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, I need help with a ${visa.city} visa.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
            leadingIcon="chat"
            className="w-full"
          >
            WhatsApp Us
          </ButtonLink>
        </aside>
      </Container>

      <CtaBand />
      <MobileActionBar
        value={`${visa.city} visa`}
        prefill={{ subject: `${visa.city} visa`, service: "Visa services", destination: visa.city }}
        cta="Ask about this visa"
      />
      <RevealOnScroll />
    </>
  );
}
