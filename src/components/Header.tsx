"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav, site } from "@/lib/site";
import { Arrow } from "./ui";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // The drawer remembers which route it was opened on, so navigating anywhere
  // closes it without needing an effect to reset the state.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Every page opens on a dark hero, so the header inverts until it is scrolled
  // off that hero (or the mobile drawer opens over a white sheet).
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-ink-900/8 bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo tone={solid ? "light" : "dark"} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.slice(1).map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? solid
                      ? "text-naija-700"
                      : "text-white"
                    : solid
                      ? "text-ink-900/70 hover:text-ink-900"
                      : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
                {active ? (
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px rounded-full ${
                      solid ? "bg-naija-600" : "bg-naija-300"
                    }`}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#waitlist"
            className={`group hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 sm:inline-flex ${
              solid
                ? "bg-ink-900 text-white hover:bg-naija-700"
                : "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm hover:bg-white hover:text-ink-900 hover:ring-white"
            }`}
          >
            Join the waitlist
            <Arrow />
          </Link>

          <button
            type="button"
            onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden ${
              solid
                ? "border-ink-900/12 text-ink-900 hover:bg-ink-900/5"
                : "border-white/25 text-white hover:bg-white/10"
            }`}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ${
                  open ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ${
                  open ? "top-[5px] -rotate-45" : "top-[11px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-900/8 bg-white lg:hidden"
      >
        <nav className="container-x flex flex-col py-4" aria-label="Mobile">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between border-b border-ink-900/6 py-4 text-lg font-medium ${
                  active ? "text-naija-700" : "text-ink-900"
                }`}
              >
                {item.label}
                <Arrow className="opacity-40" />
              </Link>
            );
          })}
          <Link
            href="/#waitlist"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-naija-600 px-6 py-3.5 text-sm font-semibold text-white"
          >
            Join the waitlist
            <Arrow />
          </Link>
          <a
            className="mt-6 block text-sm font-medium text-ink-900/60"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>
        </nav>
      </div>
    </header>
  );
}
