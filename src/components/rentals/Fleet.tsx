"use client";

import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { contact } from "@/data/site";
import { vehicleTypes, type DriveMode, type Vehicle, type VehicleType } from "@/data/rentals";

const modes: { id: DriveMode; label: string }[] = [
  { id: "self-drive", label: "Self-drive" },
  { id: "with-driver", label: "With driver" },
];

export function Fleet({ vehicles }: { vehicles: Vehicle[] }) {
  const [type, setType] = useState<VehicleType | "all">("all");
  const [mode, setMode] = useState<DriveMode>("self-drive");

  const visible = vehicles.filter((v) => (type === "all" || v.type === type) && v.modes.includes(mode));
  const chips = [{ id: "all" as const, label: "All", icon: "apps" }, ...vehicleTypes];
  const modeLabel = modes.find((m) => m.id === mode)!.label;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Vehicle type" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {chips.map((c) => {
            const on = c.id === type;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => setType(c.id)}
                className={`flex h-10 flex-none cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-[18px] text-sm font-medium transition-colors ${
                  on ? "border-ocean-600 bg-ocean-600 text-white" : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
                }`}
              >
                <Icon name={c.icon} size={18} />
                {c.label}
              </button>
            );
          })}
        </div>
        <div role="radiogroup" aria-label="Driving option" className="inline-flex self-start rounded-xl bg-sand-50 p-1">
          {modes.map((m) => {
            const on = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setMode(m.id)}
                className={`h-9 cursor-pointer rounded-lg px-4 text-[13px] font-semibold transition-colors ${
                  on ? "bg-white text-ocean-600 shadow-lf-header" : "text-ink-600 hover:text-ocean-600"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((v) => (
            <li
              key={v.id}
              className="flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white transition-[border-color,box-shadow] hover:border-ocean-600 hover:shadow-lf-card-hover"
            >
              <div className="relative h-[200px] bg-sand-200">
                {v.image ? (
                  <Image src={v.image} alt={v.name} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
                ) : (
                  <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
                )}
                <span className="absolute top-3.5 left-3.5 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-semibold text-ocean-600">
                  {vehicleTypes.find((t) => t.id === v.type)?.label}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-[17px] font-semibold">{v.name}</h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-400">
                  <li className="flex items-center gap-1" title="Seats">
                    <Icon name="airline_seat_recline_normal" size={17} className="text-ocean-600" />
                    <span className="sr-only">Seats:</span> {v.seats}
                  </li>
                  <li className="flex items-center gap-1">
                    <Icon name="settings" size={17} className="text-ocean-600" />
                    {v.transmission}
                  </li>
                  <li className="flex items-center gap-1">
                    <Icon name="local_gas_station" size={17} className="text-ocean-600" />
                    {v.fuel}
                  </li>
                </ul>
                <div className="mt-auto border-t border-sand-300 pt-4">
                  <ButtonLink
                    href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, I'd like to book the ${v.name} (${modeLabel}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    className="h-10 px-5 text-[13.5px]"
                  >
                    Book Now
                  </ButtonLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-ink-600">
          No {type === "all" ? "" : `${vehicleTypes.find((t) => t.id === type)?.label.toLowerCase()} `}available{" "}
          {mode === "with-driver" ? "with a driver" : "for self-drive"}. Try the other option or ask us.
        </p>
      )}
    </div>
  );
}
