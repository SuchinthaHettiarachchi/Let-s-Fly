"use client";

import { useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { formatLKR } from "@/lib/package-format";
import { contact } from "@/data/site";

export type Journey = {
  id: string;
  kind: "train" | "cruise";
  label: string;
  title: string;
  text: string;
  chips: string[];
  price: number;
  priceNote: string;
  image?: string;
};

export function JourneyList({ journeys }: { journeys: Journey[] }) {
  return (
    <div>
      {journeys.map((j) => (
        <div key={j.id} className="border rounded p-4 mb-4">
          <h3>{j.title}</h3>
          <p>{j.text}</p>
          {j.image ? (
            <Image src={j.image} alt={j.title} fill />
          ) : (
            <Placeholder label="PHOTO" />
          )}
          <p>{formatLKR(j.price)} - {j.priceNote}</p>
          <ButtonLink
            href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, I'd like to book: ${j.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
          >
            Book Now
          </ButtonLink>
        </div>
      ))}
    </div>
  );
}

export function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <div className="border rounded p-4">
      <h3>{journey.title}</h3>
      <p>{journey.text}</p>
      {journey.image ? (
        <Image src={journey.image} alt={journey.title} fill />
      ) : (
        <Placeholder label="PHOTO" />
      )}
      <p>{formatLKR(journey.price)} - {journey.priceNote}</p>
      <ButtonLink
        href={`${contact.whatsappHref}?text=${encodeURIComponent(`Hi Let's Fly, I'd like to book: ${journey.title}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="md"
      >
        Book Now
      </ButtonLink>
    </div>
  );
}