# Metrics and Instrumentation

**Status:** Active · **Owner:** Product + Data · **Last updated:** 2026-09-05

This document turns the KPI list in [PRD §3.3](prd-v1-web.md#33-success-metrics)
into something buildable: the events behind each metric, the questions each metric
is actually answering, and the gate that decides whether v2 gets funded.

> **Targets are unset.** Every metric below needs a launch target from the founding
> team — [OQ-2](open-questions.md). A metric without a target is a number, not a
> decision tool. Setting them is a prerequisite for the soft launch, not the
> national one.

---

## 1. The one question v1 exists to answer

> **Does organising a social feed by Nigeria's own geography produce better
> engagement and retention than a national feed would?**

Everything else is supporting evidence. If v1 ships and this question is still
unanswered, v1 failed regardless of how the other numbers look.

**How it gets answered:** by comparing engagement and D7/D30 retention across
users segmented by the density of their local tier at signup. A user in a
well-populated LGA and a user in a thin one are running two different experiments
for us at no extra cost.

| Cohort | What it tells us |
|---|---|
| Users whose LGA had ≥ 200 active users at signup | The geo bet under favourable conditions — the ceiling |
| Users whose LGA had 20–199 | The realistic middle case |
| Users whose LGA had < 20 | Whether the tier fallback (FR-01.11) is enough, or whether thin local means dead product |

If retention is flat across all three, geography is not the driver and the
differentiator is weaker than assumed. That is a finding worth having early.

---

## 2. Metric definitions

### 2.1 North-star and health

| Metric | Definition | Source events |
|---|---|---|
| **DAU / MAU by feed tier** | Distinct users with ≥1 `feed_viewed` per tier, daily over monthly | `feed_viewed` |
| **D1 / D7 / D30 retention** | Share of a signup cohort with any session on day 1/7/30 | `session_started` |
| **Sessions per DAU** | Mean sessions per active user per day | `session_started` |
| **Feed depth** | Median posts rendered per feed session | `feed_page_loaded` |

### 2.2 The geo bet

| Metric | Definition | Why |
|---|---|---|
| **Tier engagement share** | Distribution of `post_engaged` across National/State/LGA/Town | If ~all engagement is National, the hierarchy is decoration |
| **Tier switch rate** | Share of sessions with ≥1 `feed_tier_switched` | Whether users actually use the control (FR-01.3) |
| **State-follow adoption** | Share of users following ≥1 extra state (FR-01.5) | Whether cross-state interest is real |
| **Thin-tier fallback rate** | Share of tier loads served via FR-01.11 fallback | Direct measure of the empty-tier risk |
| **Default-tier prompt acceptance** | Accept rate when the FR-01.4 prompt fires | Whether users want local as home |

### 2.3 Content quality

| Metric | Definition | Why |
|---|---|---|
| **Active engagement ratio** | (saves + shares) ÷ (qualifying views) | PRD §3.3's "quality vs. passive scrolling" |
| **Save rate**, **Share rate** | Per impression | The two heaviest ranking weights (4 and 3) |
| **Post creation rate** | Posts per DAU | Supply side of the loop |
| **Creator concentration** | Share of posts from top 1% of posters | Early warning that the feed is a broadcast, not a community |

### 2.4 Stories → chat funnel

The PRD's explicit design intent (F03 rationale) is that stories feed the chat
product. This is the check.

| Metric | Definition |
|---|---|
| **Story reaction rate** | `story_reacted` ÷ `story_viewed` |
| **Reaction→DM conversion** | Share of `story_reacted` producing a `message_sent` reply from the poster |
| **Reaction→conversation** | Share producing ≥3 messages exchanged within 24h — the real signal |
| **Highlight save rate** | `story_highlighted` ÷ `story_posted` |

### 2.5 Chat and the resilience bet 🔺

Reframed from the PRD's "SMS fallback trigger rate" to match the FR-04.2 redesign.

| Metric | Definition | Why |
|---|---|---|
| **Outbox queue rate** | Share of messages entering local outbox before send | How often the network actually fails users |
| **Outbox flush success** | Share of queued messages delivered on reconnect | Whether sender-side resilience works |
| **Outbox flush latency** | p50/p95 from reconnect to delivered | |
| **SMS relay trigger rate** | Share of 1:1 messages triggering relay (FR-04.2b) | How often recipients are unreachable |
| **SMS relay → return rate** | Share of relays followed by a session within 1h | **Whether the relay is worth its cost.** If nobody returns, the spend is waste |
| **SMS cost per active user** | Naira per DAU per day | Feeds the NFR-14 circuit breaker |
| **Duplicate message rate** | Messages deduplicated by idempotency key (FR-04.8) | Should be non-zero (replay happens) but stable |

### 2.6 Sticker/GIF — the viral mechanic

| Metric | Definition |
|---|---|
| **Creator rate** | Share of chat users creating ≥1 sticker |
| **Pack publish rate** | Share of creators publishing publicly (FR-04.4) |
| **Public pack install rate** | Installs per published pack |
| **Sticker send share** | Share of chat messages that are stickers |
| **Viral coefficient** | New sticker creators attributable to an installed public pack ÷ pack creators |

### 2.7 Recognition loop

| Metric | Definition | Why |
|---|---|---|
| **Weekly picture participation** | Share of WAU uploading a weekly picture | The core habit |
| **Week-over-week repeat participation** | Share who participate in consecutive weeks | Whether it is a *habit* or a novelty |
| **Badge holder retention lift** | D30 of badge winners vs. matched non-winners | Whether recognition actually retains |
| **Explore session share** | Share of sessions touching Explore | Whether P3 has somewhere to live |
| **Ranking exclusion rate** | Accounts excluded by FR-06.4/06.5/06.7 | Gaming pressure |

### 2.8 Web-first validation 🔺

**These metrics exist only because of [ADR-0001](../04-decisions/0001-web-first-delivery.md)
and are the evidence that either vindicates it or triggers pulling v1.5 forward.**

| Metric | Definition | Decision it drives |
|---|---|---|
| **PWA install rate** | Share of returning users who install to home screen | Whether users accept web as "the app" |
| **Installed vs. browser-only D7** | Retention split by install state | If the gap is large, native likely helps — but beware selection bias; installers were already more engaged |
| **Return-visit source** | Home screen vs. link vs. browser history | Whether the install actually changes behaviour |
| **p75 LCP on the feed route**, by connection class | Field data, not lab | NFR-7 compliance |
| **Median session data transfer** | KB per session | P4's data cost |
| **Push permission grant rate**, by platform | | Sizes the push-unreachable population feeding FR-04.2b |
| **iOS degraded-experience share** | Share of sessions on iOS Safari | Sizes the cost of the ADR-0001 iOS trade-off |

### 2.9 Onboarding

| Metric | Definition |
|---|---|
| **Step-level drop-off** | Completion by each of the 6 screens (FR-12.1) |
| **OTP delivery success / time-to-delivery** | Per provider |
| **Pre-signup browse → signup conversion** | The FR-12.7 bet |
| **Signup resume rate** | Share of FR-12.8 resumptions completing |
| **Age-gate rejection rate** | Under-16 blocks (FR-12.3) |
| **Google Sign-In share** | If FR-12.5 ships — sizes what descoping would cost |

### 2.10 Trust and safety ⚠️

| Metric | Definition |
|---|---|
| **Report rate** | Reports per 1,000 posts / messages |
| **Time to first review** | p50/p95 queue latency — targets in [OQ-10](open-questions.md) |
| **Enforcement rate by action** | Removal / exclusion / suspension / ban |
| **Appeal rate and overturn rate** | Overturn rate is a moderation-quality signal |
| **Block rate** | Blocks per 1,000 conversations |

### 2.11 Commerce intent proxies

Not v1 features — instrumentation that makes the v2 marketplace argument
evidence-based rather than assumed. Cheap to add now, impossible to backfill.

| Proxy | How |
|---|---|
| **Price-pattern messages** | Share of DMs matching price/product patterns (aggregate counts only, never content storage — see privacy note below) |
| **Selling-intent posts** | Posts matching sale patterns, aggregate |
| **Call-intent taps** | Taps on a visible, disabled call affordance (see [Scope](scope-and-non-goals.md#voice-video-and-conference-calling-f05)) |
| **Profile → DM rate** | Proxy for informal transaction initiation |

> **Privacy constraint.** These proxies must be computed as counts at the point of
> classification and must never persist message content, matched substrings, or
> per-message classifications tied to an identifiable user. Anything else is a
> purpose-limitation breach under NDPA (NFR-11) and destroys the trust the whole
> product is built on. If the pattern matching cannot be done without storing
> content, do not build it.

---

## 3. Event taxonomy

Naming: `object_verbPast`, snake_case. Every event carries the base payload.

**Base payload on every event**

```jsonc
{
  "event": "post_engaged",
  "ts": "2026-09-05T14:22:31.004Z",   // client time, ISO-8601 UTC
  "serverTs": "...",                   // server stamps on receipt; use this for analysis
  "sessionId": "…",
  "userId": "…",                       // null pre-signup
  "anonId": "…",                       // stable pre-signup id, merged on signup
  "app": { "version": "1.0.3", "build": "…", "installed": true },
  "device": { "platform": "web", "os": "Android 12", "browser": "Chrome 130",
              "viewport": "360x780", "dpr": 2 },
  "network": { "effectiveType": "3g", "saveData": true },
  "geo": { "stateCode": "EN", "lgaCode": "EN-ENN", "townId": "…" }  // registered, never device
}
```

**Core events**

| Domain | Events |
|---|---|
| Session | `session_started`, `session_ended`, `app_installed`, `install_prompt_shown`, `install_prompt_dismissed` |
| Onboarding | `signup_started`, `signup_step_completed`, `otp_requested`, `otp_verified`, `otp_failed`, `signup_completed`, `signup_abandoned`, `signup_resumed`, `age_gate_blocked`, `consent_recorded` |
| Feed | `feed_viewed`, `feed_page_loaded`, `feed_tier_switched`, `feed_fallback_served`, `post_impressed`, `post_viewed_qualifying` (≥3 s), `post_engaged` (`{action: save\|share\|comment\|like}`), `post_created`, `post_upload_failed` |
| Stories | `story_posted`, `story_viewed`, `story_reacted`, `story_highlighted`, `story_expired` |
| Chat | `conversation_opened`, `message_composed`, `message_queued`, `message_sent`, `message_delivered`, `message_read`, `message_deduplicated`, `sms_relay_triggered`, `sms_relay_delivered`, `sticker_created`, `pack_published`, `pack_installed` |
| Recognition | `weekly_picture_uploaded`, `badge_awarded`, `banner_awarded`, `explore_viewed`, `ranking_excluded` |
| Notifications | `push_permission_requested`, `push_permission_result`, `notification_sent`, `notification_batched`, `notification_opened` |
| Trust | `content_reported`, `account_blocked`, `enforcement_applied`, `appeal_submitted` |
| Settings | `setting_changed`, `data_export_requested`, `account_deletion_requested`, `consent_withdrawn` |

**Rules**

1. **Server-side wherever the truth is server-side.** Ranking-relevant engagement
   is recorded by the API, not trusted from the client. Client analytics events
   are for behaviour, never for scoring.
2. **`serverTs` for analysis.** Client clocks on cheap Android phones are wrong
   often enough to matter.
3. **Batch and compress the client queue,** flush on visibility change, and never
   let analytics compete with content for bandwidth. Drop events before degrading
   the feed — P4's data plan outranks our dashboard.
4. **No PII in event payloads.** No phone numbers, no message content, no free
   text. Ids only.
5. **Every new event is registered in this document** in the same PR that emits it.
   An undocumented event is an unusable event six weeks later.

---

## 4. The v2 gate

[OQ-3](open-questions.md) asks what threshold triggers v2 development. This is the
proposed shape of the answer; the numbers are for the founding team to set.

**v2 development starts when, sustained over 4 consecutive weeks:**

| Gate | Metric | Target |
|---|---|---|
| G1 — *People come back* | D30 retention | _TBD_ |
| G2 — *Geography is the reason* | Engagement share from State+LGA+Town tiers combined | _TBD_ (must exceed National, or the differentiator is unproven) |
| G3 — *The loop is self-sustaining* | Post creation rate per DAU, non-declining | _TBD_ |
| G4 — *Chat holds up* | Outbox flush success | ≥ 99% |
| G5 — *Safety is under control* | p95 time to first review | Within [OQ-10](open-questions.md) target |

**If G1–G3 are met:** fund v2, and use tier and commerce-proxy data to sequence
marketplace vs. calls ([OQ-4](open-questions.md)).

**If G2 fails while G1 passes:** the product retains but geography is not why.
That is a strategy finding, not a failure — it means the marketplace bet and the
geo bet need re-weighting before v2 money is committed.

**If G1 fails:** do not fund v2. Fix the fundamentals or stop.

---

## 5. Implementation notes

- **Analytics store:** not yet chosen. Requirements: cheap at Nigerian data
  volumes, self-hostable or regionally hosted for NDPA comfort, tolerant of
  duplicate events. Track under [OQ-6](open-questions.md)'s infrastructure
  decisions.
- **Cohorting is by signup week and LGA density band**, computed at signup time
  and stored on the user record — density changes, and retroactive cohorting
  against a changed denominator produces nonsense.
- **Dashboards before launch, not after.** The soft launch is worthless if nobody
  can see the numbers during it. Minimum: retention curves, tier engagement split,
  outbox/relay health, moderation queue depth.
- **Instrument the failure paths.** `post_upload_failed`, `otp_failed`,
  `message_queued` are more informative in the first month than any success
  metric.
