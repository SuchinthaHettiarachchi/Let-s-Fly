import { LogoTile } from "@/components/home/AirlinePartners";
import { airlines } from "@/data/home";

// Each row repeats its half of the logos four times, so the -50% marquee loop is seamless and never runs short.
const half = Math.ceil(airlines.length / 2);
const rows = [airlines.slice(0, half), airlines.slice(half)].map((r) => [...r, ...r, ...r, ...r]);

/** Two rows of airline logos scrolling in opposite directions. */
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
