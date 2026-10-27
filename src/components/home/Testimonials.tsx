"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowButton, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useScroller } from "@/hooks/useScroller";
import { reviews } from "@/data/home";
import { contact } from "@/data/site";

export function Testimonials() {
  const { ref, prev, next } = useScroller<HTMLDivElement>();
  return (
    <section className="overflow-hidden bg-sand-50 py-20 lg:py-[110px]">
      <Container>
        <div data-reveal className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Testimonials" title="What our travellers say" />
          <div className="flex flex-none items-center gap-2.5">
            <ButtonLink
              href={contact.googleWriteReviewHref}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              leadingIcon="rate_review"
              className="sm:mr-2"
            >
              Write a review
            </ButtonLink>
            <div className="flex gap-2.5">
              <ArrowButton direction="prev" onClick={prev} />
              <ArrowButton direction="next" onClick={next} />
            </div>
          </div>
        </div>

        <div
          data-reveal="120"
          ref={ref}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-2 lg:mx-0 lg:scroll-px-0 lg:px-0"
        >
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex w-[85vw] max-w-[384px] flex-none snap-start flex-col gap-[18px] rounded-xl border border-sand-300 bg-white p-7 sm:w-[384px] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-ocean-600" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon key={i} name="star" size={22} fill />
                  ))}
                </div>
                <Icon name="format_quote" size={40} fill className="text-sand-200" />
              </div>
              <blockquote className="flex-1 text-body text-ink-600">“{r.quote}”</blockquote>
              <figcaption className="flex items-center gap-3.5 border-t border-sand-300 pt-[18px]">
                <Image
                  src={r.image}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 rounded-full bg-sand-200 object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <span className="text-h5">{r.name}</span>
                  <span className="text-caption font-normal text-ink-400">{r.trip}</span>
                </div>
                <span className="rounded-full bg-sand-50 px-2.5 py-[5px] text-caption text-ocean-600">
                  Google review
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div data-reveal className="mt-10 flex justify-center">
          <ButtonLink
            href={contact.googleReviewsHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            leadingIcon="star"
            icon="north_east"
          >
            See all reviews on Google
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
