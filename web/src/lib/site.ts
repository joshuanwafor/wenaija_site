export const site = {
  name: "WeNaija",
  shortName: "WeNaija",
  tagline: "Nigeria's own social network",
  description:
    "WeNaija is a social network built around Nigeria's own geography — National, State, LGA and Town. Discover what's happening where you actually live, share stories, and chat on a network built for real Nigerian connections.",
  url: "https://wenaija.ng",
  email: "hello@wenaija.ng",
  // Pre-launch status. Everything user-facing reads from here so there is one
  // place to flip when the product ships.
  status: "in-development",
  launchWindow: "2027",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/preview", label: "Preview" },
  { href: "/geography", label: "Geography" },
  { href: "/about", label: "About" },
] as const;

/* ------------------------------------------------------------------ Pillars */

export type Pillar = {
  slug: string;
  code: string;
  title: string;
  summary: string;
  points: string[];
};

export const pillars: Pillar[] = [
  {
    slug: "feed",
    code: "F01",
    title: "The Geographic Feed",
    summary:
      "Four feeds, not one. National, State, LGA and Town — each ranked independently, so local content is never drowned out by national volume.",
    points: [
      "Switch between National, State, LGA and Town at any time",
      "Follow up to two states beyond your own, weighted equally",
      "Ranking built on saves and shares, not just passive scrolling",
      "Text, photo, video and reshares — compressed for real networks",
    ],
  },
  {
    slug: "stories",
    code: "F03",
    title: "Stories that start conversations",
    summary:
      "Photo, video, text and voice stories that last 24 hours — and a reaction that becomes a real message, not a floating emoji.",
    points: [
      "Four formats including voice notes",
      "React to a story and it lands in the poster's inbox as a DM",
      "Save anything to permanent Highlights before it expires",
      "Tag people with @mentions",
    ],
  },
  {
    slug: "chat",
    code: "F04",
    title: "Chat built for Nigerian networks",
    summary:
      "Messaging that assumes the connection will drop, because it will. Your message is saved and sent the moment you're back.",
    points: [
      "Messages queue offline and send themselves when signal returns",
      "SMS notification when someone can't be reached online",
      "Make your own stickers and GIFs from a 5-second clip",
      "Groups up to 500 with real admin controls",
    ],
  },
  {
    slug: "recognition",
    code: "F02 · F06",
    title: "Local recognition, weekly",
    summary:
      "One picture a week. Top of your city, your state or the country earns a badge — and rankings stay in Explore, never in your feed.",
    points: [
      "A weekly picture slot you can change any time before Sunday",
      "City, State and National badges with featured placement",
      "Monthly Top Creator for your region",
      "Zero leaderboards in the main feed. Ever.",
    ],
  },
];

/* --------------------------------------------------------------- Geography */

export const tiers = [
  {
    key: "national",
    label: "National",
    scope: "Nigeria",
    count: "1",
    body: "Everything, everywhere. Where you land on your first day, and the only way to reach content from states you don't follow.",
  },
  {
    key: "state",
    label: "State",
    scope: "36 states + FCT",
    count: "37",
    body: "Your home state, plus up to two more you choose to follow — blended with equal weight, because people belong to more than one place.",
  },
  {
    key: "lga",
    label: "LGA",
    scope: "Local Government Areas",
    count: "774",
    body: "The layer global platforms have never had. Nigeria's official local government structure, as a feed.",
  },
  {
    key: "town",
    label: "Town / City",
    scope: "Where you actually live",
    count: "—",
    body: "The finest grain: your town. Close enough that you recognise names, places and faces in the feed.",
  },
] as const;

/* ----------------------------------------------------------------- Problems */

export const problems = [
  {
    title: "Discovery isn't local",
    body: "Global feeds rank globally or nationally. They don't organise content the way Nigerians actually think about community — by state, by LGA, by town. Your neighbour's post competes with Lagos and loses.",
  },
  {
    title: "The network isn't assumed to fail",
    body: "Messaging apps are built for stable connectivity that large parts of Nigeria simply don't have. When the signal drops mid-conversation, the product should hold your message, not lose it.",
  },
  {
    title: "Access itself costs something",
    body: "A 60MB install is a real decision on a phone with 200MB free and data bought in ₦500 bundles. WeNaija opens from a link and installs to your home screen for a fraction of that.",
  },
];

/* ------------------------------------------------------------------- Status */

export type BuildPhase = {
  phase: string;
  title: string;
  body: string;
  state: "done" | "active" | "next";
};

export const buildStatus: BuildPhase[] = [
  {
    phase: "01",
    title: "Product definition",
    body: "Requirements, geography model, ranking design and the full v1 specification.",
    state: "done",
  },
  {
    phase: "02",
    title: "Web prototype",
    body: "The public site and interface preview you're looking at now.",
    state: "active",
  },
  {
    phase: "03",
    title: "Platform build",
    body: "Accounts and onboarding, the geographic feed, stories, chat, and the recognition system.",
    state: "next",
  },
  {
    phase: "04",
    title: "Single-state pilot",
    body: "A closed launch in one state, so local feeds have real density from day one.",
    state: "next",
  },
  {
    phase: "05",
    title: "Nationwide",
    body: "Open registration across all 36 states and the FCT.",
    state: "next",
  },
];

/* ---------------------------------------------------------------------- FAQ */

export const faqs = [
  {
    q: "When does WeNaija launch?",
    a: "We're building toward a closed pilot in a single state first, so that local feeds are actually populated when people arrive — an empty Town feed is worse than no Town feed. Join the waitlist and you'll hear from us before general registration opens.",
  },
  {
    q: "Is there an app to download?",
    a: "WeNaija starts on the web, and it's built mobile-first — designed for a phone screen before anything else. You open it from a link and add it to your home screen; no store, no 60MB install, no storage negotiation. Native Android and iOS apps follow.",
  },
  {
    q: "Do I need a Nigerian phone number?",
    a: "No. Diaspora Nigerians get full access with an international number — the whole point is staying connected to your state and town from wherever you are.",
  },
  {
    q: "How is this different from what I already use?",
    a: "The geography. Every other platform gives you one feed ranked for everyone. WeNaija gives you four, and the ones that matter most are the ones closest to you — your LGA and your town.",
  },
  {
    q: "Will my feed be full of leaderboards and rankings?",
    a: "No, and that's a hard rule rather than a preference. Rankings, badges and trending content live in Explore. The main feed stays a feed.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. There's no paid tier and no advertising at launch — the first version exists to prove the product works, not to monetise it.",
  },
];
