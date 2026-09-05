# WeNaija — Product Requirements Document

## v1 Fundamentals · Web-First

| | |
|---|---|
| **Document status** | Active — in development |
| **Version** | 1.2 (web-first delivery) |
| **Date** | 2026-09-05 |
| **Supersedes** | WeNaija PRD v1.1 (`WeNaija_PRD_v1_fundamentals.docx`, August 2026) |
| **Product owner** | Festus Udealor Onyeka, WeNaija Founder |
| **Platform (v1)** | **Mobile-first responsive web (PWA)** — native Android/iOS follow in v1.5/v2 🔺 |
| **v1 scope** | Geographic Feed, Profile, Stories, Chat, Rankings & Explore, Settings, Onboarding, Notifications, Moderation |
| **Deferred to v2** | Calls, Marketplace (seller + buyer), Pro Subscriptions, Advertising — see [Roadmap](roadmap.md) |
| **Source input** | WeNaija Developer Feature Specification v1.0 (confidential) |
| **Classification** | 🔒 Confidential — authorised use only |

> 🔺 marks a deliberate deviation from source PRD v1.1.
> ⚠️ marks a requirement added here because the source PRD did not cover it.
> Both are itemised in [Appendix A](#appendix-a--deviation-register-from-source-prd-v11).

---

## 1. Overview

WeNaija is a mobile-first super-app for the Nigerian market, organised around
Nigeria's own geographic hierarchy (National → State → LGA → Town/City). This
document scopes v1 to the fundamentals of that social product — feed, profile,
stories, chat, rankings, settings, onboarding, and notifications — deliberately
excluding commerce, calling, and monetization so the team can validate the core
social loop before investing in the heavier features that build on top of it.

**v1 ships as a mobile-first responsive web application, installable as a PWA.**
The product is designed for a phone screen first and always; the browser is
simply the delivery vehicle that gets it into Nigerian hands fastest, with no app
store gatekeeping, no install friction on low-storage devices, and same-day
iteration. Native Android and iOS clients remain part of the plan and consume the
same API, which is why the API is specified independently of the web client
throughout these docs. See [ADR-0001](../04-decisions/0001-web-first-delivery.md).

Calls, the marketplace (both sides), Pro subscriptions, and the advertising
system remain part of the product's full vision and are detailed at a roadmap
level in [Roadmap §Deferred](roadmap.md#deferred-to-v2--reference), ready to be
scoped into full PRDs once v1 validates demand for the fundamentals.

---

## 2. Problem Statement

Nigerian users are currently served by global social platforms that were not
designed for Nigeria's network conditions or hyper-local social structure. Three
gaps define the v1 scope:

1. **Discovery is not local.** Global feeds rank globally or nationally; they do
   not organise content the way Nigerians actually think about community — state,
   LGA, town.
2. **Core communication is not resilient to real network conditions.** Messaging
   assumes stable connectivity that large parts of Nigeria do not reliably have,
   and lacks a distinctly Nigerian content layer.
3. 🔺 **Access itself is a barrier.** Entry-level Android devices are storage- and
   data-constrained; a 40–80 MB install is a real cost against a competing app
   already on the phone. A web client that opens from a link and installs to the
   home screen for under 1 MB of transfer removes that barrier entirely for the
   validation phase.

A fourth gap — the lack of trust infrastructure in Nigerian e-commerce — is real
and part of WeNaija's long-term thesis, but is intentionally out of scope for v1
(see [Scope & Non-Goals](scope-and-non-goals.md)) until the social product has
proven it can attract and retain users on its own.

---

## 3. Goals and Success Metrics

### 3.1 v1 Goals

- Validate the **geo-tiered feed** as a genuine discovery advantage before
  investing further engineering in it.
- Ship a **chat product resilient to real Nigerian network conditions**, with at
  least one distinctive, shareable content mechanic (sticker/GIF creation).
- Build early **habitual engagement** through low-effort recognition loops
  (weekly picture, star badges) without polluting the core feed with competitive
  noise.
- Establish the **identity, settings, and notification foundations** that every
  later feature (marketplace, calls, monetization) will build on, so v2 is
  additive rather than a rework.
- 🔺 Prove the **API surface is client-agnostic**, so native clients in v1.5/v2
  are a client project, not a backend project.

### 3.2 Explicitly Not v1 Goals

- v1 does not aim to generate revenue. Pro subscriptions and advertising are the
  monetization layer and are deferred to v2; this is a deliberate trade-off to
  keep v1 lean, not an oversight.
- v1 does not aim to solve commerce trust or replace voice/video calling apps —
  both are validated as later bets, not launch requirements.
- 🔺 v1 does not aim to match native app performance on every axis. It aims to be
  fast enough on a 3G connection and a ₦40,000 Android phone that users do not
  notice they are in a browser.

### 3.3 Success Metrics

These KPIs are the v1 evaluation framework. **Concrete targets must be assigned
by the founding team before launch** — see [OQ-2](open-questions.md). Full event
taxonomy in [Metrics & Instrumentation](metrics-and-instrumentation.md).

| Metric | What it validates |
|---|---|
| DAU/MAU by feed tier (National/State/LGA/Town) | Whether the geo-localisation bet is actually driving engagement |
| Share of engagement from saves/shares vs. passive views | Content quality vs. passive scrolling |
| Story-reaction-to-DM conversion rate | Whether Stories is successfully feeding the chat product as designed |
| Sticker/GIF creation & public-pack share rate | Viral coefficient of the chat flagship feature |
| Weekly-picture participation rate | Whether the recognition loop is actually pulling users back weekly |
| Undelivered-message SMS relay rate and successful-delivery rate 🔺 | Whether the network-resilience bet is working in practice |
| D1/D7/D30 retention | Baseline health signal to justify investing in v2 |
| 🔺 PWA install rate; return-visit rate installed vs. browser-only | Whether the web-first bet holds, and what native would actually add |
| 🔺 p75 Largest Contentful Paint on 3G, and median session data transfer | Whether the product is usable at the network and cost reality of the market |

---

## 4. Non-Goals (Out of Scope for v1)

These are deliberate v1 exclusions, not gaps. Full reasoning per item in
[Scope & Non-Goals](scope-and-non-goals.md).

- **Marketplace** — both seller side (store creation, verification, product
  vetting) and buyer side (browsing, wishlist, purchase flow).
- **Voice, video, and conference calling.**
- **Pro Account subscriptions** (Personal Pro and Business Pro).
- **The advertising system.**
- 🔺 **Native iOS and Android clients** — v1 is web-only. (Source PRD had this
  inverted: Android-only, web deferred.)
- **Active Igbo/Yoruba/Hausa localisation** — the language toggle ships in v1;
  translations activate in v2.
- **A dedicated "tagged in stories" profile section**; video beyond 60 seconds.
- 🔺 **End-to-end encryption for chat** — v1 uses transport encryption with
  encryption at rest. See [ADR-0007](../04-decisions/0007-no-e2ee-in-v1.md) for
  why, and for the constraint this places on v2.

---

## 5. Target Users

Scoped to the users v1's fundamentals actually serve; sellers, buyers,
advertisers, and Pro subscribers become relevant once v2 ships. Detail in
[Personas & JTBD](personas-and-jtbd.md).

| Segment | Primary need from v1 |
|---|---|
| General social users | A geographically relevant feed, stories, and chat that work reliably on their network |
| Diaspora Nigerians | Full social access without a Nigerian phone number |
| Creators / recognition seekers | Weekly and monthly recognition through badges and rankings, without a paid tier |
| 🔺 Low-spec device users | Access without spending storage or a data bundle on an install |

---

## 6. Assumptions and Dependencies

### 6.1 Assumptions

- Enough seed users exist per LGA/state at launch for local feed tiers to not
  feel empty — **unvalidated**, and the single biggest product risk. Mitigated by
  a soft launch in one state before national rollout
  ([Roadmap M4](roadmap.md#m4--soft-launch-single-state)).
- The social fundamentals are sufficient to drive retention on their own, ahead
  of any commerce or monetization hook.
- Deferring monetization to v2 is financially viable for the runway available —
  to be confirmed with the founding team ([OQ-1](open-questions.md)).
- 🔺 Nigerian users will accept a home-screen PWA as "the app". Partially
  evidenced by the market's familiarity with lite/web clients, but worth
  measuring from week one (see the PWA install-rate metric in §3.3).

### 6.2 External Dependencies

| Dependency | Used for | Failure posture |
|---|---|---|
| Africa's Talking SMS gateway | OTP delivery, undelivered-message SMS relay | OTP has a secondary provider; relay degrades silently to push-only |
| Firebase Cloud Messaging | Web push notifications | Degrades to in-app only; no user-visible error |
| SendGrid / Zoho Mail | Transactional email (account alerts, password reset) | Blocks password reset — needs a secondary provider before launch |
| Google Sign-In (OAuth) | Optional social auth at signup | Optional path; phone/OTP always available |
| Object storage + CDN | Media storage and delivery | Hard dependency. Provider not yet chosen — [OQ-6](open-questions.md) |

---

## 7. Functional Requirements

Requirements are grouped by feature area and prioritised using MoSCoW: **Must**
(launch-blocking), **Should** (expected at launch, workable if slipped a
release), **Could** (valuable, first cut if v1 needs to shrink). Each area
carries the user stories it exists to serve and the acceptance criteria a build
should be validated against.

Requirement IDs are inherited unchanged from source PRD v1.1 wherever the
requirement is unchanged, so the two documents can be diffed. New requirements
take new numbers in the same series.

---

### 7.1 F01 — Geographic Feed

**Core Platform**

A single undifferentiated national feed does not reflect how Nigerians actually
organise their social world — by state, LGA, and town. Without geographic
structure, local content is drowned out by national volume and the platform loses
its main differentiator against global incumbents.

#### User Stories

- As a new user, I see relevant content immediately without having to build a
  following first.
- As a user, I can move between National, State, LGA, and Town/City views on demand.
- As a user, I can follow states beyond my own to stay connected to more than one
  community.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | The feed shall support four geographic tiers — National, State, LGA, Town/City — each with an independent ranking calculation. | Must |
| FR-01.2 | New accounts shall default to the National feed on first load. | Must |
| FR-01.3 | Users shall be able to switch tiers at any time via a persistent control; the toggle shall remain available even after any default-tier prompt. | Must |
| FR-01.4 | Once total platform users reach 5,000–10,000, the system shall prompt users to set their State feed as default (opt-in, reversible). | Should |
| FR-01.5 | Users shall be able to follow up to 2 states beyond their home state; followed-state content shall be weighted equally with home-state content in the blended feed. | Must |
| FR-01.6 | Content from states outside a user's home + 2 followed states shall only be reachable via the National feed. | Must |
| FR-01.7 | The feed shall support text (≤500 characters), photo (≤10 images), video (≤60 seconds), and reshared posts as content types. | Must |
| FR-01.8 | All video uploads shall pass through adaptive-bitrate compression tuned for low-bandwidth conditions before publishing. | Must |
| FR-01.9 | Post ranking within a tier shall be computed from a weighted engagement score combining save, share, comment, like, and qualifying-view signals. | Must |
| FR-01.10 🔺 | Feed ranking shall apply time decay so that a high-scoring post cannot occupy a tier indefinitely. Decay parameters are specified in the [Feed & Ranking Spec](../03-engineering/feed-ranking-spec.md). | Must |
| FR-01.11 🔺 | An empty or thin tier (fewer than 10 ranked posts) shall fall back to the next-broader tier with a visible label explaining the substitution, rather than rendering an empty feed. | Must |
| FR-01.12 🔺 | The feed shall be paginated by cursor and render progressively; a user on a 3G connection shall see first content without waiting for the full page. | Must |

**Engagement scoring weights** (unchanged from v1.1):

| Action | Weight | Rationale |
|---|---|---|
| Save | 4 | Strongest intent signal |
| Share | 3 | Public endorsement |
| Comment | 2 | Active engagement |
| Like | 1 | Passive engagement |
| View | 0.1 | Only counted past 3 seconds on-screen |

#### Acceptance Criteria

- A new install opens on the National feed with the tier switcher visible.
- Following exactly 2 additional states blends their content with equal weight to
  the home state.
- Any video over 60 seconds is rejected or trimmed at capture, not at review.
- 🔺 A tier with fewer than 10 posts renders the broader tier's content with a
  labelled explanation, never an empty state without content.
- 🔺 On a throttled Fast 3G profile, the National feed reaches Largest Contentful
  Paint within 3 seconds on a mid-tier Android device.

> Verified-publisher long-form articles and election-driven burst-upload handling
> are tied to the platform's growth/media ambitions rather than the core loop;
> deferred to v2 alongside the other heavier features so v1 can ship a simpler,
> hardened upload path.

---

### 7.2 F02 — Profile Page

**Identity & Retention**

Retention on social platforms is driven by recognition loops. Without a
structured way for users to compete for and display local status, there is no
mechanism pulling users back week over week.

#### User Stories

- As a user, I want a profile that credibly represents who I am and what I've posted.
- As a user, I want a low-effort weekly ritual (uploading one picture) that can
  earn me visible recognition.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | Every account shall have a public profile displaying picture, name, location, bio, follower/following counts, post count, and a reverse-chronological post grid. | Must |
| FR-02.2 | Users shall be able to pin up to 3 posts above the main grid. | Should |
| FR-02.3 | Every profile shall have one weekly-picture slot, editable at any point during the week. | Must |
| FR-02.4 | The system shall calculate weekly-picture winners automatically at a fixed weekly cutoff (**Sunday 23:59:59 WAT / UTC+1** 🔺), using weighted engagement on the weekly-picture post only. | Must |
| FR-02.5 | Winners shall receive a tier-appropriate badge (city/state/national) and, for state/national, a 24-hour feature placement. | Must |
| FR-02.6 | Users shall be able to opt out of winner notifications independently of whether they keep earning badges. | Should |
| FR-02.7 | The system shall calculate a Monthly Top Creator per region from cumulative weekly scores across 4 weeks, displayed as a profile banner until replaced. | Must |
| FR-02.8 🔺 | Weekly and monthly calculations shall be idempotent and replayable: re-running a cutoff for a given period shall produce the same result and shall not re-issue notifications or duplicate badges. | Must |
| FR-02.9 🔺 | Where a tier has fewer than 5 eligible weekly-picture entries, no winner shall be declared for that tier and period, rather than crowning an uncontested entry. | Should |

**Weekly award tiers** (unchanged):

| Tier | Coverage | Reward |
|---|---|---|
| City | Top picture in registered city | Badge + opt-in message |
| State | Top picture statewide | Badge + message + 24h State Explore feature |
| National | Top picture nationwide | Badge + message + 24h National feed feature |

#### Acceptance Criteria

- Weekly winners are computed with no manual intervention, every week, on schedule.
- A user who opts out of notifications still receives and displays any badge earned.
- A user can simultaneously hold a weekly badge and a Monthly Top Creator banner.
- 🔺 Re-running the Sunday job produces zero duplicate badges and zero repeat
  notifications.

> The verification badge and the one-external-link profile field are Pro-account
> perks; since Pro is deferred to v2, those fields are inactive placeholders in
> v1, not built-out requirements.

---

### 7.3 F03 — Stories and Status

**Engagement**

Ephemeral content formats are a baseline social expectation, and their value to
WeNaija specifically is as a funnel into chat — a story that only lives on its own
screen does not feed the messaging product it needs to strengthen.

#### User Stories

- As a user, I want to share time-limited updates without cluttering my permanent
  profile.
- As a viewer, I want a low-friction way to respond to someone's story that turns
  into a real conversation.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | The system shall support photo, video (≤60s), text (≤150 chars), and voice (≤60s) story formats, each expiring 24 hours after posting. | Must |
| FR-03.2 | Users shall be able to save any of their own stories to a permanent Highlights collection before expiry. | Must |
| FR-03.3 | Story posters shall be able to see a list of viewers. | Should |
| FR-03.4 | Users shall be able to tag other accounts in a story via @mention, generating a notification and a tappable in-story link for the tagged account. | Should |
| FR-03.5 | A viewer reaction (emoji or short text) to a story shall be delivered as a direct message to the story's poster, not as a standalone reaction object. | Must |
| FR-03.6 🔺 | Story capture on web shall use the device camera via `getUserMedia` where available, and shall always offer file upload as a fallback for browsers or permission states where camera capture is unavailable. | Must |
| FR-03.7 🔺 | Expiry shall be enforced at read time as well as by the cleanup job, so that a delayed job never exposes an expired story. | Must |

#### Acceptance Criteria

- Every story format expires at exactly 24 hours with no manual cleanup required.
- A Highlight saved before expiry is retrievable indefinitely until the user deletes it.
- Reacting to a story always produces a message the poster can see and reply to in
  their inbox.
- 🔺 With the cleanup job halted, a story past 24 hours returns 404 to every
  reader including its author's followers.

#### Out of Scope (v1)

- A dedicated "tagged in stories" section on the profile.

---

### 7.4 F04 — Chats and Messaging

**Core Platform**

Messaging is the highest-frequency surface on any social app, and Nigerian users
regularly lose connectivity mid-conversation. A chat product that silently fails
on poor networks will lose trust fast; a chat product with no distinctive content
layer (stickers/GIFs) will not out-compete WhatsApp on its own turf.

#### User Stories

- As a user, I want confidence that my message gets through even on a bad connection.
- As a user, I want to express myself with Naija-specific content, not just
  generic stickers.
- As a group admin, I want enough control to manage a large community chat safely.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | Chats shall support text, images, voice notes (≤10 min), video (≤60s), location, stickers, GIFs, and documents (≤20MB). | Must |
| FR-04.2 🔺 | **Reframed for web.** Message delivery shall be resilient to poor networks in two directions: **(a) sender-side** — a message composed while offline or on a failing connection shall be persisted to a local outbox and transmitted automatically when connectivity returns, with a visible `queued → sending → sent` state; **(b) recipient-side** — where a 1:1 message remains undelivered past a configurable threshold (default 90 seconds) and the recipient is neither socket-connected nor push-reachable, the server shall relay an SMS notification to the recipient via Africa's Talking, subject to per-user daily cost caps. The sender shall see that an SMS relay occurred. | Must |
| FR-04.3 | Users shall be able to create a sticker or GIF from a video clip (≤5s) with up to 2 lines of text overlay, saved to a personal sticker pack usable across all chats. | Must |
| FR-04.4 | Users shall be able to publish a sticker pack publicly, and public packs shall be searchable by name or keyword. | Should |
| FR-04.5 | Disappearing messages, message pinning, and chat pinning shall be configurable per chat, off by default. | Should |
| FR-04.6 | Message reactions and read receipts shall be on by default and user-controllable. | Should |
| FR-04.7 | Group chats shall support up to 500 members with admin controls for membership, permissions, and metadata. | Must |
| FR-04.8 🔺 | Every message shall carry a client-generated idempotency key; the server shall deduplicate on it so that outbox replay after reconnection cannot produce duplicate messages. | Must |
| FR-04.9 🔺 | SMS relay shall never be used for group messages, and its content shall be limited to a sender name and a deep link — never the message body — to avoid leaking message content to an unauthenticated channel. | Must |
| FR-04.10 ⚠️ | Users shall be able to block another account and report a conversation; a block shall prevent messaging, story visibility, and profile interaction in both directions. | Must |

#### Acceptance Criteria

- 🔺 A message composed with the network disabled shows `queued`, and delivers
  automatically within 10 seconds of connectivity returning, exactly once.
- 🔺 A 1:1 message to a recipient with no socket and no push token triggers exactly
  one SMS relay after the threshold, containing no message body.
- The sticker/GIF creation flow rejects clips longer than 5 seconds and text
  overlays beyond 2 lines.
- A public sticker pack is discoverable by keyword search from another account.
- Group membership cannot exceed 500, enforced server-side.
- ⚠️ A blocked account cannot send messages, view stories, or see the blocker's
  profile, verified from both sides.

> **Why FR-04.2 changed.** A web page cannot originate an SMS from the user's
> device — there is no browser API for it, and a `sms:` link only opens the
> native composer with the user's own credit and consent. The source PRD's
> mechanism assumed an Android process with `SEND_SMS`. The *user-facing promise*
> — "my message gets through" — is preserved and arguably strengthened, because
> the redesign covers recipient-side unreachability too, which the original did
> not. Full analysis in [ADR-0005](../04-decisions/0005-sms-fallback-on-web.md)
> and [Realtime, Offline & Delivery](../03-engineering/realtime-offline-delivery.md).

---

### 7.5 F06 — Rankings and Explore Tab

**Engagement Integrity**

Leaderboard mechanics drive engagement but, left unchecked, invite gaming and
clutter the core experience. The product needs competitive recognition without
compromising the cleanliness of the main feed or the integrity of the scores.

#### User Stories

- As a user, I want to discover what's trending in my area without my main feed
  turning into a leaderboard.
- As a platform operator, I need rankings that can't be trivially gamed by new or
  bot accounts.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | No ranking, leaderboard, or trending content shall be injected into the main feed; it shall be confined to the Explore tab and profiles. | Must |
| FR-06.2 | The Explore tab shall surface top topics, top profiles, and hyper-local ("Near You") content, filterable by City/State/National. | Must |
| FR-06.3 | The system shall assign gold/silver/bronze badges weekly based on rank within a geographic tier, resetting every Monday (00:00 WAT 🔺). | Must |
| FR-06.4 | Accounts younger than 30 days shall be excluded from all ranking calculations. | Must |
| FR-06.5 | Accounts flagged for suspicious interaction patterns shall be temporarily excluded from rankings pending manual review. | Must |
| FR-06.6 | Self-interactions (liking or saving one's own content) shall not contribute to ranking scores. | Must |
| FR-06.7 🔺 | Reciprocal-engagement rings shall be detected: where two accounts' engagement with each other exceeds a configurable share of their total outbound engagement, those interactions shall be discounted in ranking. | Should |
| FR-06.8 🔺 | Ranking exclusion decisions shall be logged with reason and timestamp, and shall be reversible by an operator. | Must |
| FR-06.9 🔺 | "Near You" shall derive locality from the user's registered Town/LGA, not from device geolocation. Device location shall not be requested in v1. | Must |

#### Acceptance Criteria

- A sample crawl of the main feed contains zero leaderboard or ranking widgets.
- An account created 29 days ago does not appear in any leaderboard; the same
  account appears on day 31 if it qualifies.
- Self-likes are excluded from the score calculation at the data layer, verifiable
  via test accounts.
- 🔺 The app never triggers a browser geolocation permission prompt.

> The separate Business/Verified-Business ranking track is a marketplace-and-Pro-
> dependent rule; with both deferred to v2, all v1 accounts rank in a single track.

---

### 7.6 F11 — Settings

**Trust & Control**

Users need enough control over privacy, notifications, and data usage to trust the
platform with their attention and their data plan.

#### User Stories

- As a user, I want to manage privacy, notifications, and data usage without
  digging through menus.
- As a user, I want the option to secure my account with two-factor authentication
  even though it isn't required yet.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-11.1 | Settings shall provide dedicated Account, Privacy, Notifications, Display, Data & Storage, Security, and Support sections. | Must |
| FR-11.2 | Two-factor authentication shall be available and user-optional for all v1 accounts. | Should |
| FR-11.3 | Data Saver mode shall default to ON for new installs. | Should |
| FR-11.4 | Users shall be able to remove a follower without notifying them. | Could |
| FR-11.5 | Follow / be-followed shall apply uniformly to every account, public by default unless hidden in privacy settings; mutual follows shall unlock the Close Friends story tier. | Should |
| FR-11.6 🔺 | Data & Storage shall report the cache footprint held by the PWA and offer a one-tap clear, since browser storage is opaque to users in a way an app's storage entry is not. | Should |
| FR-11.7 ⚠️ | Account settings shall provide **data export** (a machine-readable copy of the user's own content and profile) and **account deletion** with a stated retention window, as required under the Nigeria Data Protection Act 2023. | Must |
| FR-11.8 ⚠️ | Users shall be able to view and withdraw consents given at signup, separately from deleting the account. | Must |

#### Acceptance Criteria

- 2FA can be turned on or off by any user from Settings → Security.
- A fresh install has Data Saver ON without user action.
- Removing a follower produces no notification to that follower.
- ⚠️ A deletion request removes or irreversibly anonymises the account's personal
  data within the documented window, verified against the retention schedule in
  [Security & Privacy](../03-engineering/security-privacy-compliance.md).

#### Out of Scope (v1)

- A Calls settings section (no calling feature in v1).
- Multi-account switching between personal and store accounts (no store accounts
  without the marketplace).
- Mandatory 2FA and ad-performance notification controls (both depend on
  Pro/Advertising, deferred to v2).
- Igbo/Yoruba/Hausa language activation (toggle ships in v1, languages activate in v2).

---

### 7.7 F12 — Onboarding and Signup

**Growth**

Signup friction is the single biggest lever on activation. The flow needs to be
short enough to not lose users, while still capturing the location and identity
data every other v1 feature (feed tiering, age-gating) depends on.

#### User Stories

- As a new user, I want to get into the app quickly without a long form.
- As a diaspora Nigerian, I want full access to the social features without a
  Nigerian phone number.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-12.1 | Personal signup shall be a 6-screen flow: Welcome, Sign up (with OTP), Location (State→LGA→Town), Interests (optional, ≤5), Profile setup (optional), Welcome/entry. | Must |
| FR-12.2 | State selection shall be mandatory before a user can proceed past the Location screen. | Must |
| FR-12.3 | The system shall collect date of birth and block account creation for users under 16. | Must |
| FR-12.4 | Diaspora users with international phone numbers shall receive full social features at signup. | Must |
| FR-12.5 | Google Sign-In shall be attempted as an auth option, bypassing manual signup and auto-filling name/email; it may be descoped from v1 if implementation cost is prohibitive. | Could |
| FR-12.6 | Transactional email (account alerts, password reset) and SMS (OTP, security, chat relay) infrastructure shall be live from day one. | Must |
| FR-12.7 🔺 | Content shall be **browsable before signup** on the National feed, in a read-only state, with the signup prompt triggered by the first interaction attempt. A web client is reached by link; forcing a wall before any content is a conversion loss a native app does not face. | Should |
| FR-12.8 🔺 | Signup progress shall survive a page reload or connection drop; a user who loses network at the OTP screen shall resume rather than restart. | Must |
| FR-12.9 ⚠️ | Signup shall present the Privacy Policy and Terms with explicit, recorded consent, capturing the policy version, timestamp, and consent method. | Must |
| FR-12.10 🔺 | The PWA install prompt shall be deferred until after first meaningful engagement, never shown on the welcome screen. | Should |

#### Acceptance Criteria

- An entered date of birth under 16 blocks account creation at the signup step.
- A diaspora phone number completes signup with the same feature access as a
  Nigerian number.
- Google Sign-In, where implemented, skips the manual sign-up screen entirely and
  auto-fills name/email.
- 🔺 Reloading the browser mid-signup resumes at the same step with entered data
  intact.

#### Out of Scope (v1)

- Seller/store onboarding, including document upload and delivery-agreement
  e-signature (no marketplace in v1).

---

### 7.8 F13 — Notifications System

**Retention & Trust**

Over-notifying users destroys trust and adoption; under-notifying on security
events (OTP, account alerts) creates real risk. The system needs a tiered model
that scales alert volume to event importance automatically, especially around
viral spikes.

#### User Stories

- As a user, I don't want a viral post to flood my phone with 200 separate alerts.
- As a user, I want security-critical alerts I can't accidentally silence.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-13.1 | Notifications shall route through three layers — in-app, push, and SMS — scaled to event urgency. | Must |
| FR-13.2 | SMS notifications for OTP and security alerts shall be non-disableable. | Must |
| FR-13.3 | The system shall batch reaction/comment notifications on a single post into one summary once volume exceeds 10 within a 1-hour window. | Must |
| FR-13.4 | Direct messages shall never be batched. | Must |
| FR-13.5 | New installs shall default to quiet hours of midnight–7am (WAT 🔺), user-adjustable. | Should |
| FR-13.6 🔺 | Push notification permission shall be requested contextually — at the moment a user takes an action whose value depends on it — never on first load. | Must |
| FR-13.7 🔺 | Where web push is unavailable or denied, all non-security notifications shall degrade to the in-app centre without error, and the account shall be marked push-unreachable for the SMS relay logic in FR-04.2. | Must |

#### Acceptance Criteria

- SMS toggles for OTP/security are absent or disabled in Settings — there is no way
  to turn them off.
- A test post crossing the 10-reactions-per-hour threshold produces exactly one
  batched notification, not individual ones.
- 🔺 A fresh session never triggers a notification permission prompt before the
  user has taken a notification-relevant action.

#### Out of Scope (v1)

- Incoming-call push notifications (no calling feature in v1).
- Store-inquiry, product-approval, and ad-performance notifications.
- Store broadcast messages (no store accounts in v1).

---

### 7.9 F14 — Content Moderation and Trust ⚠️ *New in v1.2*

**Trust & Safety**

The source PRD contains no moderation requirements. A user-generated-content
platform accepting photo, video, voice, and text from the open public cannot
launch without a reporting path, a review queue, and an enforcement ladder — not
because of a product ambition, but because the first abuse incident arrives within
days of the first thousand users, and because platform liability and app-store /
payment-partner readiness both depend on it. Full design in
[Moderation & Trust](../03-engineering/moderation-and-trust.md).

#### User Stories

- As a user, I want to report content or an account that violates the rules and
  know something happened.
- As a user, I want to block someone and stop hearing from them entirely.
- As an operator, I want a queue that tells me what to look at first.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-14.1 | Every post, comment, story, message, and profile shall be reportable, with a reason taxonomy. | Must |
| FR-14.2 | Reports shall enter a moderation queue prioritised by report volume, reporter trust, and content reach. | Must |
| FR-14.3 | Operators shall have an enforcement ladder: content removal, ranking exclusion, temporary suspension, permanent ban — each logged with actor, reason, and timestamp. | Must |
| FR-14.4 | Reporters shall receive an outcome notification when a report is resolved. | Should |
| FR-14.5 | Users shall be able to appeal an enforcement action once. | Should |
| FR-14.6 | Content published by an account under review shall be excluded from all ranked surfaces (feed tiers, Explore, weekly awards) pending resolution. | Must |
| FR-14.7 | Automated pre-screening of uploaded media against a CSAM hash set shall run before publication. | Must |
| FR-14.8 | A published set of Community Guidelines shall exist and be linked from signup, settings, and every report flow. | Must |

#### Acceptance Criteria

- A report submitted from any surface produces a queue item within 5 seconds.
- An account moved to `under_review` disappears from Explore and all tier feeds
  within one ranking cycle.
- Every enforcement action is reconstructable from the audit log alone.

---

## 8. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-1 | Video shall be adaptively compressed for low-bandwidth delivery; this is launch-blocking, not a later optimisation. | Must |
| NFR-2 🔺 | Message delivery shall be resilient in both directions per FR-04.2: local outbox on the sender side, SMS relay on the recipient side, both automatic and both visible in the UI. | Must |
| NFR-3 | SMS shall remain the mandatory, non-disableable channel for OTP and security alerts. | Must |
| NFR-4 | Minimum user age of 16 shall be enforced via collected date of birth at signup. | Must |
| NFR-5 | This document and the underlying developer specification shall be handled as confidential, authorised-use-only material. | Must |
| NFR-6 | The v1 data model for accounts, posts, and profiles shall not preclude adding marketplace, Pro, calling, or ad entities in v2 without a destructive migration. | Should |
| NFR-7 🔺 | **Performance budget.** On a mid-tier Android device over throttled Fast 3G: first-visit JS transfer ≤ 170 KB gzipped for the feed route; Largest Contentful Paint ≤ 3.0 s; Interaction to Next Paint ≤ 200 ms at p75. | Must |
| NFR-8 🔺 | **Offline capability.** The app shell, the last-viewed feed page, and open conversations shall be readable offline; composing a message or post offline shall queue rather than fail. | Must |
| NFR-9 🔺 | **Mobile-first responsive.** Every screen shall be designed and tested at a 360×640 CSS-pixel baseline first, then progressively enhanced to tablet and desktop. No feature shall be desktop-only. | Must |
| NFR-10 🔺 | **Browser support.** Chrome/Android WebView and Safari/iOS at current and current-minus-two major versions; Opera Mini in a documented degraded mode. | Should |
| NFR-11 ⚠️ | **Data protection.** Processing of personal data shall comply with the Nigeria Data Protection Act 2023: lawful basis recorded, data subject rights (access, correction, deletion, portability) implemented, breach notification runbook in place, and a documented retention schedule. | Must |
| NFR-12 🔺 | **Accessibility.** Interactive surfaces shall meet WCAG 2.2 AA for contrast, target size, focus visibility, and keyboard operability. | Should |
| NFR-13 🔺 | **Availability.** 99.5% monthly availability for the API, measured on the feed and messaging read paths. | Should |
| NFR-14 🔺 | **Cost control.** SMS spend shall be capped per user per day and globally per day, with an alert and an automatic circuit breaker before the cap is exceeded. | Must |

---

## 9. Release Plan and Milestones

Detail and sequencing in [Roadmap](roadmap.md).

| Release | Scope |
|---|---|
| **v1** (this document) | Geographic Feed, Profile, Stories, Chat & Messaging, Rankings & Explore, Settings, Onboarding, Notifications, Moderation — **mobile-first web (PWA)**, no monetization 🔺 |
| **v1.5** 🔺 | Native Android and iOS clients wrapping the same API; native camera, native push, background sync. Language activation (Igbo/Yoruba/Hausa) if v1 data supports it. |
| **v2** | Voice/Video/Conference Calls; Marketplace (seller + buyer); Pro Account subscriptions; Advertising system; 90-second video; tagged-stories profile section |
| **v3** | Full-length video (no cap) |

**At risk of dropping from v1:** Google Sign-In (FR-12.5) is explicitly
conditional on implementation cost — phone/OTP-only auth is an acceptable fallback.

---

## 10. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| v1 ships with no revenue mechanism, extending time-to-monetization. | Confirm runway is sufficient to reach v2 before committing to this scope; treat v1 as a deliberately funded validation phase, not a delay. |
| Users may expect voice/video calling as baseline and find its absence a reason to churn back to incumbents. | Track call-intent proxies (users tapping a disabled call affordance) to quantify demand and prioritise v2 sequencing. |
| Deferring the marketplace delays WeNaija's most defensible long-term differentiator. | Use v1 retention and geographic engagement data to make an evidence-based case for how much of v2 to fund. |
| Language localisation deferred to v2 despite the toggle shipping in v1. | Track adoption among likely non-English-first regions post-launch to decide whether to accelerate. |
| Google Sign-In may be descoped, affecting onboarding conversion. | Monitor drop-off on the phone/OTP-only path to quantify the actual cost. |
| 🔺 **Users may not perceive a PWA as "a real app",** depressing return visits relative to a native install. | Measure install rate and installed-vs-browser retention from week one. If the gap is material by M+2, pull v1.5 native shells forward — the API is already client-agnostic, so this is a client project. |
| 🔺 **iOS Safari constrains web push and background sync** more than Android Chrome. | v1's Nigerian target market is overwhelmingly Android; iOS users receive a documented degraded notification experience, and the SMS relay (FR-04.2) partially compensates. Revisit at v1.5. |
| 🔺 **SMS relay cost could scale faster than expected** if a large share of users are chronically push-unreachable. | Per-user and global daily caps with a circuit breaker (NFR-14); relay threshold is configurable at runtime, not compiled in. |
| ⚠️ **A serious abuse or CSAM incident in the first weeks** with no moderation capability would be existential — reputationally and legally. | F14 is scoped as launch-blocking, with automated CSAM hash screening before publication and a staffed queue from day one. |
| ⚠️ **NDPA non-compliance** exposes the company to regulatory action from the NDPC. | NFR-11 treated as launch-blocking; compliance review before soft launch, not after. |
| 🔺 **Thin local tiers at launch** make LGA/Town feeds feel dead and undercut the core differentiator. | Soft launch in a single state to concentrate density (Roadmap M4); FR-01.11 tier fallback so a thin tier degrades gracefully rather than showing emptiness. |

---

## 11. Open Questions

Tracked with owners in [Open Questions](open-questions.md). Summary:

| ID | Question |
|---|---|
| OQ-1 | What is the funding runway assumption for a v1 that generates no revenue? |
| OQ-2 | What are the concrete v1 launch targets for the KPIs in §3.3? |
| OQ-3 | What retention/engagement threshold triggers the start of v2 development? |
| OQ-4 | Should v2 sequence calls, marketplace, and monetization together, or stage them? |
| OQ-5 | What is the review cadence for badge/ranking gaming resistance? |
| OQ-6 🔺 | Which object storage and CDN provider, and is media served from a Nigerian or nearest-region edge? |
| OQ-7 🔺 | Where does canonical Town/City reference data come from? LGAs are official (774); towns are not. |
| OQ-8 🔺 | What is the SMS relay threshold, per-user daily cap, and monthly budget ceiling? |
| OQ-9 🔺 | Is chat E2E encryption a v2 commitment or a permanent non-goal? It constrains the v1 data model either way. |
| OQ-10 ⚠️ | Who staffs the moderation queue at launch, and what is the target time-to-first-review? |
| OQ-11 🔺 | Does v1.5 native mean React Native, or a Capacitor/TWA wrapper around the same web build? |
| OQ-12 🔺 | What is the launch state for the soft launch, and on what evidence? |

---

## 12. Appendix

- Source document: WeNaija Developer Feature Specification v1.0, prepared by
  Festus Udealor Onyeka (WeNaija Founder), confidential.
- Direct predecessor: WeNaija PRD v1.1 (`WeNaija_PRD_v1_fundamentals.docx`).
- MoSCoW priority key: **Must** = launch-blocking; **Should** = expected at
  launch, workable if slipped; **Could** = valuable, first cut if scope must shrink.

---

## Appendix A — Deviation Register from Source PRD v1.1

Every difference between this document and v1.1, so the change is reviewable
rather than absorbed silently.

### A.1 Platform inversion

| v1.1 | v1.2 (this doc) | Why |
|---|---|---|
| v1 is Android-native (React Native); iOS and web in v2 | v1 is mobile-first responsive web (PWA); native in v1.5/v2 | Fastest path to users in a storage- and data-constrained market; no store review latency during a validation phase; link-shareable, which matters for a product whose growth loop is social. [ADR-0001](../04-decisions/0001-web-first-delivery.md) |

### A.2 Requirements whose mechanism changed

| ID | Change |
|---|---|
| FR-04.2 | SMS fallback reframed from device-originated SMS to sender-side offline outbox + server-side SMS relay to unreachable recipients. The promise is preserved; the mechanism could not be. [ADR-0005](../04-decisions/0005-sms-fallback-on-web.md) |
| FR-03.6 | Story capture specified via `getUserMedia` with mandatory file-upload fallback, since browser camera access is not guaranteed. |
| FR-13.6 | Push permission timing specified, because a browser permission prompt is far more destructive to conversion than an OS-level one on a native app. |
| NFR-2 | Rewritten to match the FR-04.2 reframing. |

### A.3 Requirements added

| ID | Addition | Reason |
|---|---|---|
| FR-01.10 | Time decay in ranking | v1.1 specified weights but no decay; without it, one viral post permanently occupies a tier. |
| FR-01.11 | Thin-tier fallback | v1.1's own §6.1 assumption flags the empty-tier risk but no requirement addresses it. |
| FR-01.12 | Progressive, cursor-paginated feed rendering | Web-specific performance requirement. |
| FR-02.4 | Cutoff timezone fixed to WAT | v1.1 said "Sunday midnight" with no timezone — ambiguous for diaspora users, who are explicitly a target segment. |
| FR-02.8 | Idempotent award jobs | Scheduled-job reality; prevents duplicate badges on retry. |
| FR-02.9 | Minimum entries for a weekly winner | An uncontested "win" devalues the badge. |
| FR-03.7 | Read-time expiry enforcement | Job lag must not expose expired content. |
| FR-04.8 | Message idempotency keys | Required by the outbox replay in FR-04.2. |
| FR-04.9 | SMS relay content restriction | Prevents leaking message bodies to an unauthenticated channel. |
| FR-04.10 | Block and report in chat | v1.1 had no blocking requirement anywhere. |
| FR-06.7–06.9 | Ring detection, reversible exclusions, no device geolocation | Ranking integrity and a privacy-conservative "Near You". |
| FR-11.6–11.8 | PWA cache control, data export, consent management | Web-specific plus NDPA obligations. |
| FR-12.7–12.10 | Pre-signup browsing, resumable signup, consent capture, deferred install prompt | Web-specific conversion and compliance. |
| FR-13.7 | Push-unreachable degradation | Feeds the SMS relay decision in FR-04.2. |
| **F14 (all)** ⚠️ | Content moderation and trust | v1.1 had no moderation requirements of any kind. |
| NFR-7 to NFR-14 | Performance budget, offline, responsive baseline, browser support, NDPA, accessibility, availability, SMS cost control | v1.1 had six NFRs, none quantified. |

### A.4 Unchanged

Sections 1, 2 (first two gaps), 3.1–3.3 (metric set), 4 (exclusion list, apart
from the platform inversion), 5, 6, and all of F01/F02/F03/F06/F11/F12/F13's
original requirement text carry forward verbatim. Engagement weights, award
tiers, group size limits, content length caps, the 30-day ranking eligibility
rule, and the age gate are all unchanged.
