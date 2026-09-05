import type { Metadata } from "next";
import Link from "next/link";
import { FeedApp } from "@/components/feed/FeedApp";
import { StatusPill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Live feed prototype",
  description:
    "A working prototype of the WeNaija geographic feed — real ranking, real tier switching, real engagement. Seeded content, no backend.",
  robots: { index: false, follow: true },
};

export default function FeedPage() {
  return (
    <div className="bg-sand-25 pt-[72px]">
      {/* Intro strip */}
      <div className="border-b border-ink-900/8 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <StatusPill tone="light">Working prototype · seeded data</StatusPill>
          <h1 className="mt-4 font-display text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold leading-tight text-ink-900">
            The geographic feed, actually working
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink-900/65">
            This is not a mockup. The ranking is real — engagement is weighted
            and divided by age, exactly as specified. Switch tiers, save a post,
            turn on{" "}
            <span className="font-semibold text-ink-900/80">Show the ranking</span>{" "}
            and watch the maths. Everything persists in your browser and nothing
            leaves it.
          </p>
          <p className="mt-3 text-[13px] text-ink-900/45">
            You&apos;re signed in as someone in Obukpa, Nsukka LGA, Enugu State,
            following Lagos and Rivers.{" "}
            <Link
              href="/geography"
              className="font-medium text-naija-700 underline underline-offset-4"
            >
              How the tiers work
            </Link>
          </p>
        </div>
      </div>

      <div className="py-2 pb-20">
        <FeedApp />
      </div>
    </div>
  );
}
