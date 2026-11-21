import { browserApiUrl } from "@/lib/api-url";

export type DashboardCounts = {
  packages: number;
  projects: number;
  galleryImages: number;
  vehicles: number;
};

export type StorageStats = {
  usedBytes: number;
  quotaBytes: number;
  percent: number;
  unavailable: boolean;
  error?: string;
};

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
  const response = await fetch(browserApiUrl("/stats"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as DashboardCounts;
}

export async function fetchStorageStats(): Promise<StorageStats> {
  const response = await fetch(browserApiUrl("/stats/storage"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as StorageStats;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, index);
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
}
