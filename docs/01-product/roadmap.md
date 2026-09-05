# Roadmap

**Status:** Active · **Owner:** Product · **Last updated:** 2026-09-05

> **Durations are relative, not dated.** No calendar dates appear here because
> team size and start date are not settled. Sequence and dependency are the
> useful content; convert to dates once staffing is known.

---

## Release shape

| Release | Platform | Scope |
|---|---|---|
| **v1** | Mobile-first web (PWA) 🔺 | The social fundamentals + moderation. No monetization. |
| **v1.5** 🔺 | Native Android + iOS | Same API, native shells. Language activation if v1 data supports it. |
| **v2** | All | Calls, Marketplace (seller + buyer), Pro subscriptions, Advertising, 90 s video, tagged-stories section |
| **v3** | All | Uncapped video |

v1.5 is new in this version of the roadmap — it exists because the web-first
decision defers native rather than cancelling it, and because bundling native
clients into v2 alongside four major feature areas would guarantee neither ships
well.

---

## v1 milestones

### M0 — Foundations

**Exit criteria:** a deployed skeleton a developer can add a feature to without
asking anyone how.

- Repo, CI, environments (dev/staging/prod), observability baseline
- NestJS API skeleton with auth middleware, error envelope, request tracing
- MongoDB with migration tooling; Redis provisioned
- Next.js app shell, design tokens, PWA manifest and service worker registration
- **Geographic reference data loaded and frozen** — states, LGAs, towns
  ([geo-hierarchy](../05-reference/geo-hierarchy.md)). This blocks onboarding,
  feed tiering, and ranking; it is the first thing that must be right and it
  carries an unresolved question ([OQ-7](open-questions.md)) — start it in M0, do
  not discover it in M2.

**Critical path.** Nothing else starts cleanly until geo data exists.

---

### M1 — Identity

**Delivers:** F12 onboarding, the account half of F11 settings, NFR-4 age gate,
NDPA consent capture.

- 6-screen signup with OTP, resumable (FR-12.8)
- Africa's Talking integration + a second OTP provider for failover
- International/diaspora numbers (FR-12.4)
- Age gate (FR-12.3), consent recording (FR-12.9)
- Sessions, refresh, optional 2FA (FR-11.2)
- Transactional email live (FR-12.6)

**Exit criteria:** a real person can create an account on a real Nigerian phone
number, on a real low-end Android device, over a real 3G connection, and come back
to it tomorrow.

**Risk:** OTP deliverability in Nigeria is genuinely unreliable across carriers.
Test on MTN, Glo, Airtel and 9mobile separately, and instrument delivery rate per
carrier from day one. This is not a thing to discover at soft launch.

---

### M2 — The feed

**Delivers:** F01 in full. The core bet.

- Post composition: text, photo (≤10), video (≤60 s), reshare
- Media pipeline: upload, transcode, adaptive bitrate (NFR-1) —
  see [Media Pipeline](../03-engineering/media-pipeline.md)
- Four tiers with independent ranking (FR-01.1)
- Scoring with time decay (FR-01.9, FR-01.10);
  see [Feed & Ranking Spec](../03-engineering/feed-ranking-spec.md)
- State following (FR-01.5, FR-01.6)
- Thin-tier fallback (FR-01.11), cursor pagination and progressive render (FR-01.12)
- Performance budget enforced in CI (NFR-7)

**Exit criteria:** the National and State feeds render inside the NFR-7 budget on
a throttled Fast 3G profile against a seeded corpus of several thousand posts, and
ranking output is reproducible from a fixture set.

**This milestone is the product.** If it slips, everything slips; if it is
mediocre, nothing downstream saves it.

---

### M3 — The social loop

Two workstreams that can run in parallel once M2 is stable.

**M3a — Profile, stories, recognition (F02, F03)**

- Profile, pinned posts, weekly picture slot
- Weekly/monthly award jobs — idempotent, WAT cutoff (FR-02.4, FR-02.8)
- Stories in all four formats, 24 h expiry enforced at read time (FR-03.7)
- Highlights, viewer lists, @mentions
- **Reaction → DM (FR-03.5)** — depends on M3b's message send path

**M3b — Chat (F04)**

- 1:1 and group (≤500) messaging over WebSocket
- Offline outbox with idempotency keys (FR-04.2a, FR-04.8)
- SMS relay for unreachable recipients (FR-04.2b) with cost caps (NFR-14)
- Sticker/GIF creation from ≤5 s clips (FR-04.3); public packs (FR-04.4)
- Block and report (FR-04.10)

**Exit criteria:** the acceptance criteria in PRD §7.3 and §7.4 pass, including
the deliberately adversarial ones — network disabled mid-compose, outbox replayed
twice, recipient with no socket and no push token.

**Sequencing note:** FR-03.5 (story reaction becomes a DM) is the seam between
these workstreams and the single most likely integration surprise. Agree the
message-creation interface before both start, not after.

---

### M4 — Explore, settings, notifications, moderation

- F06 Explore with integrity rules (FR-06.4 through FR-06.9)
- F11 settings in full, including data export and deletion (FR-11.7)
- F13 three-layer notifications with batching and contextual permission
- **F14 moderation** — report flow, queue, enforcement ladder, audit log, CSAM
  hash screening ⚠️
- NDPA compliance review (NFR-11)
- Accessibility pass (NFR-12)

**Exit criteria:** an operator can find and action a reported piece of content end
to end; a user can export and delete their data; the app is launchable without a
lawyer objecting.

---

### M4 — Soft launch (single state)

**The most important milestone in the plan and the easiest one to skip under
schedule pressure.**

Launch in **one state only** ([OQ-12](open-questions.md) — which state, and on
what evidence). The purpose is density: the geo bet cannot be evaluated against a
population thinly spread over 36 states, and a national launch into empty local
tiers burns the first-impression advantage permanently.

**Run for at least 4 weeks. Watch:**

- Retention by LGA density band ([Metrics §1](metrics-and-instrumentation.md#1-the-one-question-v1-exists-to-answer))
- Thin-tier fallback rate — is FR-01.11 carrying the whole experience?
- OTP delivery per carrier
- Outbox and SMS relay health, and actual SMS spend against forecast
- Moderation queue depth and time-to-first-review
- PWA install rate and installed-vs-browser retention (the ADR-0001 evidence)

**Go/no-go for national rollout** is an explicit decision with these numbers on
the table, not a date.

---

### M5 — National rollout

Capacity work, the FR-01.4 default-tier prompt once users cross 5,000–10,000,
carrier and provider failover verified under load, incident runbooks rehearsed.

---

## v1.5 — Native clients 🔺

**Trigger:** either the installed-vs-browser retention gap is large enough to
justify it (see [Metrics §2.8](metrics-and-instrumentation.md#28-web-first-validation-)),
or v1 passes its gates and native is the obvious next investment.

**Scope:** Android and iOS clients against the unchanged v1 API. Native camera,
native push, real background sync, app-store presence. Language activation
(Igbo/Yoruba/Hausa) lands here if soft-launch data justifies accelerating it.

**Open:** React Native versus a wrapper (Capacitor/TWA) around the existing web
build — [OQ-11](open-questions.md). The wrapper is far cheaper and recovers store
presence and push; React Native recovers native feel. The answer depends on what
the v1 data says users actually missed.

**The API's job in v1 is to make this a client project.** Every endpoint that
assumes a browser is a v1.5 tax — this is what "prove the API is client-agnostic"
in [PRD §3.1](prd-v1-web.md#31-v1-goals) means in practice.

---

## Deferred to v2 — reference

Roadmap-level only. Each needs its own PRD before it is built; nothing below is a
committed requirement.

### F05 — Voice, video and conference calls
Real-time VoIP with GSM fallback and multi-party conferencing. Its own significant
infrastructure investment: telephony gateway integration, adaptive quality,
recording and consent handling, and on web, WebRTC across browser variance. Not
required to validate the core loop. **v1 should instrument call intent** so v2
sequencing is evidence-based.

### F07 — Marketplace, seller side
Seller verification (NIN/CAC/bank statement validation), a human product-vetting
workflow, and a store-management surface. A distinct product with its own trust
and operational requirements, including headcount for vetting.

### F08 — Marketplace, buyer side
Browsing, wishlist, inquiries, purchase flow. Directly dependent on F07 — no
seller supply, nothing to serve. Ships alongside or after F07, never before.

### F09 — Pro Account subscriptions
Personal Pro and Business Pro. Monetizes visibility and marketplace tools that do
not exist until F07/F08 land. Business Pro is explicitly marketplace-linked.
v1 already reserves the placeholder fields (verification badge, external link).

### F10 — Advertising system
Geo-targeted ads. Highest-value formats (product boosts, Business Pro story
campaigns) assume marketplace and Pro. Building it earlier means monetization
infrastructure with no inventory to sell against.

### Also v2
90-second video · tagged-in-stories profile section · Business/Verified-Business
ranking track · verified-publisher long-form articles · burst-upload capacity
handling.

---

## Dependency map

```
M0 Foundations
 └─ geo reference data ──┬─────────────────────────────────┐
                         │                                 │
M1 Identity ─────────────┴─ M2 Feed ──┬── M3a Profile/Stories ──┐
                                      │        │                │
                                      └── M3b Chat ◄────────────┘
                                               │   (FR-03.5 seam)
                                               │
                          M4 Explore/Settings/Notifications/Moderation
                                               │
                                     M4 Soft launch (1 state)
                                               │
                                     M5 National rollout
                                               │
                                     ── v2 gate ──► v1.5 / v2
```

**Hard dependencies**

| This | needs |
|---|---|
| Everything | geo reference data (M0) |
| Feed tiering, ranking eligibility | user location + account age (M1) |
| Story reaction → DM (FR-03.5) | chat message-send path (M3b) |
| Weekly awards (FR-02.4) | engagement scoring (M2) |
| SMS relay (FR-04.2b) | push reachability state (M4 notifications) |
| Explore rankings (F06) | scoring + 30-day account age rule |
| National rollout | soft-launch evidence, not a date |

---

## What can be cut if v1 must shrink

In order of what to drop first. Every item is a **Could** or **Should** in the
PRD — no Must appears here, by construction.

1. **Google Sign-In (FR-12.5)** — already flagged as conditional. Phone/OTP only.
2. **Remove-follower-silently (FR-11.4)** — the only Could in settings.
3. **Public sticker packs (FR-04.4)** — keep personal sticker creation, which is
   the differentiator; publishing and search are the amplifier.
4. **Story viewer lists (FR-03.3)** and **@mentions in stories (FR-03.4)**.
5. **Pinned posts (FR-02.2)**.
6. **Ring detection (FR-06.7)** — ship the simpler integrity rules (FR-06.4/06.6),
   add ring detection post-launch when there is real gaming data to tune against.
7. **PWA cache reporting (FR-11.6)**.

**Do not cut:** the performance budget, the offline outbox, moderation, NDPA
compliance, or the thin-tier fallback. Each of those is load-bearing for either a
Must requirement or the launch itself, and each is far more expensive to retrofit
than to build.
