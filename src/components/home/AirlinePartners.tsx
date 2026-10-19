import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

// Placeholder tiles until the real airline logos are supplied.
const airlines = Array.from({ length: 7 }, (_, i) => `Airline ${i + 1}`);

function LogoTile({ name }: { name: string }) {
  return (
    <div
      title={name}
      className="flex h-[76px] w-[150px] flex-none items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-sand-400 bg-white font-mono text-[10.5px] font-semibold tracking-[0.08em] text-ink-400"
    >
      <Icon name="flight" size={20} />
      AIRLINE LOGO
    </div>
  );
}

export function AirlinePartners() {
  // The track holds the list twice so the -50% marquee loop is seamless.
  const track = [...airlines, ...airlines];
  return (
    <section className="border-y border-sand-300 bg-sand-50 py-16">
      <Container className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <Eyebrow>Airline partners</Eyebrow>
          <h2 className="text-2xl font-bold sm:text-[28px]">Flying you with the world&apos;s best airlines</h2>
        </div>
        <Link href="/contact" className="flex items-center gap-1.5 text-[15px] font-semibold">
          Partner with us
          <Icon name="arrow_forward" />
        </Link>
      </Container>
      <Container>
        <div className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
            {track.map((name, i) => (
              <LogoTile key={i} name={name} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
