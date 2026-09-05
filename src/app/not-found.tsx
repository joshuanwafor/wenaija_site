import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink-950 pt-[72px] text-white">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-naija-600/20 blur-[110px]"
        aria-hidden="true"
      />
      <div className="container-x relative py-20">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-naija-300">
          404
        </p>
        <h1 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.06]">
          This one no dey here.
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/60">
          The page you were looking for doesn&apos;t exist — or hasn&apos;t been
          built yet. Plenty of WeNaija is still in that second category.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back home</Button>
          <Button href="/preview" variant="ghost">
            See the preview
          </Button>
        </div>
      </div>
    </section>
  );
}
