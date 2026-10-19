"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FormSent } from "@/components/forms/FormSent";
import { fieldClass, labelClass, textareaClass, titleOptions } from "@/components/forms/styles";
import { cabinClasses } from "@/data/flights";

type TripType = "return" | "one-way" | "multi-city";
const tripTypes: { id: TripType; label: string }[] = [
  { id: "return", label: "Return" },
  { id: "one-way", label: "One-way" },
  { id: "multi-city", label: "Multi-city" },
];
const MAX_LEGS = 5;

/** "Let our ticketing desk book it for you" — route, passengers and contact details. */
export function FlightInquiryForm() {
  const [trip, setTrip] = useState<TripType>("return");
  const [extraLegs, setExtraLegs] = useState(1);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send to the inquiry endpoint once the backend exists.
    setSent(true);
  }

  if (sent) {
    return (
      <FormSent
        title="Flight inquiry sent!"
        text="Thanks — our ticketing desk will reply by email or WhatsApp with the best options."
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div role="radiogroup" aria-label="Trip type" className="flex flex-wrap gap-2">
        {tripTypes.map((t) => {
          const on = t.id === trip;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setTrip(t.id)}
              className={`h-10 cursor-pointer rounded-full border-[1.5px] px-5 text-sm font-medium transition-colors ${
                on ? "border-ocean-600 bg-ocean-600 text-white" : "border-sand-300 bg-white text-ink-900 hover:border-ocean-600"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <legend className="sr-only">Route</legend>
        <label className={labelClass}>
          From *
          <input name="from" required defaultValue="Colombo (CMB)" className={fieldClass} />
        </label>
        <label className={labelClass}>
          To *
          <input name="to" required placeholder="City or airport" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Departure date *
          <input name="departure" type="date" required className={fieldClass} />
        </label>
        {trip === "return" && (
          <label className={labelClass}>
            Return date
            <input name="return" type="date" className={fieldClass} />
          </label>
        )}
      </fieldset>

      {trip === "multi-city" && (
        <div className="flex flex-col gap-4 rounded-xl border border-dashed border-sand-400 p-4">
          {Array.from({ length: extraLegs }, (_, i) => (
            <fieldset key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <legend className="mb-2 text-xs font-semibold tracking-[0.12em] text-ocean-600">FLIGHT {i + 2}</legend>
              <label className={labelClass}>
                From
                <input name={`leg${i + 2}-from`} placeholder="City or airport" className={fieldClass} />
              </label>
              <label className={labelClass}>
                To
                <input name={`leg${i + 2}-to`} placeholder="City or airport" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Date
                <input name={`leg${i + 2}-date`} type="date" className={fieldClass} />
              </label>
            </fieldset>
          ))}
          <div className="flex gap-4">
            {extraLegs + 1 < MAX_LEGS && (
              <button
                type="button"
                onClick={() => setExtraLegs((n) => n + 1)}
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-ocean-600 hover:text-navy-900"
              >
                <Icon name="add" size={18} />
                Add another flight
              </button>
            )}
            {extraLegs > 1 && (
              <button
                type="button"
                onClick={() => setExtraLegs((n) => n - 1)}
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-ink-600 hover:text-navy-900"
              >
                <Icon name="remove" size={18} />
                Remove last
              </button>
            )}
          </div>
        </div>
      )}

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <legend className="sr-only">Passengers</legend>
        <label className={labelClass}>
          Adults *
          <input name="adults" type="number" min={1} max={30} required defaultValue={2} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Children (2–11)
          <input name="children" type="number" min={0} max={30} defaultValue={0} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Infants (under 2)
          <input name="infants" type="number" min={0} max={10} defaultValue={0} className={fieldClass} />
        </label>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Cabin class
          <select name="cabin" className={fieldClass}>
            {cabinClasses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Preferred airline (optional)
          <input name="airline" placeholder="Any airline" className={fieldClass} />
        </label>
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
        <input type="checkbox" name="flexible" className="size-[18px] accent-ocean-600" />
        My dates are flexible (±3 days)
      </label>

      <div className="h-px bg-sand-300" />

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
        <legend className="sr-only">Your details</legend>
        <label className={labelClass}>
          Title *
          <select name="title" className={fieldClass}>
            {titleOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Full name *
          <input name="name" required autoComplete="name" placeholder="As on passport" className={fieldClass} />
        </label>
      </fieldset>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Email *
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Phone / WhatsApp *
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+94 7X XXX XXXX" className={fieldClass} />
        </label>
      </div>
      <label className={labelClass}>
        Additional details
        <textarea
          name="details"
          placeholder="e.g. extra baggage, stopover preference, special assistance"
          className={textareaClass}
        />
      </label>
      <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-normal text-ink-400">
        <input type="checkbox" required className="mt-px size-[18px] flex-none accent-ocean-600" />
        <span>
          I have read the <Link href="/privacy">Privacy Policy</Link> and agree to be contacted about my inquiry. *
        </span>
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="primary" size="lg" icon="arrow_forward">
          Send Flight Inquiry
        </Button>
        <span className="text-xs text-ink-400">We&apos;ll reply by email or WhatsApp. No payment is taken here.</span>
      </div>
    </form>
  );
}
