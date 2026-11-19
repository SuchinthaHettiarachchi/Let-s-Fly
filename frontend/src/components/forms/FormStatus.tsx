import { Icon } from "@/components/ui/Icon";
import { contact } from "@/data/site";

/** Shown under a form when sending fails, with other ways to reach the office. */
export function FormError({ className = "" }: { className?: string }) {
  return (
    <p role="alert" className={`flex gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-800 ${className}`}>
      <Icon name="error" size={18} className="mt-px flex-none" />
      <span>
        Sorry, we couldn&apos;t send that just now. Please try again, call us on{" "}
        <a href={contact.phoneHref} className="font-semibold underline">
          {contact.phone}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${contact.email}`} className="font-semibold underline">
          {contact.email}
        </a>
        .
      </span>
    </p>
  );
}

/**
 * Spam trap: hidden from people and screen readers, but bots that fill every field fill it in.
 * Forms check `isBot(form)` and quietly skip sending.
 */
export function Honeypot() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] size-px opacity-0"
    />
  );
}

export function isBot(form: HTMLFormElement) {
  return Boolean((form.elements.namedItem("website") as HTMLInputElement | null)?.value);
}
