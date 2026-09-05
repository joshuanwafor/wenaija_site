import Link from "next/link";
import { LogoMark } from "./Logo";
import { nav, pillars, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white/70">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-naija-600/20 blur-[100px]"
        aria-hidden="true"
      />

      <div className="container-x relative py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-[18px] font-semibold tracking-tight text-white">
                WeNaija
              </span>
            </div>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/55">
              A social network organised around Nigeria&apos;s own geography —
              because the community that matters most is the one closest to you.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/60 ring-1 ring-white/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-naija-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-naija-400" />
              </span>
              In development
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              {nav.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              What we&apos;re building
            </h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/product#${p.slug}`}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Get in touch
            </h3>
            <div className="mt-5 space-y-1.5 text-[15px]">
              <a
                href={`mailto:${site.email}`}
                className="block text-white transition-colors hover:text-naija-300"
              >
                {site.email}
              </a>
              <p className="text-white/55">Nigeria</p>
            </div>
            <Link
              href="/#waitlist"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-ink-900"
            >
              Join the waitlist
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/legal/privacy" className="transition-colors hover:text-white/70">
              Privacy
            </Link>
            <Link href="/legal/terms" className="transition-colors hover:text-white/70">
              Terms
            </Link>
            <Link
              href="/legal/guidelines"
              className="transition-colors hover:text-white/70"
            >
              Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
