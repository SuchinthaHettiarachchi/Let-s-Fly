import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { durationShort, formatLKR, type Package } from "@/data/packages";

export function RelatedPackages({ items }: { items: Package[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-sand-50 py-16 lg:py-20">
      <Container>
        <h2 data-reveal className="mb-8 text-[26px] font-bold tracking-[-0.01em] sm:text-[32px]">You may also like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Link
              key={p.slug}
              data-reveal={i * 120}
              href={`/packages/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white text-ink-900 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-1 hover:border-ocean-600 hover:text-ink-900 hover:shadow-lf-card-hover"
            >
              <div className="relative h-[200px] bg-sand-200">
                {p.image ? (
                  <Image src={p.image} alt={p.title} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
                ) : (
                  <Placeholder label="PHOTO" className="absolute inset-0 rounded-none border-0" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 px-5 pt-4 pb-5">
                <span className="text-xs font-semibold text-ocean-600">{p.region}</span>
                <span className="text-base font-semibold">{p.title}</span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[13px] text-ink-400">{durationShort(p)}</span>
                  <span className="text-base font-bold text-ocean-600">{formatLKR(p.price)}</span>
                </div>
              </div>
              <div className="mt-auto h-1.5 bg-sun-400" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
