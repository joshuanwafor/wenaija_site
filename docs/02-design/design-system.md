# Design System

**Status:** Draft — tokens proposed, brand not yet set · **Owner:** Design ·
**Last updated:** 2026-09-05

> **The colour values below are a working proposal, not brand.** They are chosen
> to be plausible, accessible and internally consistent so that engineering can
> build against real tokens from M0 rather than waiting. When brand lands, change
> the token *values*; the token *names* and the structure should survive.

---

## 1. Token architecture

Two layers. Components consume semantic tokens only — never primitives directly.
That indirection is what makes rebranding and dark mode a values change instead of
a refactor.

```
primitives  →  semantic  →  components
--green-600    --color-accent    Button.primary background
```

Delivered as CSS custom properties on `:root`, with the dark palette redefined
under both `prefers-color-scheme: dark` and an explicit `[data-theme="dark"]`, so
a user override and the system default both work.

---

## 2. Colour

### Primitives

```css
:root {
  /* Green — Nigerian identity, the brand axis */
  --green-50:  #eefbf2;  --green-100: #d5f5e0;  --green-200: #aeeac4;
  --green-300: #77d79f;  --green-400: #3fbc77;  --green-500: #1ba05c;
  --green-600: #0f8049;  --green-700: #0d663c;  --green-800: #0d5132;
  --green-900: #0b432b;

  /* Neutrals — warm-leaning, so surfaces don't read clinical */
  --gray-0:   #ffffff;  --gray-25:  #fbfaf9;  --gray-50:  #f6f5f3;
  --gray-100: #ecebe8;  --gray-200: #dedcd7;  --gray-300: #c2bfb8;
  --gray-400: #9a968d;  --gray-500: #74706a;  --gray-600: #565350;
  --gray-700: #3e3c3a;  --gray-800: #2a2927;  --gray-900: #1a1918;
  --gray-950: #0f0f0e;

  /* Status */
  --red-500: #d92d20;  --red-600: #b42318;
  --amber-500: #f79009; --amber-600: #dc6803;
  --blue-500: #2e7bd6; --blue-600: #1d5fad;

  /* Accent — for badges and recognition only. Never for UI chrome */
  --gold-400: #f0b429; --silver-400: #a8adb5; --bronze-400: #b5763a;
}
```

### Semantic tokens

```css
:root {
  --color-bg:            var(--gray-25);
  --color-surface:       var(--gray-0);
  --color-surface-alt:   var(--gray-50);
  --color-border:        var(--gray-200);
  --color-border-strong: var(--gray-300);

  --color-text:          var(--gray-900);
  --color-text-muted:    var(--gray-500);
  --color-text-inverse:  var(--gray-0);

  --color-accent:        var(--green-600);
  --color-accent-hover:  var(--green-700);
  --color-accent-subtle: var(--green-50);
  --color-on-accent:     var(--gray-0);

  --color-danger:  var(--red-600);
  --color-warning: var(--amber-600);
  --color-info:    var(--blue-600);
  --color-success: var(--green-600);

  --color-focus:   var(--blue-500);
}

:root:not([data-theme="light"]) { @media (prefers-color-scheme: dark) { /* …dark values… */ } }
:root[data-theme="dark"] {
  --color-bg:            var(--gray-950);
  --color-surface:       var(--gray-900);
  --color-surface-alt:   var(--gray-800);
  --color-border:        var(--gray-800);
  --color-border-strong: var(--gray-700);
  --color-text:          var(--gray-50);
  --color-text-muted:    var(--gray-400);
  --color-text-inverse:  var(--gray-950);
  --color-accent:        var(--green-400);
  --color-accent-hover:  var(--green-300);
  --color-accent-subtle: var(--green-900);
  --color-on-accent:     var(--gray-950);
  --color-danger:  var(--red-500);
  --color-warning: var(--amber-500);
  --color-info:    var(--blue-500);
}
```

### Rules

- **Contrast:** ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI boundaries
  (NFR-12). Verified in both themes, in CI.
- **Never colour alone.** Every state carries an icon or text label too — for
  colour-blind users and for the many users on cheap screens in bright sun where
  a subtle hue difference simply is not visible.
- **Gold/silver/bronze are reserved** for ranking badges (FR-06.3). Using them
  anywhere else devalues the only place they mean something.
- **Dark mode is not optional.** OLED phones are common in this market and dark
  mode measurably saves battery; battery is a real constraint for P1 and P4.

---

## 3. Typography

**System stack.** No web font in v1 unless brand forces it, and if brand forces
it, it is subset and preloaded (Principle 2).

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
```

**Scale** — 1.200 ratio, 16 px base. Never below 14 px for body content: small
text on a cheap screen at arm's length in daylight is unreadable, and that is the
actual reading condition.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `--text-xs` | 12 / 16 | 500 | Timestamps, metadata. Sparingly |
| `--text-sm` | 14 / 20 | 400 | Secondary text, captions |
| `--text-base` | 16 / 24 | 400 | Body, post content, messages |
| `--text-lg` | 18 / 26 | 500 | Card titles, list headings |
| `--text-xl` | 22 / 30 | 600 | Screen titles |
| `--text-2xl` | 28 / 36 | 700 | Profile name, hero |

**Rules**
- 16 px minimum on form inputs — anything smaller triggers zoom-on-focus in iOS
  Safari, which is a layout bug disguised as a type choice.
- Line length capped around 65 characters on wide viewports.
- Weights 400/500/600/700 only.

---

## 4. Spacing, radius, elevation

4 px base scale:

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px;
```

`--space-4` (16 px) is the default gutter and the screen edge padding at mobile.

```css
--radius-sm: 6px;   --radius-md: 10px;  --radius-lg: 14px;
--radius-xl: 20px;  --radius-full: 999px;
```

Elevation is used sparingly — borders carry most separation, since shadows cost
paint time on weak GPUs:

```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / .06);
--shadow-md: 0 4px 12px rgb(0 0 0 / .08);
--shadow-lg: 0 12px 28px rgb(0 0 0 / .12);
```

---

## 5. Layout and breakpoints

```css
--bp-sm:  480px;   /* large phone */
--bp-md:  768px;   /* tablet */
--bp-lg: 1024px;   /* desktop */
--bp-xl: 1280px;
```

**Baseline is 360 px.** Breakpoints are enhancements upward — every rule is
written mobile-first with `min-width` queries only.

| Range | Shell |
|---|---|
| < 768 px | Single column. Bottom tab bar. Full-bleed content. **The design.** |
| 768–1023 | Single column, centred, max 600 px. Bottom bar persists. |
| ≥ 1024 px | Two columns: left nav rail + content (max 640 px). Bottom bar becomes the rail. |

Content column never exceeds 640 px. A feed that spans a 1440 px monitor is
unreadable and signals the design was not built for phones.

**Safe areas:** honour `env(safe-area-inset-*)` — notches and home indicators are
the majority case, and an installed PWA has no browser chrome to hide behind.

---

## 6. Motion

```css
--ease-out:    cubic-bezier(.2, .8, .3, 1);
--ease-in-out: cubic-bezier(.4, 0, .2, 1);
--dur-fast:   120ms;   /* state change: press, toggle */
--dur-base:   200ms;   /* enter/exit: sheet, toast */
--dur-slow:   320ms;   /* page transition */
```

- Motion is feedback, never decoration. If it does not communicate a state change
  or a spatial relationship, remove it.
- Animate `transform` and `opacity` only. Anything else janks on a low-end GPU.
- **`prefers-reduced-motion: reduce` must be honoured** — replace movement with a
  cross-fade, never with nothing.

---

## 7. Touch and interaction

- **Minimum target: 44 × 44 px**, with ≥ 8 px between adjacent targets (NFR-12).
- Primary actions in the lower two-thirds; destructive actions never adjacent to
  a common one.
- Every interactive element has a visible focus ring (`--color-focus`, 2 px
  offset). Keyboard operability is not optional and is nearly free.
- Hover styles are progressive enhancement — most users never produce a hover, and
  a hover-only affordance is an invisible one.
- Long-press opens context actions; it must have a visible alternative, since
  long-press is undiscoverable on its own.

---

## 8. Component inventory (v1)

**Primitives** — Button (primary/secondary/ghost/danger; sm/md/lg) · IconButton ·
Input · Textarea (auto-grow) · Select · Checkbox · Radio · Switch · Chip ·
Avatar (with presence dot) · Badge · Spinner · Skeleton · Divider

**Feedback** — Toast · InlineAlert · EmptyState · ErrorState (with retry) ·
OfflineBanner · ProgressBar

**Layout** — AppShell · BottomTabBar · TopBar · NavRail (≥1024) · BottomSheet ·
Modal · Tabs · PullToRefresh · InfiniteList (virtualised)

**Domain**

| Component | Notes |
|---|---|
| `TierSwitcher` | Always visible (FR-01.3). The product's signature control |
| `PostCard` | Text/photo/video/reshare variants; engagement bar |
| `MediaCarousel` | Up to 10 images (FR-01.7), swipe, lazy |
| `VideoPlayer` | Adaptive bitrate, Data-Saver-aware, never autoplays metered |
| `EngagementBar` | Like · comment · share · save. Optimistic, reconciled |
| `StoryRing` | Unseen/seen/close-friends states |
| `StoryViewer` | Full-screen, tap-through, reply composer |
| `MessageBubble` | Carries `queued`/`sending`/`sent`/`delivered`/`read` — the resilience contract made visible |
| `ChatComposer` | Text, media, voice, sticker; works offline |
| `StickerCreator` | ≤5 s clip, ≤2 overlay lines (FR-04.3) |
| `WeeklyPictureSlot` | Upload, current entry, countdown to cutoff |
| `BadgeDisplay` | Gold/silver/bronze, tier-labelled |
| `RankingCard` | Explore only — never in the feed (FR-06.1) |
| `LocationPicker` | Cascading State → LGA → Town |
| `ReportSheet` | Reason taxonomy (FR-14.1) |
| `ConsentBlock` | Versioned, recorded (FR-12.9) |

---

## 9. Content and voice

- Nigerian English. Warm, direct, unperformed.
- Sentence case everywhere, including buttons. Never ALL CAPS.
- Buttons are verbs: "Post", "Send", "Follow" — not "OK", "Submit".
- Errors state the cause and the next step. *"Couldn't send — we saved it and
  we'll try again when you're back online."*
- Numbers abbreviate above 1,000: `1.2k`, `34k`.
- Timestamps are relative under a week, absolute after.
- Never blame the user. "That code didn't match" beats "You entered an invalid
  code."

---

## 10. Implementation notes

- Tokens live in one file, exported as CSS custom properties and as a TS object
  for the rare case a value is needed in JS.
- No inline hex outside the token file. Enforce with a lint rule — it is the only
  thing that keeps a system alive past month three.
- Ship a component gallery (Storybook or equivalent) from M0, rendering every
  component in **light and dark, at 360 px and 1024 px**. If the gallery does not
  show all four, drift is invisible until it is expensive.
- Contrast checks and the NFR-7 bundle budget run in CI.
