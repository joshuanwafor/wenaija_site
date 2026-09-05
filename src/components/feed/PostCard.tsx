"use client";

import { useEffect, useRef } from "react";
import { formatAge, formatCount, WEIGHTS } from "@/lib/feed/ranking";
import type { Author, EngagementAction, ScoredPost, ViewerEngagement } from "@/lib/feed/types";

/** A qualifying view is 3 seconds on screen (FR-01.9). */
const VIEW_DWELL_MS = 3000;

export function PostCard({
  post,
  author,
  rank,
  engagement,
  showRanking,
  onEngage,
  onView,
}: {
  post: ScoredPost;
  author: Author | undefined;
  rank: number;
  engagement: ViewerEngagement;
  showRanking: boolean;
  onEngage: (action: EngagementAction) => void;
  onView: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const counted = useRef(engagement.viewed ?? false);

  // Count a view only after the card has genuinely been on screen for 3s.
  useEffect(() => {
    const el = ref.current;
    if (!el || counted.current) return;
    if (typeof IntersectionObserver === "undefined") return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          timer = setTimeout(() => {
            counted.current = true;
            onView();
            observer.disconnect();
          }, VIEW_DWELL_MS);
        } else if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [onView]);

  const isOwn = post.own;

  return (
    <article
      ref={ref}
      className="rounded-2xl border border-ink-900/8 bg-white p-4 transition-colors sm:p-5"
    >
      <header className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
            isOwn ? "bg-ink-900 text-white" : "bg-naija-100 text-naija-800"
          }`}
        >
          {isOwn ? "YO" : (author?.initials ?? "??")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[14px] font-semibold text-ink-900">
              {isOwn ? "You" : (author?.name ?? "Unknown")}
            </span>
            {author?.badge ? (
              <span
                className={`h-2 w-2 rounded-full ${
                  author.badge === "gold"
                    ? "bg-gold-400"
                    : author.badge === "silver"
                      ? "bg-silver-400"
                      : "bg-bronze-400"
                }`}
                title={`${author.badge} badge this week`}
              />
            ) : null}
            {post.weeklyPicture ? (
              <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-semibold text-ink-900/75 ring-1 ring-gold-400/30">
                Weekly picture
              </span>
            ) : null}
            {post.isOwn ? (
              <span
                className="rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-medium text-ink-900/50"
                title="Your own likes and saves don't count toward a score (FR-06.6)"
              >
                Your post · self-engagement doesn&apos;t score
              </span>
            ) : null}
            {post.excluded === "new-account" ? (
              <span
                className="rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-medium text-ink-900/50"
                title="Accounts under 30 days old are excluded from ranking (FR-06.4)"
              >
                Not ranked · new account
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[12px] text-ink-900/45">
            {post.town} · {post.lga} · {formatAge(post.ageMinutes)}
          </p>
        </div>

        {showRanking ? (
          <span className="shrink-0 rounded-lg bg-ink-900/5 px-2 py-1 text-[11px] font-bold tabular-nums text-ink-900/50">
            #{rank}
          </span>
        ) : null}
      </header>

      <p className="mt-3 text-[15px] leading-relaxed text-ink-900/85">{post.body}</p>

      {post.media ? (
        <div
          className="mt-3 flex h-44 items-center justify-center rounded-xl sm:h-56"
          style={{
            background: `linear-gradient(135deg, hsl(${post.media.hue} 45% 88%), hsl(${post.media.hue + 30} 30% 94%))`,
          }}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-ink-900/20" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
            <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}

      {post.queued ? (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-sand-100 px-3 py-2 text-[12px] font-medium text-ink-900/60">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Queued on your device — will post when you&apos;re back online
        </p>
      ) : null}

      {showRanking ? <ScoreBreakdown post={post} /> : null}

      <footer className="mt-3 flex items-center gap-1 border-t border-ink-900/6 pt-3">
        <EngageButton
          label="Like"
          count={post.counts.like}
          active={!!engagement.like}
          onClick={() => onEngage("like")}
          icon={
            <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9" />
          }
        />
        <EngageButton
          label="Comment"
          count={post.counts.comment}
          active={!!engagement.comment}
          onClick={() => onEngage("comment")}
          icon={
            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4z" />
          }
        />
        <EngageButton
          label="Share"
          count={post.counts.share}
          active={!!engagement.share}
          onClick={() => onEngage("share")}
          icon={
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3m0 0L8 7m4-4 4 4" />
          }
        />
        <EngageButton
          label="Save"
          count={post.counts.save}
          active={!!engagement.save}
          onClick={() => onEngage("save")}
          weightHint="×4"
          className="ml-auto"
          icon={<path d="M6.5 4h11a.5.5 0 0 1 .5.5V20l-6-3.5L6 20V4.5a.5.5 0 0 1 .5-.5" />}
        />
      </footer>
    </article>
  );
}

function EngageButton({
  label,
  count,
  active,
  onClick,
  icon,
  weightHint,
  className = "",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  weightHint?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label} — ${formatCount(count)}`}
      className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12.5px] font-medium tabular-nums transition-colors ${
        active
          ? "bg-naija-50 text-naija-700"
          : "text-ink-900/50 hover:bg-ink-900/4 hover:text-ink-900/80"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
      {formatCount(count)}
      {weightHint ? (
        <span className="text-[10px] font-bold text-naija-600/60">{weightHint}</span>
      ) : null}
    </button>
  );
}

function ScoreBreakdown({ post }: { post: ScoredPost }) {
  const parts: [string, number, number][] = [
    ["save", post.counts.save, WEIGHTS.save],
    ["share", post.counts.share, WEIGHTS.share],
    ["comment", post.counts.comment, WEIGHTS.comment],
    ["like", post.counts.like, WEIGHTS.like],
    ["view", post.counts.views, WEIGHTS.views],
  ];
  const total = post.engagementScore || 1;

  return (
    <div className="mt-3 rounded-xl bg-sand-50 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-900/40">
          Ranking
        </span>
        <span className="text-[11px] tabular-nums text-ink-900/50">
          {Math.round(post.engagementScore).toLocaleString()} ÷ ({post.ageHours.toFixed(1)}h + 2)
          <sup>1.35</sup> ={" "}
          <strong className="text-naija-700">{post.rankScore.toFixed(1)}</strong>
        </span>
      </div>

      <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-ink-900/8">
        {parts.map(([name, count, weight], i) => (
          <span
            key={name}
            title={`${name}: ${formatCount(count)} × ${weight} = ${Math.round(count * weight)}`}
            style={{
              width: `${((count * weight) / total) * 100}%`,
              background: `hsl(${152 - i * 22} ${60 - i * 8}% ${34 + i * 11}%)`,
            }}
          />
        ))}
      </div>

      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] tabular-nums text-ink-900/50">
        {parts.map(([name, count, weight]) => (
          <li key={name}>
            {name} {formatCount(count)}×{weight} ={" "}
            <span className="font-semibold text-ink-900/70">
              {formatCount(count * weight)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
