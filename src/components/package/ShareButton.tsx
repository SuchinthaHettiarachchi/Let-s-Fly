"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/** Uses the native share sheet where available, otherwise copies the link. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed the share sheet.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="md" leadingIcon={copied ? "check" : "share"} onClick={share} className="h-10 px-4 text-[13.5px]">
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </Button>
  );
}
