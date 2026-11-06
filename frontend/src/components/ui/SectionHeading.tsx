type EyebrowProps = {
  children: React.ReactNode;
  onDark?: boolean;
  rule?: boolean;
  className?: string;
};

/** Small uppercase label above headings: ocean on light, sun on dark. */
export function Eyebrow({ children, onDark = false, rule = false, className = "" }: EyebrowProps) {
  return (
    <div
      className={`flex items-center gap-3 eyebrow ${
        onDark ? "text-sun-400" : "text-ocean-600"
      } ${className}`}
    >
      {rule && <span className={`h-0.5 w-9 ${onDark ? "bg-sun-400" : "bg-ocean-600"}`} />}
      {children}
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  centered?: boolean;
  className?: string;
};

export function SectionHeading({ eyebrow, title, centered = false, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-2.5 ${centered ? "items-center text-center" : ""} ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="m-0">
        {title}
      </h2>
    </div>
  );
}
