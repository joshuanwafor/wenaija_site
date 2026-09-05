/**
 * Mock content for the interface preview. None of this is real — it exists to
 * show how the four geographic tiers change what you see, which is the single
 * idea the whole product rests on.
 */

export type MockPost = {
  id: string;
  author: string;
  handle: string;
  initials: string;
  place: string;
  time: string;
  body: string;
  media?: "photo" | "video";
  saves: number;
  comments: number;
  likes: number;
  badge?: "gold" | "silver" | "bronze";
};

export type TierKey = "national" | "state" | "lga" | "town";

export const TIER_LABELS: Record<TierKey, string> = {
  national: "National",
  state: "Enugu",
  lga: "Nsukka",
  town: "Obukpa",
};

export const TIER_SCOPE: Record<TierKey, string> = {
  national: "All of Nigeria",
  state: "Enugu State",
  lga: "Nsukka LGA",
  town: "Obukpa, Nsukka",
};

export const MOCK_FEED: Record<TierKey, MockPost[]> = {
  national: [
    {
      id: "n1",
      author: "Amara Eze",
      handle: "amaraeze",
      initials: "AE",
      place: "Lagos",
      time: "2h",
      body: "The new Lagos–Ibadan train schedule dropped. Six services a day now. Anybody tried the 6am one?",
      saves: 412,
      comments: 128,
      likes: 1900,
      badge: "gold",
    },
    {
      id: "n2",
      author: "Musa Ibrahim",
      handle: "musaib",
      initials: "MI",
      place: "Kano",
      time: "4h",
      body: "Harmattan don start for north. Cream and lip balm, make una prepare.",
      media: "photo",
      saves: 288,
      comments: 96,
      likes: 1400,
    },
    {
      id: "n3",
      author: "Tolu Adeyemi",
      handle: "toluade",
      initials: "TA",
      place: "Abuja",
      time: "6h",
      body: "Nigerian devs — what are you actually being paid in 2027? Anonymous thread, drop your range.",
      saves: 903,
      comments: 341,
      likes: 2100,
    },
  ],
  state: [
    {
      id: "s1",
      author: "Chinelo Obi",
      handle: "chinelo",
      initials: "CO",
      place: "Enugu North",
      time: "1h",
      body: "Enugu State University resumption pushed to the 14th. Official memo is out, don't rush back.",
      saves: 187,
      comments: 64,
      likes: 640,
      badge: "silver",
    },
    {
      id: "s2",
      author: "Ike Nwankwo",
      handle: "ikenw",
      initials: "IN",
      place: "Udi",
      time: "3h",
      body: "Ngwo Pine Forest this morning. Still the most underrated spot in the whole state.",
      media: "photo",
      saves: 233,
      comments: 41,
      likes: 812,
    },
    {
      id: "s3",
      author: "Ngozi Ani",
      handle: "ngoziani",
      initials: "NA",
      place: "Enugu East",
      time: "5h",
      body: "Light don steady for Abakpa since Monday. Make I no talk too much.",
      saves: 76,
      comments: 118,
      likes: 519,
    },
  ],
  lga: [
    {
      id: "l1",
      author: "Emeka Ugwu",
      handle: "emekau",
      initials: "EU",
      place: "Nsukka",
      time: "35m",
      body: "Ogige market prices this week — tomato basket down to ₦18k from ₦26k. Go and buy.",
      saves: 94,
      comments: 37,
      likes: 268,
      badge: "gold",
    },
    {
      id: "l2",
      author: "Adaeze Okafor",
      handle: "adaeze",
      initials: "AO",
      place: "Nsukka",
      time: "2h",
      body: "UNN convocation ground being set up. Anybody know if the gate by Odenigbo will be open tomorrow?",
      media: "photo",
      saves: 41,
      comments: 52,
      likes: 143,
    },
    {
      id: "l3",
      author: "Chidi Eze",
      handle: "chidieze",
      initials: "CE",
      place: "Obukpa",
      time: "4h",
      body: "Water don come back for our side. Three weeks!",
      saves: 22,
      comments: 29,
      likes: 97,
    },
  ],
  town: [
    {
      id: "t1",
      author: "Chidi Eze",
      handle: "chidieze",
      initials: "CE",
      place: "Obukpa",
      time: "4h",
      body: "Water don come back for our side. Three weeks!",
      saves: 22,
      comments: 29,
      likes: 97,
      badge: "gold",
    },
    {
      id: "t2",
      author: "Nneka Odo",
      handle: "nnekaodo",
      initials: "NO",
      place: "Obukpa",
      time: "7h",
      body: "Community meeting Saturday 4pm at the town hall. Levy discussion, please come.",
      saves: 18,
      comments: 14,
      likes: 63,
    },
  ],
};

export type MockMessage = {
  id: string;
  from: "me" | "them";
  body: string;
  time: string;
  state?: "queued" | "sent" | "delivered" | "read" | "relayed";
  quoted?: string;
};

export const MOCK_THREAD: MockMessage[] = [
  {
    id: "m1",
    from: "them",
    body: "Abeg you still dey Nsukka?",
    time: "18:02",
  },
  {
    id: "m2",
    from: "me",
    body: "Yes o, till Sunday",
    time: "18:04",
    state: "read",
  },
  {
    id: "m3",
    from: "them",
    body: "Perfect. I go pass your side tomorrow",
    time: "18:05",
  },
  {
    id: "m4",
    from: "me",
    body: "Network don cut for my side. Send me the time when you fit",
    time: "18:11",
    state: "queued",
  },
  {
    id: "m5",
    from: "me",
    body: "Around 3pm works",
    time: "18:11",
    state: "relayed",
  },
];

export type MockStory = {
  id: string;
  name: string;
  initials: string;
  seen: boolean;
  own?: boolean;
};

export const MOCK_STORIES: MockStory[] = [
  { id: "own", name: "Your story", initials: "YS", seen: false, own: true },
  { id: "s1", name: "Adaeze", initials: "AO", seen: false },
  { id: "s2", name: "Emeka", initials: "EU", seen: false },
  { id: "s3", name: "Chinelo", initials: "CO", seen: true },
  { id: "s4", name: "Ike", initials: "IN", seen: true },
  { id: "s5", name: "Ngozi", initials: "NA", seen: true },
];
