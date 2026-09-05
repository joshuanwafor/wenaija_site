import type { ReactNode } from "react";
import { PageHero } from "./PageHero";
import { site } from "@/lib/site";

/**
 * Legal pages exist from day one because signup will need to link to them, and
 * because a placeholder that says so honestly is better than a page of
 * boilerplate nobody has reviewed.
 */
export function LegalPage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={lede} status="Draft — pre-launch" />

      <section className="bg-white py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl space-y-8 text-[16px] leading-relaxed text-ink-900/70">
            <div className="rounded-xl border border-naija-600/20 bg-naija-50 p-5">
              <p className="text-[14.5px] leading-relaxed text-naija-900">
                <strong className="font-semibold">This is a placeholder.</strong>{" "}
                WeNaija has not launched, and this document has not been finalised
                or legally reviewed. The final version will be published before
                registration opens and will apply from that date. Questions in the
                meantime:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold underline underline-offset-4"
                >
                  {site.email}
                </a>
                .
              </p>
            </div>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink-900">
        {heading}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
