import { apiUrl, browserApiUrl } from "@/lib/api-url";

export type AirTicketContent = {
  _id?: string;
  photo: string;
  title: string;
  description: string;
  phoneNumber: string;
};

export type AirTicketRoute = {
  _id: string;
  startLocation: string;
  endLocation: string;
  pricePerPerson: number;
  image: string;
  sortOrder?: number;
  createdAt?: string;
};

export type AirTicketsData = {
  content: AirTicketContent;
  routes: AirTicketRoute[];
};

export const defaultAirTicketContent: AirTicketContent = {
  photo: "",
  title: "Book your flight on our booking portal",
  description:
    "Built by the Let's Fly.lk team, our portal lets you compare live fares, pick seats and pay securely, all in one place.",
  phoneNumber: "+94 77 831 6020",
};

export const defaultAirTicketRoutes: Omit<AirTicketRoute, "_id">[] = [
  { startLocation: "Colombo", endLocation: "Dubai", pricePerPerson: 118000, image: "/images/packages/dubai-family-escape.jpg" },
  { startLocation: "Colombo", endLocation: "Malé", pricePerPerson: 62500, image: "/images/packages/maldives-overwater-villa.jpg" },
  { startLocation: "Colombo", endLocation: "Bangkok", pricePerPerson: 96000, image: "/images/packages/bangkok-phuket.jpg" },
  { startLocation: "Colombo", endLocation: "Singapore", pricePerPerson: 104000, image: "/images/packages/singapore-malaysia-cruise.jpg" },
  { startLocation: "Colombo", endLocation: "Paris", pricePerPerson: 265000, image: "" },
  { startLocation: "Colombo", endLocation: "Tokyo", pricePerPerson: 238000, image: "" },
];

export async function getAirTickets(): Promise<AirTicketsData> {
  try {
    const response = await fetch(apiUrl("/air-tickets"), { next: { revalidate: 60 } });
    if (!response.ok) throw new Error("Failed");
    const data = (await response.json()) as Partial<AirTicketsData>;
    const content = { ...defaultAirTicketContent, ...(data.content || {}) };
    const routes = Array.isArray(data.routes)
      ? (data.routes as AirTicketRoute[])
      : (defaultAirTicketRoutes.map((r, i) => ({ ...r, _id: `fallback-${i}` })) as AirTicketRoute[]);
    return { content, routes };
  } catch {
    return {
      content: defaultAirTicketContent,
      routes: defaultAirTicketRoutes.map((r, i) => ({ ...r, _id: `fallback-${i}` })) as AirTicketRoute[],
    };
  }
}

export async function fetchAirTicketsManage(): Promise<AirTicketsData> {
  const [contentRes, routesRes] = await Promise.all([
    fetch(browserApiUrl("/air-tickets/content"), { credentials: "include" }),
    fetch(browserApiUrl("/air-tickets/routes"), { credentials: "include" }),
  ]);
  if (!contentRes.ok || !routesRes.ok) throw new Error("Failed to load air tickets");
  const contentData = (await contentRes.json()) as { content?: AirTicketContent };
  const routesData = (await routesRes.json()) as { routes?: AirTicketRoute[] };
  return {
    content: { ...defaultAirTicketContent, ...(contentData.content || {}) },
    routes: Array.isArray(routesData.routes) ? routesData.routes : [],
  };
}
