# WeNaija Documentation

**Status:** v1 planning · **Last updated:** 2026-09-05 · **Classification:** Confidential

---

## Reading order

If you are new to the project, read these four in order. They take about 40 minutes
and are enough to have an informed opinion about the plan.

1. [Web-first PRD v1](01-product/prd-v1-web.md) — what we are building and why
2. [Scope & Non-Goals](01-product/scope-and-non-goals.md) — what we are deliberately not building
3. [Architecture](03-engineering/architecture.md) — how the system is shaped
4. [Roadmap](01-product/roadmap.md) — the sequence and what unlocks v2

## Full index

### 01 · Product

| Doc | What it covers |
|---|---|
| [PRD v1 (web-first)](01-product/prd-v1-web.md) | The authoritative v1 requirements. Supersedes the source `.docx` for delivery purposes. |
| [Scope & Non-Goals](01-product/scope-and-non-goals.md) | The v1 boundary, and the reasoning behind each exclusion. |
| [Personas & Jobs-to-be-Done](01-product/personas-and-jtbd.md) | Who v1 serves and what they are hiring it to do. |
| [Metrics & Instrumentation](01-product/metrics-and-instrumentation.md) | The KPI framework, the event taxonomy behind it, and the v2 go/no-go gate. |
| [Roadmap](01-product/roadmap.md) | Release plan, milestone sequencing, deferred-feature reference. |
| [Open Questions](01-product/open-questions.md) | Everything still unresolved, with an owner and a "needed by" date. |

### 02 · Design

| Doc | What it covers |
|---|---|
| [Design Principles](02-design/design-principles.md) | The rules that resolve arguments — mobile-first, bandwidth-first, trust-first. |
| [Design System](02-design/design-system.md) | Tokens, type scale, colour, spacing, component inventory. |
| [Information Architecture](02-design/information-architecture.md) | Navigation model, full route map, screen inventory. |
| [Key Flows](02-design/key-flows.md) | Onboarding, posting, story→DM, degraded-network chat, weekly picture. |

### 03 · Engineering

| Doc | What it covers |
|---|---|
| [Architecture](03-engineering/architecture.md) | Services, boundaries, request paths, deployment topology. |
| [Data Model](03-engineering/data-model.md) | MongoDB collections, indexes, denormalisation strategy. |
| [API Contract](03-engineering/api-contract.md) | REST surface, WebSocket events, conventions, error shape. |
| [Feed & Ranking Spec](03-engineering/feed-ranking-spec.md) | Scoring, time decay, tier blending, integrity rules. |
| [Realtime, Offline & Delivery](03-engineering/realtime-offline-delivery.md) | Chat transport, offline outbox, the SMS fallback redesign. |
| [Media Pipeline](03-engineering/media-pipeline.md) | Upload, transcode, adaptive bitrate, storage, delivery. |
| [Notifications](03-engineering/notifications.md) | Three-layer routing, batching, non-disableable channels. |
| [Security & Privacy](03-engineering/security-privacy-compliance.md) | AuthN/Z, 2FA, NDPA compliance, data retention. |
| [Content Moderation & Trust](03-engineering/moderation-and-trust.md) | Reporting, review queue, enforcement ladder. **Gap in source PRD.** |
| [Environments & Deployment](03-engineering/environments-and-deployment.md) | Environments, CI/CD, observability, runbooks. |
| [Engineering Conventions](03-engineering/conventions.md) | Repo layout, branching, testing strategy, definition of done. |

### 04 · Decisions (ADRs)

| ADR | Decision |
|---|---|
| [0001](04-decisions/0001-web-first-delivery.md) | Ship v1 as mobile-first web, not Android-native |
| [0002](04-decisions/0002-mongodb-primary-store.md) | MongoDB as the primary datastore |
| [0003](04-decisions/0003-separate-nestjs-api.md) | A separate NestJS API rather than Next.js full-stack |
| [0004](04-decisions/0004-redis-ranked-feeds.md) | Redis sorted sets for tier feed ranking |
| [0005](04-decisions/0005-sms-fallback-on-web.md) | Redefining SMS fallback for a browser client |
| [0006](04-decisions/0006-pwa-over-native-shell.md) | PWA install over a native shell for v1 |
| [0007](04-decisions/0007-no-e2ee-in-v1.md) | Transport encryption, not end-to-end, for v1 chat |

### 05 · Reference

| Doc | What it covers |
|---|---|
| [Geographic Hierarchy](05-reference/geo-hierarchy.md) | The National/State/LGA/Town model and its reference data. |
| [Requirements Traceability](05-reference/requirements-traceability.md) | Every FR/NFR mapped to the doc and epic that delivers it. |
| [Glossary](05-reference/glossary.md) | Shared vocabulary. |

---

## How to use these docs

- **The PRD is the contract.** If code and PRD disagree, one of them is a bug —
  decide which, then fix it. Do not leave the two out of sync.
- **Requirement IDs are stable.** `FR-01.4` means the same thing forever. New
  requirements take new IDs; they never reuse retired ones.
- **Decisions go in ADRs, not in Slack.** If you are about to make a choice that
  a future engineer would ask "why?" about, write the ADR.
- **Open questions are tracked, not buried.** Anything unresolved belongs in
  [Open Questions](01-product/open-questions.md) with a named owner.

## Document conventions

| Convention | Meaning |
|---|---|
| **Must / Should / Could** | MoSCoW. Must = launch-blocking. Should = expected, workable if slipped. Could = first cut if scope shrinks. |
| `FR-nn.n` | Functional requirement |
| `NFR-n` | Non-functional requirement |
| `OQ-n` | Open question |
| 🔺 | Marks a deviation from the source PRD v1.1 |
| ⚠️ | Marks a gap the source PRD did not address |
