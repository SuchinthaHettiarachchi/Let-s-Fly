import { HeroSlider } from "@/components/home/HeroSlider";
import { AboutIntro } from "@/components/home/AboutIntro";
import { AirlinePartners } from "@/components/home/AirlinePartners";
import { LatestPackages } from "@/components/home/LatestPackages";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { RentalsTeaser } from "@/components/home/RentalsTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/layout/CtaBand";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutIntro />
      <AirlinePartners />
      <LatestPackages />
      <ServicesGrid />
      <RentalsTeaser />
      <Testimonials />
      <CtaBand tone="sand" />
    </>
  );
}
