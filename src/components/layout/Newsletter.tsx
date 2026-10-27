"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { contact } from "@/data/site";

const avatars = [
  { src: "/images/footer/traveller-1.jpg", className: "top-9 left-[6%] size-[84px]" },
  { src: "/images/footer/traveller-2.jpg", className: "bottom-8 left-[11%] size-[68px]" },
  { src: "/images/footer/traveller-3.jpg", className: "top-10 right-[10%] size-[68px]" },
  { src: "/images/footer/traveller-4.jpg", className: "right-[5%] bottom-9 size-[84px]" },
];

const stack = [5, 6, 7, 8].map((n) => `/images/footer/traveller-${n}.jpg`);

/**
 * Sand card above the footer. There's no mailing list service yet, so subscribing opens an email
 * to the office with the address filled in.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    const body = `Please add ${email} to the Let's Fly newsletter.`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Newsletter subscription")}&body=${encodeURIComponent(body)}`;
    setDone(true);
  }

  return (
    <section aria-labelledby="newsletter-title" className="bg-white py-12 sm:py-[72px]">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-sand-100 px-5 py-14 text-center min-[900px]:px-6 min-[900px]:py-[72px]">
          {avatars.map((a) => (
            <Image
              key={a.src}
              src={a.src}
              alt=""
              width={84}
              height={84}
              className={`absolute hidden rounded-full border-4 border-white object-cover min-[900px]:block ${a.className}`}
            />
          ))}

          <div className="relative mx-auto max-w-[560px]">
            <h2 id="newsletter-title" className="text-navy-900">
              Travel deals and ideas, straight to your inbox
            </h2>
            <p className="mx-auto mt-3.5 max-w-[440px] text-body text-ink-600">
              Subscribe for new holiday packages, fare offers and visa updates from Let&apos;s Fly.
            </p>

            {done ? (
              <p role="status" className="mt-7 text-body font-medium text-ocean-600">
                Thanks for subscribing. Look out for our next update.
              </p>
            ) : (
              <form onSubmit={subscribe} className="mx-auto mt-7 flex max-w-[460px] flex-col gap-2.5 min-[480px]:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[52px] min-w-0 flex-1 rounded-full border border-sand-300 bg-white px-[22px] text-ink-900 placeholder:text-ink-400 focus:border-transparent focus:outline-2 focus:outline-offset-1 focus:outline-ocean-600"
                />
                <button
                  type="submit"
                  className="h-[52px] cursor-pointer rounded-full bg-navy-900 px-[26px] text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ocean-600"
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="mt-[22px] flex flex-col items-center justify-center gap-2 text-small font-medium text-ink-900 min-[480px]:flex-row min-[480px]:gap-3">
              <div aria-hidden="true" className="flex">
                {stack.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className={`size-8 rounded-full border-2 border-sand-100 object-cover ${i ? "-ml-2" : ""}`}
                  />
                ))}
                <span className="-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-sand-100 bg-sun-400 text-body font-semibold text-navy-900">
                  +
                </span>
              </div>
              <span>Join travellers already planning with us</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
