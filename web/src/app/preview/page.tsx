import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AppPreview } from "@/components/AppPreview";
import { Reveal } from "@/components/Reveal";
import { Button, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Interface preview",
  description:
    "A working preview of the WeNaija interface — switch between the National, State, LGA and Town feeds and see how the product changes with them.",
};

const designRules = [
  {
    title: "Designed at 360px first",
    body: "Every screen starts as a phone screen and grows from there. Nothing is desktop-only, and nothing is designed wide then squeezed.",
  },
  {
    title: "Every kilobyte is somebody's money",
    body: "Data is bought in bundles here and counted. Images are lazy and responsive, video never autoplays on Data Saver, and the feed has a hard size budget.",
  },
  {
    title: "The network will fail",
    body: "Not an edge case — the normal condition. Actions apply instantly on your phone and reconcile with the server, and offline is a first-class state.",
  },
  {
    title: "Recognition without noise",
    body: "Badges and leaderboards live in Explore. The main feed stays a feed, permanently — that's a rule, not a preference.",
  },
];

export default function PreviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Interface preview"
        title="What it looks like, before it's live"
        lede="The geography is real — 36 states, the FCT and 774 local government areas. The posts are illustrative. Switch tiers and watch what changes."
        status="Prototype — not connected to a backend"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="container-x">
          <AppPreview />
        </div>
      </section>

      <section className="border-t border-ink-900/8 bg-sand-25 py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Design rules"
              title="Mobile-first is a discipline, not a viewport"
              lede="WeNaija starts on the web because that's the fastest way into Nigerian hands — no store, no 60MB install, no storage negotiation. But it's designed for a phone, always."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {designRules.map((rule, i) => (
              <Reveal key={rule.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-ink-900/8 bg-white p-7">
                  <span className="font-display text-sm font-semibold text-naija-600">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">
                    {rule.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-900/65">
                    {rule.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-14 rounded-2xl border border-ink-900/8 bg-white p-8 md:p-10">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                This is a prototype
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-900/65">
                Nothing here is connected to a live backend yet — accounts, posts,
                messages and rankings are all still being built. What you&apos;re
                looking at is the interface and the idea, published early so the
                thinking can be argued with before it&apos;s expensive to change.
              </p>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-900/65">
                The <strong className="font-semibold">live feed</strong> goes
                further: it runs the real ranking algorithm on seeded content, so
                you can post, engage, and watch positions move.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/feed">Open the live feed</Button>
                <Button href="/#waitlist" variant="outline">
                  Join the waitlist
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
