"use client";

import { Icon } from "@/components/ui/Icon";

/** Vehicle-related Material Symbols used by rental category cards. */
export const VEHICLE_ICONS: { value: string; label: string }[] = [
  { value: "directions_car", label: "Car" },
  { value: "electric_car", label: "Electric car" },
  { value: "local_taxi", label: "Taxi" },
  { value: "airport_shuttle", label: "Van / shuttle" },
  { value: "directions_bus", label: "Bus" },
  { value: "local_shipping", label: "Truck" },
  { value: "two_wheeler", label: "Scooter" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "electric_scooter", label: "Electric scooter" },
  { value: "pedal_bike", label: "Bicycle" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  /** Class(es) applied to the <select> itself (CMS input shell, etc.). */
  className?: string;
  /** Show the "Select an icon…" empty option. */
  placeholder?: boolean;
  disabled?: boolean;
};

/** Dropdown of vehicle icons with a live glyph preview. Reusable across admin forms. */
export function VehicleIconSelect({ value, onChange, id, className = "", placeholder = true, disabled = false }: Props) {
  const selected = VEHICLE_ICONS.some((icon) => icon.value === value);
  return (
    <span className="relative flex w-full items-center">
      <span aria-hidden="true" className="pointer-events-none absolute left-3 flex items-center">
        <Icon name={selected ? value : "directions_car"} size={18} className={selected ? "text-ocean-600" : "text-ink-400"} />
      </span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`${className} pl-9`}
      >
        {placeholder && <option value="">Select an icon…</option>}
        {VEHICLE_ICONS.map((icon) => (
          <option key={icon.value} value={icon.value}>
            {icon.label}
          </option>
        ))}
        {value && !selected && <option value={value}>{value}</option>}
      </select>
    </span>
  );
}
