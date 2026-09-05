# Scope and Non-Goals

**Status:** Active · **Owner:** Product · **Last updated:** 2026-09-05

The purpose of this document is to make the v1 boundary defensible. Every
exclusion below is a decision with a reason, not an omission — so that when
someone asks "why isn't the marketplace in v1?" three months from now, the answer
is written down and does not have to be re-argued.

---

## The v1 boundary in one sentence

> v1 is the **social loop** — discover locally, post, react, converse — delivered
> as a mobile-first web app, with the identity, notification, and integrity
> foundations that every later feature will sit on top of.

---

## In scope

| Area | Included in v1 | Notes |
|---|---|---|
| **F01** Geographic Feed | ✅ Full | Four tiers, engagement ranking, follow up to 2 extra states |
| **F02** Profile | ✅ Full | Weekly picture, badges, Monthly Top Creator. Verification badge and external link are inactive placeholders (Pro perks) |
| **F03** Stories | ✅ Full | Photo/video/text/voice, 24h expiry, Highlights, reaction→DM |
| **F04** Chat | ✅ Full | 1:1 and groups to 500, stickers/GIF creation, resilient delivery |
| **F06** Rankings & Explore | ✅ Full | Confined to Explore; integrity rules enforced |
| **F11** Settings | ✅ Full | Plus data export, deletion, consent management |
| **F12** Onboarding | ✅ Full | 6 screens, age gate, diaspora support |
| **F13** Notifications | ✅ Full | Three-layer, batching, non-disableable security channel |
| **F14** Moderation | ✅ Full | ⚠️ Added in v1.2 — see reasoning below |

---

## Out of scope, with reasoning

### Marketplace — seller side (F07) and buyer side (F08)

**Why not v1.** Commerce is a *different product* with its own trust
requirements: NIN/CAC/bank verification, a human product-vetting workflow,
dispute handling, and a store-management surface. None of it validates the
question v1 exists to answer — will Nigerians use a geo-organised social feed?
Building it in parallel would roughly double v1's scope and add an operational
headcount requirement (vetting) before there is any traffic to vet for.

**What we lose.** The most defensible long-term differentiator is delayed. The
mitigation is that v1's data model must not preclude it (NFR-6) — accounts,
media, and messaging are designed so a store entity attaches later without a
destructive migration.

**What would change our mind.** If v1 retention is strong and users are already
transacting informally in DMs at measurable volume, that is direct evidence to
pull the marketplace forward. Instrument for it: see
[Metrics](metrics-and-instrumentation.md#commerce-intent-proxies).

---

### Voice, video and conference calling (F05)

**Why not v1.** Real-time VoIP is a significant infrastructure investment on its
own — media servers, TURN/STUN, adaptive quality, recording and consent handling,
and GSM fallback. On web specifically it means WebRTC with all its browser
variance. It is not required to validate the core feed/stories/chat loop.

**What we lose.** WhatsApp sets the baseline expectation that a messaging product
can call. Some users will treat its absence as a reason to stay on WhatsApp.

**What would change our mind.** Instrument a call-intent proxy — a visible but
disabled call affordance that logs taps and asks "would you use this?" — so the
v2 sequencing argument is data-driven rather than assumed. This is a cheap
measurement worth building in v1.

---

### Pro Account subscriptions (F09)

**Why not v1.** Personal Pro and Business Pro monetize visibility and marketplace
tools that do not exist in this scope. Business Pro is explicitly marketplace-
linked. Shipping a paid tier whose main perks are placeholders would damage trust
in the tier permanently.

**What we lose.** No revenue in v1 — the single largest strategic cost of this
scope. It is a runway question, not a product question: see
[OQ-1](open-questions.md).

---

### Advertising system (F10)

**Why not v1.** The ad system's highest-value formats (product boosts, Business
Pro story ads) assume a marketplace and a Pro tier that are both deferred.
Shipping geo-targeted ad infrastructure ahead of them means building monetization
plumbing with no proportionate inventory to sell against — and inserting ads into
a feed that has not yet proven it retains users is the fastest way to ensure it
never does.

---

### Native iOS and Android clients 🔺

**Why not v1.** This is the inversion from source PRD v1.1, which had it exactly
the other way around. Full reasoning in
[ADR-0001](../04-decisions/0001-web-first-delivery.md). In short: web reaches a
storage- and data-constrained market with no install cost, ships fixes the same
day without store review, and is link-shareable — which matters disproportionately
for a product whose growth loop is social sharing.

**What we lose.** Native camera quality, reliable background sync on iOS, richer
push, and the psychological weight of "a real app in the store". Some of this is
recoverable in v1.5; some of it is a genuine cost of the choice.

**Explicitly not deferred:** the *mobile-first design discipline*. v1 is designed
at a 360 px baseline and tested on real low-end Android hardware (NFR-9). Web-first
is a delivery decision, never a design one.

---

### Active Igbo / Yoruba / Hausa localisation

**Why not v1.** The language toggle ships; translations do not. Translating a
product whose copy is still changing weekly wastes the translation budget and
guarantees drift. Ship the mechanism, activate the content once copy stabilises.

**What would change our mind.** If soft-launch data shows meaningful usage in
regions where English is not the first language of social media use, accelerate
into v1.5 rather than waiting for v2.

---

### End-to-end encryption for chat 🔺

**Why not v1.** See [ADR-0007](../04-decisions/0007-no-e2ee-in-v1.md). E2EE on
web has real key-management problems (no secure device keystore, key loss on
cache clear, multi-device sync), and it is incompatible with several v1
requirements as written — server-side SMS relay (FR-04.2), server-side content
moderation of reported messages (F14), and message search.

**This is the most consequential exclusion in the document,** because adding
E2EE later is a migration, not a feature. It needs an explicit founder decision
rather than a default: [OQ-9](open-questions.md).

---

### Other specific exclusions

| Excluded | Reason |
|---|---|
| "Tagged in stories" profile section | Marginal value against build cost; the notification and in-story link (FR-03.4) deliver most of the benefit |
| Video beyond 60 seconds | Bandwidth cost and moderation surface; 90s in v2, uncapped in v3 |
| Verified-publisher long-form articles | Media ambition, not core loop |
| Election burst-upload handling | Specialised capacity work; premature before baseline load is known |
| Business/Verified-Business ranking track | Depends on marketplace + Pro; all v1 accounts rank in one track |
| Device geolocation | "Near You" derives from registered Town/LGA instead (FR-06.9). A permission prompt costs conversion and creates a privacy obligation for a marginal accuracy gain |
| Multi-account switching | No store accounts exist without the marketplace |
| Mandatory 2FA | Optional in v1 (FR-11.2); mandatory only makes sense once accounts hold money or a storefront |

---

## Two things added to v1 that the source PRD excluded ⚠️

Both are additions rather than exclusions, and both are argued at length because
adding scope to a deliberately-lean v1 needs at least as much justification as
cutting it.

### Content moderation (F14)

The source PRD has no moderation requirements at any priority level. Its only
adjacent rule is FR-06.5, which excludes suspicious accounts from *rankings* —
an integrity measure, not a safety one.

A platform accepting public photo, video, voice, and text uploads will receive
abusive content, harassment, and eventually illegal material. Without a reporting
path this is not merely a bad user experience: it is unbounded legal and
reputational exposure, and it makes the product unshippable through the app stores
in v1.5 and unbankable with payment partners in v2. The first serious incident
arrives within days of the first thousand users, not months.

Scoped deliberately small: report → prioritised queue → enforcement ladder →
appeal, plus automated CSAM hash screening at upload. No ML classification, no
proactive scanning beyond hash matching, no trust-and-safety org — a queue, a set
of actions, and an audit log.

### NDPA 2023 compliance (NFR-11, FR-11.7, FR-11.8, FR-12.9)

The product collects date of birth, phone number, precise-enough location
(State/LGA/Town), and message content from Nigerian data subjects. The Nigeria
Data Protection Act 2023 applies from the first user. The obligations that touch
product surface — recorded consent, data access, correction, deletion,
portability — are cheap to build at v1 and expensive to retrofit into an existing
user base. This is not gold-plating; it is the minimum lawful basis for operating.

---

## How to propose a scope change

1. Open a PR against [the PRD](prd-v1-web.md) and this document together.
2. State what the change costs in weeks, and what it displaces — v1 is time-boxed,
   so additions are trades, not additions.
3. State what evidence prompted it.
4. If it is a decision a future engineer would ask "why?" about, add an ADR.

Scope changes that do not displace something else are the ones that sink release
dates.
