# Accounts and Services

**Status:** Active · **Owner:** Engineering + Founder · **Last updated:** 2026-09-05

Every third-party account WeNaija needs, what each one is for, what to configure,
and what secret it hands back. Work top to bottom — the order reflects real
dependencies, not preference.

> **Who creates these matters.** Accounts opened on a personal email under one
> person's name become a single point of failure the day that person is
> unavailable. See [Ownership and access](#ownership-and-access) before opening
> anything.

---

## Summary

### Confirmed

| # | Service | Purpose | Plan to start on | Blocks |
|---|---|---|---|---|
| 1 | **Domain + DNS** | `wenaija.ng`, and DNS for everything below | Registrar of choice | Everything |
| 2 | **AWS** | Hosting, object storage, CDN, Redis, secrets | Free tier → pay-as-you-go | M0 |
| 3 | **MongoDB Atlas** | Primary datastore | M0 free (dev) → M10 (prod) | M0 |
| 4 | **ZeptoMail** | Transactional email | Credit-based | M1 |

### Still required, not yet opened

These are named in the PRD as hard dependencies but have no account yet. They are
listed here so they don't get discovered late.

| # | Service | Purpose | Blocks |
|---|---|---|---|
| 5 | **Africa's Talking** | OTP SMS + undelivered-message relay | M1 — signup does not work without it |
| 6 | **Firebase (FCM)** | Web push notifications | M4 |
| 7 | **Sentry** (or equivalent) | Error monitoring | M0 — cheap now, painful to retrofit |
| 8 | **Vercel** | Hosting for this prototype | Already in use — see [the hosting question](#the-hosting-question) |

---

## The hosting question

**AWS is named as the host, and the prototype is currently deployed on Vercel.**
Both can be true, but the split should be deliberate rather than accidental.

| Option | Shape | Trade-off |
|---|---|---|
| **A — Split (recommended)** | Next.js web client on Vercel; NestJS API, S3, CloudFront, Redis on AWS | Zero-config deploys and preview environments for the client, full control for the API. Two bills, two dashboards. CORS between origins is the only real friction |
| **B — All AWS** | Next.js on Amplify Hosting or ECS; everything else as above | One provider, one bill, one IAM model. Loses Vercel's preview deploys and zero-config Next.js support; someone has to own the build pipeline |
| **C — All Vercel** | Next.js + API routes on Vercel, storage elsewhere | Contradicts [ADR-0003](../04-decisions/0003-separate-nestjs-api.md) — the API must stay client-agnostic for v1.5 native clients |

**Recommendation: A.** The web client is a Next.js app and Vercel is the lowest-
friction way to run one; the API is a long-running stateful service with a
WebSocket gateway, which is the thing AWS is genuinely better at. Revisit if the
two-bill overhead becomes annoying.

This needs a decision recorded as an ADR before M0 completes.

---

## 1 · Domain and DNS

**Why first:** ZeptoMail needs DNS records to verify the sending domain, AWS
needs it for certificates, and email deliverability depends on records that take
time to propagate and longer to build reputation. Start this the day work begins.

**To create**

- Register `wenaija.ng` (`.ng` domains are administered by NiRA; most registrars
  resell them). Consider defensively registering `wenaija.com`.
- Point nameservers at whichever DNS host you'll use — Route 53 if you want it
  alongside AWS, or the registrar's own DNS if simpler.

**Records to plan for**

| Record | For |
|---|---|
| `A` / `CNAME` apex + `www` | The web client |
| `CNAME api` | The API |
| `CNAME cdn` | CloudFront distribution |
| `TXT` SPF, `CNAME` DKIM, `TXT` DMARC | ZeptoMail — see §4 |
| `TXT` verification | AWS ACM certificate validation |

**Notes**

- **Set DMARC to `p=none` first**, collect reports for a couple of weeks, then
  tighten to `quarantine` and later `reject`. Going straight to `reject` with a
  misconfigured SPF or DKIM silently blackholes your own password-reset emails.
- Enable registrar lock and auto-renew. A lapsed domain takes the product down
  and can lose the email reputation you spent months building.

---

## 2 · AWS

**Purpose:** hosting for the API, object storage and CDN for media, Redis for
ranking and presence, and secret storage.

### Region

**Recommended: `eu-west-1` (Ireland) or `eu-west-2` (London).**

Nigeria's submarine cable routes (MainOne, WACS, Equiano) land in Europe, so
European regions typically give Lagos better round-trip times than `af-south-1`
(Cape Town) despite the shorter map distance. Do not pick on geography alone —
**measure from a Nigerian connection before committing**, because the region is
expensive to change once data lives in it.

CloudFront has an edge location in Lagos, so media and static assets are served
locally regardless of which region the origin sits in. That is what actually
governs perceived speed for P1 and P4 users.

**NDPA note:** the region decision is also a data-residency decision. Personal
data leaving Nigeria needs a lawful transfer basis under the Nigeria Data
Protection Act 2023. Record the reasoning; see [NFR-11](../01-product/prd-v1-web.md#8-non-functional-requirements)
and [OQ-13](../01-product/open-questions.md).

### Services to provision

| Service | Use | Start with |
|---|---|---|
| **S3** | Original uploads + transcoded media | One bucket per environment, private, versioning on |
| **CloudFront** | Media and asset CDN | One distribution per environment, S3 origin via OAC |
| **ECS Fargate** *(or App Runner)* | NestJS API + workers | Fargate — the WebSocket gateway needs long-lived connections |
| **ElastiCache (Redis)** | Feed ZSETs, presence, queues, rate limits | `cache.t4g.micro` to start |
| **ACM** | TLS certificates | Free; must be in `us-east-1` for CloudFront |
| **Secrets Manager** *(or Parameter Store)* | Every credential on this page | Parameter Store SecureString is cheaper and adequate |
| **CloudWatch** | Logs, metrics, alarms | Set log retention — the default is forever, and it bills |
| **IAM** | Access control | See below |
| **Budgets** | Cost alarms | Do this on day one, not after the first surprise |

### Account setup, in order

1. Create the account on a **shared company email**, not a personal one.
2. **Enable MFA on the root user immediately**, store the recovery codes
   somewhere the team can reach, and then stop using root. Root is for billing
   changes and account closure only.
3. Create an **IAM admin user or Identity Center account** for day-to-day work.
4. Create **separate IAM roles for CI** with only the permissions a deploy needs
   — never long-lived admin keys in a CI environment.
5. Set a **budget alarm** at a monthly figure you'd be unhappy to exceed.
6. Turn on **CloudTrail** so account actions are auditable.

### Secrets produced

```
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=            # CI/service user only, never root
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_MEDIA=wenaija-media-prod
CLOUDFRONT_DOMAIN=cdn.wenaija.ng
REDIS_URL=rediss://...
```

Prefer **IAM roles over static keys** wherever the runtime supports it — ECS
tasks should assume a task role and hold no keys at all. Static keys are for
places that genuinely cannot assume a role.

### Cost notes

The dominant cost will be **CloudFront egress on video**, not compute. NFR-1's
adaptive bitrate compression is therefore a cost control as much as a
performance requirement. Watch it from the first week of the pilot.

---

## 3 · MongoDB Atlas

**Purpose:** the primary datastore — accounts, posts, stories, messages,
rankings, moderation. See [ADR-0002](../04-decisions/0002-mongodb-primary-store.md).

**To create**

1. Atlas organisation on a shared company email, MFA enforced.
2. Two projects: `wenaija-dev` and `wenaija-prod`. Separate projects, not
   separate databases in one cluster — it makes access separation real.
3. Clusters:
   - **Dev:** `M0` (free, 512 MB shared). Fine for development.
   - **Production:** **`M10` minimum.** Not a preference — `M0`/`M2`/`M5` have
     no automated backups, no dedicated resources, and no VPC peering. Launching
     a social product with user data on a tier that cannot be restored is not a
     cost saving.
4. **Host the cluster on AWS in the same region as the API.** Atlas runs on AWS,
   so matching regions keeps latency low and avoids cross-cloud egress.
5. Create database users per environment with least privilege — the application
   user needs `readWrite` on its own database, nothing more.
6. **Network access:** VPC peering or PrivateLink from the API's VPC. Do not
   leave `0.0.0.0/0` on the IP access list beyond initial local development.
7. Enable **automated backups** and set a retention period that matches the
   retention schedule in [Security & Privacy](security-privacy-compliance.md).

**Secrets produced**

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```

**Notes**

- Atlas connection strings contain the password. They belong in Secrets Manager,
  never in a repo, and never in a client-side environment variable.
- Turn on **Performance Advisor** early — it surfaces missing indexes, and the
  feed's hot path (see [Data Model](data-model.md)) will need several.
- Free-tier clusters pause after inactivity. That is fine for dev and a nasty
  surprise if anything demo-facing points at one.

---

## 4 · ZeptoMail

**Purpose:** transactional email only — OTP fallback, password reset, account and
security alerts. Replaces the "SendGrid / Zoho Mail" placeholder in the PRD.

ZeptoMail is Zoho's transactional-only service. That constraint is a feature
here: keeping transactional mail on a dedicated, marketing-free sending domain
protects the deliverability of exactly the emails that must arrive.

**To create**

1. Zoho account on a shared company email → open ZeptoMail.
2. **Add and verify the sending domain.** This is the step with the DNS
   dependency in §1 — add the SPF, DKIM and (recommended) DMARC records ZeptoMail
   provides and wait for verification.
3. **Expect an account review before sending is enabled.** ZeptoMail vets new
   accounts. Do this in M0, not the week you need to launch M1 signup.
4. Create a **Mail Agent** per environment — `wenaija-dev`, `wenaija-prod`. Each
   gets its own send token, so a leaked dev token cannot send production mail.
5. Generate the **Send Mail Token** for each agent.
6. Purchase sending credits. Volume is low in v1 — this is a small line item
   next to SMS.

**Sender addresses**

| Address | Use |
|---|---|
| `no-reply@wenaija.ng` | OTP, password reset, security alerts |
| `hello@wenaija.ng` | Waitlist and human replies (a real inbox, not ZeptoMail) |

**Secrets produced**

```
ZEPTOMAIL_TOKEN=
ZEPTOMAIL_FROM_ADDRESS=no-reply@wenaija.ng
ZEPTOMAIL_FROM_NAME=WeNaija
```

**Notes**

- **A single email provider is a single point of failure for password reset**
  ([OQ-14](../01-product/open-questions.md)). AWS SES is the natural secondary
  given the AWS account already exists — note that SES starts in a sandbox that
  only sends to verified addresses, and production access needs a request that
  takes time. Request it early even if you don't use it yet.
- Send a real email to Gmail, Outlook and Yahoo before launch and check where it
  lands. Deliverability is not something to discover from user complaints.

---

## 5 · Africa's Talking — required, not yet opened

**Purpose:** OTP delivery at signup and the undelivered-message SMS relay
(FR-04.2b). **Signup does not function without this**, which makes it an M1
blocker.

**To create**

1. Account, then a production app (separate from the sandbox).
2. Register a **sender ID / alphanumeric header** — this needs carrier approval
   in Nigeria and takes time. Start it early.
3. Top up credit and set a low-balance alert.

**Secrets produced**

```
AT_USERNAME=
AT_API_KEY=
AT_SENDER_ID=WeNaija
```

**Notes**

- **Test deliverability on MTN, Glo, Airtel and 9mobile separately.** Nigerian
  OTP delivery varies significantly by carrier, and per-carrier delivery metrics
  are a launch requirement, not a nice-to-have.
- SMS is the one line item that can produce a surprise bill (NFR-14). Set the
  per-user daily cap, the global daily cap and the circuit breaker before the
  relay goes live — [OQ-8](../01-product/open-questions.md).

---

## 6 · Firebase (FCM) — required, not yet opened

**Purpose:** web push notifications. Free at v1 volumes.

**To create**

1. Firebase project → **Cloud Messaging**.
2. Generate a **Web Push certificate (VAPID key pair)**.
3. Generate a **service account key** for server-side sending.

**Secrets produced**

```
FCM_VAPID_PUBLIC_KEY=          # safe to expose to the client
FCM_SERVICE_ACCOUNT_JSON=      # server only
```

**Note:** use Firebase for messaging only. Pulling in Firebase Auth or Firestore
would duplicate decisions already made in [ADR-0002](../04-decisions/0002-mongodb-primary-store.md).

---

## 7 · Sentry — recommended, not yet opened

Error monitoring for both the web client and the API. The free tier covers v1
volumes comfortably. Worth doing in M0: retrofitting error tracking after a
confusing production incident is the expensive way to get it.

```
SENTRY_DSN=
SENTRY_AUTH_TOKEN=     # CI, for source map upload
```

---

## Environment variables

Consolidated reference. Nothing here belongs in the repository — `.env.example`
carries the names with empty values, and real values live in Secrets Manager or
the host's environment settings.

```bash
# --- Web client (public; NEXT_PUBLIC_ is visible in the browser) -------------
NEXT_PUBLIC_API_URL=https://api.wenaija.ng
NEXT_PUBLIC_CDN_URL=https://cdn.wenaija.ng
NEXT_PUBLIC_FCM_VAPID_PUBLIC_KEY=
NEXT_PUBLIC_SENTRY_DSN=

# --- Email -------------------------------------------------------------------
ZEPTOMAIL_TOKEN=
ZEPTOMAIL_FROM_ADDRESS=no-reply@wenaija.ng
ZEPTOMAIL_FROM_NAME=WeNaija
WAITLIST_TO_EMAIL=hello@wenaija.ng

# --- Database ----------------------------------------------------------------
MONGODB_URI=

# --- AWS ---------------------------------------------------------------------
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_MEDIA=
CLOUDFRONT_DOMAIN=
REDIS_URL=

# --- SMS ---------------------------------------------------------------------
AT_USERNAME=
AT_API_KEY=
AT_SENDER_ID=
SMS_RELAY_THRESHOLD_SECONDS=90
SMS_DAILY_CAP_PER_USER=5
SMS_DAILY_CAP_GLOBAL=

# --- Push --------------------------------------------------------------------
FCM_SERVICE_ACCOUNT_JSON=

# --- App ---------------------------------------------------------------------
JWT_SECRET=
JWT_REFRESH_SECRET=
NODE_ENV=production
```

**`NEXT_PUBLIC_` variables are compiled into the browser bundle.** Anything
secret must not carry that prefix. This is the most common way a key leaks in a
Next.js project.

---

## Ownership and access

The failure mode to design against is not a breach — it is one person on holiday
while a certificate expires.

| Rule | Why |
|---|---|
| Every account is opened on a **shared company email** (`ops@wenaija.ng`), never a personal address | Accounts survive people leaving |
| **MFA on every root/owner account**, recovery codes in shared secure storage | Root lockout is unrecoverable |
| **At least two people** have owner access to each account | Removes the single point of failure |
| Billing consolidated on one company card, with **budget alarms per provider** | Surprise bills are caught early |
| Day-to-day work uses **scoped users, never root** | Limits blast radius |
| Secrets in **Secrets Manager / Parameter Store**, never in the repo or a Slack message | The repo is not a secret store |
| **Rotate credentials when anyone with access leaves** | Obvious, routinely skipped |

---

## Setup order

Dependencies, not preference — each step unblocks the next.

```
1. Domain + DNS ─────────────┬──────────────────────────┐
                             │                          │
2. AWS account, MFA, budget  │                          │
   └─ ACM certs ◄────────────┘                          │
   └─ S3 + CloudFront                                   │
   └─ ElastiCache                                       │
                                                        │
3. MongoDB Atlas (AWS, same region)                     │
                                                        │
4. ZeptoMail ◄──────────────────────────────────────────┘
   └─ domain verification (SPF/DKIM/DMARC)
   └─ account review — start early, it takes days
   └─ Mail Agent per environment

5. Africa's Talking          ← M1 blocker; sender ID needs carrier approval
6. Firebase (FCM)            ← M4
7. Sentry                    ← do it in M0, it is 20 minutes
```

**The three long-lead items are the ones to start on day one:** ZeptoMail's
account review, Africa's Talking' sender-ID approval, and (if you want it as a
backup) AWS SES production access. None of them are hard; all of them are
waiting.

---

## Cost expectations

Order-of-magnitude only, for a single-state pilot. **Verify current pricing at
signup — do not budget from this table.**

| Service | Pilot scale | Scales with |
|---|---|---|
| Domain | Annual, small | — |
| AWS — Fargate + ElastiCache | Low fixed monthly | Traffic |
| AWS — S3 + CloudFront | Small at first | **Video egress — the one to watch** |
| MongoDB Atlas M10 | Fixed monthly | Storage and tier |
| ZeptoMail | Very small | Emails sent |
| Africa's Talking | **Variable and unbounded without caps** | OTPs + relay volume |
| Firebase FCM | Free at this scale | — |
| Sentry | Free tier | Event volume |

The two that can surprise you are **CloudFront video egress** and **SMS**. Both
have caps and alarms available; configure them before launch rather than after
the first bill.
