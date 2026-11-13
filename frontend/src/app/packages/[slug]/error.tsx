"use client";

export default function Error({ reset }: { reset: () => void }) {
  return <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-5 text-center"><h1 className="text-h3">We couldn&apos;t load this package</h1><p className="text-body text-ink-600">Please try again, or return to the packages list.</p><div className="flex gap-3"><button className="rounded-lg bg-ocean-600 px-4 py-2 font-semibold text-white" onClick={reset} type="button">Try again</button><a className="rounded-lg border border-sand-300 px-4 py-2 font-semibold" href="/holidays/outbound">View packages</a></div></main>;
}
