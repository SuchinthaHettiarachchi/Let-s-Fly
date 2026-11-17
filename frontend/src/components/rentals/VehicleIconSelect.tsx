"use client";

import { CmsSelect, type CmsSelectOption } from "@/components/cms/CmsSelect";

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
  /** Class(es) merged onto the dropdown trigger (CMS input shell, etc.). */
  className?: string;
  /** Show the "Select an icon…" empty option. */
  placeholder?: boolean;
  disabled?: boolean;
};

/** Vehicle-icon dropdown: each option shows its glyph + label. Reusable across admin forms. */
export function VehicleIconSelect({ value, onChange, id, className = "", placeholder = true, disabled = false }: Props) {
  const options: CmsSelectOption[] = VEHICLE_ICONS.map((icon) => ({
    value: icon.value,
    label: icon.label,
    icon: icon.value,
  }));
  return (
    <CmsSelect
      aria-label="Vehicle icon"
      className={className}
      disabled={disabled}
      id={id}
      onChange={onChange}
      options={options}
      placeholder={placeholder ? "Select an icon…" : "Select…"}
      value={value}
    />
  );
}
