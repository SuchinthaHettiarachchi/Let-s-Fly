/**
 * Cookie consent: the categories visitors can switch on or off, and the cookies behind each one.
 * The banner, the preferences dialog and the Privacy Policy all read from this file, so add a
 * cookie here when you add a script that sets one.
 */

export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";

/** Categories the visitor can switch. "necessary" is always on. */
export type OptionalCategory = Exclude<ConsentCategory, "necessary">;

export const consentConfig = {
  /** First-party cookie that stores the visitor's choices. */
  cookieName: "lf_consent",
  /** Bump this when categories or cookies change, so every visitor is asked again. */
  version: 1,
  /** How long a choice is remembered before we ask again. */
  maxAgeDays: 180,
};

export type CookieInfo = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

export type CookieCategory = {
  id: ConsentCategory;
  title: string;
  description: string;
  /** Always on; shown with an "Always on" label instead of a switch. */
  required?: boolean;
  cookies: CookieInfo[];
};

export const cookieCategories: CookieCategory[] = [
  {
    id: "necessary",
    title: "Strictly necessary",
    description: "Needed for the site to work and to remember your cookie choices. These can't be switched off.",
    required: true,
    cookies: [
      {
        name: consentConfig.cookieName,
        provider: "Let's Fly.lk",
        purpose: "Remembers the cookie choices you make here",
        duration: "6 months",
      },
    ],
  },
  {
    id: "functional",
    title: "Maps and embedded content",
    description: "Shows the Google Maps view of our office. Google may set its own cookies when the map loads.",
    cookies: [
      {
        name: "Google cookies",
        provider: "Google Maps",
        purpose: "Set by Google when the office map is shown",
        duration: "Set by Google",
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Helps us see which pages people visit and how they find us, so we can improve the site.",
    cookies: [
      { name: "_ga", provider: "Google Analytics", purpose: "Tells one visitor apart from another", duration: "2 years" },
      { name: "_ga_<ID>", provider: "Google Analytics", purpose: "Keeps track of a visit", duration: "2 years" },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Lets us measure our Facebook and Instagram ads and show you relevant travel offers.",
    cookies: [
      { name: "_fbp", provider: "Meta", purpose: "Measures and improves our ads on Facebook and Instagram", duration: "3 months" },
    ],
  },
];

/** Cookies to delete when a visitor switches a category off, matched by name prefix. */
export const cookiesToClear: Record<OptionalCategory, string[]> = {
  functional: [],
  analytics: ["_ga", "_gid", "_gat"],
  marketing: ["_fbp", "_fbc"],
};
