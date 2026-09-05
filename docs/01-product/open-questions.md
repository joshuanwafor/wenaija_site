# Open Questions

**Status:** Active · **Owner:** Product · **Last updated:** 2026-09-05

Everything unresolved, with who decides and when it blocks. An open question with
no owner is a question nobody is answering.

**Legend** — **Blocks:** the earliest milestone that cannot complete without an
answer. **Owner:** who decides, not who researches.

---

## Carried from source PRD v1.1

### OQ-1 — Runway for a zero-revenue v1
**Owner:** Founder · **Blocks:** scope commitment (now)

What is the funding runway assumption for a v1 that generates no revenue, and how
long can it sustain the team until v2 monetization ships?

*Why it matters:* the entire "defer monetization" thesis rests on this. If runway
does not reach v2, the correct v1 is a different, smaller v1 with an earlier
revenue hook — a decision that must be made before M2, not after.

---

### OQ-2 — Concrete KPI targets
**Owner:** Founder + Product · **Blocks:** M4 soft launch

What are the v1 launch targets for the KPIs in
[PRD §3.3](prd-v1-web.md#33-success-metrics)?

*Why it matters:* a soft launch without targets produces numbers nobody can act
on. Targets set after seeing the data are rationalisation, not evaluation.

---

### OQ-3 — The v2 trigger
**Owner:** Founder · **Blocks:** post-launch decision, but set it before launch

What retention or engagement threshold from v1 should trigger the start of v2
development? Proposed gate structure in
[Metrics §4](metrics-and-instrumentation.md#4-the-v2-gate) — G1–G5 need numbers.

---

### OQ-4 — v2 sequencing
**Owner:** Founder · **Blocks:** v2 planning

Should v2 sequence calls, marketplace, and monetization together, or stage them
(e.g. marketplace + Pro before calls)?

*Input available:* v1's call-intent proxies and commerce-intent proxies
([Metrics §2.11](metrics-and-instrumentation.md#211-commerce-intent-proxies)) are
built precisely to inform this. Do not decide before that data exists.

---

### OQ-5 — Gaming-resistance review cadence
**Owner:** Product + Eng · **Blocks:** M5 national rollout

What is the review cadence for the star-badge and Monthly Top Creator algorithm's
resistance to gaming, beyond the rules already specified?

*Proposal to react to:* monthly review of ranking exclusion rates and manual
inspection of the top 20 per tier during the first quarter, moving to quarterly
once stable. Gaming pressure scales with prize value and user count; the cadence
should be tied to those, not to the calendar alone.

---

## New — from the web-first rewrite 🔺

### OQ-6 — AWS region for storage and API
**Owner:** Eng · **Blocks:** M2 (media pipeline) · **Partially resolved**

**Resolved:** the provider is AWS — S3 for objects, CloudFront for delivery.
See [Accounts & Services](../03-engineering/accounts-and-services.md).

**Still open:** which region, and whether it satisfies NDPA transfer
requirements.

*Why it matters:* media delivery latency is the dominant term in feed performance
(NFR-7). The working assumption is `eu-west-1`/`eu-west-2` over `af-south-1`,
because Nigeria's cable routes land in Europe — but that should be measured from
a Nigerian connection, not assumed. The region is also where personal data
physically rests, which feeds the NFR-11 transfer analysis and
[OQ-13](#oq-13--data-protection-accountability).

---

### OQ-7 — Canonical Town/City reference data
**Owner:** Product + Eng · **Blocks:** M0 — **the earliest hard blocker**

Where does Town/City reference data come from? Nigeria's 36 states + FCT and 774
LGAs are official and stable. **Towns and cities are not** — there is no single
authoritative list, coverage varies wildly by region, and naming and spelling are
inconsistent.

*Options, with the trade-off stated:*

| Option | Cost | Risk |
|---|---|---|
| Curate a fixed list from a public dataset (e.g. GeoNames), reviewed manually | Moderate upfront | Gaps in rural coverage; users can't find their town |
| Let users free-text a town, normalise and cluster server-side | Low upfront | Fragmented tiers — "Nsukka", "nsukka", "Nsuka" become three towns and each is empty |
| **Ship LGA as the finest tier in v1**, add Town in v1.5 once real usage shows which towns matter | Lowest | Loses the finest-grain differentiator at launch |

*Recommendation to react to:* the third. It removes a data problem from the
critical path and lets real signup data tell us which towns exist in practice.
FR-01.1's four tiers stay in the model; the Town tier ships behind a flag.
**This needs a decision in M0 either way.** See
[geo-hierarchy](../05-reference/geo-hierarchy.md).

---

### OQ-8 — SMS relay economics
**Owner:** Founder + Eng · **Blocks:** M3b

What is the SMS relay threshold (default proposed: 90 s), the per-user daily cap,
and the monthly budget ceiling that trips the NFR-14 circuit breaker?

*Why it matters:* FR-04.2b sends real SMS at real cost, triggered by a condition —
recipient unreachable — that is common in exactly the market we are targeting.
Unbounded, this is the one v1 feature that can generate a surprise five-figure
bill. The threshold and caps must be runtime-configurable, and someone must own
the budget.

*Needed to answer:* Africa's Talking per-message pricing at expected volume, and
an estimate of the push-unreachable population — which the soft launch measures
directly.

---

### OQ-9 — End-to-end encryption: v2 commitment or permanent non-goal?
**Owner:** Founder · **Blocks:** M3b data model (soft), v2 planning (hard)

Is chat E2E encryption a v2 commitment or a permanent non-goal?

*Why it matters, and why it cannot be deferred silently:* E2EE is not a feature
that can be added later without a migration and a set of capability losses.
Committing to it in v2 constrains what v1 may build on server-readable message
content — server-side search, the SMS relay preview, and message moderation
(F14) all become impossible or degraded. Deciding "later" is itself a decision
that quietly forecloses the option.

See [ADR-0007](../04-decisions/0007-no-e2ee-in-v1.md) for the full analysis. A
positioning note: competing with WhatsApp on messaging while being materially less
private than WhatsApp is a claim the market may test.

---

### OQ-11 — v1.5 native: React Native or wrapper?
**Owner:** Eng + Founder · **Blocks:** v1.5 planning

Does v1.5 native mean React Native, or a Capacitor/TWA wrapper around the same
web build?

*Trade-off:* a wrapper is weeks not months, and recovers store presence, native
push, and the "real app" perception at low cost. React Native recovers native feel
and camera quality but is effectively a second client to maintain.

*The answer depends on v1 data:* if installed-vs-browser retention shows the gap
is about **distribution and perception**, the wrapper closes it. If it shows the
gap is about **performance and feel**, it does not.

---

### OQ-12 — Soft-launch state
**Owner:** Founder · **Blocks:** M4

Which state, and on what evidence?

*Selection criteria to weigh:* achievable user density (the whole point),
smartphone and data penetration, existing founder network for seeding, LGA count
(fewer LGAs concentrate the same users into denser tiers), and how representative
the state is of the eventual national market.

*Note the tension:* Lagos maximises reachable users but is the least
representative of the geo-local thesis — everyone is already national there. A
secondary city may test the actual hypothesis better.

---

## New — gaps in the source PRD ⚠️

### OQ-10 — Moderation staffing and SLA
**Owner:** Founder · **Blocks:** M4 — launch-blocking

Who staffs the moderation queue at launch, and what is the target time-to-first-
review?

*Why it matters:* F14 builds the queue, the enforcement ladder, and the audit log.
None of it does anything without a human. At soft-launch volume this is plausibly
a few hours a day for one person; at national scale it is not. The answer
determines whether national rollout is gated on hiring.

*Sub-questions:* Out-of-hours coverage for severe reports? Escalation path for
CSAM hash matches (a legal reporting obligation, not just a takedown)? Who writes
the Community Guidelines (FR-14.8)?

---

### OQ-13 — Data protection accountability
**Owner:** Founder · **Blocks:** M4 — launch-blocking

Who is the accountable person for NDPA compliance, and has the company registered
with the NDPC where required?

*Sub-questions:* retention periods for message content, media, and deleted
accounts; whether a Data Protection Impact Assessment is required given the scale
and the collection of minors-adjacent data (age gate at 16); breach notification
runbook owner.

*Why it is here and not in a legal folder:* the answers change product surfaces —
FR-11.7 needs a retention window to state, and FR-12.9 needs a policy version to
record against.

---

### OQ-14 — Failure posture for hard dependencies
**Owner:** Eng · **Blocks:** M1

Two dependencies in [PRD §6.2](prd-v1-web.md#62-external-dependencies) have no
redundancy:

- **Transactional email** — ZeptoMail is the only provider, so an outage blocks
  password reset for every user. AWS SES is the obvious secondary since the AWS
  account already exists; note SES starts sandboxed and production access takes
  time to request.
- **OTP SMS** — Nigerian carrier deliverability varies enough that a single
  gateway is a real availability risk. The PRD assumes Africa's Talking alone.

*Recommendation to react to:* dual-provider both, with per-carrier delivery
metrics from M1 so failover can be triggered on evidence rather than guessed at.

---

## Resolved

*(None yet. Move questions here with the decision, the date, and who decided —
do not delete them. A resolved question with its reasoning attached is how the
next person avoids reopening it.)*
