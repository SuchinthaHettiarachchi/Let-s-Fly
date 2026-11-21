import { apiUrl, browserApiUrl } from "@/lib/api-url";

export type Journey = {
  id: string;
  kind: "train" | "cruise";
  name: string;
  label: string;
  text: string;
  price: number;
  priceNote: string;
  image: string;
  chips: string[];
  country?: string; // "Sri Lankan" | "Overseas" — only for trains
  startingPoint: string;
  stops: string[];
};

export async function getJourneys(): Promise<Journey[]> {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error("Journey API request timed out."));
      }, 3000);
    });
    const response = await Promise.race([
      fetch(apiUrl("/journey-categories"), { next: { revalidate: 60 }, signal: controller.signal }),
      timeout,
    ]);
    if (!response.ok) return [];
    const data: { journeys?: Journey[] } = await response.json();
    return Array.isArray(data.journeys) ? data.journeys : [];
  } catch (error) {
    console.error("Failed to load journeys:", error);
    return [];
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function createJourney(data: Omit<Journey, "id">): Promise<Journey> {
  const response = await fetch(browserApiUrl("/journey-categories"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create journey");
  return response.json();
}

export async function updateJourney(id: string, data: Partial<Journey>): Promise<Journey> {
  const response = await fetch(`${browserApiUrl("/journey-categories")}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update journey");
  return response.json();
}

export async function deleteJourney(id: string): Promise<void> {
  const response = await fetch(`${browserApiUrl("/journey-categories")}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete journey");
}