import Link from "next/link";

/**
 * The mark is the four geographic tiers as nested arcs narrowing to a point —
 * national at the top, town at the tip.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="wn-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3fbc77" />
          <stop offset="55%" stopColor="#0f8049" />
          <stop offset="100%" stopColor="#0b432b" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#wn-mark)" />
      {/* Four tiers, narrowing downward */}
      <path
        d="M9 13h22"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M11.5 19h17"
        stroke="#ffffff"
        strokeOpacity="0.65"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M14 25h12"
        stroke="#ffffff"
        strokeOpacity="0.85"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="31" r="2.2" fill="#ffffff" />
    </svg>
  );
}

export function Logo({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const top = tone === "dark" ? "text-white" : "text-ink-900";
  const bottom = tone === "dark" ? "text-white/55" : "text-ink-900/55";

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="WeNaija — home"
    >
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[18px] font-semibold tracking-tight ${top}`}
        >
          WeNaija
        </span>
        <span
          className={`mt-1 text-[9.5px] font-medium uppercase tracking-[0.16em] ${bottom}`}
        >
          National · State · LGA · Town
        </span>
      </span>
    </Link>
  );
}
