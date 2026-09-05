export type TierKey = "national" | "state" | "lga" | "town";

export type EngagementAction = "like" | "comment" | "share" | "save";

export type Author = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  stateCode: string;
  lga: string;
  town: string;
  /** Accounts under 30 days are excluded from rankings (FR-06.4). */
  accountAgeDays: number;
  badge?: "gold" | "silver" | "bronze";
};

export type Post = {
  id: string;
  authorId: string;
  /** Minutes before "now". Resolved to a timestamp on the client after mount. */
  ageMinutes: number;
  body: string;
  media?: { kind: "photo" | "video"; hue: number };
  stateCode: string;
  lga: string;
  town: string;
  counts: Record<EngagementAction, number> & { views: number };
  /** Marks the author's one weekly-picture entry (FR-02.3). */
  weeklyPicture?: boolean;
  /** Set on posts the viewer composed in this session. */
  own?: boolean;
  /** Composed while "offline" and not yet flushed. */
  queued?: boolean;
};

/** The signed-in viewer. Location decides which tiers they can see. */
export type Viewer = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  stateCode: string;
  lga: string;
  town: string;
  /** Up to 2 extra states, weighted equally with home (FR-01.5). */
  followedStates: string[];
};

/** What the viewer has done to a post, held separately from the post itself. */
export type ViewerEngagement = Partial<Record<EngagementAction, boolean>> & {
  /** Set once the post has been on screen for 3 seconds, so views count once. */
  viewed?: boolean;
};

export type FeedResult = {
  posts: ScoredPost[];
  /** Set when a thin tier was widened to its parent (FR-01.11). */
  fallbackFrom?: TierKey;
  fallbackTo?: TierKey;
  /** How many posts the requested tier had on its own, before widening. */
  tierCount: number;
};

export type ScoredPost = Post & {
  engagementScore: number;
  rankScore: number;
  ageHours: number;
  /** Why a post was left out of ranking, if it was. */
  excluded?: "new-account";
  /** The viewer authored this. Their own engagement on it must not score. */
  isOwn?: boolean;
};
