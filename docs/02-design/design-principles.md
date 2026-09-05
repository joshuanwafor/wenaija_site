# Design Principles

**Status:** Active · **Owner:** Design + Product · **Last updated:** 2026-09-05

Seven principles, ordered. When two conflict, the higher one wins. That ordering
is the whole point — principles that do not resolve arguments are decoration.

---

## 1. Mobile-first is a discipline, not a viewport

**Design at 360 × 640 CSS pixels. Always. First.**

The desktop layout is a progressive enhancement of the mobile one, never the
reverse. If a screen is designed wide and then squeezed, it will be obvious, and
it will be worse for the 95%+ of users who will never see it wide.

**In practice**
- Every design starts as a 360 px artboard. Tablet and desktop come after the
  mobile version is signed off.
- No feature is desktop-only (NFR-9). If it does not work on a phone, it is not
  in v1.
- Thumb reach governs placement: primary actions in the lower half, destructive
  actions away from the thumb arc.
- Review on a real low-end Android device, not a resized desktop browser. They
  are not the same and the difference is where the bugs live.

> Web-first is a *delivery* decision ([ADR-0001](../04-decisions/0001-web-first-delivery.md)).
> It is never a design one. Nothing in this product is designed for a laptop.

---

## 2. Every kilobyte is somebody's money

Data in Nigeria is bought in bundles and counted. A heavy page is not a slow
page — it is a page that costs the user something real, and they know it.

**In practice**
- The NFR-7 budget (≤170 KB gzipped JS on the feed route) is a hard gate in CI,
  not a target. A PR that exceeds it fails.
- Images: responsive `srcset`, modern formats, lazy below the fold, always with
  intrinsic dimensions so nothing reflows.
- Video never autoplays with Data Saver on (default ON, FR-11.3). With it off,
  autoplay is muted and pauses off-screen.
- Fonts: system stack first. A custom face must justify its bytes; if it ships, it
  is subset, preloaded, and `font-display: swap`.
- Analytics yields to content. Drop events before degrading the feed.

**The test:** open the feed on a metered connection and look at the transfer
figure. If you would not want to pay for it, do not ship it.

---

## 3. The network will fail. Design for that, not around it

Assume connectivity is intermittent — not as an edge case, but as the normal
condition. A product that only works on good networks does not work.

**In practice**
- Every action that changes state is optimistic locally and reconciled with the
  server (FR-04.2a, FR-04.8).
- Three honest states, always visible: `queued` · `sending` · `sent`. Never a
  spinner that means nothing.
- Offline is a first-class state (NFR-8). The app shell, last feed page, and open
  conversations are readable offline; composing queues rather than fails.
- Errors say what happened and what happens next: *"Saved on your phone. It'll
  send when you're back online."* — not *"Network error."*
- No dead ends. Every failure has a retry, an alternative, or a clear wait.

---

## 4. Local means local

The geographic hierarchy is the product's reason to exist. It has to be visible,
legible, and always under the user's control.

**In practice**
- The current tier is *always* on screen — a user should never wonder which feed
  they are looking at.
- Switching tiers takes one tap and is never hidden behind a menu (FR-01.3).
- When a tier is thin, say so and show the broader tier with a label (FR-01.11).
  An honest substitution beats an empty screen and beats a silent one.
- Use real place names, spelled the way people spell them. "Nsukka", not
  "LGA-EN-14".
- Never ask for device location (FR-06.9). Registered location is the truth, and
  it does not cost a permission prompt.

---

## 5. Recognition without noise

Competition drives return visits; competition in the main feed destroys it. The
feed is for community, Explore is for status.

**In practice**
- Zero ranking, leaderboard, or trending UI in the main feed (FR-06.1). This is
  absolute — a "just this once" exception is how feeds become leaderboards.
- Badges live on profiles and in Explore, where they are context, not intrusion.
- Winning is legible: a user should understand *why* they won and *how* to win
  again without reading documentation.
- Losing is quiet. No "you didn't win" notifications.

---

## 6. Trust is a feature, and it is easy to lose

Users are handing over a phone number, a date of birth, their location, and their
conversations. Every screen either earns that or spends it.

**In practice**
- Ask for permissions in context, at the moment they pay off — never on load
  (FR-13.6).
- Explain before requesting: say what a permission is for before the browser's
  prompt appears, so a denial is an informed one and not a reflex.
- Privacy and safety controls are reachable in two taps: block, report, mute,
  remove follower.
- Security notifications cannot be silenced (FR-13.2) and the UI says why rather
  than hiding the toggle.
- Data export and deletion are in Settings where users expect them, not buried in
  a help article (FR-11.7).
- Never surprise a user with visibility. If something is public, it says so
  before they post it.

---

## 7. Familiar, then distinctive

Users arrive fluent in WhatsApp, Instagram and TikTok. Spend novelty where it
differentiates — the geo tiers, the weekly picture, sticker creation — and nowhere
else.

**In practice**
- Conventional gestures behave conventionally: pull to refresh, swipe back, tap
  the avatar for the profile, long-press for options.
- Bottom navigation, because that is what the market's muscle memory expects.
- Distinctiveness comes from Nigerian identity — colour, voice, content — not from
  reinventing interaction patterns.
- Copy sounds like a person, in Nigerian English, without performing it.

---

## Applying these

**In design review, ask in order:**

1. Was this designed at 360 px first?
2. What does it cost to load?
3. What does it do offline, or when the request fails?
4. Is the tier visible and switchable?
5. Does it put ranking in the feed?
6. Does it ask for anything before it has earned it?
7. Is it novel where it needs to be, and conventional everywhere else?

**In PR review**, the first three are checkable mechanically. Automate them and
save the review for the rest.

---

## Anti-patterns

| Don't | Because |
|---|---|
| A full-screen signup wall on first load | The user arrived from a WhatsApp link, not a store page. Let them look first (FR-12.7) |
| A permission prompt on load | Denied prompts do not come back, and a denial costs the whole notification channel |
| An empty state with no content | FR-01.11 exists so this never happens |
| A spinner with no state | "Sending" and "queued" are different facts and users can tell |
| Autoplaying video on a metered connection | Principle 2, and it is a trust breach |
| Hiding the tier switcher to save space | Principle 4. Cut something else |
| "Just one" ranking widget in the feed | Principle 5. There is no such thing as one |
| Desktop-first, "we'll make it responsive" | Principle 1. It never becomes mobile-first later |
