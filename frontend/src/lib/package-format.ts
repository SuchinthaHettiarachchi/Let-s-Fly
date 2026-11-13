import type { Package } from "@/data/packages";

export const formatLKR = (value: number) => `LKR ${value.toLocaleString("en-US")}`;
export const durationLabel = (pkg: Pick<Package, "days" | "nights">) =>
  `${pkg.days} Days / ${pkg.nights} ${pkg.nights === 1 ? "Night" : "Nights"}`;
export const durationShort = (pkg: Pick<Package, "days" | "nights">) => `${pkg.days}D / ${pkg.nights}N`;
