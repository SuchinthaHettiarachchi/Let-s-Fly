import { Icon } from "./Icon";

type PlaceholderProps = {
  label: string;
  icon?: string;
  dark?: boolean;
  className?: string;
};

/** Dashed box standing in for content that hasn't been supplied yet (maps, awards, logos). */
export function Placeholder({ label, icon = "image", dark = false, className = "" }: PlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed text-center ${
        dark ? "border-white/35 bg-white/4 text-white/65" : "border-sand-400 bg-sand-100 text-ink-400"
      } ${className}`}
    >
      <Icon name={icon} size={26} />
      <span className="font-mono text-caption tracking-[0.1em]">{label}</span>
    </div>
  );
}
