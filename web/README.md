# WeNaija — Web Prototype

The public site and interface preview for WeNaija, published while the backend
is being built. Everything here is real and working **except** the product
itself: there is no platform behind it yet, and the pages say so.

## What this is

| Route | Purpose |
|---|---|
| `/` | Landing page — the thesis, the interface preview, build status, waitlist, FAQ |
| `/product` | The four v1 pillars, and what's deliberately left out |
| `/preview` | Interactive interface preview — switch feed tiers and watch the phone change |
| `/geography` | The four-tier model, all 36 states + FCT, 774 LGAs by zone |
| `/about` | Why the product exists, who it's for, how it's being built |
| `/legal/*` | Privacy, Terms, Community Guidelines — honest placeholders |
| `/api/waitlist` | The one live endpoint: validates and records waitlist signups |

## The prototype boundary

There is no database, no accounts, no posts and no messages. What exists:

- **Real** — the geography (`src/lib/geo.ts`), the waitlist endpoint with full
  validation, every page, and the interface preview's interaction.
- **Illustrative** — the posts, messages, profiles and badges in the preview
  (`src/lib/preview-data.ts`). Labelled as such on the page itself.

The preview is a faithful mock of the interface, not a client for a backend.
When the API exists, the preview components become the reference for the real
screens rather than something to throw away.

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
    AppPreview.tsx        The interactive tier-switching preview
    PhoneFrame.tsx        360px device frame
    WaitlistForm.tsx      Client form with honeypot + optimistic states
    Header.tsx  Footer.tsx  PageHero.tsx  Logo.tsx  Reveal.tsx
    LegalPage.tsx  ui.tsx
  lib/
    site.ts               All page copy and content data
    geo.ts                States, LGA counts, zones — reference data
    preview-data.ts       Mock feed/chat/profile content
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
