# Key Flows

**Status:** Active · **Owner:** Design + Eng · **Last updated:** 2026-09-05

Five flows that carry v1's core bets. Each states the decision points, the failure
paths, and the requirements it satisfies. Failure paths are given equal weight to
happy paths deliberately — on this product's target network, the failure path *is*
a common path.

---

## Flow 1 — Signup

**Satisfies:** FR-12.1 to FR-12.10, FR-11.8, NFR-4

```
Link (WhatsApp) ──► / (National feed, read-only)  ◄── FR-12.7
                          │
              taps like / comment / tier switch
                          ▼
                    /welcome ──► /signup
                          │
                    phone or email
                    date of birth ────► under 16 ──► blocked, explained
                    consent (versioned, recorded)
                          ▼
                  /signup/verify (OTP)
                    ├─ code correct ──────────────┐
                    ├─ wrong ──► retry (3), then cooldown
                    └─ never arrives ──► resend (30s) ──► switch channel
                          ▼                                     │
                  /signup/location  ◄───────────────────────────┘
                    State (required) ──► LGA ──► Town
                          ▼
                  /signup/interests  (skippable, ≤5)
                          ▼
                  /signup/profile    (skippable)
                          ▼
                  /signup/done ──► / (National feed, FR-01.2)
```

**Decision points**

| Point | Behaviour |
|---|---|
| Under 16 (FR-12.3) | Block at DOB entry, before OTP. Explain the rule; do not fail silently after the user has spent an SMS |
| International number (FR-12.4) | Full access. No degraded tier, no "Nigerian numbers only" |
| Location — State required (FR-12.2) | LGA and Town optional. See [OQ-7](../01-product/open-questions.md) — Town may ship behind a flag |
| Google Sign-In (FR-12.5) | Skips screen 2, auto-fills name/email, still requires DOB and location |

**Failure paths**

| Failure | Behaviour |
|---|---|
| Network drops mid-flow | State persisted server-side per step; resume at the same step (FR-12.8) |
| Page reload | Same — resume, never restart |
| OTP undelivered | Resend after 30 s; after two failures offer email; log per carrier ([OQ-14](../01-product/open-questions.md)) |
| OTP gateway down | Failover provider; if both are down, say so honestly and offer email |

**Instrumented:** step-level drop-off, OTP delivery per carrier, resume rate,
age-gate blocks, pre-signup-browse conversion.

---

## Flow 2 — Posting to the feed

**Satisfies:** FR-01.7, FR-01.8, NFR-1, NFR-8

```
[+] ──► Composer (modal)
          │
          ├─ text (≤500)
          ├─ photos (≤10)  ──► client resize ──► queued upload
          └─ video (≤60s)  ──► length check AT CAPTURE (not at review)
                                     │
                                     ├─ >60s ──► trim UI, never silent rejection
                                     └─ ok ──► client-side compress ──► upload
          ▼
      [Post] tapped
          │
     online? ──no──► outbox ──► "Saved. Will post when you're back."
          │                            │
         yes                    reconnect ──► auto-send ──► notify on success
          ▼
   optimistic insert at top of current tier
          │
   server confirms ──► settled
   server rejects  ──► card shows failure + Retry + Edit, never disappears silently
```

**Design notes**

- **Length is enforced at capture** (acceptance criterion, PRD §7.1). Letting a
  user record 90 seconds and rejecting it after upload wastes their data — the
  most expensive possible way to say no.
- Client-side compression before upload. The full pipeline is in
  [Media Pipeline](../03-engineering/media-pipeline.md).
- Upload progress is per-file and cancellable; a failed image does not lose the
  written text.
- The composer is a modal and always returns to origin.

---

## Flow 3 — Story reaction becomes a conversation

**Satisfies:** FR-03.5 — the F03 → F04 funnel that Stories exists to create, and
the seam between M3a and M3b.

```
Home story rail ──► /stories/:userId
                          │
                  tap-through segments
                          │
              viewer reacts: emoji or short text
                          ▼
        ┌─────────────────────────────────────┐
        │  NOT a reaction object.              │
        │  A real message in a real            │
        │  conversation. (FR-03.5)             │
        └─────────────────────────────────────┘
                          ▼
     conversation created (if none) ──► message sent
                          │
                          ├─ same offline outbox as any message (FR-04.2a)
                          ├─ same idempotency key (FR-04.8)
                          └─ same delivery states
                          ▼
     poster receives it in /chats — with the story frame quoted for context
                          ▼
              poster replies ──► conversation
```

**Why the story context must be quoted:** a bare "🔥" with no referent is
meaningless three hours later when the story has expired. The message carries an
immutable snapshot reference so the thread still makes sense after expiry.

**Edge cases**

| Case | Behaviour |
|---|---|
| Poster has blocked the viewer | The story is not visible at all (FR-04.10) — the reaction path never arises |
| Story expires before delivery | Message still delivers; the quoted frame renders as "This story has expired" |
| Viewer is offline | Queues like any message; delivers on reconnect |
| Reaction to own story | No-op; no self-conversation |

**Instrumented:** reaction rate, reaction→DM conversion, reaction→conversation
(≥3 messages in 24 h) — the last is the one that actually measures the design
intent.

---

## Flow 4 — Sending a message on a failing network

**Satisfies:** FR-04.2, FR-04.8, FR-04.9, NFR-2, NFR-8, NFR-14 · the resilience
bet, and the flow most changed by the web-first decision.

### 4a — Sender side

```
compose ──► [Send]
              │
      write to local outbox (IndexedDB) + idempotency key
              │
      render bubble: ⏱ queued
              ▼
      socket connected? ──no──► register Background Sync
              │                        │
             yes                 reconnect / sync event
              ▼                        │
      send ──────────────◄─────────────┘
              │
      ack within 10s? ──no──► retry w/ backoff (1s, 2s, 4s, 8s, capped)
              │                    stays ⏱ queued, never silently fails
             yes
              ▼
      ✓ sent ──► ✓✓ delivered ──► ✓✓ read (if receipts on, FR-04.6)
```

The user-visible contract is three honest states — **queued · sending · sent** —
and they must be accurate. A bubble that says "sent" when it is queued is worse
than no indicator at all, because it teaches users the indicator lies.

### 4b — Recipient side 🔺

This half did not exist in source PRD v1.1 and is the redesign that keeps the
"my message gets through" promise on a platform that cannot originate SMS from
the device. Full rationale:
[ADR-0005](../04-decisions/0005-sms-fallback-on-web.md).

```
server has message for recipient
              │
      socket connected? ──yes──► deliver, done
              │no
              ▼
      push token valid? ──yes──► send push ──► ack within threshold? ──yes──► done
              │no                                        │no
              ▼                                          ▼
      ┌──────────────────────────────────────────────────────┐
      │  UNREACHABLE for T (default 90s, configurable)         │
      └──────────────────────────────────────────────────────┘
              │
      1:1 only? ──no (group)──► stop. Never relay group messages (FR-04.9)
              │yes
      under per-user daily cap AND global cap? ──no──► stop, log, alert (NFR-14)
              │yes
              ▼
      SMS via Africa's Talking:
        "Ada sent you a message on WeNaija: wenaija.ng/m/AB12"
        ── sender name + deep link ONLY
        ── never the message body (FR-04.9)
              │
      sender's bubble annotates: "Notified by SMS"
```

**Why no message body in the SMS.** SMS is unauthenticated and unencrypted, it
lands on a lock screen, and phones get shared. Putting message content there
leaks it to whoever holds the handset — a privacy failure the user never
consented to. The deep link requires auth (`?next=` per
[IA §4](information-architecture.md#4-cross-cutting-behaviours)), so the content
stays behind the login.

**Duplicate prevention.** Outbox replay after reconnect is expected and normal —
the same message may be sent two or three times. The idempotency key (FR-04.8)
makes the server drop the repeats. Without it, every network blip produces
duplicate messages, which is the single most trust-destroying bug a chat product
can have.

**Instrumented:** queue rate, flush success and latency, relay trigger rate,
relay→return rate, SMS cost per DAU, dedupe rate.

---

## Flow 5 — The weekly picture

**Satisfies:** FR-02.3 to FR-02.9, FR-06.3 · the retention loop.

```
any time during the week
      │
/me/weekly-picture ──► upload / replace (editable all week, FR-02.3)
      │
      └─► appears on profile + eligible for tier ranking
                │
     engagement accrues (weighted per FR-01.9, weekly-picture post only)
                │
        ═══ Sunday 23:59:59 WAT ═══  (FR-02.4 — timezone explicit 🔺)
                │
        eligibility filter:
          ├─ account ≥30 days old (FR-06.4)
          ├─ not under review / flagged (FR-06.5, FR-14.6)
          ├─ self-interactions excluded (FR-06.6)
          └─ ring-discounted engagement (FR-06.7)
                │
        ≥5 eligible entries in the tier? ──no──► no winner this period (FR-02.9)
                │yes
                ▼
        winners per tier: City · State · National
                │
        ├─ badge awarded (permanent on profile)
        ├─ 24h feature placement (State → Explore, National → feed)
        └─ notification IF opted in (FR-02.6 — badge lands either way)
                │
        Monday 00:00 WAT ──► weekly gold/silver/bronze reset (FR-06.3)
                │
        every 4 weeks ──► Monthly Top Creator from cumulative scores (FR-02.7)
```

**Idempotency (FR-02.8).** Scheduled jobs fail and get retried; this one hands out
permanent badges and sends notifications, so a retry must be safe. Each `(period,
tier, region)` is computed once and stored with that key; a re-run reads the
existing result rather than recomputing, so no duplicate badges and no repeat
notifications. This is not defensive over-engineering — it is the difference
between a retry being routine and a retry being an incident.

**Why a minimum entry count (FR-02.9).** A "National winner" chosen from three
entries is not a win, and the first user who realises the badge is uncontested
tells everyone. Scarcity is what makes the badge worth chasing.

**Timezone (FR-02.4).** WAT/UTC+1, fixed and stated in the UI countdown. Diaspora
users (P2) are an explicit target segment and "Sunday midnight" means something
different in Houston. The countdown shows the user's local equivalent.

**Failure paths**

| Failure | Behaviour |
|---|---|
| Job doesn't run | Alert; run late; result is identical because the calculation is period-keyed, not run-time-keyed |
| Winner suspended between cutoff and award | Award withheld; next eligible entry promoted; logged |
| Tie on score | Earliest post wins. Deterministic and stated |
| Under-review account (FR-14.6) | Excluded from all ranked surfaces, including this one |

---

## Flow states — a shared vocabulary

Used consistently across every flow above.

| State | Meaning | UI |
|---|---|---|
| `queued` | On device, not yet sent | ⏱ + muted text |
| `sending` | In flight | Animated indicator |
| `sent` | Server accepted | ✓ |
| `delivered` | Reached recipient device | ✓✓ |
| `read` | Recipient opened it | ✓✓ accent |
| `relayed` | SMS notification sent (FR-04.2b) | "Notified by SMS" |
| `failed` | Permanently failed | ⚠ + Retry. **Never disappears** |

A failed item that vanishes is the worst outcome in the set: the user believes it
sent, and finds out days later that it did not.
