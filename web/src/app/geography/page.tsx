import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Button, Check, SectionHeading } from "@/components/ui";
import { tiers } from "@/lib/site";
import { NIGERIAN_STATES, TOTAL_LGAS, type Zone } from "@/lib/geo";

export const metadata: Metadata = {
  title: "Geography",
  description:
    "How WeNaija's four feed tiers work — National, State, LGA and Town — across Nigeria's 36 states, the FCT and 774 local government areas.",
};

const ZONES: Zone[] = [
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
];

const rules = [
  "Your home state is set once, at signup, from your registered location.",
  "You can follow up to two more states — their content is weighted equally with your own.",
  "Anything outside your home state and those two is reachable through the National feed.",
  "We never ask for your device location. Registered location is the only thing that decides your tiers.",
  "When a local tier is quiet, we show the broader tier and say so — rather than an empty screen.",
];

export default function GeographyPage() {
  return (
    <>
      <PageHero
        eyebrow="Geography"
        title="Nigeria's own structure, as a product"
        lede="36 states, the Federal Capital Territory, 774 local government areas and the towns inside them. That hierarchy already exists — WeNaija just makes it something you can scroll."
      />

      {/* Tiers */}
      <section className="bg-sand-25 py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="The four tiers"
              title="Each one ranks on its own"
              lede="A post doesn't have to beat the whole country to reach your town. That's the entire difference, and it changes what surfaces at every level."
            />
          </Reveal>

          <div className="mt-16 space-y-4">
            {tiers.map((t, i) => (
              <Reveal key={t.key} delay={i * 80}>
                <div
                  className="rounded-2xl border border-ink-900/8 bg-white p-7 transition-all duration-300 hover:border-naija-500/30 md:p-9"
                  style={{ marginLeft: `${i * 8}px` }}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <h3 className="font-display text-2xl font-semibold text-ink-900">
                      {t.label}
                    </h3>
                    <span className="rounded-full bg-naija-50 px-2.5 py-1 text-[11px] font-semibold text-naija-700">
                      {t.scope}
                    </span>
                    <span className="ml-auto font-display text-3xl font-semibold text-ink-900/10">
                      {t.count}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-900/65">
                    {t.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="relative overflow-hidden bg-ink-950 py-24 text-white md:py-32">
        <div className="contour pointer-events-none absolute inset-0 opacity-50" />
        <div
          className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-naija-600/18 blur-[110px]"
          aria-hidden="true"
        />
        <div className="container-x relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="How it's decided"
                  title="The rules, stated plainly"
                  tone="dark"
                />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {rules.map((rule, i) => (
                  <Reveal key={rule} delay={i * 60}>
                    <li className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                      <Check className="mt-0.5 text-naija-400" />
                      <span className="text-[15px] leading-relaxed text-white/70">
                        {rule}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Coverage"
              title="Every state, every LGA"
              lede={`All ${NIGERIAN_STATES.length} states and the FCT, and the ${TOTAL_LGAS} local government areas inside them. Grouped here by geopolitical zone.`}
            />
          </Reveal>

          <div className="mt-16 space-y-10">
            {ZONES.map((zone, zi) => {
              const states = NIGERIAN_STATES.filter((s) => s.zone === zone);
              return (
                <Reveal key={zone} delay={zi * 60}>
                  <div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-ink-900/8 pb-3">
                      <h3 className="font-display text-lg font-semibold text-ink-900">
                        {zone}
                      </h3>
                      <span className="text-[13px] text-ink-900/45">
                        {states.length} states ·{" "}
                        {states.reduce((n, s) => n + s.lgas, 0)} LGAs
                      </span>
                    </div>
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {states.map((s) => (
                        <li
                          key={s.code}
                          className="flex items-center justify-between gap-3 rounded-lg border border-ink-900/8 bg-sand-25 px-4 py-3"
                        >
                          <span className="truncate text-[14.5px] font-medium text-ink-900">
                            {s.name}
                          </span>
                          <span className="shrink-0 text-[12px] tabular-nums text-ink-900/40">
                            {s.lgas} LGAs
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={120}>
            <div className="mt-16 rounded-2xl border border-ink-900/8 bg-sand-25 p-8 md:p-10">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                Where does your town fit?
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-900/65">
                LGA boundaries are official and settled. Towns are messier — there
                is no single authoritative list, and coverage varies by region.
                Tell us your town when you join the waitlist and you help build
                that map.
              </p>
              <div className="mt-7">
                <Button href="/#waitlist">Join the waitlist</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
