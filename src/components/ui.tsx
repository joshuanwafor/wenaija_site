import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ---------------------------------------------------------------- Eyebrow */

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flow-line h-px w-8 rounded-full" />
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
          tone === "dark" ? "text-naija-300" : "text-naija-700"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------- Button */

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

const buttonBase =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out";

const buttonVariants = {
  primary:
    "bg-naija-600 text-white shadow-[0_8px_24px_-8px_rgba(15,128,73,0.7)] hover:bg-naija-500 hover:shadow-[0_12px_32px_-8px_rgba(15,128,73,0.75)] hover:-translate-y-0.5",
  outline:
    "border border-ink-900/15 bg-white text-ink-900 hover:border-naija-500/60 hover:text-naija-700 hover:-translate-y-0.5",
  ghost:
    "border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/12 hover:border-white/35 hover:-translate-y-0.5",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...rest}
    >
      {children}
      <Arrow />
    </Link>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M3 8h10m0 0-3.8-3.8M13 8l-3.8 3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------- Heading */

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "light",
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow ? (
        <div className={align === "center" ? "flex justify-center" : ""}>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <h2
        className={`mt-5 text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.08] ${
          tone === "dark" ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={`mt-5 text-[17px] leading-relaxed ${
            tone === "dark" ? "text-white/65" : "text-ink-900/65"
          }`}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Check */

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-[18px] w-[18px] shrink-0 ${className}`}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" className="fill-current opacity-12" />
      <path
        d="m6.2 10.3 2.5 2.5 5.1-5.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------- Coming-soon pill */

export function StatusPill({
  tone = "dark",
  children = "In development",
  className = "",
}: {
  tone?: "light" | "dark";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
        tone === "dark"
          ? "bg-white/8 text-white/80 ring-1 ring-white/15 backdrop-blur-sm"
          : "bg-naija-50 text-naija-800 ring-1 ring-naija-600/15"
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-naija-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-naija-400" />
      </span>
      {children}
    </span>
  );
}
