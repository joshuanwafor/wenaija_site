"use client";

import { useState } from "react";
import { NIGERIAN_STATES } from "@/lib/geo";
import { Arrow } from "./ui";

type Status = "idle" | "sending" | "done" | "error";

export function WaitlistForm({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const dark = tone === "dark";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("done");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className={`rounded-2xl p-8 text-center ${
          dark
            ? "bg-white/5 ring-1 ring-white/12"
            : "bg-naija-50 ring-1 ring-naija-600/15"
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-naija-500/15">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-naija-400">
            <path
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          className={`mt-5 font-display text-xl font-semibold ${
            dark ? "text-white" : "text-ink-900"
          }`}
        >
          You&apos;re on the list
        </h3>
        <p
          className={`mx-auto mt-3 max-w-sm text-[15px] leading-relaxed ${
            dark ? "text-white/60" : "text-ink-900/65"
          }`}
        >
          We&apos;ll be in touch before registration opens in your state. No spam,
          and nothing else — that&apos;s the only reason we asked.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={`mt-6 text-sm font-semibold underline underline-offset-4 ${
            dark ? "text-white/70 hover:text-white" : "text-naija-700"
          }`}
        >
          Add someone else
        </button>
      </div>
    );
  }

  const fieldClass = dark
    ? "w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3.5 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-naija-400/60 focus:bg-white/8"
    : "w-full rounded-xl border border-ink-900/12 bg-white px-4 py-3.5 text-[15px] text-ink-900 placeholder:text-ink-900/35 outline-none transition-colors focus:border-naija-500/60";

  const labelClass = `mb-2 block text-[13px] font-medium ${
    dark ? "text-white/70" : "text-ink-900/70"
  }`;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* Honeypot — real people never fill this in. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="wl-website">Website</label>
        <input
          id="wl-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-name" className={labelClass}>
            Name
          </label>
          <input
            id="wl-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Chidi Okeke"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="wl-email" className={labelClass}>
            Email
          </label>
          <input
            id="wl-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-state" className={labelClass}>
            Your state
          </label>
          <select
            id="wl-state"
            name="state"
            required
            defaultValue=""
            className={`${fieldClass} appearance-none`}
          >
            <option value="" disabled>
              Select a state
            </option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s.code} value={s.code} className="text-ink-900">
                {s.name}
              </option>
            ))}
            <option value="DIASPORA" className="text-ink-900">
              I&apos;m in the diaspora
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="wl-town" className={labelClass}>
            Town or city{" "}
            <span className={dark ? "text-white/40" : "text-ink-900/40"}>
              (optional)
            </span>
          </label>
          <input
            id="wl-town"
            name="town"
            type="text"
            placeholder="Nsukka"
            className={fieldClass}
          />
        </div>
      </div>

      {error ? (
        <p
          className="rounded-xl bg-red-500/10 px-4 py-3 text-[14px] text-red-300 ring-1 ring-red-500/20"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-naija-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(15,128,73,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-naija-500 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Adding you…" : "Join the waitlist"}
        {status === "sending" ? null : <Arrow />}
      </button>

      <p className={`text-[13px] ${dark ? "text-white/40" : "text-ink-900/50"}`}>
        We&apos;ll only email you about the launch. Your state helps us decide
        where to open first.
      </p>
    </form>
  );
}
