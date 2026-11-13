"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  allAllowed,
  getConsent,
  getServerConsent,
  noneAllowed,
  saveConsent,
  subscribeConsent,
  type Choices,
  type Consent,
} from "@/lib/consent";
import type { OptionalCategory } from "@/data/cookies";
import { CookieBanner } from "./CookieBanner";
import { CookiePreferences } from "./CookiePreferences";
import { ConsentScripts } from "./ConsentScripts";

type ConsentContextValue = {
  /** undefined while rendering on the server, null until the visitor chooses. */
  consent: Consent | null | undefined;
  allowed: (category: OptionalCategory) => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choices: Choices) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside <ConsentProvider>");
  return ctx;
}

/**
 * Holds the visitor's cookie choice and renders the banner, the preferences dialog and the
 * consent-gated scripts. Wrap the whole site with it in app/layout.tsx.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // The CMS portal (and its login screen) never shows the consent UI — it is staff-only.
  const pathname = usePathname() ?? "";
  const onPortal = pathname === "/cms" || pathname.startsWith("/cms/") || pathname === "/login" || pathname.startsWith("/login/");

  const save = useCallback((choices: Choices) => {
    saveConsent(choices);
    setSettingsOpen(false);
  }, []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      allowed: (category) => consent?.[category] === true,
      acceptAll: () => save(allAllowed),
      rejectAll: () => save(noneAllowed),
      save,
      settingsOpen,
      openSettings,
      closeSettings,
    }),
    [consent, save, settingsOpen, openSettings, closeSettings],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {consent === null && !settingsOpen && !onPortal && <CookieBanner />}
      {settingsOpen && !onPortal && <CookiePreferences />}
      <ConsentScripts />
    </ConsentContext.Provider>
  );
}
