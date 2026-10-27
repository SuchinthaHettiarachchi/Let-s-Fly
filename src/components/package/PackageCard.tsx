import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { durationLabel, durationShort, formatLKR, type Package } from "@/data/packages";

type Props = { pkg: Package; className?: string; imageSizes?: string; compact?: boolean };

/** Package card: photo with place tag + badge, title, duration, price and the yellow bottom strip. */
export function PackageCard({ pkg, className = "", imageSizes = "(min-width: 1024px) 400px, 100vw", compact = false }: Props) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white text-ink-900 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-1.5 hover:border-ocean-600 hover:text-ink-900 hover:shadow-lf-lg ${className}`}
    >
      <div className={`relative bg-sand-200 ${compact ? "h-[150px]" : "h-[210px]"}`}>
        {pkg.image ? (
          <Image src={pkg.image} alt={pkg.title} fill sizes={imageSizes} className="object-cover" />
        ) : (
          <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
        )}
        <span className="absolute top-3.5 left-3.5 flex items-center gap-1 rounded-full bg-white px-[11px] py-1.5 text-caption text-ocean-600">
          <Icon name="location_on" size={14} />
          {pkg.area ?? pkg.region}
        </span>
        {pkg.badge && (
          <span className="absolute top-3.5 right-3.5 rounded-full bg-sun-400 px-[11px] py-1.5 text-caption text-navy-900">
            {pkg.badge}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "gap-2 px-4 pt-4 pb-4" : "gap-2.5 px-5 pt-5 pb-[22px]"}`}>
        <div className={compact ? "text-h5" : "text-h4"}>{pkg.title}</div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-400">
          <span className="flex items-center gap-1.5">
            <Icon name="schedule" size={17} className="text-ocean-600" />
            {pkg.flightsIncluded ? durationShort(pkg) : durationLabel(pkg)}
          </span>
          {pkg.flightsIncluded && (
            <span className="flex items-center gap-1.5">
              <Icon name="flight" size={17} className="text-ocean-600" />
              Flights incl.
            </span>
          )}
        </div>
        <div className="my-1 h-px bg-sand-300" />
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-caption font-normal text-ink-400">From</span>
            <span className={`num font-bold text-ocean-600 ${compact ? "text-h5" : "text-h4"}`}>{formatLKR(pkg.price)}</span>
            <span className="text-caption font-normal text-ink-400">per person</span>
          </div>
          <span className="flex items-center gap-0.5 text-small font-semibold text-ocean-600">
            View More
            <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-sun-400" />
    </Link>
  );
}
