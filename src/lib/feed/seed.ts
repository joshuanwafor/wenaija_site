import type { Author, Post, Viewer } from "./types";

/**
 * A seeded corpus. Deterministic — no Math.random, no Date.now at module
 * scope — so server and client render the same thing before hydration.
 *
 * The viewer is placed in Obukpa, Nsukka LGA, Enugu State, following Lagos and
 * Rivers. That gives every tier something to show while keeping the Town tier
 * deliberately thin, so the fallback behaviour is visible without contriving it.
 */

export const VIEWER: Viewer = {
  id: "u-you",
  name: "You",
  handle: "you",
  initials: "YO",
  stateCode: "EN",
  lga: "Nsukka",
  town: "Obukpa",
  followedStates: ["LA", "RI"],
};

export const AUTHORS: Author[] = [
  { id: "u1", name: "Amara Eze", handle: "amaraeze", initials: "AE", stateCode: "LA", lga: "Eti-Osa", town: "Lekki", accountAgeDays: 412, badge: "gold" },
  { id: "u2", name: "Musa Ibrahim", handle: "musaib", initials: "MI", stateCode: "KN", lga: "Nassarawa", town: "Hotoro", accountAgeDays: 288 },
  { id: "u3", name: "Tolu Adeyemi", handle: "toluade", initials: "TA", stateCode: "FC", lga: "Abuja Municipal", town: "Wuse", accountAgeDays: 190 },
  { id: "u4", name: "Chinelo Obi", handle: "chinelo", initials: "CO", stateCode: "EN", lga: "Enugu North", town: "Ogui", accountAgeDays: 340, badge: "silver" },
  { id: "u5", name: "Ike Nwankwo", handle: "ikenw", initials: "IN", stateCode: "EN", lga: "Udi", town: "Ngwo", accountAgeDays: 155 },
  { id: "u6", name: "Ngozi Ani", handle: "ngoziani", initials: "NA", stateCode: "EN", lga: "Enugu East", town: "Abakpa", accountAgeDays: 96 },
  { id: "u7", name: "Emeka Ugwu", handle: "emekau", initials: "EU", stateCode: "EN", lga: "Nsukka", town: "Nsukka", accountAgeDays: 520, badge: "gold" },
  { id: "u8", name: "Adaeze Okafor", handle: "adaeze", initials: "AO", stateCode: "EN", lga: "Nsukka", town: "Nsukka", accountAgeDays: 210 },
  { id: "u9", name: "Chidi Eze", handle: "chidieze", initials: "CE", stateCode: "EN", lga: "Nsukka", town: "Obukpa", accountAgeDays: 78 },
  { id: "u10", name: "Nneka Odo", handle: "nnekaodo", initials: "NO", stateCode: "EN", lga: "Nsukka", town: "Obukpa", accountAgeDays: 141 },
  { id: "u11", name: "Bayo Salami", handle: "bayos", initials: "BS", stateCode: "LA", lga: "Ikeja", town: "Ikeja GRA", accountAgeDays: 265 },
  { id: "u12", name: "Funmi Bakare", handle: "funmib", initials: "FB", stateCode: "LA", lga: "Alimosho", town: "Egbeda", accountAgeDays: 133 },
  { id: "u13", name: "Tamuno Briggs", handle: "tamuno", initials: "TB", stateCode: "RI", lga: "Port Harcourt", town: "Old GRA", accountAgeDays: 301 },
  { id: "u14", name: "Ibiso Wokoma", handle: "ibisow", initials: "IW", stateCode: "RI", lga: "Obio-Akpor", town: "Choba", accountAgeDays: 88 },
  { id: "u15", name: "Halima Yusuf", handle: "halimay", initials: "HY", stateCode: "KD", lga: "Kaduna North", town: "Malali", accountAgeDays: 174 },
  { id: "u16", name: "Obinna Nwosu", handle: "obinnan", initials: "ON", stateCode: "EN", lga: "Nsukka", town: "Opi", accountAgeDays: 12 },
  { id: "u17", name: "Ifeoma Chukwu", handle: "ifeomac", initials: "IC", stateCode: "EN", lga: "Nsukka", town: "Nsukka", accountAgeDays: 19 },
  { id: "u18", name: "Segun Ojo", handle: "segunojo", initials: "SO", stateCode: "OY", lga: "Ibadan North", town: "Bodija", accountAgeDays: 227 },
];

type Seed = Omit<Post, "counts"> & {
  counts: [like: number, comment: number, share: number, save: number, views: number];
};

const S: Seed[] = [
  // ---------------------------------------------------------- Town: Obukpa
  { id: "p1", authorId: "u9", ageMinutes: 240, stateCode: "EN", lga: "Nsukka", town: "Obukpa",
    body: "Water don come back for our side. Three weeks!", counts: [97, 29, 8, 22, 1840] },
  { id: "p2", authorId: "u10", ageMinutes: 420, stateCode: "EN", lga: "Nsukka", town: "Obukpa",
    body: "Community meeting Saturday 4pm at the town hall. Levy discussion, please come.", counts: [63, 14, 11, 18, 1120] },
  { id: "p3", authorId: "u9", ageMinutes: 1500, stateCode: "EN", lga: "Nsukka", town: "Obukpa",
    body: "Whoever dey park motor for front of the borehole — abeg. People need to fetch.", counts: [140, 47, 6, 9, 2310] },

  // ------------------------------------------------------------- LGA: Nsukka
  { id: "p4", authorId: "u7", ageMinutes: 35, stateCode: "EN", lga: "Nsukka", town: "Nsukka",
    body: "Ogige market prices this week — tomato basket down to ₦18k from ₦26k. Go and buy.",
    counts: [268, 37, 41, 94, 3400], weeklyPicture: true, media: { kind: "photo", hue: 128 } },
  { id: "p5", authorId: "u8", ageMinutes: 120, stateCode: "EN", lga: "Nsukka", town: "Nsukka",
    body: "UNN convocation ground being set up. Anybody know if the gate by Odenigbo will be open tomorrow?",
    counts: [143, 52, 9, 41, 2900], media: { kind: "photo", hue: 96 } },
  { id: "p6", authorId: "u7", ageMinutes: 600, stateCode: "EN", lga: "Nsukka", town: "Nsukka",
    body: "Road from Opi junction has been graded. First time in maybe four years.", counts: [412, 88, 63, 121, 7200] },
  { id: "p7", authorId: "u17", ageMinutes: 90, stateCode: "EN", lga: "Nsukka", town: "Nsukka",
    body: "New to WeNaija. Anybody know a good welder around Odenigbo?", counts: [8, 12, 0, 1, 210] },
  { id: "p8", authorId: "u16", ageMinutes: 300, stateCode: "EN", lga: "Nsukka", town: "Opi",
    body: "Opi market don move to the new site. Old place empty now.", counts: [22, 6, 3, 4, 480] },
  { id: "p9", authorId: "u8", ageMinutes: 2880, stateCode: "EN", lga: "Nsukka", town: "Nsukka",
    body: "Thread: every keke route in Nsukka and what it should actually cost. Save this one.",
    counts: [880, 210, 340, 620, 19400] },

  // ----------------------------------------------------------- State: Enugu
  { id: "p10", authorId: "u4", ageMinutes: 60, stateCode: "EN", lga: "Enugu North", town: "Ogui",
    body: "Enugu State University resumption pushed to the 14th. Official memo is out, don't rush back.",
    counts: [640, 64, 88, 187, 12800] },
  { id: "p11", authorId: "u5", ageMinutes: 180, stateCode: "EN", lga: "Udi", town: "Ngwo",
    body: "Ngwo Pine Forest this morning. Still the most underrated spot in the whole state.",
    counts: [812, 41, 96, 233, 15600], media: { kind: "photo", hue: 150 } },
  { id: "p12", authorId: "u6", ageMinutes: 300, stateCode: "EN", lga: "Enugu East", town: "Abakpa",
    body: "Light don steady for Abakpa since Monday. Make I no talk too much.", counts: [519, 118, 34, 76, 9800] },
  { id: "p13", authorId: "u4", ageMinutes: 1440, stateCode: "EN", lga: "Enugu North", town: "Asata",
    body: "Enugu → Onitsha road update: the bad portion after Ninth Mile is patched. About 40 minutes saved.",
    counts: [1240, 156, 288, 502, 31000] },
  { id: "p14", authorId: "u5", ageMinutes: 4320, stateCode: "EN", lga: "Udi", town: "Udi",
    body: "Coal Camp history thread — old pictures my father kept. Long one but worth it.",
    counts: [2100, 340, 610, 1180, 68000], media: { kind: "photo", hue: 40 } },

  // ---------------------------------------------------- Followed state: Lagos
  { id: "p15", authorId: "u1", ageMinutes: 120, stateCode: "LA", lga: "Eti-Osa", town: "Lekki",
    body: "The new Lagos–Ibadan train schedule dropped. Six services a day now. Anybody tried the 6am one?",
    counts: [1900, 128, 410, 412, 48000] },
  { id: "p16", authorId: "u11", ageMinutes: 240, stateCode: "LA", lga: "Ikeja", town: "Ikeja GRA",
    body: "Third Mainland closed again this weekend. Plan for it.", counts: [1560, 203, 690, 340, 52000] },
  { id: "p17", authorId: "u12", ageMinutes: 720, stateCode: "LA", lga: "Alimosho", town: "Egbeda",
    body: "Egbeda to Ikeja by bus is now ₦1,200. Last month it was ₦800.", counts: [980, 312, 155, 210, 28000] },

  // --------------------------------------------------- Followed state: Rivers
  { id: "p18", authorId: "u13", ageMinutes: 200, stateCode: "RI", lga: "Port Harcourt", town: "Old GRA",
    body: "PH refinery convoy on Aba Road this morning — avoid it if you can.", counts: [740, 96, 188, 164, 21000] },
  { id: "p19", authorId: "u14", ageMinutes: 900, stateCode: "RI", lga: "Obio-Akpor", town: "Choba",
    body: "Uniport students: the new shuttle stop by Choba gate is live from Monday.",
    counts: [430, 71, 62, 118, 13400], media: { kind: "photo", hue: 200 } },

  // ------------------------------------ National only (states not followed)
  { id: "p20", authorId: "u2", ageMinutes: 240, stateCode: "KN", lga: "Nassarawa", town: "Hotoro",
    body: "Harmattan don start for north. Cream and lip balm, make una prepare.",
    counts: [1400, 96, 288, 288, 41000], media: { kind: "photo", hue: 30 } },
  { id: "p21", authorId: "u3", ageMinutes: 360, stateCode: "FC", lga: "Abuja Municipal", town: "Wuse",
    body: "Nigerian devs — what are you actually being paid in 2027? Anonymous thread, drop your range.",
    counts: [2100, 341, 520, 903, 76000] },
  { id: "p22", authorId: "u15", ageMinutes: 480, stateCode: "KD", lga: "Kaduna North", town: "Malali",
    body: "Kaduna–Abuja train tickets now on the app only. No more queue at the station.",
    counts: [1180, 142, 390, 470, 34000] },
  { id: "p23", authorId: "u18", ageMinutes: 1080, stateCode: "OY", lga: "Ibadan North", town: "Bodija",
    body: "Bodija market fire — everybody safe, but plenty shops gone. Details in comments.",
    counts: [3200, 890, 1400, 760, 120000] },
  { id: "p24", authorId: "u2", ageMinutes: 2160, stateCode: "KN", lga: "Fagge", town: "Sabon Gari",
    body: "Sabon Gari market: full price list for building materials this week.",
    counts: [960, 180, 240, 590, 26000] },
];

export const POSTS: Post[] = S.map((s) => ({
  ...s,
  counts: {
    like: s.counts[0],
    comment: s.counts[1],
    share: s.counts[2],
    save: s.counts[3],
    views: s.counts[4],
  },
}));

export const AUTHORS_BY_ID: Record<string, Author> = Object.fromEntries(
  AUTHORS.map((a) => [a.id, a]),
);
