import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Button, Check, SectionHeading } from "@/components/ui";
import { pillars } from "@/lib/site";

export const metadata: Metadata = {
  title: "Product",
  description:
    "The four things WeNaija v1 does: a geographic feed, stories that start conversations, chat built for Nigerian networks, and weekly local recognition.",
};

const notYet = [
  {
    title: "Marketplace",
    body: "Vetted local commerce is the long-term thesis, and it's a different product with its own trust requirements. It comes after the social loop is proven.",
  },
  {
    title: "Voice & video calls",
    body: "Real-time calling is a significant infrastructure build on its own. Not needed to answer the question the first version exists to answer.",
  },
  {
    title: "Paid tiers",
    body: "No Pro subscription at launch. A paid tier whose perks are placeholders damages trust in it permanently.",
  },
  {
    title: "Advertising",
    body: "Inserting ads into a feed that hasn't yet proven it retains people is the fastest way to ensure it never does.",
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Four things, built well enough that people come back"
        lede="The first version of WeNaija is deliberately narrow. Every feature here earns its place by serving the core loop — discover locally, post, react, converse."
        status="Specification complete · in build"
      />

      <section className="bg-sand-25 py-24 md:py-32">
        <div className="container-x space-y-20">
          {pillars.map((p, i) => (
            <Reveal key={p.slug}>
              <div
                id={p.slug}
                className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <div className="lg:col-span-5">
                  <span className="rounded-full bg-naija-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-naija-700">
                    {p.code}
                  </span>
                  <h2 className="mt-5 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold leading-tight text-ink-900">
                    {p.title}
                  </h2>
                  <p className="mt-5 text-[16px] leading-relaxed text-ink-900/65">
                    {p.summary}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {p.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 rounded-xl border border-ink-900/8 bg-white p-5"
                      >
                        <Check className="mt-0.5 text-naija-600" />
                        <span className="text-[14.5px] leading-relaxed text-ink-900/75">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {i < pillars.length - 1 ? (
                <hr className="mt-20 border-ink-900/8" />
              ) : null}
            </Reveal>
          ))}
        </div>
      </section>

      {/* What's deliberately absent */}
      <section className="relative overflow-hidden bg-ink-950 py-24 text-white md:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <Reveal>
            <SectionHeading
              eyebrow="Not in version one"
              title="What we're deliberately leaving out"
              lede="These are decisions, not gaps. Each one is a real part of the long-term product — and each one would make the first version worse if it shipped now."
              tone="dark"
            />
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {notYet.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                  <h3 className="font-display text-lg font-semibold text-white/85">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/50">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-14 flex flex-wrap gap-3">
              <Button href="/preview" variant="ghost">
                See the interface
              </Button>
              <Button href="/#waitlist">Join the waitlist</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
