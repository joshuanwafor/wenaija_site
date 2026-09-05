import type { ReactNode } from "react";

/**
 * A 360x740 device frame — the same baseline viewport the real product is
 * designed at, so the preview is honest about how much room there actually is.
 */
export function PhoneFrame({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative mx-auto w-[300px] rounded-[2.6rem] bg-ink-950 p-2.5 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
        {/* Side buttons */}
        <span
          className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-ink-800"
          aria-hidden="true"
        />
        <span
          className="absolute -right-[3px] top-24 h-8 w-[3px] rounded-r bg-ink-800"
          aria-hidden="true"
        />

        <div className="relative h-[620px] w-full overflow-hidden rounded-[2rem] bg-sand-25">
          {/* Notch */}
          <div
            className="absolute left-1/2 top-0 z-30 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-ink-950"
            aria-hidden="true"
          />
          <div className="no-scrollbar h-full overflow-y-auto">{children}</div>
        </div>
      </div>

      {label ? (
        <p className="mt-5 text-center text-[13px] font-medium text-ink-900/50">
          {label}
        </p>
      ) : null}
    </div>
  );
}

/** The in-app status bar, so mock screens read as a real device. */
export function PhoneStatusBar({ dark = false }: { dark?: boolean }) {
  const tone = dark ? "text-white" : "text-ink-900";
  return (
    <div
      className={`flex h-6 items-center justify-between px-6 pt-1 text-[10px] font-semibold ${tone}`}
    >
      <span>09:41</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <svg viewBox="0 0 18 12" className="h-2.5 w-4 fill-current">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="4.5" y="6" width="3" height="6" rx="1" />
          <rect x="9" y="3" width="3" height="9" rx="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3" />
        </svg>
        <svg viewBox="0 0 24 12" className="h-2.5 w-5 fill-none stroke-current">
          <rect x="0.5" y="0.5" width="19" height="11" rx="3" strokeWidth="1" />
          <rect x="2" y="2" width="13" height="8" rx="1.5" className="fill-current stroke-none" />
          <path d="M21 4v4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}
