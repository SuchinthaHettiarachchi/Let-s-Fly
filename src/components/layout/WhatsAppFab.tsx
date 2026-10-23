import { Icon } from "@/components/ui/Icon";
import { contact } from "@/data/site";

/**
 * Floating WhatsApp button. It sits in a zero-height sticky strip placed after <main>, so it
 * follows the viewport bottom while scrolling and comes to rest just above the footer.
 */
export function WhatsAppFab() {
  return (
    <div className="pointer-events-none sticky bottom-0 z-60 h-0">
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto absolute right-4 bottom-4 flex h-[60px] items-center gap-2.5 rounded-full bg-ocean-600 p-2 text-sm font-semibold text-white shadow-lf-sm transition-transform hover:-translate-y-0.5 hover:text-white sm:right-7 sm:bottom-7 sm:pr-[22px]"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-white text-ocean-600">
          <Icon name="chat" size={24} fill />
        </span>
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
