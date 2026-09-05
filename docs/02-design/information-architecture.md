# Information Architecture

**Status:** Active · **Owner:** Design + Eng · **Last updated:** 2026-09-05

Navigation model, route map, and screen inventory for the v1 web client.

---

## 1. Navigation model

**Five bottom tabs.** Five is the ceiling for reachable, labelled targets at
360 px; a sixth forces either an overflow menu or unlabelled icons, and both cost
discoverability.

| Tab | Icon | Route | Purpose |
|---|---|---|---|
| **Home** | house | `/` | The geographic feed — the product |
| **Explore** | compass | `/explore` | Rankings, trending, Near You (FR-06.2) |
| **Post** | plus (accent) | modal | Composition. Not a destination |
| **Chats** | message | `/chats` | Conversations, unread badge |
| **You** | avatar | `/me` | Own profile, entry to Settings |

**Where things deliberately are not**

- **Stories** are not a tab. They live in a rail at the top of Home, because their
  job is to feed chat (F03 rationale), and a separate tab would isolate them from
  the surface that creates that funnel.
- **Notifications** are not a tab. They are a bell in the Home top bar. A tab
  would advertise a badge count constantly and pull attention away from the feed —
  and the feed is the thesis.
- **Search** is not a tab. It lives in Explore's top bar, since discovery and
  search are the same job.
- **Settings** is not a tab. It is reached from You. Settings tabs are for
  products with nothing better to put there.

**Post is a modal, not a page.** Composition always returns you to where you were.
On ≥1024 px the tab bar becomes a left rail; the model is otherwise unchanged.

---

## 2. Route map

Next.js App Router. `(auth)` and `(app)` are route groups, not URL segments.

```
/                                  Home — geographic feed
  ?tier=national|state|lga|town    Tier as a query param: shareable, back-button correct
/p/:postId                         Post detail + comments
/p/:postId/likes                   Engagement list

/explore                           Explore
  ?scope=city|state|national       Scope filter (FR-06.2)
/explore/topics/:topic             Topic feed
/explore/people                    Top profiles
/explore/near-you                  Registered-locality content (FR-06.9)
/search?q=                         Search: people, topics, sticker packs

/stories/:userId                   Story viewer (full-screen)
/stories/new                       Story composer
/highlights/:userId/:highlightId   Saved highlight

/chats                             Conversation list
/chats/:conversationId             Thread
/chats/new                         Recipient picker
/chats/:id/info                    Group info, members, admin controls
/stickers                          My packs
/stickers/create                   Sticker/GIF creator (FR-04.3)
/stickers/explore                  Public pack search (FR-04.4)

/me                                Own profile
/u/:username                       Public profile
/u/:username/followers
/u/:username/following
/me/weekly-picture                 Weekly slot (FR-02.3)
/me/saved                          Saved posts

/settings                          Settings index
/settings/account
/settings/privacy
/settings/notifications
/settings/display
/settings/data                     Data & Storage, incl. cache footprint (FR-11.6)
/settings/security                 2FA (FR-11.2)
/settings/support
/settings/account/export           Data export (FR-11.7)
/settings/account/delete           Account deletion (FR-11.7)
/settings/account/consents         Consent management (FR-11.8)

(auth)
/welcome                           Screen 1
/signup                            Screen 2 — phone/email + OTP
/signup/verify                     OTP entry
/signup/location                   Screen 3 — State → LGA → Town (FR-12.2)
/signup/interests                  Screen 4 — optional, ≤5
/signup/profile                    Screen 5 — optional
/signup/done                       Screen 6
/login
/login/recover

/legal/terms   /legal/privacy   /legal/guidelines    Public, no auth (FR-14.8)
/offline                           Service worker fallback
```

**Route conventions**

- **Tier is a query param, not a path segment.** `/?tier=lga` keeps Home a single
  route with a preserved scroll position, makes tier state shareable, and makes
  the back button behave the way users expect after a tier switch.
- **`/u/:username` is public and server-rendered.** It is the most-shared link
  type and must render meaningful content (and Open Graph tags) without JS —
  shared links are a primary growth channel and a client-rendered blank page kills
  it.
- **`/p/:postId` is public and server-rendered** for the same reason. It is the
  pre-signup entry point that FR-12.7 depends on.
- Modals that need to be shareable or back-navigable get real routes
  (`/stories/:userId`); ephemeral ones (post composer, report sheet) do not.

---

## 3. Screen inventory

### Onboarding — 6 screens (FR-12.1)

| # | Screen | Must capture | Notes |
|---|---|---|---|
| 1 | Welcome | — | Value proposition. "Browse first" link (FR-12.7). Never shows the install prompt (FR-12.10) |
| 2 | Sign up | Phone or email, DOB, consent | Age gate (FR-12.3). Consent versioned and recorded (FR-12.9). Google Sign-In if shipped (FR-12.5) |
| 2b | OTP verify | 6-digit code | Resend with cooldown; carrier-aware messaging. Resumable (FR-12.8) |
| 3 | Location | **State (required)**, LGA, Town | Cascading picker. FR-12.2 gate |
| 4 | Interests | ≤5, optional | Skippable, and the skip is visible |
| 5 | Profile setup | Photo, name, bio — optional | Skippable |
| 6 | Welcome/entry | — | Lands on National feed (FR-01.2) |

**Every step persists to the server on completion,** so FR-12.8 resume works
across a device change, not just a reload.

### Home

- Top bar: WeNaija mark · `TierSwitcher` · notifications bell
- Story rail
- Feed list (virtualised, cursor-paginated, progressive — FR-01.12)
- Fallback banner when a thin tier substitutes (FR-01.11)
- Offline banner when applicable
- Pull to refresh

### Explore

- Search entry · scope filter (City/State/National)
- Sections: Trending topics · Top profiles · Near You
- Weekly winner features (24 h placements from FR-02.5)
- **Contains all ranking UI in the product** (FR-06.1)

### Post detail
Post · engagement bar · comments (paginated) · composer. Publicly server-rendered.

### Stories
Full-screen viewer, tap-through, progress segments, reply composer (FR-03.5),
viewer list for own stories (FR-03.3). Composer supports photo/video/text/voice
with camera capture and mandatory upload fallback (FR-03.6).

### Chats
List with presence and unread; thread with `MessageBubble` state, composer with
media/voice/sticker, group info and admin controls (FR-04.7), block/report
(FR-04.10). Sticker creator at `/stickers/create`.

### Profile
Header (photo, name, location, bio, counts) · weekly picture slot · badges ·
Monthly Top Creator banner (FR-02.7) · pinned posts (≤3) · post grid ·
follow/message actions · report/block for other users.

### Settings
Seven sections per FR-11.1, plus export, deletion and consents.

---

## 4. Cross-cutting behaviours

**Deep links.** Every notification and every SMS relay (FR-04.2b) links to a real
route. An unauthenticated user hitting a private route lands on `/login` with a
`?next=` and returns after auth — including for the SMS relay, which is the whole
point of sending it.

**Back behaviour.** Browser back is the primary navigation gesture on Android and
must always be correct. Modals push history; tier switches replace it; the story
viewer pushes per-user, not per-story.

**Scroll restoration.** Feed scroll position survives navigating to a post and
back. This is the single most-noticed quality signal in a feed product.

**Loading.** Skeletons that match final layout, never spinners on route changes.
Content streams in progressively (FR-01.12) — never one blocking wait.

**Offline (NFR-8).** App shell, last feed page and open conversations readable;
composition queues; a persistent banner states the condition; `/offline` is the
service worker fallback for uncached routes.

**Auth boundaries.**

| Public | Auth required |
|---|---|
| `/`, `/p/:id`, `/u/:username` (read-only), `/legal/*`, `(auth)` | Everything else, and every write |

FR-12.7's read-before-signup applies to the National feed only; tier switching
prompts signup, because tier relevance requires a registered location.

---

## 5. Responsive shell

| Viewport | Shell |
|---|---|
| **< 768** | Bottom tabs, single column, full-bleed. The design. |
| **768–1023** | Bottom tabs retained, content centred at max 600 px |
| **≥ 1024** | Left nav rail replaces tabs; content max 640 px; a right column may show Explore highlights — never ranking in the feed column itself (FR-06.1) |

Content never exceeds 640 px at any width.

---

## 6. Admin surface ⚠️

Separate app, separate auth, not part of the user client. Minimal by design —
[Moderation & Trust](../03-engineering/moderation-and-trust.md) covers the detail.

```
/admin/queue                 Prioritised moderation queue (FR-14.2)
/admin/queue/:reportId       Review + enforcement ladder (FR-14.3)
/admin/accounts/:userId      Account view, history, ranking-exclusion state
/admin/appeals               Appeals (FR-14.5)
/admin/audit                 Immutable action log
```
