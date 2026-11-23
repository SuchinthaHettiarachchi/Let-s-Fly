import type { Package } from "@/data/packages";
import { apiUrl, browserApiUrl, backendTimeout } from "@/lib/api-url";

export type TourCategory = {
  _id: string;
  key: string;
  label: string;
  scope: "sri-lanka" | "outbound";
  image?: string;
  sortOrder?: number;
};

export type PackagePayment = {
  methods: { icon: string; title: string; text: string }[];
  steps: { title: string; text: string }[];
  note: string;
};

export type PackageOverview = {
  summary: string;
  highlights: { icon: string; label: string }[];
};

export type ItineraryDayCms = {
  category: string;
  title: string;
  body: string;
  meta?: { icon: string; label: string }[];
};

export type PackageItinerary = {
  endpoints: string;
  route: string[];
  footnote: string;
  days: ItineraryDayCms[];
};

export type InclusionItemCms = { title: string; note?: string };

export type PackageInclusions = {
  intro: string;
  included: InclusionItemCms[];
  excluded: InclusionItemCms[];
};

export type PackageDetailFields = {
  gallery: string[];
  overview: PackageOverview;
  itinerary: PackageItinerary;
  inclusions: PackageInclusions;
  payment: PackagePayment;
};

export function defaultOverview(): PackageOverview {
  return { summary: "", highlights: [] };
}

export function defaultItinerary(): PackageItinerary {
  return { endpoints: "", route: [], footnote: "", days: [] };
}

export function defaultInclusions(): PackageInclusions {
  return { intro: "", included: [], excluded: [] };
}

export function defaultPayment(): PackagePayment {
  return {
    methods: [
      { icon: "account_balance", title: "Bank transfer", text: "" },
      { icon: "credit_card", title: "Credit or debit card", text: "" },
    ],
    steps: [
      { title: "Pay a deposit to confirm", text: "" },
      { title: "Pay the balance before you travel", text: "" },
    ],
    note: "",
  };
}

export function hydrateDetailFields(pkg: Partial<Package>): PackageDetailFields {
  const overview = pkg.overview;
  const itinerary = pkg.itinerary;
  const inclusions = pkg.inclusions;
  const payment = (pkg as { payment?: PackagePayment }).payment;
  return {
    gallery: pkg.gallery ?? [],
    overview: overview
      ? { summary: overview.summary ?? "", highlights: overview.highlights ?? [] }
      : defaultOverview(),
    itinerary: itinerary
      ? {
          endpoints: itinerary.endpoints ?? "",
          route: itinerary.route ?? [],
          footnote: itinerary.footnote ?? "",
          days: (itinerary.days ?? []).map((d) => ({
            category: d.category ?? "",
            title: d.title ?? "",
            body: d.body ?? "",
            meta: d.meta ?? [],
          })),
        }
      : defaultItinerary(),
    inclusions: inclusions
      ? {
          intro: inclusions.intro ?? "",
          included: inclusions.included ?? [],
          excluded: inclusions.excluded ?? [],
        }
      : defaultInclusions(),
    payment: payment
      ? {
          methods: payment.methods ?? [],
          steps: payment.steps ?? [],
          note: payment.note ?? "",
        }
      : defaultPayment(),
  };
}

export async function getCategories(scope: "sri-lanka" | "outbound" = "sri-lanka"): Promise<TourCategory[]> {
  try {
    const response = await fetch(apiUrl(`/categories?scope=${scope}`), { next: { revalidate: 60 }, signal: backendTimeout() });
    if (!response.ok) return [];
    const data: { categories?: TourCategory[] } = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch {
    return [];
  }
}

export async function fetchCategoriesManage(scope: "sri-lanka" | "outbound" = "sri-lanka"): Promise<TourCategory[]> {
  try {
    const response = await fetch(browserApiUrl(`/categories?scope=${scope}`), { cache: "no-store", credentials: "include" });
    if (!response.ok) return [];
    const data: { categories?: TourCategory[] } = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch {
    return [];
  }
}

export async function getTourCategories(): Promise<TourCategory[]> {
  return getCategories("sri-lanka");
}

export async function fetchTourCategories(): Promise<TourCategory[]> {
  return fetchCategoriesManage("sri-lanka");
}

export type PackageListItem = Package & { _id?: string };

export async function fetchManagePackages(category: "outbound" | "sri-lanka"): Promise<PackageListItem[]> {
  const response = await fetch(browserApiUrl(`/packages/manage?category=${category}`), { credentials: "include" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: { packages?: PackageListItem[] } = await response.json();
  return Array.isArray(data.packages) ? data.packages : [];
}
