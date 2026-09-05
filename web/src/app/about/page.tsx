import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Button, Check, SectionHeading } from "@/components/ui";
import { buildStatus, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why WeNaija exists, who it's for, and how it's being built — a social network organised around Nigeria's own geography.",
};

const audiences = [
  {
    title: "People who live somewhere specific",
    body: "The feed you want most is the one from your LGA and your town — the one where you recognise names, places and faces. That's the feed nobody has built.",
  },
  {
    title: "Nigerians abroad",
    body: "Full access with an international number. No Nigerian SIM required, and the state you left is one of the states you follow.",
  },
  {
    title: "People who want to be known locally",
    body: "One picture a week, ranked in your town, your state and the country. Recognition you can earn without already being famous.",
  },
  {
    title: "People on cheap phones and counted data",
    body: "Opens from a link. Installs to your home screen for a fraction of an app download. Works when the signal doesn't.",
  },
];

const principles = [
  "Mobile-first always — designed at 360px, tested on real low-end Android hardware.",
  "The network will fail. Messages queue and send themselves; offline is a designed state, not an error.",
  "Rankings stay in Explore. The main feed never becomes a leaderboard.",
  "Ask for permissions in context, at the moment they pay off — never on first load.",
  "Free at launch. No advertising, no paid tier, no data sold.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A social network that knows where you are"
        lede="Not through your device's GPS — through the state, LGA and town you told us you belong to. That difference is the whole product."
        status="In development"
      />

      {/* Thesis */}
      <section className="bg-sand-25 py-24 md:py-32">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading eyebrow="The idea" title="Community is local. Feeds aren't." />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={100}>
                <div className="space-y-5 text-[16.5px] leading-relaxed text-ink-900/70">
                  <p>
                    Nigerians organise their social world by state, by local
                    government area, by town. It&apos;s how people introduce
                    themselves, how they find each other, how they decide what
                    matters. Every global platform flattens that into one feed
                    ranked for everybody at once.
                  </p>
                  <p>
                    The result is predictable: your neighbour&apos;s post
                    competes with Lagos and loses. Local content is drowned out by
                    national volume, and the thing that made the community worth
                    joining is the first thing to disappear.
                  </p>
                  <p>
                    WeNaija turns Nigeria&apos;s actual administrative hierarchy —
                    National, State, LGA, Town — into four feeds that rank
                    independently. Your town&apos;s biggest post doesn&apos;t have
                    to beat the country to reach you. It only has to be the
                    biggest post in your town.
                  </p>
                  <p className="text-ink-900/85">
                    That&apos;s the bet. Everything else in the first version
                    exists to test whether it&apos;s right.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-y border-ink-900/8 bg-white py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Who it's for"
              title="Four people we're building for"
              lede="When two designs are both defensible, we pick the one that serves the first of these on a 3G connection."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {audiences.map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-ink-900/8 bg-sand-25 p-7">
                  <h3 className="font-display text-xl font-semibold text-ink-900">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-900/65">
                    {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="relative overflow-hidden bg-ink-950 py-24 text-white md:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="How we build"
                  title="Five rules we don't trade away"
                  tone="dark"
                  lede="Principles that only apply when convenient aren't principles. These settle arguments."
                />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {principles.map((p, i) => (
                  <Reveal key={p} delay={i * 60}>
                    <li className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                      <Check className="mt-0.5 text-naija-400" />
                      <span className="text-[15px] leading-relaxed text-white/70">
                        {p}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="bg-sand-25 py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Progress"
              title="Where the work is"
              lede="Published early, on purpose. It's cheaper to be argued with now than after it's built."
            />
          </Reveal>

          <ol className="mt-14 space-y-3">
            {buildStatus.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 60}>
                <li
                  className={`flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:gap-6 ${
                    phase.state === "active"
                      ? "border-naija-500/40 bg-white"
                      : "border-ink-900/8 bg-white/60"
                  }`}
                >
                  <span
                    className={`font-display text-sm font-bold ${
                      phase.state === "next" ? "text-ink-900/25" : "text-naija-600"
                    }`}
                  >
                    {phase.phase}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-display text-[17px] font-semibold ${
                        phase.state === "next" ? "text-ink-900/50" : "text-ink-900"
                      }`}
                    >
                      {phase.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-900/55">
                      {phase.body}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      phase.state === "done"
                        ? "bg-naija-50 text-naija-700"
                        : phase.state === "active"
                          ? "bg-naija-600 text-white"
                          : "bg-ink-900/5 text-ink-900/40"
                    }`}
                  >
                    {phase.state === "done"
                      ? "Complete"
                      : phase.state === "active"
                        ? "In progress"
                        : "Up next"}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={140}>
            <div className="mt-14 rounded-2xl border border-ink-900/8 bg-white p-8 md:p-10">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                Want to talk to us?
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-900/65">
                Whether you want early access, want to help build it, or think
                we&apos;ve got something wrong — we&apos;d rather hear it now.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button href="/#waitlist">Join the waitlist</Button>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm font-semibold text-naija-700 underline underline-offset-4"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
