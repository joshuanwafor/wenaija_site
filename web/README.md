# WeNaija — Web Prototype

The public site and interface preview for WeNaija, published while the backend
is being built. Everything here is real and working **except** the product
itself: there is no platform behind it yet, and the pages say so.

## What this is

| Route | Purpose |
|---|---|
| `/` | Landing page — the thesis, the interface preview, build status, waitlist, FAQ |
| `/product` | The four v1 pillars, and what's deliberately left out |
| `/preview` | Interface preview — switch feed tiers and watch the phone mock change |
| `/feed` | **Working feed prototype** — the real ranking algorithm on seeded content |
| `/geography` | The four-tier model, all 36 states + FCT, 774 LGAs by zone |
| `/about` | Why the product exists, who it's for, how it's being built |
| `/legal/*` | Privacy, Terms, Community Guidelines — honest placeholders |
| `/api/waitlist` | The one live endpoint: validates and records waitlist signups |

## The prototype boundary

There is no database, no accounts and no server-side state. What exists:

- **Real** — the geography (`src/lib/geo.ts`), the waitlist endpoint with full
  validation, every page, and **the ranking engine** (`src/lib/feed/`), which
  implements FR-01.9, FR-01.10, FR-01.11 and FR-06.4/06.6 exactly as specified.
- **Seeded** — the 24-post corpus in `src/lib/feed/seed.ts` and the phone-mock
  content in `src/lib/preview-data.ts`. Labelled as such in the UI.

`/feed` is a genuinely working client: scores are computed, time decay applies,
thin tiers widen, engagement persists to `localStorage`, and posts composed
offline queue and flush on reconnect. Only the server is missing. When the API
exists, `src/lib/feed/ranking.ts` is the reference implementation to port —
it is deliberately free of React and browser APIs for that reason.

### What the working feed showed us

Two things a spec review would not have caught:

1. **Views dominate the score at realistic ratios.** With the PRD's weights, a
   post with 3.4k views earns 340 from views against 376 from 94 saves —
   passive viewing nearly matches the strongest intent signal. Worth revisiting
   the 0.1 view weight before build.
2. **Followed states can bury your home state.** FR-01.5 weights followed states
   equally, so high-volume Lagos content outranks Enugu content in an Enugu
   user's own State feed. Equal weighting may need to become proportional.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

Requires Node 20.9+.

## Waitlist delivery

Without a mail provider configured, the endpoint validates each signup and logs
it server-side, so nothing is lost in development. To deliver by email, copy
`.env.example` to `.env.local` and fill in:

```
RESEND_API_KEY=
WAITLIST_FROM_EMAIL="WeNaija <waitlist@wenaija.ng>"
WAITLIST_TO_EMAIL=hello@wenaija.ng
```

**Before launch this should write to a database rather than an inbox** — an
email-only waitlist has no deduplication and no way to segment by state, which
is the entire reason the form asks for one.

## Structure

```
src/
  app/
    page.tsx              Landing
    product/  preview/  geography/  about/
    legal/{privacy,terms,guidelines}/
    api/waitlist/route.ts Validation + delivery
    layout.tsx  globals.css  robots.ts  sitemap.ts  not-found.tsx
  components/
    feed/                 The working feed: FeedApp, PostCard, Composer
    AppPreview.tsx        The phone-frame tier-switching preview
    PhoneFrame.tsx        360px device frame
    WaitlistForm.tsx      Client form with honeypot + optimistic states
    Header.tsx  Footer.tsx  PageHero.tsx  Logo.tsx  Reveal.tsx
    LegalPage.tsx  ui.tsx
  lib/
    site.ts               All page copy and content data
    geo.ts                States, LGA counts, zones — reference data
    preview-data.ts       Mock content for the phone-frame preview
    feed/
      ranking.ts          Scoring, decay, tier matching — pure, portable
      store.ts            React state + localStorage + feed assembly
      seed.ts             24-post seeded corpus
      types.ts
```

**Content lives in `src/lib/site.ts`,** not in the pages. Change copy there.

## Conventions

- Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript strict.
- Tailwind theme tokens are defined in `src/app/globals.css` under `@theme` —
  `naija-*` for brand green, `ink-*` for the dark ground, `sand-*` for neutrals,
  and `gold/silver/bronze-400` reserved for ranking badges only.
- Every page is statically generated except the waitlist route.
- Designed at a 360px baseline first. Check mobile before desktop, always.

## Design decisions worth knowing

- **No web font beyond the two loaded via `next/font`** — bytes are a product
  constraint, not a performance nicety. See the design principles in
  [`../docs/02-design/design-principles.md`](../docs/02-design/design-principles.md).
- **`Reveal` degrades safely** — browsers without `IntersectionObserver` show
  content immediately rather than leaving it invisible.
- **The waitlist honeypot returns success to bots** so they get no signal.
- **Legal pages exist now** because signup will need to link to them, and a
  placeholder that admits what it is beats unreviewed boilerplate.

## Related

Product and engineering documentation lives in [`../docs`](../docs). The
requirements this prototype presents come from
[`../docs/01-product/prd-v1-web.md`](../docs/01-product/prd-v1-web.md).
