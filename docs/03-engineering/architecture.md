# Architecture

**Status:** Active · **Owner:** Engineering · **Last updated:** 2026-09-05

---

## 1. Shape

A **modular monolith** API plus a set of workers, behind a Next.js web client.
Not microservices — a pre-launch product with an unproven core loop needs the
ability to change a boundary in an afternoon, and distributed systems tax exactly
that. NestJS modules give clean internal boundaries; if one needs to become a
service later, the seam is already there.

```
                        ┌─────────────────────────────┐
                        │   Browser (mobile-first)     │
                        │   Next.js PWA + SW + IDB     │
                        └──────────┬──────────────────┘
                              HTTPS │ WSS
                        ┌──────────▼──────────────────┐
                        │   Edge / CDN                 │
                        │   static, media, SSR cache   │
                        └──────────┬──────────────────┘
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
        ┌────────────────────┐        ┌────────────────────────┐
        │  Next.js server     │        │  NestJS API            │
        │  SSR public routes  │───────►│  REST + WS gateway     │
        │  /u/:id  /p/:id  /  │        │                        │
        └────────────────────┘        └───┬────────────────┬───┘
                                          │                │
                        ┌─────────────────┼────────────────┼──────────────┐
                        ▼                 ▼                ▼              ▼
                 ┌───────────┐     ┌───────────┐   ┌────────────┐  ┌──────────┐
                 │ MongoDB   │     │  Redis    │   │  Object    │  │  Queue   │
                 │ primary   │     │ cache/    │   │  storage   │  │ (BullMQ  │
                 │           │     │ ZSET/     │   │  + CDN     │  │ on Redis)│
                 │           │     │ presence  │   │            │  │          │
                 └───────────┘     └───────────┘   └────────────┘  └────┬─────┘
                                                                        │
                        ┌───────────────────────────────────────────────┤
                        ▼           ▼            ▼            ▼         ▼
                   ranking     media        notify      awards    moderation
                   worker      worker       worker      worker    worker
                        │                       │
                        └───────────┬───────────┘
                                    ▼
                Africa's Talking · FCM · ZeptoMail
```

---

## 2. Components

### Web client — Next.js (App Router)

- **Server-rendered, publicly:** `/`, `/p/:postId`, `/u/:username`. These are the
  shared-link surfaces and the pre-signup entry (FR-12.7); they must render
  content and Open Graph tags without JS. Shared links are a primary growth
  channel — a client-rendered blank page for a crawler or a slow phone is a
  growth bug, not a performance nit.
- **Client-rendered:** everything behind auth. No SEO value, and the interactivity
  is the point.
- **Service worker:** app shell precache, stale-while-revalidate for feed pages,
  Background Sync for the outbox (NFR-8).
- **IndexedDB:** message outbox, draft posts, cached conversations.
- The Next.js server does **not** talk to MongoDB. It calls the API like any other
  client. This is what keeps the API client-agnostic and makes v1.5 native a
  client project — see [ADR-0003](../04-decisions/0003-separate-nestjs-api.md).

### API — NestJS

One deployable, modular inside:

| Module | Owns |
|---|---|
| `auth` | Signup, OTP, sessions, 2FA, consent records |
| `users` | Profiles, follows, blocks, settings |
| `geo` | State/LGA/Town reference data, resolution, validation |
| `posts` | Composition, retrieval, engagement recording |
| `feed` | Tier assembly, ranking reads, pagination |
| `stories` | Stories, highlights, viewers, expiry |
| `chat` | Conversations, messages, groups, delivery state |
| `stickers` | Creation, packs, publication, search |
| `rankings` | Scores, badges, awards, integrity rules |
| `notifications` | Routing, batching, preferences, reachability |
| `media` | Upload orchestration, transcode jobs, URL signing |
| `moderation` | Reports, queue, enforcement, audit |
| `admin` | Operator surface (separately authenticated) |

**Rules between modules:** a module may call another module's *service*, never
another module's collections. Cross-module reads that need to be fast are handled
by denormalisation ([Data Model](data-model.md)), not by reaching into someone
else's data. This is the discipline that keeps the seams real.

### WebSocket gateway

Socket.IO on the same deployable, Redis adapter for multi-instance fan-out.
Carries chat messages, delivery/read receipts, typing, presence, and live
notification pushes. Falls back to long-polling automatically, which matters on
networks where WebSocket upgrade is blocked — common enough on Nigerian mobile
networks to be a real case, not a theoretical one.

### Workers

Separate processes, same codebase, BullMQ over Redis.

| Worker | Job |
|---|---|
| `ranking` | Recompute tier ZSETs on a cadence; apply decay |
| `media` | Transcode, adaptive-bitrate ladder, thumbnails, hash-screen |
| `notify` | Fan-out, batching windows, push/SMS dispatch, quiet hours |
| `awards` | Weekly and monthly cutoffs (idempotent, period-keyed) |
| `moderation` | Report intake, queue scoring, enforcement propagation |
| `cleanup` | Story expiry, orphaned media, retention enforcement |

### Data stores

| Store | Role |
|---|---|
| **MongoDB Atlas** | Everything durable, hosted on AWS in the API's region. [ADR-0002](../04-decisions/0002-mongodb-primary-store.md) |
| **Redis (ElastiCache)** | Ranked tier feeds (ZSET), session/presence, rate limits, dedupe, queues, counters. [ADR-0004](../04-decisions/0004-redis-ranked-feeds.md) |
| **AWS S3 + CloudFront** | Media storage and delivery. See [Accounts & Services](accounts-and-services.md) |

**Redis holds no source of truth.** Every ZSET, counter and presence key is
reconstructible from Mongo. A Redis flush is a performance event, not a data-loss
event — that property is worth protecting deliberately.

---

## 3. Request paths

### Feed read (the hot path)

```
GET /v1/feed?tier=lga&cursor=…
  │
  ├─ resolve viewer's geo scope (cached on session)
  ├─ ZRANGE feed:lga:{lgaCode} by score, cursor-bounded     ← Redis
  ├─ post count < 10?  ──yes──► widen to parent tier, flag  ← FR-01.11
  ├─ hydrate post docs by _id                               ← Mongo, one query
  ├─ filter: blocked authors, under-review content          ← FR-14.6
  └─ attach viewer state (liked/saved) in one batched read
```

Target p95 under 200 ms server-side. Two round trips: one Redis, one Mongo.
Blocked-author filtering happens after the ZSET read against a small cached set —
not as a Mongo query — because it must not add a round trip to the hot path.

### Message send

```
WS message:send { idempotencyKey, conversationId, body }
  │
  ├─ SETNX msg:idem:{key} ──► exists? return the original ack   ← FR-04.8
  ├─ authorise (member? blocked?)                               ← FR-04.10
  ├─ persist to Mongo
  ├─ ack sender  ──► bubble goes queued → sent
  ├─ emit to recipient sockets in the room
  └─ enqueue delivery-check job (T = 90s)                       ← FR-04.2b
        │
        └─ still undelivered, 1:1, under caps ──► SMS relay
```

### Engagement write

```
POST /v1/posts/:id/engage { action }
  │
  ├─ rate limit (Redis)
  ├─ reject self-interaction                    ← FR-06.6
  ├─ upsert engagement doc (idempotent per user+post+action)
  ├─ INCR post counters (Redis, flushed to Mongo periodically)
  └─ ZINCRBY the post's score in each tier ZSET it appears in
```

Score updates are incremental on write and fully recomputed by the ranking worker
on a cadence — incremental keeps the feed responsive; recomputation applies decay
and corrects any drift.

---

## 4. Cross-cutting

**AuthN/Z.** Short-lived access JWT (15 min) + rotating refresh token in an
`HttpOnly`, `Secure`, `SameSite=Lax` cookie. Refresh rotation with reuse
detection. WebSocket authenticates on connect and re-authenticates on token
refresh. Detail in
[Security & Privacy](security-privacy-compliance.md).

**Idempotency.** Every state-changing endpoint accepts an `Idempotency-Key`.
Mandatory for message send (FR-04.8) and post creation, since both are replayed by
the offline outbox. Keys live in Redis for 24 h.

**Rate limiting.** Per-user and per-IP, at the edge and in the API. Tighter on
OTP, engagement, and report submission — the three abuse surfaces.

**Observability.** Structured JSON logs with a request id propagated to workers;
RED metrics per endpoint; distributed tracing across API → worker → external
provider. **Domain alerts that matter more than infrastructure ones:** SMS spend
rate (NFR-14), OTP delivery per carrier, outbox flush failure rate, moderation
queue depth, ranking job lag.

**Configuration.** Anything with an operational cost or a tuning need is runtime
config, not a constant: SMS relay threshold and caps, ranking decay half-life,
batching thresholds, feature flags. Being unable to change the SMS threshold
without a deploy is an incident waiting to happen.

**Failure posture.**

| Dependency down | Behaviour |
|---|---|
| Redis | Feed degrades to a Mongo-backed recency query, flagged as degraded. Chat continues; presence is lost |
| Object storage / CDN | Text posts and chat continue; media uploads queue and retry |
| FCM | Push silently degrades to in-app; accounts marked push-unreachable, which *increases* SMS relay — cap check matters here |
| Africa's Talking | OTP fails over to secondary; relay disabled with an alert. Signup is the blocking impact ([OQ-14](../01-product/open-questions.md)) |
| Email provider | Password reset blocked — single point of failure today, see [OQ-14](../01-product/open-questions.md) |

---

## 5. Deployment topology

| Environment | Shape |
|---|---|
| **dev** | Docker Compose: Mongo, Redis, MinIO, API, web |
| **staging** | Production topology at minimum size; seeded with realistic geo distribution |
| **production** | ≥2 API instances behind a load balancer; workers scaled per queue; managed Mongo with replica set; managed Redis with persistence; CDN in front of everything static |

**Region.** `eu-west-1` or `eu-west-2` for API and data — Nigeria's submarine
cable routes land in Europe, so those usually beat `af-south-1` from Lagos
despite the map. CloudFront has a Lagos edge, which is what governs perceived
media speed. Measure from a Nigerian connection before committing; the region is
expensive to change later, and it is also an NDPA data-transfer decision. Detail
in [Accounts & Services](accounts-and-services.md).

Detail in [Environments & Deployment](environments-and-deployment.md).

---

## 6. Scaling notes

Written for the scale v1 will actually see, with the next bottleneck named.

| Concern | v1 approach | Next step when it hurts |
|---|---|---|
| Feed reads | Redis ZSET per tier | Shard ZSETs by tier; precompute personalised slices for heavy users |
| Post fan-out | Fan-out on read | Stays correct far longer than fan-out on write, which is a poor fit for geo tiers anyway |
| Ranking recompute | Full recompute per tier on a cadence | Incremental windowed recompute; only active tiers |
| Chat | Single WS layer, Redis adapter | Dedicated WS deployable; sticky routing by conversation |
| Media transcode | Worker pool | Managed transcoding service |
| Mongo | Replica set, indexed reads | Read preference to secondaries for feed hydration; shard on `geo.stateCode` if ever needed |

**The scaling risk that is actually likely:** not read volume, but *SMS cost*
(NFR-14) and *moderation queue depth* ([OQ-10](../01-product/open-questions.md)).
Both scale with users and neither is solved by adding servers.

---

## 7. What this architecture deliberately does not do

- **No microservices.** The boundaries are inside one deployable until there is
  evidence a boundary needs to be a network hop.
- **No GraphQL.** REST plus WebSocket covers the surface; a schema layer is
  overhead for a client we control.
- **No event-sourcing or CQRS.** Interesting, and wrong for a team that needs to
  change the data model weekly during validation.
- **No Next.js API routes for domain logic.** [ADR-0003](../04-decisions/0003-separate-nestjs-api.md).
- **No ML ranking.** FR-01.9's weighted score is deterministic, explainable, and
  debuggable. A model would obscure the very thing v1 is trying to measure.
