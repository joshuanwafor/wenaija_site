import type {
  Author,
  EngagementAction,
  Post,
  ScoredPost,
  TierKey,
  Viewer,
} from "./types";

/**
 * Engagement weights, from the PRD (FR-01.9). Save is the strongest intent
 * signal; a view barely registers and only counts past 3 seconds on screen.
 */
export const WEIGHTS: Record<EngagementAction | "views", number> = {
  save: 4,
  share: 3,
  comment: 2,
  like: 1,
  views: 0.1,
};

/**
 * Time decay (FR-01.10). Without it a single viral post occupies a tier
 * permanently, which is the failure mode the source PRD's weights alone would
 * have produced.
 *
 * score / (ageHours + 2)^GRAVITY — the +2 stops brand-new posts dividing by
 * something near zero and dominating on a handful of likes.
 */
export const GRAVITY = 1.35;

export function engagementScore(post: Post): number {
  const c = post.counts;
  return (
    c.save * WEIGHTS.save +
    c.share * WEIGHTS.share +
    c.comment * WEIGHTS.comment +
    c.like * WEIGHTS.like +
    c.views * WEIGHTS.views
  );
}

export function rankScore(post: Post): number {
  const ageHours = post.ageMinutes / 60;
  return engagementScore(post) / Math.pow(ageHours + 2, GRAVITY);
}

/** Which tiers a post can appear in, for a given viewer. */
export function matchesTier(
  post: Post,
  tier: TierKey,
  viewer: Viewer,
): boolean {
  switch (tier) {
    case "national":
      // Everything. The only way to reach states you don't follow (FR-01.6).
      return true;
    case "state":
      // Home state plus up to 2 followed, weighted equally (FR-01.5).
      return (
        post.stateCode === viewer.stateCode ||
        viewer.followedStates.includes(post.stateCode)
      );
    case "lga":
      return post.stateCode === viewer.stateCode && post.lga === viewer.lga;
    case "town":
      return (
        post.stateCode === viewer.stateCode &&
        post.lga === viewer.lga &&
        post.town === viewer.town
      );
  }
}

export const PARENT_TIER: Record<TierKey, TierKey | null> = {
  town: "lga",
  lga: "state",
  state: "national",
  national: null,
};

/** Below this a tier is "thin" and widens to its parent (FR-01.11). */
export const THIN_TIER_THRESHOLD = 4;

export function score(
  posts: Post[],
  authors: Record<string, Author>,
  viewerId: string,
): ScoredPost[] {
  return posts.map((post) => {
    const author = authors[post.authorId];
    // Only the account-age rule removes a post from ranking (FR-06.4).
    // FR-06.6 is about self-interaction not counting toward a score, which is
    // enforced where engagement is recorded — it does not stop your own posts
    // from ranking in your own feed.
    const excluded =
      author && author.accountAgeDays < 30 ? ("new-account" as const) : undefined;

    return {
      ...post,
      engagementScore: engagementScore(post),
      rankScore: excluded ? 0 : rankScore(post),
      ageHours: post.ageMinutes / 60,
      excluded,
      isOwn: post.authorId === viewerId,
    };
  });
}

export function sortByRank(posts: ScoredPost[]): ScoredPost[] {
  return [...posts].sort((a, b) => {
    if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
    // Deterministic tie-break: earliest post wins, as documented for awards.
    return a.ageMinutes - b.ageMinutes;
  });
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(Math.round(n));
}

export function formatAge(minutes: number): string {
  if (minutes < 1) return "now";
  if (minutes < 60) return `${Math.floor(minutes)}m`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h`;
  return `${Math.floor(hours / 24)}d`;
}
