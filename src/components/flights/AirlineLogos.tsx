import { LogoTile } from "@/components/home/AirlinePartners";
import { airlines } from "@/data/home";

/** Airline logos laid out in place. Each fades up in turn on scroll and lifts on hover. */
export function AirlineLogos() {
  return (
    <ul className="flex flex-wrap justify-center gap-4">
      {airlines.map((a, i) => (
        <li
          key={a.name}
          data-reveal={(i % 6) * 70}
          className="rounded-xl transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lf-card-hover"
        >
          <LogoTile {...a} />
        </li>
      ))}
    </ul>
  );
}
