import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact } from "@/data/site";

/**
 * Floating WhatsApp button. It sits in a zero-height sticky strip placed after <main>, so it
 * follows the viewport bottom while scrolling and comes to rest just above the footer.
 * A round green WhatsApp icon on mobile, a green pill with "Chat on WhatsApp" from sm up.
 */
export function WhatsAppFab() {
  return (
    <div className="pointer-events-none sticky bottom-0 z-60 h-0">
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto absolute right-4 bottom-4 flex h-[60px] items-center gap-2 rounded-full bg-[#25d366] p-2 text-[0.9375rem] font-semibold text-white shadow-lf-sm transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#1ebe5b] hover:text-white sm:right-7 sm:bottom-7 sm:pr-[22px]"
      >
        <span className="flex size-11 items-center justify-center rounded-full">
          <SocialIcon name="WhatsApp" size={28} />
        </span>
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
