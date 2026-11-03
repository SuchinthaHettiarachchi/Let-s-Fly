import { consentConfig, cookiesToClear, type OptionalCategory } from "@/data/cookies";

/** What the visitor allowed. Strictly necessary cookies are always allowed, so they aren't stored. */
export type Consent = Record<OptionalCategory, boolean> & {
  version: number;
  /** ISO date of the choice, kept as a record of consent. */
  updatedAt: string;
};

export type Choices = Record<OptionalCategory, boolean>;

export const optionalCategories: OptionalCategory[] = ["functional", "analytics", "marketing"];

export const noneAllowed: Choices = { functional: false, analytics: false, marketing: false };
export const allAllowed: Choices = { functional: true, analytics: true, marketing: true };

const listeners = new Set<() => void>();
let cachedRaw: string | undefined;
let cachedConsent: Consent | null = null;

function readRawCookie(): string {
  const prefix = `${consentConfig.cookieName}=`;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : "";
}

function parse(raw: string): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as Partial<Consent>;
    // An older version means the categories changed since they chose, so ask again.
    if (value.version !== consentConfig.version) return null;
    return {
      version: value.version,
      updatedAt: String(value.updatedAt ?? ""),
      functional: value.functional === true,
      analytics: value.analytics === true,
      marketing: value.marketing === true,
    };
  } catch {
    return null;
  }
}

/** The stored choice, or null if the visitor hasn't chosen yet. Same object until the cookie changes. */
export function getConsent(): Consent | null {
  const raw = readRawCookie();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedConsent = parse(raw);
  }
  return cachedConsent;
}

/** Server render: the choice isn't known, so nothing consent-gated is rendered. */
export function getServerConsent(): undefined {
  return undefined;
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function deleteCookie(name: string) {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const d of domains) {
    document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

function clearCategoryCookies(category: OptionalCategory) {
  const prefixes = cookiesToClear[category];
  if (!prefixes.length) return;
  for (const c of document.cookie.split("; ")) {
    const name = c.split("=")[0];
    if (prefixes.some((p) => name.startsWith(p))) deleteCookie(name);
  }
}

type Gtag = (...args: unknown[]) => void;

/** Saves the choice, tells Google Consent Mode, and reloads if a running script was switched off. */
export function saveConsent(choices: Choices) {
  const previous = getConsent();
  const consent: Consent = { ...choices, version: consentConfig.version, updatedAt: new Date().toISOString() };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${consentConfig.cookieName}=${encodeURIComponent(JSON.stringify(consent))}` +
    `; Max-Age=${consentConfig.maxAgeDays * 86400}; path=/; SameSite=Lax${secure}`;

  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("consent", "update", {
    analytics_storage: choices.analytics ? "granted" : "denied",
    ad_storage: choices.marketing ? "granted" : "denied",
    ad_user_data: choices.marketing ? "granted" : "denied",
    ad_personalization: choices.marketing ? "granted" : "denied",
  });

  const revoked = optionalCategories.filter((c) => previous?.[c] && !choices[c]);
  revoked.forEach(clearCategoryCookies);

  listeners.forEach((l) => l());

  // Analytics and Meta scripts keep running once loaded; a reload is the only clean way to stop them.
  if (revoked.some((c) => c !== "functional")) window.location.reload();
}
