import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  sub?: string;
  image?: string;
  /** Tailwind object-position class for cropping the photo, e.g. "object-[50%_30%]". */
  imagePosition?: string;
  /** Set false to show the photo without the navy gradient on top. */
  overlay?: boolean;
  crumbs: Crumb[];
  /** Small visual before the title text, e.g. a flag. */
  titleIcon?: React.ReactNode;
  /** How far the next section's cards overlap the hero bottom (they use a matching negative margin), so the text stays centred in the visible part. */
  overlap?: keyof typeof overlapPadding;
  children?: React.ReactNode;
};

/** Bottom padding = the usual 56px + the overlap, paired with -mt-16 (md) and -mt-20 lg:-mt-24 (lg). */
const overlapPadding = {
  none: "pb-14",
  md: "pb-[120px]",
  lg: "pb-[136px] lg:pb-[152px]",
};

const heroGradient =
  "bg-[linear-gradient(180deg,rgba(11,37,69,.55)_0%,rgba(11,37,69,.9)_100%)] sm:bg-[linear-gradient(90deg,rgba(11,37,69,.94)_0%,rgba(11,37,69,.78)_35%,rgba(19,87,155,.35)_70%,rgba(19,87,155,.1)_100%)]";

/** Navy banner at the top of inner pages: photo + Ocean gradient, breadcrumb, eyebrow, title. Same height as the Home hero, text left-aligned and centred vertically. */
export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  imagePosition = "",
  overlay = true,
  crumbs,
  titleIcon,
  overlap = "none",
  children,
}: PageHeroProps) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy-900">
      {image && <Image src={image} alt="" fill preload sizes="100vw" className={`animate-zoom object-cover ${imagePosition}`} />}
      {overlay && <div className={`absolute inset-0 ${heroGradient}`} />}
      <Container
        className={`relative flex min-h-[460px] flex-col justify-center gap-4 pt-14 ${overlapPadding[overlap]} text-white sm:min-h-[640px] lg:min-h-[660px] ${
          overlay ? "" : "[text-shadow:0_2px_12px_rgba(11,37,69,.7)]"
        }`}
      >
        <div className="animate-rise">
          <Breadcrumb items={crumbs} onDark />
        </div>
        <Eyebrow onDark className="mt-1 animate-rise [animation-delay:120ms]">
          {eyebrow}
        </Eyebrow>
        <h1 className="max-w-[20ch] animate-rise [animation-delay:240ms]">
          {titleIcon && <span className="mr-3.5 inline-block align-middle">{titleIcon}</span>}
          {title}
        </h1>
        {sub && <p className="max-w-[52ch] animate-rise text-lead [animation-delay:360ms] text-white/85">{sub}</p>}
        {children}
      </Container>
    </section>
  );
}
