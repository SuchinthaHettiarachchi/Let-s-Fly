import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { AirlineLogos } from "@/components/flights/AirlineLogos";

export function AirlinePartners() {
  return (
    <section className="border-y border-sand-300 bg-sand-50 py-16">
      <Container data-reveal className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <Eyebrow>Airline partners</Eyebrow>
          <h2 className="text-h3">Flying you with the world&apos;s best airlines</h2>
        </div>
        <Link href="/contact" className="flex items-center gap-1.5 text-body font-semibold">
          Partner with us
          <Icon name="arrow_forward" />
        </Link>
      </Container>
      <Container data-reveal="120">
        <AirlineLogos />
      </Container>
    </section>
  );
}
