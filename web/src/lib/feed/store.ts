"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { AUTHORS_BY_ID, POSTS, VIEWER } from "./seed";
import {
  PARENT_TIER,
  THIN_TIER_THRESHOLD,
  matchesTier,
  score,
  sortByRank,
} from "./ranking";
import type {
  EngagementAction,
  FeedResult,
  Post,
  ScoredPost,
  TierKey,
  ViewerEngagement,
} from "./types";

const STORAGE_KEY = "wenaija.feed.v1";

type Persisted = {
  engagement: Record<string, ViewerEngagement>;
  /** Deltas applied on top of the seed corpus, so the seed stays pristine. */
  deltas: Record<string, Partial<Record<EngagementAction | "views", number>>>;
  ownPosts: Post[];
};

const EMPTY: Persisted = { engagement: {}, deltas: {}, ownPosts: [] };

/* --------------------------------------------------------- External store */
/**
 * A module-level store read through useSyncExternalStore, rather than state
 * hydrated inside an effect. The server and the first client render both see
 * EMPTY, so hydration matches; localStorage is read on first subscribe and
 * React picks up the changed snapshot itself.
 */

let state: Persisted = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): Persisted {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      engagement: parsed.engagement ?? {},
      deltas: parsed.deltas ?? {},
      ownPosts: parsed.ownPosts ?? [],
    };
  } catch {
    // A corrupt or unreadable store is not worth failing the page over.
    return EMPTY;
  }
}

function writeStorage(next: Persisted) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode, quota, blocked storage — the feed still works in memory.
  }
}

function subscribe(listener: () => void) {
  if (!loaded) {
    state = readStorage();
    loaded = true;
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => EMPTY;

function update(fn: (prev: Persisted) => Persisted) {
  const next = fn(state);
  if (next === state) return;
  state = next;
  writeStorage(next);
  for (const listener of listeners) listener();
}

/* --------------------------------------------------------------- The hook */

export function useFeedStore() {
  const persisted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [online, setOnlineState] = useState(true);

  /** Seed corpus + the viewer's own posts, with deltas applied. */
  const posts = useMemo<Post[]>(() => {
    const all = [...POSTS, ...persisted.ownPosts];
    return all.map((p) => {
      const d = persisted.deltas[p.id];
      if (!d) return p;
      return {
        ...p,
        counts: {
          like: p.counts.like + (d.like ?? 0),
          comment: p.counts.comment + (d.comment ?? 0),
          share: p.counts.share + (d.share ?? 0),
          save: p.counts.save + (d.save ?? 0),
          views: p.counts.views + (d.views ?? 0),
        },
      };
    });
  }, [persisted]);

  const engagementFor = useCallback(
    (postId: string): ViewerEngagement => persisted.engagement[postId] ?? {},
    [persisted],
  );

  /** Toggle like/save, or increment share/comment. */
  const engage = useCallback(
    (postId: string, action: EngagementAction, selfPost = false) => {
      update((prev) => {
        const current = prev.engagement[postId] ?? {};
        const isToggle = action === "like" || action === "save";
        const nextOn = isToggle ? !current[action] : true;
        // Self-interaction never contributes to a ranking score (FR-06.6).
        const delta = selfPost ? 0 : isToggle ? (nextOn ? 1 : -1) : 1;

        return {
          ...prev,
          engagement: {
            ...prev.engagement,
            [postId]: { ...current, [action]: nextOn },
          },
          deltas: {
            ...prev.deltas,
            [postId]: {
              ...prev.deltas[postId],
              [action]: (prev.deltas[postId]?.[action] ?? 0) + delta,
            },
          },
        };
      });
    },
    [],
  );

  /** A qualifying view — 3 seconds on screen (FR-01.9). Counted once. */
  const recordView = useCallback((postId: string) => {
    update((prev) => {
      if (prev.engagement[postId]?.viewed) return prev;
      return {
        ...prev,
        engagement: {
          ...prev.engagement,
          [postId]: { ...prev.engagement[postId], viewed: true },
        },
        deltas: {
          ...prev.deltas,
          [postId]: {
            ...prev.deltas[postId],
            views: (prev.deltas[postId]?.views ?? 0) + 1,
          },
        },
      };
    });
  }, []);

  const compose = useCallback((body: string, opts: { queued: boolean }) => {
    const post: Post = {
      id: `own-${Date.now()}`,
      authorId: VIEWER.id,
      ageMinutes: 0,
      body,
      stateCode: VIEWER.stateCode,
      lga: VIEWER.lga,
      town: VIEWER.town,
      counts: { like: 0, comment: 0, share: 0, save: 0, views: 0 },
      own: true,
      queued: opts.queued,
    };
    update((prev) => ({ ...prev, ownPosts: [post, ...prev.ownPosts] }));
    return post.id;
  }, []);

  /**
   * Reconnecting flushes the outbox (FR-04.2a). This belongs on the transition
   * itself, not in an effect watching `online` — the flush is a consequence of
   * the connection returning, not a state we need to synchronise toward.
   */
  const setOnline = useCallback((next: boolean) => {
    setOnlineState(next);
    if (next) {
      update((prev) =>
        prev.ownPosts.some((p) => p.queued)
          ? { ...prev, ownPosts: prev.ownPosts.map((p) => ({ ...p, queued: false })) }
          : prev,
      );
    }
  }, []);

  const reset = useCallback(() => {
    update(() => EMPTY);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clean up */
    }
  }, []);

  return {
    /** False until localStorage has been read, so the UI can show skeletons. */
    mounted: loaded,
    viewer: VIEWER,
    authors: AUTHORS_BY_ID,
    posts,
    engagementFor,
    engage,
    recordView,
    compose,
    reset,
    online,
    setOnline,
    queuedCount: persisted.ownPosts.filter((p) => p.queued).length,
  };
}

/* ------------------------------------------------------------ Feed assembly */

/**
 * A post you just made goes to the top of the tier you made it in, regardless
 * of score — otherwise a fresh post with no engagement sorts last and you never
 * see the thing you just wrote. It still earns no ranking score of its own.
 */
function pinOwn(ranked: ScoredPost[]): ScoredPost[] {
  const own = ranked.filter((p) => p.own);
  if (own.length === 0) return ranked;
  return [...own, ...ranked.filter((p) => !p.own)];
}

/**
 * Assemble one tier's feed: filter by geography, rank, and widen to the parent
 * tier when the result is too thin to be worth showing (FR-01.11).
 */
export function buildFeed(
  posts: Post[],
  tier: TierKey,
  viewer: typeof VIEWER,
  authors = AUTHORS_BY_ID,
): FeedResult {
  const inTier = posts.filter((p) => matchesTier(p, tier, viewer));
  const ranked = pinOwn(sortByRank(score(inTier, authors, viewer.id)));

  if (ranked.length >= THIN_TIER_THRESHOLD) {
    return { posts: ranked, tierCount: ranked.length };
  }

  const parent = PARENT_TIER[tier];
  if (!parent) return { posts: ranked, tierCount: ranked.length };

  const widened = sortByRank(
    score(
      posts.filter((p) => matchesTier(p, parent, viewer)),
      authors,
      viewer.id,
    ),
  );

  // Keep the tier's own posts on top, then fill from the parent.
  const ownIds = new Set(ranked.map((p) => p.id));
  return {
    posts: [...ranked, ...widened.filter((p) => !ownIds.has(p.id))],
    fallbackFrom: tier,
    fallbackTo: parent,
    tierCount: ranked.length,
  };
}
