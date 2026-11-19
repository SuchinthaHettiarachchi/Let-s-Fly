import { apiUrl } from "@/lib/api-url";

export type VisaDocument = { title: string; note?: string };
export type VisaFact = { icon: string; label: string };
export type VisaFeeItem = { label: string; value: string; note?: string };
export type VisaFeeGroup = { title: string; items: VisaFeeItem[] };
export type VisaExtraSection = { title: string; body?: string; items?: VisaDocument[] };

export type Visa = {
  _id?: string;
  slug: string;
  countryKey: string;
  country: string;
  city: string;
  categoryKey: string;
  type: string;
  image?: string;
  flag?: string;
  summary?: string;
  facts?: VisaFact[];
  documentGroups?: { title: string; items: VisaDocument[] }[];
  warning?: string;
  feeGroups?: VisaFeeGroup[];
  extraSections?: VisaExtraSection[];
  sortOrder?: number;
};

export type VisaCategory = { _id: string; key: string; label: string; sortOrder?: number };
export type VisaCountry = { _id: string; key: string; label: string; sortOrder?: number };

export type VisaPublicData = {
  categories: VisaCategory[];
  countries: VisaCountry[];
  visas: Visa[];
};

export async function getVisaPublic(): Promise<VisaPublicData> {
  try {
    const res = await fetch(apiUrl("/visas/public"), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed");
    const data = (await res.json()) as Partial<VisaPublicData>;
    return {
      categories: Array.isArray(data.categories) ? data.categories : [],
      countries: Array.isArray(data.countries) ? data.countries : [],
      visas: Array.isArray(data.visas) ? data.visas : [],
    };
  } catch {
    return { categories: [], countries: [], visas: [] };
  }
}

export async function getVisaBySlug(slug: string): Promise<Visa | null> {
  try {
    const res = await fetch(apiUrl(`/visas/by-slug/${encodeURIComponent(slug)}`), { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { visa?: Visa };
    return data.visa || null;
  } catch {
    return null;
  }
}

async function j<T>(res: Response): Promise<T> { return (await res.json().catch(() => ({}))) as T; }

export async function fetchVisaManage() {
  const [cats, countries, visas] = await Promise.all([
    fetch(apiUrl("/visas/categories"), { credentials: "include" }),
    fetch(apiUrl("/visas/countries"), { credentials: "include" }),
    fetch(apiUrl("/visas/manage"), { credentials: "include" }),
  ]);
  if (!cats.ok || !countries.ok || !visas.ok) throw new Error("Failed to load visa CMS data");
  const c = await j<{ categories?: VisaCategory[] }>(cats);
  const co = await j<{ countries?: VisaCountry[] }>(countries);
  const vi = await j<{ visas?: Visa[] }>(visas);
  return {
    categories: Array.isArray(c.categories) ? c.categories : [],
    countries: Array.isArray(co.countries) ? co.countries : [],
    visas: Array.isArray(vi.visas) ? vi.visas : [],
  };
}

export const visaCmsApi = {
  saveCategory: (body: Partial<VisaCategory>, id?: string) => fetch(apiUrl(id ? `/visas/categories/${id}` : "/visas/categories"), { method: id ? "PUT" : "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  deleteCategory: (id: string) => fetch(apiUrl(`/visas/categories/${id}`), { method: "DELETE", credentials: "include" }),
  saveCountry: (body: Partial<VisaCountry>, id?: string) => fetch(apiUrl(id ? `/visas/countries/${id}` : "/visas/countries"), { method: id ? "PUT" : "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  deleteCountry: (id: string) => fetch(apiUrl(`/visas/countries/${id}`), { method: "DELETE", credentials: "include" }),
  saveVisa: (body: Partial<Visa>, id?: string) => fetch(apiUrl(id ? `/visas/manage/${id}` : "/visas/manage"), { method: id ? "PUT" : "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  deleteVisa: (id: string) => fetch(apiUrl(`/visas/manage/${id}`), { method: "DELETE", credentials: "include" }),
};
