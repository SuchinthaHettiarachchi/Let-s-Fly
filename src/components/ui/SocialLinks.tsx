import { SocialIcon } from "@/components/ui/SocialIcon";
import { socials } from "@/data/site";

/** Round social profile buttons on a light background (mobile menu, Contact page). */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            title={s.name}
            className="flex size-11 items-center justify-center rounded-full bg-navy-900 text-white transition-colors hover:bg-ocean-600 hover:text-white"
          >
            <SocialIcon name={s.name} size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
