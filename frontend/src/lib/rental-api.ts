import { apiUrl } from "@/lib/api-url";

export type DriveMode = "self-drive" | "with-driver";
export type Transmission = "Automatic" | "Manual";
export type FuelType = "Hybrid" | "Diesel" | "Petrol";

export type RentalCategory = {
  _id: string;
  name: string;
  icon: string;
  sortOrder?: number;
};

export type RentalVehicle = {
  _id: string;
  name: string;
  /** RentalCategory id. */
  category: string;
  seats: number;
  transmission: Transmission;
  fuel: FuelType;
  modes: DriveMode[];
  image?: string;
  sortOrder?: number;
};

export async function getRentalCategories(): Promise<RentalCategory[]> {
  try {
    const response = await fetch(apiUrl("/rental-categories"), { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data: { categories?: RentalCategory[] } = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch {
    return [];
  }
}

export async function getRentalVehicles(): Promise<RentalVehicle[]> {
  try {
    const response = await fetch(apiUrl("/rental-vehicles"), { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data: { vehicles?: RentalVehicle[] } = await response.json();
    return Array.isArray(data.vehicles) ? data.vehicles : [];
  } catch {
    return [];
  }
}
