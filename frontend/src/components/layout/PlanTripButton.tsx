"use client";

import { Button } from "@/components/ui/Button";
import { useInquiry } from "@/components/inquiry/InquiryProvider";

/** "Plan My Trip" in the yellow CTA band: opens the inquiry popup with "Plan my trip" picked as the service. */
export function PlanTripButton() {
  const { openInquiry } = useInquiry();
  return (
    <Button variant="navy" size="xl" icon="arrow_forward" onClick={() => openInquiry({ service: "Plan my trip" })}>
      Plan My Trip
    </Button>
  );
}
