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
  YouTube: (
    <path
      fillRule="evenodd"
      d="M2.5 8.2c0-1.9 1.4-3.4 3.3-3.5C7.7 4.6 9.8 4.5 12 4.5s4.3.1 6.2.2c1.9.1 3.3 1.6 3.3 3.5v7.6c0 1.9-1.4 3.4-3.3 3.5-1.9.1-4 .2-6.2.2s-4.3-.1-6.2-.2c-1.9-.1-3.3-1.6-3.3-3.5zM10 8.8v6.4l5.5-3.2z"
    />
  ),
};

export function SocialIcon({ name, size = 18 }: { name: SocialName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
