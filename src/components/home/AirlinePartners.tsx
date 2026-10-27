import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { airlines } from "@/data/home";

// Logo files are squares with white margins, so each tile crops to the middle band.
export function LogoTile({ name, logo, copy = false }: { name: string; logo: string; copy?: boolean }) {
  return (
    <div
      title={name}
      className="flex h-[84px] w-[160px] flex-none items-center justify-center overflow-hidden rounded-xl border border-sand-300 bg-white"
    >
      <Image src={logo} alt={copy ? "" : name} width={124} height={124} className="size-[124px] max-w-none flex-none object-contain" />
    </div>
  );
}

export function AirlinePartners() {
  // The track holds the list twice so the -50% marquee loop is seamless.
  const track = [...airlines, ...airlines];
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
        <div className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-5">
            {track.map((a, i) => (
              <LogoTile key={i} {...a} copy={i >= airlines.length} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
