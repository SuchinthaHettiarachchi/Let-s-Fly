import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PhotoWall } from "@/components/gallery/PhotoWall";
import { contact, socials } from "@/data/site";
import { galleryPhotos } from "@/data/gallery";

export const metadata: Metadata = {
  title: { absolute: "Tour Photos & Videos | Travel Gallery | Let's Fly" },
  description:
    "Browse photos and videos from Let's Fly tours, including Sri Lanka round trips, overseas holidays and group journeys. See where our travellers have been.",
};

export default function GalleryPage() {
  const instagram = socials.find((s) => s.name === "Instagram")?.href ?? "#";
  return (
    <>
      <PageHero
        image="/images/packages/bali-honeymoon.jpg"
        crumbs={[{ label: "Home", href: "/" }, { label: "Travellers Gallery" }]}
        eyebrow="Travellers gallery"
        title="Moments from our travellers"
        sub="Real trips, real smiles. Share yours with LetsFlyLK and you might see it here."
      />

      <section className="py-14 lg:py-20">
        <Container>
          <PhotoWall photos={galleryPhotos} />
        </Container>
      </section>

      <section className="pb-16 lg:pb-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy-900 p-8 text-white sm:p-12 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <span className="flex size-12 flex-none items-center justify-center rounded-full bg-sun-400 text-navy-900">
                <Icon name="photo_camera" size={24} />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold">Share your trip with #LetsFlyLK</h2>
                <p className="max-w-[520px] text-[15px] text-white/75">
                  Tag us on Instagram or send your favourite photos on WhatsApp. We feature new travellers every month.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={instagram} target="_blank" rel="noopener noreferrer" variant="primaryOnDark" size="lg" leadingIcon="photo_camera">
                Tag us on Instagram
              </ButtonLink>
              <ButtonLink href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" variant="ghostOnDark" size="lg" leadingIcon="chat">
                Send on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
