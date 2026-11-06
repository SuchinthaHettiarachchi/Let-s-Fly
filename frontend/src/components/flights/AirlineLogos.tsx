import Image from "next/image";
import { airlines } from "@/data/home";

// Logo files are squares with white margins, so each tile crops to the middle band.
function LogoTile({ name, logo, copy = false }: { name: string; logo: string; copy?: boolean }) {
  return (
    <div
      title={name}
      className="flex h-[84px] w-[160px] flex-none items-center justify-center overflow-hidden rounded-xl border border-sand-300 bg-white"
    >
      <Image src={logo} alt={copy ? "" : name} width={124} height={124} className="size-[124px] max-w-none flex-none object-contain" />
    </div>
  );
}

// Each row repeats its half of the logos four times, so the -50% marquee loop is seamless and never runs short.
const half = Math.ceil(airlines.length / 2);
const rows = [airlines.slice(0, half), airlines.slice(half)].map((r) => [...r, ...r, ...r, ...r]);

/** Two rows of airline logos: the first moves right to left, the second left to right. */
export function AirlineLogos() {
  return (
    <div className="flex flex-col gap-4 overflow-hidden mask-[linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      {rows.map((track, r) => (
        <div key={r} className={`flex w-max animate-marquee gap-4 ${r === 1 ? "[animation-direction:reverse]" : ""}`}>
          {track.map((a, i) => (
            <LogoTile key={i} {...a} copy={i >= track.length / 4} />
          ))}
        </div>
      ))}
    </div>
  );
}
