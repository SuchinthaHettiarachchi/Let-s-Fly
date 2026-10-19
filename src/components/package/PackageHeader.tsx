import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { categoryCrumb, durationLabel, type Package } from "@/data/packages";
import { ShareButton } from "./ShareButton";

export function PackageHeader({ pkg }: { pkg: Package }) {
  const parent = categoryCrumb[pkg.category];
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb items={[{ label: "Home", href: "/" }, parent, { label: pkg.title }]} />

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-sand-50 px-3 py-1 text-xs font-semibold text-ocean-600">{pkg.location}</span>
        {pkg.badge && (
          <span className="rounded-full bg-sun-400 px-3 py-1 text-xs font-semibold text-navy-900">{pkg.badge}</span>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="text-[30px] leading-tight font-bold tracking-[-0.01em] sm:text-[40px]">{pkg.title}</h1>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-600">
            <li className="flex items-center gap-1.5">
              <Icon name="schedule" size={18} className="text-ocean-600" />
              {durationLabel(pkg)}
            </li>
            {pkg.flightsIncluded && (
              <li className="flex items-center gap-1.5">
                <Icon name="flight" size={18} className="text-ocean-600" />
                Return flights included
              </li>
            )}
            {pkg.rating && (
              <li className="flex items-center gap-1.5">
                <Icon name="star" size={18} fill className="text-ocean-600" />
                {pkg.rating.score} ({pkg.rating.count} reviews)
              </li>
            )}
          </ul>
        </div>
        <div className="flex gap-2.5">
          <ShareButton title={pkg.title} />
          {pkg.brochureUrl && (
            <ButtonLink
              href={pkg.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              leadingIcon="download"
              className="h-10 px-4 text-[13.5px]"
            >
              Brochure PDF
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
