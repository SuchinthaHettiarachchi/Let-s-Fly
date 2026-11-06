import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

/**
 * Plain document layout for policy pages (terms, privacy, GDPR): breadcrumb, a centred title,
 * then readable body copy in a narrow column. No hero image, on purpose.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="pt-8 pb-20 lg:pb-24">
      <Container>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
        <div className="mx-auto max-w-[860px]">
          <header className="mt-10 mb-10 flex flex-col items-center gap-4 border-b border-sand-300 pb-10 text-center lg:mt-14">
            <h1 className="animate-rise">{title}</h1>
            {intro && (
              <div className="max-w-[64ch] animate-rise text-lead text-ink-600 [animation-delay:120ms]">{intro}</div>
            )}
          </header>
          <div className="flex flex-col gap-10">{children}</div>
        </div>
      </Container>
    </article>
  );
}

/** A numbered or titled block of the document. */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h3">{title}</h2>
      {children}
    </section>
  );
}

export function LegalSubhead({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-2 font-sans text-h5 text-ink-900">{children}</h3>;
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="max-w-[72ch] text-body text-ink-600">{children}</p>;
}

export function LegalList({ items, ordered = false }: { items: React.ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`flex max-w-[72ch] flex-col gap-3 pl-6 text-body text-ink-600 marker:text-ocean-600 ${
        ordered ? "list-decimal marker:font-semibold" : "list-disc"
      }`}
    >
      {items.map((item, i) => (
        <li key={i} className="pl-1.5">
          {item}
        </li>
      ))}
    </Tag>
  );
}
