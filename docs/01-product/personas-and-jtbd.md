# Personas and Jobs-to-be-Done

**Status:** Active · **Owner:** Product · **Last updated:** 2026-09-05

> ⚠️ **These personas are constructed from the source specification, not from
> research.** They are a shared working model, useful for resolving design
> arguments and prioritising, but they are hypotheses. Validate them in the soft
> launch ([Roadmap M4](roadmap.md#m4--soft-launch-single-state)) and revise this
> document with what you learn. Do not cite them as evidence.

---

## P1 — Chidi, the local social user

**Primary segment. Everything in v1 is designed for this person first.**

24, lives in Enugu, works retail. Android phone bought used, 64 GB with maybe 4 GB
free. Buys data in ₦500–₦1,000 bundles and watches the balance. On WhatsApp
constantly, Facebook occasionally, TikTok when there is data to spare.

**Job to be done:** *"Show me what's actually happening around me, from people
near me — not from people in Lagos, and not from America."*

| | |
|---|---|
| **Enters via** | A link a friend shares in a WhatsApp group |
| **Judges the product on** | Whether the first screen has anything from his LGA on it |
| **Churns because** | The local feed is empty; the app eats data; it's slow on 3G |
| **v1 features that serve him** | F01 tiers, F03 stories, F04 chat, F13 quiet hours |
| **Design implications** | 🔺 The National feed must be readable before signup (FR-12.7) — he arrived from a link, not a store page. Data Saver on by default (FR-11.3). Thin-tier fallback (FR-01.11) matters more for him than for anyone else. |

**The single measurement that tells us we are serving him:** D7 retention among
users whose LGA had fewer than 50 active users at signup. If a thin local tier
retains, the geo bet works. If it does not, the bet needs revisiting before v2.

---

## P2 — Amaka, the diaspora Nigerian

29, Houston. Left Nigeria at 19. US phone number, good connectivity, iPhone.
Follows Nigerian news through Twitter/X and family WhatsApp groups.

**Job to be done:** *"Keep me connected to home — my state, my town, the people
there — without needing a Nigerian SIM."*

| | |
|---|---|
| **Enters via** | Family sharing a link, or search |
| **Judges the product on** | Whether signup works with a +1 number, and whether her home state's feed is alive |
| **Churns because** | Signup demands a Nigerian number; content is national-generic; timezone-dependent features (weekly cutoff) behave confusingly |
| **v1 features that serve her** | FR-12.4 international signup, FR-01.5 follow extra states, F03 stories |
| **Design implications** | 🔺 She is why FR-02.4 fixes the weekly cutoff to WAT explicitly — "Sunday midnight" is ambiguous for someone six hours behind. 🔺 She is disproportionately on iOS, where web push and background sync are weakest — she gets the documented degraded notification path (FR-13.7), which is a real cost of the web-first choice for this segment. |

**Note on prioritisation:** diaspora users are high-value (engaged, often
higher-spending in a future v2 marketplace) but low-volume. Do not let their needs
pull design away from P1. Where they conflict, P1 wins in v1.

---

## P3 — Tunde, the recognition seeker

21, student in Ibadan. Posts constantly. Cares about follower counts, wants to be
known. Would be an influencer given the chance.

**Job to be done:** *"Give me a way to be somebody locally — a status I can earn
and show off — without having to already be famous."*

| | |
|---|---|
| **Enters via** | Hearing about the badges, or seeing someone's badge |
| **Judges the product on** | Whether the recognition is achievable and visibly displayed |
| **Churns because** | Rankings feel rigged or gamed; the badge is invisible to others; the same accounts win every week |
| **v1 features that serve him** | F02 weekly picture and badges, F02.7 Monthly Top Creator, F06 Explore |
| **Design implications** | 🔺 He is the reason FR-06.7 (ring detection) and FR-02.9 (minimum entries) exist. He is also the person most likely to *game* the system — the same motivation drives both engagement and abuse. Integrity rules are a feature for him, not a tax: a badge that anyone can farm is worth nothing to him. |

**Tension to watch:** FR-06.1 forbids ranking content in the main feed, which
protects P1's experience at some cost to P3's visibility. That trade is correct —
P1 is the larger segment and the feed's cleanliness is the differentiator — but
Explore must be good enough that P3 does not feel exiled to a dead tab.

---

## P4 — Blessing, the low-spec device user

**Not a demographic — a constraint that cuts across P1 and P3.**

Phone has 1–2 GB RAM, Android 10, 200 MB free storage on a good day. Regularly
uninstalls apps to install others. Opera Mini or Chrome with Data Saver on.

**Job to be done:** *"Let me use this without choosing between it and something
else already on my phone."*

| | |
|---|---|
| **v1 features that serve her** | 🔺 The web-first decision itself. NFR-7 performance budget, NFR-8 offline shell, FR-11.6 cache footprint control |
| **Design implications** | Every kilobyte in the feed route is a decision about whether she can use the product. NFR-7's 170 KB budget is not aspirational — it is the requirement. Images must be responsive and lazily loaded; video must never autoplay on Data Saver. |

She is the clearest single argument for [ADR-0001](../04-decisions/0001-web-first-delivery.md).
A 50 MB install is not a minor friction for her; it is a refusal.

---

## P5 — The operator

**Internal. Has no UI in the source PRD at all, which is a gap.**

Whoever is on the moderation queue and the ranking-integrity review at launch —
plausibly a founder in the first months.

**Job to be done:** *"Tell me what needs my attention, let me act on it, and keep
a record of what I did."*

| | |
|---|---|
| **v1 features that serve them** | ⚠️ F14 moderation queue and enforcement ladder, FR-06.5 flagged-account review, FR-06.8 reversible logged exclusions |
| **Design implications** | The admin surface is minimal but real: a prioritised queue, four enforcement actions, an audit log. It is not a dashboard project. See [Moderation & Trust](../03-engineering/moderation-and-trust.md). |

**Staffing this role is [OQ-10](open-questions.md)** and is currently unanswered.
The feature is useless without someone behind it.

---

## Segments explicitly not served in v1

Sellers, buyers, advertisers, and Pro subscribers. They become personas when the
features that serve them are scoped — do not design v1 surfaces "for later" around
users who cannot exist yet. NFR-6 keeps the data model open for them; that is the
whole of v1's obligation to them.

---

## Using these personas

- **When two designs are both defensible**, pick the one that serves P1 on a 3G
  connection.
- **When a feature only serves P3**, check it does not degrade P1's feed (FR-06.1
  is this rule, made permanent).
- **When something adds weight to the feed route**, weigh it against P4 and the
  NFR-7 budget explicitly, in the PR.
- **When you catch yourself designing for a desktop reviewer**, stop. Nobody in
  this list is on a laptop.
