"use client";

import { useState } from "react";
import { PhoneFrame, PhoneStatusBar } from "./PhoneFrame";
import {
  MOCK_FEED,
  MOCK_STORIES,
  MOCK_THREAD,
  TIER_LABELS,
  TIER_SCOPE,
  type MockMessage,
  type MockPost,
  type TierKey,
} from "@/lib/preview-data";

const TIERS: TierKey[] = ["national", "state", "lga", "town"];
type Screen = "feed" | "chat" | "profile";

export function AppPreview() {
  const [screen, setScreen] = useState<Screen>("feed");
  const [tier, setTier] = useState<TierKey>("state");

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
      {/* --------------------------------------------------- Explainer side */}
      <div className="order-2 lg:order-1">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Preview screen">
          {(
            [
              ["feed", "Geographic feed"],
              ["chat", "Chat"],
              ["profile", "Profile"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={screen === key}
              onClick={() => setScreen(key)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                screen === key
                  ? "bg-ink-900 text-white"
                  : "bg-ink-900/5 text-ink-900/60 hover:bg-ink-900/10 hover:text-ink-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {screen === "feed" ? (
          <div className="mt-8">
            <h3 className="font-display text-2xl font-semibold text-ink-900">
              Four feeds, one tap apart
            </h3>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-900/65">
              Change the tier and the feed changes with it. This is the whole
              idea — the same app, showing you Nigeria at the scale you actually
              care about right now.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  aria-pressed={tier === t}
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                    tier === t
                      ? "border-naija-600 bg-naija-600 text-white"
                      : "border-ink-900/12 bg-white text-ink-900/70 hover:border-naija-500/50 hover:text-naija-700"
                  }`}
                >
                  {TIER_LABELS[t]}
                </button>
              ))}
            </div>

            <p className="mt-5 text-[14px] text-ink-900/50">
              Showing{" "}
              <span className="font-semibold text-naija-700">
                {TIER_SCOPE[tier]}
              </span>{" "}
              — {MOCK_FEED[tier].length} posts ranked by saves, shares and
              comments.
            </p>
          </div>
        ) : null}

        {screen === "chat" ? (
          <div className="mt-8">
            <h3 className="font-display text-2xl font-semibold text-ink-900">
              Built for a connection that drops
            </h3>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-900/65">
              When the network goes, your message doesn&apos;t. It waits on your
              phone and sends itself the moment signal returns — and if the person
              you&apos;re messaging is offline entirely, they get an SMS telling
              them to check.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                ["Queued", "Saved on your phone. Nothing lost.", "text-sand-500"],
                ["Sent", "Reached our servers.", "text-naija-600"],
                ["Notified by SMS", "They were offline, so we texted them.", "text-gold-400"],
              ].map(([label, body, tone]) => (
                <li key={label} className="flex gap-3">
                  <span
                    className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-current ${tone}`}
                  />
                  <span className="text-[15px] text-ink-900/70">
                    <span className="font-semibold text-ink-900">{label}</span> —{" "}
                    {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {screen === "profile" ? (
          <div className="mt-8">
            <h3 className="font-display text-2xl font-semibold text-ink-900">
              One picture a week
            </h3>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-900/65">
              A single slot you can change any time before Sunday night. Top of
              your town, your state or the country earns a badge that stays on
              your profile — and the rankings live in Explore, never in the feed.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                ["City", "Top picture in your town", "bg-bronze-400"],
                ["State", "Top statewide + 24h feature in Explore", "bg-silver-400"],
                ["National", "Top nationwide + 24h feature on the feed", "bg-gold-400"],
              ].map(([tierName, body, dot]) => (
                <li key={tierName} className="flex gap-3">
                  <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                  <span className="text-[15px] text-ink-900/70">
                    <span className="font-semibold text-ink-900">{tierName}</span> —{" "}
                    {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-sand-50 px-3.5 py-1.5 text-[12px] font-medium text-ink-900/50 ring-1 ring-ink-900/8">
          Interface preview — not live. Content shown is illustrative.
        </p>
      </div>

      {/* ------------------------------------------------------- Phone side */}
      <div className="order-1 lg:order-2">
        <PhoneFrame>
          {screen === "feed" ? <FeedScreen tier={tier} /> : null}
          {screen === "chat" ? <ChatScreen /> : null}
          {screen === "profile" ? <ProfileScreen /> : null}
        </PhoneFrame>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Feed screen */

function FeedScreen({ tier }: { tier: TierKey }) {
  return (
    <div className="flex min-h-full flex-col bg-sand-25">
      <PhoneStatusBar />

      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-ink-900/8 bg-sand-25/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 pb-2 pt-2">
          <span className="font-display text-[15px] font-bold text-ink-900">
            WeNaija
          </span>
          <span className="relative">
            <BellIcon />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-naija-500" />
          </span>
        </div>

        {/* Tier switcher — always visible */}
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2.5">
          {TIERS.map((t) => (
            <span
              key={t}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                tier === t
                  ? "bg-naija-600 text-white"
                  : "bg-ink-900/6 text-ink-900/55"
              }`}
            >
              {TIER_LABELS[t]}
            </span>
          ))}
        </div>
      </div>

      {/* Story rail */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto border-b border-ink-900/6 bg-white px-4 py-3">
        {MOCK_STORIES.map((s) => (
          <div key={s.id} className="flex w-12 shrink-0 flex-col items-center gap-1">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full text-[11px] font-bold ${
                s.own
                  ? "bg-ink-900/5 text-ink-900/50 ring-1 ring-dashed ring-ink-900/20"
                  : s.seen
                    ? "bg-sand-100 text-ink-900/60 ring-2 ring-sand-200"
                    : "bg-naija-50 text-naija-700 ring-2 ring-naija-500"
              }`}
            >
              {s.own ? "+" : s.initials}
            </span>
            <span className="w-full truncate text-center text-[9px] text-ink-900/55">
              {s.name}
            </span>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="flex-1 space-y-2 bg-sand-50 pb-20 pt-2">
        {MOCK_FEED[tier].map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {MOCK_FEED[tier].length < 3 ? (
          <div className="mx-3 rounded-xl border border-dashed border-naija-600/30 bg-naija-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-naija-700">
              Quiet here right now
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-900/60">
              Showing posts from Nsukka LGA to fill the gap. Switch back any
              time.
            </p>
          </div>
        ) : null}
      </div>

      <BottomBar active="home" />
    </div>
  );
}

function PostCard({ post }: { post: MockPost }) {
  return (
    <article className="bg-white px-4 py-3.5">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-naija-100 text-[10px] font-bold text-naija-800">
          {post.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[12px] font-semibold text-ink-900">
              {post.author}
            </span>
            {post.badge ? (
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  post.badge === "gold"
                    ? "bg-gold-400"
                    : post.badge === "silver"
                      ? "bg-silver-400"
                      : "bg-bronze-400"
                }`}
                title={`${post.badge} badge`}
              />
            ) : null}
          </div>
          <p className="text-[10px] text-ink-900/45">
            {post.place} · {post.time}
          </p>
        </div>
      </div>

      <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-900/85">
        {post.body}
      </p>

      {post.media === "photo" ? (
        <div className="mt-2.5 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-naija-100 via-sand-100 to-naija-50">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-naija-600/40" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
            <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-4 text-[10px] text-ink-900/45">
        <span className="flex items-center gap-1">
          <HeartIcon /> {formatCount(post.likes)}
        </span>
        <span className="flex items-center gap-1">
          <CommentIcon /> {formatCount(post.comments)}
        </span>
        <span className="ml-auto flex items-center gap-1 font-semibold text-naija-700">
          <SaveIcon /> {formatCount(post.saves)}
        </span>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------- Chat screen */

function ChatScreen() {
  return (
    <div className="flex min-h-full flex-col bg-sand-25">
      <PhoneStatusBar />

      <div className="sticky top-0 z-20 flex items-center gap-2.5 border-b border-ink-900/8 bg-white px-4 py-2.5">
        <ChevronLeft />
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-naija-100 text-[10px] font-bold text-naija-800">
          AO
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-ink-900">
            Adaeze Okafor
          </p>
          <p className="text-[10px] text-ink-900/45">Last seen 18:06</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 px-3 py-4 pb-24">
        <p className="mx-auto w-fit rounded-full bg-ink-900/5 px-2.5 py-1 text-[9px] font-medium text-ink-900/45">
          Today
        </p>

        {MOCK_THREAD.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                m.from === "me"
                  ? "rounded-br-md bg-naija-600 text-white"
                  : "rounded-bl-md bg-white text-ink-900 ring-1 ring-ink-900/6"
              }`}
            >
              <p className="text-[12px] leading-relaxed">{m.body}</p>
              <div
                className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                  m.from === "me" ? "text-white/60" : "text-ink-900/40"
                }`}
              >
                <span>{m.time}</span>
                {m.state ? <MessageState state={m.state} /> : null}
              </div>
            </div>
          </div>
        ))}

        <div className="mx-auto mt-3 w-fit rounded-lg bg-gold-400/12 px-3 py-1.5 text-center">
          <p className="text-[9px] font-semibold text-ink-900/70">
            Adaeze was offline — we sent her an SMS
          </p>
        </div>
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 border-t border-ink-900/8 bg-white px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-full bg-sand-50 px-3 py-2">
          <span className="text-[11px] text-ink-900/35">Message…</span>
          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-naija-600">
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none">
              <path d="M4 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageState({ state }: { state: NonNullable<MockMessage["state"]> }) {
  if (state === "queued") {
    return (
      <span className="flex items-center gap-0.5" title="Queued on your phone">
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
          <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (state === "relayed") {
    return (
      <span className="font-semibold text-white/85" title="Notified by SMS">
        SMS
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-2.5 w-3.5" fill="none" aria-label={state}>
      <path d="m2 12.5 4 4L13 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {state !== "sent" ? (
        <path d="m10 12.5 4 4L21 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
}

/* ---------------------------------------------------------- Profile screen */

function ProfileScreen() {
  return (
    <div className="flex min-h-full flex-col bg-sand-25">
      <PhoneStatusBar />

      <div className="bg-white px-4 pb-4 pt-3">
        <div className="flex items-start gap-3">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-naija-100 text-[16px] font-bold text-naija-800">
            EU
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[14px] font-bold text-ink-900">Emeka Ugwu</p>
            <p className="text-[10.5px] text-ink-900/50">
              @emekau · Nsukka, Enugu
            </p>
            <div className="mt-2 flex gap-4 text-[10px]">
              {[
                ["1,284", "followers"],
                ["312", "following"],
                ["96", "posts"],
              ].map(([n, l]) => (
                <span key={l}>
                  <span className="font-bold text-ink-900">{n}</span>{" "}
                  <span className="text-ink-900/50">{l}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-ink-900/70">
          Market prices, road news and small talk. Ogige every Wednesday.
        </p>

        {/* Monthly banner */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400/15 to-transparent px-3 py-2 ring-1 ring-gold-400/25">
          <span className="text-[13px]">🏆</span>
          <p className="text-[10px] font-semibold text-ink-900/80">
            Monthly Top Creator — Nsukka LGA
          </p>
        </div>

        {/* Badges */}
        <div className="mt-2.5 flex gap-1.5">
          {[
            ["Gold", "bg-gold-400/15 text-ink-900 ring-gold-400/40"],
            ["Silver", "bg-silver-400/15 text-ink-900 ring-silver-400/40"],
            ["Bronze", "bg-bronze-400/15 text-ink-900 ring-bronze-400/40"],
          ].map(([label, tone]) => (
            <span
              key={label}
              className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ring-1 ${tone}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Weekly picture slot */}
      <div className="mt-2 bg-white px-4 py-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-900/45">
            This week&apos;s picture
          </p>
          <p className="text-[9.5px] font-medium text-naija-700">
            2d 4h left
          </p>
        </div>
        <div className="mt-2 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-naija-100 via-sand-100 to-naija-50">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-naija-600/40" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
            <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-2 text-[10px] text-ink-900/50">
          Ranked <span className="font-bold text-naija-700">#2</span> in Nsukka
          this week · 94 saves
        </p>
      </div>

      {/* Grid */}
      <div className="mt-2 grid grid-cols-3 gap-0.5 bg-white p-0.5 pb-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-to-br from-sand-100 to-naija-50"
          />
        ))}
      </div>

      <BottomBar active="you" />
    </div>
  );
}

/* ------------------------------------------------------------------ Chrome */

function BottomBar({ active }: { active: "home" | "you" }) {
  const items = [
    { key: "home", label: "Home", icon: <HomeIcon /> },
    { key: "explore", label: "Explore", icon: <CompassIcon /> },
    { key: "post", label: "", icon: null },
    { key: "chats", label: "Chats", icon: <ChatIcon /> },
    { key: "you", label: "You", icon: <UserIcon /> },
  ];

  return (
    <div className="sticky bottom-0 z-20 flex items-center justify-around border-t border-ink-900/8 bg-white/95 px-2 pb-2 pt-1.5 backdrop-blur">
      {items.map((item) =>
        item.key === "post" ? (
          <span
            key="post"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-naija-600 text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <span
            key={item.key}
            className={`flex w-12 flex-col items-center gap-0.5 ${
              active === item.key ? "text-naija-700" : "text-ink-900/40"
            }`}
          >
            {item.icon}
            <span className="text-[8.5px] font-medium">{item.label}</span>
          </span>
        ),
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- Icons */

const ico = "h-[18px] w-[18px]";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ico} fill="none">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ico} fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m14.5 9.5-1.6 4-4 1.6 1.6-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ico} fill="none">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ico} fill="none">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-ink-900/70" fill="none">
      <path d="M6.5 9.5a5.5 5.5 0 1 1 11 0c0 3.5 1.5 5 1.5 5H5s1.5-1.5 1.5-5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-900/60" fill="none">
      <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
      <path d="M6.5 4h11a.5.5 0 0 1 .5.5V20l-6-3.5L6 20V4.5a.5.5 0 0 1 .5-.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}
