/** Shared form styles so every form on the site looks the same. */
export const fieldClass =
  "h-[46px] w-full rounded-lg border border-sand-300 bg-white px-3.5 text-ink-900 placeholder:text-ink-400 focus:border-ocean-600 focus:outline-none focus:ring-4 focus:ring-ocean-600/12 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus:ring-red-600/12";

export const textareaClass = `${fieldClass} h-24 resize-none py-3`;

/** Red message shown under a field that fails validation. */
export const errorClass = "flex items-center gap-1 text-caption font-normal text-red-600";

export const labelClass = "flex flex-col gap-1.5 text-small font-medium text-ink-600";

export const serviceOptions = [
  "Tour package",
  "Air tickets",
  "Visa services",
  "Hotels",
  "Trains & Cruises",
  "Rentals",
  "Travel insurance",
];

export const titleOptions = ["Mr.", "Mrs.", "Ms.", "Dr."];
