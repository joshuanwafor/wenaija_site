# WeNaija

Nigeria's indigenous social platform, organised around Nigeria's own geographic
hierarchy: **National → State → LGA → Town/City**.

This repository is the product and engineering source of truth. Code lands here
later; right now it holds the documentation set that v1 will be built from.

---

## What v1 is

A **mobile-first responsive web application (PWA)** delivering the social
fundamentals:

| Area | Feature |
|---|---|
| F01 | Geographic Feed — four tiers with independent ranking |
| F02 | Profile — weekly picture, badges, Monthly Top Creator |
| F03 | Stories & Status — 24h ephemeral, reactions route to DM |
| F04 | Chats & Messaging — network-resilient, sticker/GIF creation |
| F06 | Rankings & Explore — recognition without polluting the feed |
| F11 | Settings — privacy, notifications, data usage, 2FA |
| F12 | Onboarding & Signup — 6 screens, location-aware, age-gated |
| F13 | Notifications — tiered in-app / push / SMS |

Deliberately **not** in v1: marketplace, calls, Pro subscriptions, advertising.
See [Scope & Non-Goals](docs/01-product/scope-and-non-goals.md).

## Two things that changed from the source PRD

The source PRD (`WeNaija_PRD_v1_fundamentals.docx`, v1.1) scoped v1 as
**Android-native only**, with web deferred to v2. This documentation set inverts
that:

- **v1 ships as mobile-first web.** Rationale and trade-offs:
  [ADR-0001](docs/04-decisions/0001-web-first-delivery.md).
- **Native clients become v1.5/v2**, reusing the same API surface.

Everything else in the source PRD is carried forward intact. Where a requirement
had to change *mechanism* because the client is a browser rather than an Android
process, that change is called out explicitly in
[the PRD's deviation register](docs/01-product/prd-v1-web.md#appendix-a--deviation-register-from-source-prd-v11).

## Stack

- **Web client** — Next.js (App Router) as an installable PWA
- **API** — NestJS
- **Primary store** — MongoDB
- **Cache / ranking / presence** — Redis
- **Realtime** — WebSocket gateway (Socket.IO)
- **SMS** — Africa's Talking · **Push** — Firebase Cloud Messaging ·
  **Email** — SendGrid or Zoho Mail

## Repository

| Path | What it is |
|---|---|
| [`docs/`](docs/) | Product and engineering documentation — the source of truth |
| [`web/`](web/) | The Next.js web prototype: public site + interface preview |

## Start here

→ **[docs/README.md](docs/README.md)** — the documentation index and reading order.
→ **[web/README.md](web/README.md)** — running the prototype.

## The prototype

`web/` is live-ready but deliberately front-end only: a public "coming soon"
site with a working waitlist and an interactive preview of the interface. There
is no backend behind it yet. Run it with:

```bash
cd web && npm install && npm run dev
```

---

**Classification: Confidential — authorised use only.** Derived from the WeNaija
Developer Feature Specification v1.0 (Festus Udealor Onyeka, WeNaija Founder).
