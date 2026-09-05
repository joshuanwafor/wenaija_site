import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { AppPreview } from "@/components/AppPreview";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Button, Check, Eyebrow, SectionHeading, StatusPill } from "@/components/ui";
import { buildStatus, faqs, pillars, problems, site, tiers } from "@/lib/site";
import { NIGERIAN_STATES, TOTAL_LGAS } from "@/lib/geo";

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-ink-950 pt-[72px] text-white">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="contour pointer-events-none absolute inset-0 opacity-40" />
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-naija-600/25 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-[-20%] left-[-5%] h-80 w-80 rounded-full bg-naija-500/12 blur-[100px]"
          aria-hidden="true"
        />

        <div className="container-x relative pb-24 pt-20 md:pb-32 md:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <StatusPill>In development — launching {site.launchWindow}</StatusPill>

                <h1 className="mt-7 max-w-2xl text-[clamp(2.4rem,5.6vw,4.2rem)] font-semibold leading-[1.02] text-white">
                  Nigeria doesn&apos;t need another feed.
                  <br />
                  <span className="text-naija-300">It needs its own.</span>
                </h1>

                <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-white/65 md:text-lg">
                  WeNaija organises social around the way Nigerians actually
                  think about community — National, State, LGA, Town. Four feeds,
                  one tap apart, so what happens near you never gets buried under
                  what happens everywhere else.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Button href="/feed">Try the live feed</Button>
                  <Button href="#waitlist" variant="ghost">
                    Join the waitlist
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
                  {[
                    [String(NIGERIAN_STATES.length), "States & FCT"],
                    [String(TOTAL_LGAS), "Local Government Areas"],
                    ["4", "Feed tiers"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <dt className="font-display text-2xl font-semibold text-white md:text-3xl">
                        {value}
                      </dt>
                      <dd className="mt-1.5 text-[12px] leading-snug text-white/45">
                        {label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* Tier ladder */}
            <div className="lg:col-span-5">
              <Reveal delay={160}>
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    The hierarchy
                  </p>
                  <ul className="mt-6 space-y-1">
                    {tiers.map((t, i) => (
                      <li
                        key={t.key}
                        className="flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-white/5"
                        style={{ marginLeft: `${i * 14}px` }}
                      >
                        <span
                          className="h-8 w-1 shrink-0 rounded-full"
                          style={{
                            background: `rgba(63,188,119,${0.3 + i * 0.23})`,
                          }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-white">
                            {t.label}
                          </p>
                          <p className="truncate text-[12px] text-white/45">
                            {t.scope}
                          </p>
                        </div>
                        <span className="shrink-0 font-display text-sm font-semibold text-white/30">
                          {t.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-white/10 pt-5 text-[13px] leading-relaxed text-white/50">
                    Every tier ranks independently. Your town&apos;s biggest post
                    doesn&apos;t have to beat Lagos to reach you.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Marquee */}
      <section className="overflow-hidden border-y border-ink-900/8 bg-white py-5">
        <div className="flex w-max marquee-track">
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              className="flex items-center gap-8 pr-8"
              aria-hidden={dup === 1}
            >
              {NIGERIAN_STATES.map((s) => (
                <li
                  key={s.code}
                  className="flex items-center gap-8 whitespace-nowrap text-[13px] font-medium text-ink-900/35"
                >
                  {s.name}
                  <span className="h-1 w-1 rounded-full bg-naija-500/40" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- Problem */}
      <section className="bg-sand-25 py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Why build this"
              title="Three gaps that global platforms were never going to close"
              lede="Not because they're bad products — because they weren't designed for this market, and adapting them after the fact has never worked."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-ink-900/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-naija-500/30 hover:shadow-[0_20px_40px_-24px_rgba(11,67,43,0.25)]">
                  <span className="font-display text-sm font-semibold text-naija-600">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-900/65">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Preview */}
      <section className="border-y border-ink-900/8 bg-white py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Interface preview"
              title="Try the idea before it exists"
              lede="A preview of the interface — the geography is real, the content is illustrative. Switch tiers and watch the feed change."
              align="center"
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-16">
              <AppPreview />
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-naija-600/20 bg-naija-50 p-7 text-center">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                Want the real thing?
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-900/65">
                There&apos;s a working version of the feed with the actual
                ranking algorithm running — post, save, switch tiers, go offline,
                and inspect the maths behind every position.
              </p>
              <div className="mt-6 flex justify-center">
                <Button href="/feed">Open the live feed</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- Pillars */}
      <section className="bg-sand-25 py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="What we're building"
              title="The fundamentals, done properly"
              lede="No marketplace, no calls, no subscriptions, no ads at launch. Four things, built well enough that people come back."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <div
                  id={p.slug}
                  className="h-full scroll-mt-28 rounded-2xl border border-ink-900/8 bg-white p-8 transition-all duration-300 hover:border-naija-500/30 hover:shadow-[0_20px_40px_-24px_rgba(11,67,43,0.25)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-naija-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-naija-700">
                      {p.code}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-ink-900">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-900/65">
                    {p.summary}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-ink-900/8 pt-6">
                    {p.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <Check className="mt-0.5 text-naija-600" />
                        <span className="text-[14.5px] leading-relaxed text-ink-900/70">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Status */}
      <section className="relative overflow-hidden bg-ink-950 py-24 text-white md:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
        <div
          className="pointer-events-none absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-naija-600/18 blur-[110px]"
          aria-hidden="true"
        />
        <div className="container-x relative">
          <Reveal>
            <SectionHeading
              eyebrow="Where we are"
              title="Being built in the open"
              lede="No launch-date theatre. Here's the actual sequence, and where the work sits today."
              tone="dark"
            />
          </Reveal>

          <ol className="mt-16 space-y-3">
            {buildStatus.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 70}>
                <li
                  className={`flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:gap-8 ${
                    phase.state === "active"
                      ? "border-naija-500/40 bg-naija-500/8"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`font-display text-sm font-bold ${
                      phase.state === "next" ? "text-white/25" : "text-naija-300"
                    }`}
                  >
                    {phase.phase}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-display text-lg font-semibold ${
                        phase.state === "next" ? "text-white/50" : "text-white"
                      }`}
                    >
                      {phase.title}
                    </h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/50">
                      {phase.body}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      phase.state === "done"
                        ? "bg-naija-500/15 text-naija-300"
                        : phase.state === "active"
                          ? "bg-naija-500 text-white"
                          : "bg-white/5 text-white/40"
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
        </div>
      </section>

      {/* -------------------------------------------------------- Waitlist */}
      <section
        id="waitlist"
        className="relative scroll-mt-20 overflow-hidden bg-ink-900 py-24 text-white md:py-32"
      >
        <div className="contour pointer-events-none absolute inset-0 opacity-50" />
        <div
          className="pointer-events-none absolute right-[-10%] top-1/4 h-96 w-96 rounded-full bg-naija-600/20 blur-[120px]"
          aria-hidden="true"
        />

        <div className="container-x relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow tone="dark">Early access</Eyebrow>
                <h2 className="mt-5 text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.08] text-white">
                  We open one state at a time
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-white/60">
                  A local feed only works when there are locals in it. So rather
                  than launching everywhere thinly, we&apos;re opening one state
                  first and making it dense before we move.
                </p>
                <p className="mt-5 text-[16px] leading-relaxed text-white/60">
                  Tell us where you are, and you help decide which state that is.
                </p>

                <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
                  {[
                    "No spam — launch news only",
                    "Diaspora welcome, no Nigerian number needed",
                    "Free at launch. No ads, no paid tier",
                  ].map((point) => (
                    <li key={point} className="flex gap-3">
                      <Check className="mt-0.5 text-naija-400" />
                      <span className="text-[15px] text-white/70">{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={120}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm md:p-9">
                  <WaitlistForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionHeading
                  eyebrow="Questions"
                  title="The things people ask first"
                />
                <p className="mt-8 text-[15px] leading-relaxed text-ink-900/60">
                  Something not covered here?{" "}
                  <Link
                    href="/about"
                    className="font-semibold text-naija-700 underline underline-offset-4"
                  >
                    Read more about the project
                  </Link>
                  .
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <dl className="divide-y divide-ink-900/8 border-y border-ink-900/8">
                {faqs.map((faq, i) => (
                  <Reveal key={faq.q} delay={i * 50}>
                    <div className="py-7">
                      <dt className="font-display text-[17px] font-semibold text-ink-900">
                        {faq.q}
                      </dt>
                      <dd className="mt-3 text-[15px] leading-relaxed text-ink-900/65">
                        {faq.a}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
