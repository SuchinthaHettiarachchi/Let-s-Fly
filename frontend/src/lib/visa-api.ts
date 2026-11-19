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

export type VisaStep = { title: string; text: string };
export type SriLankaVisa = {
  name: string; short: string; icon: string; image: string; text: string;
  purposes: string[]; facts: { label: string; value: string }[];
};
export type ResidenceCategory = { title: string; icon: string; text: string; highlight?: string };

export type VisaPageContent = {
  outboundEyebrow: string; outboundTitle: string;
  inboundEyebrow: string; inboundTitle: string; inboundIntro: string;
  residenceEyebrow: string; residenceTitle: string; residenceDescription: string;
  residenceRenewalTitle: string; residenceRenewalText: string;
  rulesNote: string; stepsEyebrow: string; stepsTitle: string;
  steps: VisaStep[]; sriLankaVisas: SriLankaVisa[]; residenceCategories: ResidenceCategory[];
};

export type VisaPublicData = {
  categories: VisaCategory[];
  countries: VisaCountry[];
  visas: Visa[];
  page: VisaPageContent;
};

export const defaultVisaPage: VisaPageContent = {
  outboundEyebrow: "Popular visas",
  outboundTitle: "Where Sri Lankans are heading",
  inboundEyebrow: "Sri Lankan visa types",
  inboundTitle: "Coming to Sri Lanka? Find the right visa",
  inboundIntro: "Whether you're here for a holiday, a business trip or a longer stay, we'll match you to the right visa, prepare your application and keep you updated until it's approved.",
  residenceEyebrow: "Long-term stay",
  residenceTitle: "Residence Visa",
  residenceDescription: "Designed for foreign nationals who wish to stay in Sri Lanka for an extended period. Choose the category that matches your reason for staying.",
  residenceRenewalTitle: "Renewed annually",
  residenceRenewalText: "We handle your yearly renewal through Let's Fly.lk, so you never miss a deadline.",
  rulesNote: "Visa rules and fees are set by Sri Lanka's Department of Immigration & Emigration and can change. We confirm the current requirements for your case before you apply.",
  stepsEyebrow: "How it works",
  stepsTitle: "Four steps to your visa",
  steps: [
    { title: "Share details", text: "Tell us your destination and travel dates." },
    { title: "Document check", text: "We review everything and flag gaps." },
    { title: "We submit", text: "Forms, fees and appointment, all handled." },
    { title: "Visa in hand", text: "Track progress on WhatsApp until approval." },
  ],
  sriLankaVisas: [],
  residenceCategories: [],
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
      page: { ...defaultVisaPage, ...(data.page || {}) },
    };
  } catch {
    return { categories: [], countries: [], visas: [], page: defaultVisaPage };
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
  const [cats, countries, visas, page] = await Promise.all([
    fetch(apiUrl("/visas/categories"), { credentials: "include" }),
    fetch(apiUrl("/visas/countries"), { credentials: "include" }),
    fetch(apiUrl("/visas/manage"), { credentials: "include" }),
    fetch(apiUrl("/visas/page"), { credentials: "include" }),
  ]);
  if (!cats.ok || !countries.ok || !visas.ok || !page.ok) throw new Error("Failed to load visa CMS data");
  const c = await j<{ categories?: VisaCategory[] }>(cats);
  const co = await j<{ countries?: VisaCountry[] }>(countries);
  const vi = await j<{ visas?: Visa[] }>(visas);
  const p = await j<{ page?: VisaPageContent }>(page);
  return {
    categories: Array.isArray(c.categories) ? c.categories : [],
    countries: Array.isArray(co.countries) ? co.countries : [],
    visas: Array.isArray(vi.visas) ? vi.visas : [],
    page: { ...defaultVisaPage, ...(p.page || {}) },
  };
}

export const visaCmsApi = {
  saveCategory: (body: Partial<VisaCategory>, id?: string) => fetch(apiUrl(id ? `/visas/categories/${id}` : "/visas/categories"), { method: id ? "PUT" : "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  deleteCategory: (id: string) => fetch(apiUrl(`/visas/categories/${id}`), { method: "DELETE", credentials: "include" }),
  saveCountry: (body: Partial<VisaCountry>, id?: string) => fetch(apiUrl(id ? `/visas/countries/${id}` : "/visas/countries"), { method: id ? "PUT" : "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  deleteCountry: (id: string) => fetch(apiUrl(`/visas/countries/${id}`), { method: "DELETE", credentials: "include" }),
  saveVisa: (body: Partial<Visa>, id?: string) => fetch(apiUrl(id ? `/visas/manage/${id}` : "/visas/manage"), { method: id ? "PUT" : "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  deleteVisa: (id: string) => fetch(apiUrl(`/visas/manage/${id}`), { method: "DELETE", credentials: "include" }),
  savePage: (body: VisaPageContent) => fetch(apiUrl("/visas/page"), { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
};
