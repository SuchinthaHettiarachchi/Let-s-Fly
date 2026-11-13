import type { OutboundRegion, SriLankaTheme } from "@/data/packages";

export const sriLankaThemes: { id: SriLankaTheme; label: string }[] = [
  { id: "cultural", label: "Cultural Triangle" },
  { id: "hill-country", label: "Hill Country" },
  { id: "beaches", label: "Beaches" },
  { id: "wildlife", label: "Wildlife" },
];

export const outboundRegions: { id: OutboundRegion; label: string; image?: string }[] = [
  { id: "middle-east", label: "Middle East", image: "/images/hero/dubai.jpg" },
  { id: "asia", label: "Asia", image: "/images/packages/bangkok-phuket.jpg" },
  { id: "europe", label: "Europe" },
  { id: "maldives", label: "Maldives", image: "/images/packages/maldives-overwater-villa.jpg" },
];
