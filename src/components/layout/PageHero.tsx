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
  children?: React.ReactNode;
};

const heroGradient =
  "bg-[linear-gradient(90deg,rgba(11,37,69,.94)_0%,rgba(11,37,69,.78)_35%,rgba(19,87,155,.35)_70%,rgba(19,87,155,.1)_100%)]";

/** Navy banner at the top of inner pages: photo + Ocean gradient, breadcrumb, eyebrow, title. Same height as the Home hero, text pinned top-left. */
export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  imagePosition = "",
  overlay = true,
  crumbs,
  titleIcon,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      {image && <Image src={image} alt="" fill preload sizes="100vw" className={`object-cover ${imagePosition}`} />}
      {overlay && <div className={`absolute inset-0 ${heroGradient}`} />}
      <Container
        className={`relative flex min-h-[600px] flex-col justify-start gap-4 py-14 text-white sm:min-h-[640px] lg:min-h-[660px] ${
          overlay ? "" : "[text-shadow:0_2px_12px_rgba(11,37,69,.7)]"
        }`}
      >
        <Breadcrumb items={crumbs} onDark />
        <Eyebrow onDark className="mt-1">
          {eyebrow}
        </Eyebrow>
        <h1 className="max-w-[640px] text-[34px] leading-[1.1] font-bold tracking-[-0.02em] text-pretty sm:text-[44px] lg:text-[52px]">
          {titleIcon && <span className="mr-3.5 inline-block align-middle">{titleIcon}</span>}
          {title}
        </h1>
        {sub && <p className="max-w-[520px] text-base leading-[1.6] text-white/85">{sub}</p>}
        {children}
      </Container>
    </section>
  );
}
