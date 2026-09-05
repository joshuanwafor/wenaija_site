import { Eyebrow, StatusPill } from "./ui";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  lede,
  status,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  status?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pt-[72px] text-white">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-naija-600/20 blur-[110px]"
        aria-hidden="true"
      />

      <div className="container-x relative pb-20 pt-20 md:pb-28 md:pt-28">
        <Reveal>
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.2rem,5.2vw,4rem)] font-semibold leading-[1.04] text-white">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-white/65 md:text-lg">
            {lede}
          </p>
          {status ? (
            <div className="mt-8">
              <StatusPill>{status}</StatusPill>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
