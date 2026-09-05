"use client";

import { useMemo, useState } from "react";
import { buildFeed, useFeedStore } from "@/lib/feed/store";
import { GRAVITY, WEIGHTS } from "@/lib/feed/ranking";
import { PostCard } from "./PostCard";
import { Composer } from "./Composer";
import type { TierKey } from "@/lib/feed/types";
import { NIGERIAN_STATES } from "@/lib/geo";

const TIERS: { key: TierKey; label: string; scope: (v: string[]) => string }[] = [
  { key: "national", label: "National", scope: () => "All of Nigeria" },
  { key: "state", label: "Enugu", scope: (f) => `Enugu + ${f.length} followed` },
  { key: "lga", label: "Nsukka", scope: () => "Nsukka LGA" },
  { key: "town", label: "Obukpa", scope: () => "Obukpa town" },
];

const PAGE_SIZE = 6;

export function FeedApp() {
  const store = useFeedStore();
  const [tier, setTier] = useState<TierKey>("state");
  const [showRanking, setShowRanking] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const feed = useMemo(
    () => buildFeed(store.posts, tier, store.viewer, store.authors),
    [store.posts, tier, store.viewer, store.authors],
  );

  const visible = feed.posts.slice(0, limit);
  const stateName = (code: string) =>
    NIGERIAN_STATES.find((s) => s.code === code)?.name ?? code;

  function switchTier(next: TierKey) {
    setTier(next);
    setLimit(PAGE_SIZE);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[220px_minmax(0,640px)_minmax(0,1fr)] lg:px-8">
      {/* ------------------------------------------------------- Left rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <nav aria-label="Feed tiers">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-900/40">
              Your feeds
            </p>
            <ul className="mt-3 space-y-1">
              {TIERS.map((t) => (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => switchTier(t.key)}
                    aria-current={tier === t.key ? "true" : undefined}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                      tier === t.key
                        ? "bg-naija-50 text-naija-800"
                        : "text-ink-900/65 hover:bg-ink-900/4"
                    }`}
                  >
                    <span className="block text-[14.5px] font-semibold">
                      {t.label}
                    </span>
                    <span className="block text-[11.5px] text-ink-900/45">
                      {t.scope(store.viewer.followedStates)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rounded-xl border border-ink-900/8 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-900/40">
              You
            </p>
            <p className="mt-2 text-[14px] font-semibold text-ink-900">
              Obukpa, Nsukka
            </p>
            <p className="text-[12.5px] text-ink-900/50">Enugu State</p>
            <p className="mt-3 border-t border-ink-900/6 pt-3 text-[11.5px] text-ink-900/45">
              Following{" "}
              {store.viewer.followedStates.map(stateName).join(" and ")}
            </p>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- Feed column */}
      <div className="min-w-0">
        {/* Mobile tier switcher — always visible (FR-01.3) */}
        <div className="sticky top-[64px] z-30 -mx-5 border-b border-ink-900/8 bg-sand-25/95 px-5 py-3 backdrop-blur lg:hidden">
          <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
            {TIERS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => switchTier(t.key)}
                aria-pressed={tier === t.key}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  tier === t.key
                    ? "bg-naija-600 text-white"
                    : "bg-ink-900/6 text-ink-900/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls, inline on narrow viewports. The right rail carries these
            on desktop; below lg they'd otherwise land under the whole feed. */}
        <div className="flex flex-wrap items-center gap-2 pt-4 lg:hidden">
          <ChipToggle
            checked={showRanking}
            onChange={setShowRanking}
            label="Show ranking"
          />
          <ChipToggle
            checked={!store.online}
            onChange={(v) => store.setOnline(!v)}
            label="Simulate offline"
          />
        </div>

        <div className="space-y-3 py-6">
          {!store.online ? (
            <p className="flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-3 text-[13px] font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              You&apos;re offline. Posts will queue and send when you reconnect.
              {store.queuedCount > 0 ? ` ${store.queuedCount} waiting.` : ""}
            </p>
          ) : null}

          <Composer
            online={store.online}
            viewerLocation="Obukpa"
            onPost={(body) => {
              store.compose(body, { queued: !store.online });
              switchTier("town");
            }}
          />

          {feed.fallbackFrom ? (
            <div className="rounded-xl border border-dashed border-naija-600/30 bg-naija-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-naija-700">
                Quiet in {TIERS.find((t) => t.key === feed.fallbackFrom)?.label}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-900/65">
                Only {feed.tierCount} {feed.tierCount === 1 ? "post" : "posts"}{" "}
                here, so we&apos;re filling from{" "}
                {TIERS.find((t) => t.key === feed.fallbackTo)?.label} below.
                Nothing is hidden from you — it&apos;s just thin right now.
              </p>
            </div>
          ) : null}

          {!store.mounted ? (
            <FeedSkeleton />
          ) : (
            <>
              {visible.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  author={store.authors[post.authorId]}
                  rank={i + 1}
                  engagement={store.engagementFor(post.id)}
                  showRanking={showRanking}
                  onEngage={(action) => store.engage(post.id, action, post.isOwn)}
                  onView={() => store.recordView(post.id)}
                />
              ))}

              {limit < feed.posts.length ? (
                <button
                  type="button"
                  onClick={() => setLimit((n) => n + PAGE_SIZE)}
                  className="w-full rounded-xl border border-ink-900/10 bg-white py-3.5 text-[14px] font-semibold text-ink-900/70 transition-colors hover:border-naija-500/40 hover:text-naija-700"
                >
                  Load more · {feed.posts.length - limit} left
                </button>
              ) : (
                <p className="py-6 text-center text-[13px] text-ink-900/40">
                  That&apos;s everything in this tier.
                </p>
              )}

              <div className="space-y-4 pt-6 lg:hidden">
                <RankingExplainer />
                <IntegrityNote />
                <ResetButton onReset={store.reset} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------ Right rail */}
      <aside className="hidden lg:block lg:pt-6">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-xl border border-ink-900/8 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13.5px] font-semibold text-ink-900">
                  Show the ranking
                </p>
                <p className="mt-0.5 text-[12px] text-ink-900/50">
                  See why each post sits where it does
                </p>
              </div>
              <Toggle checked={showRanking} onChange={setShowRanking} label="Show ranking" />
            </div>

            {showRanking ? (
              <div className="mt-4 border-t border-ink-900/6 pt-4">
                <RankingExplainer bare />
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-ink-900/8 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13.5px] font-semibold text-ink-900">
                  Simulate poor network
                </p>
                <p className="mt-0.5 text-[12px] text-ink-900/50">
                  Compose while offline and watch it queue
                </p>
              </div>
              <Toggle
                checked={!store.online}
                onChange={(v) => store.setOnline(!v)}
                label="Simulate offline"
              />
            </div>
          </div>

          <IntegrityNote />
          <ResetButton onReset={store.reset} />
        </div>
      </aside>
    </div>
  );
}

function ChipToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
        checked
          ? "border-naija-600 bg-naija-600 text-white"
          : "border-ink-900/12 bg-white text-ink-900/60"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${checked ? "bg-white" : "bg-ink-900/25"}`}
      />
      {label}
    </button>
  );
}

function RankingExplainer({ bare = false }: { bare?: boolean }) {
  return (
    <div
      className={
        bare ? "space-y-3" : "space-y-3 rounded-xl border border-ink-900/8 bg-white p-5"
      }
    >
      <p className="text-[12.5px] leading-relaxed text-ink-900/60">
        Score is weighted engagement divided by age, so a post can&apos;t hold a
        tier forever:
      </p>
      <code className="block rounded-lg bg-sand-50 p-3 text-[11.5px] leading-relaxed text-ink-900/70">
        ({Object.entries(WEIGHTS)
          .map(([k, v]) => `${k}×${v}`)
          .join(" + ")})
        <br />÷ (ageHours + 2)<sup>{GRAVITY}</sup>
      </code>
      <p className="text-[12px] leading-relaxed text-ink-900/50">
        Try saving a post — a save is worth 4 likes. On a big post one save
        barely moves it; on a quiet town post it moves a lot.
      </p>
    </div>
  );
}

function IntegrityNote() {
  return (
    <div className="rounded-xl border border-ink-900/8 bg-sand-50 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-900/40">
        Integrity rules, live
      </p>
      <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-ink-900/60">
        <li>
          Accounts under 30 days are excluded from ranking — look for the{" "}
          <span className="rounded bg-sand-200 px-1.5 py-0.5 text-[11px] font-medium">
            new account
          </span>{" "}
          tag.
        </li>
        <li>Your own posts never earn you ranking score.</li>
        <li>No leaderboards appear in this feed. Rankings belong in Explore.</li>
      </ul>
    </div>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="w-full rounded-xl border border-ink-900/10 py-2.5 text-[13px] font-medium text-ink-900/50 transition-colors hover:border-red-500/30 hover:text-red-600"
    >
      Reset prototype data
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-naija-600" : "bg-ink-900/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-ink-900/8 bg-white p-5">
          <div className="flex gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-sand-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-sand-100" />
              <div className="h-2.5 w-24 rounded bg-sand-50" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-sand-100" />
            <div className="h-3 w-4/5 rounded bg-sand-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
