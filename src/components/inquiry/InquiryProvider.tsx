"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { InquiryModal } from "./InquiryModal";
import type { InquiryPrefill } from "./InquiryForm";

type InquiryContextValue = {
  /** Opens the inquiry modal, optionally pre-filling some fields. */
  openInquiry: (prefill?: InquiryPrefill) => void;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<InquiryPrefill>({});

  const openInquiry = useCallback((values?: InquiryPrefill) => {
    setPrefill(values ?? {});
    setOpen(true);
  }, []);

  return (
    <InquiryContext.Provider value={{ openInquiry }}>
      {children}
      {open && <InquiryModal prefill={prefill} onClose={() => setOpen(false)} />}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used inside <InquiryProvider>");
  return ctx;
}
