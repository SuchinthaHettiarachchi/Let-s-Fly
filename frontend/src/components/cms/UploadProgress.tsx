"use client";

export function UploadProgressCircle({ progress = 0, size = 56 }: { progress?: number; size?: number }) {
  const indeterminate = progress < 0;
  const p = indeterminate ? 100 : Math.max(0, Math.min(100, Math.round(progress)));
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = indeterminate ? c * 0.25 : c - (p / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-label={indeterminate ? "Uploading" : `Uploading ${p}%`}>
      <svg width={size} height={size} className={indeterminate ? "animate-spin" : "-rotate-90"}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth={stroke} className="text-cms-line/60" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-cms-primary transition-[stroke-dashoffset] duration-150 ease-linear"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold text-cms-ink">{indeterminate ? "..." : `${p}%`}</span>
    </div>
  );
}
