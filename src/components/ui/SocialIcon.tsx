import type { SocialName } from "@/data/site";

/** Simple one-colour brand marks, drawn in currentColor on a 24×24 grid. */
const paths: Record<SocialName, React.ReactNode> = {
  Facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z" />
  ),
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.2" />
    </>
  ),
  TikTok: (
    <path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.3 7.3 0 0 0 4.4 1.4V7.3a4.3 4.3 0 0 1-3.4-1.5z" />
  ),
  LinkedIn: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zm6.5 0h3.8v1.5h.06c.53-1 1.83-1.85 3.76-1.85 4.02 0 4.38 2.4 4.38 5.5v5.85h-4v-5.2c0-1.24-.02-2.85-1.74-2.85-1.74 0-2.26 1.27-2.26 2.76v5.29h-4z" />
  ),
};

export function SocialIcon({ name, size = 18 }: { name: SocialName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/** Brand background for each network's round button (white icon on top). */
export const socialBrandClass: Record<SocialName, string> = {
  Facebook: "bg-[#1877f2]",
  Instagram: "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fd5949_45%,#d6249f_60%,#285aeb_90%)]",
  TikTok: "bg-black ring-1 ring-white/25",
  LinkedIn: "bg-[#0a66c2]",
};
