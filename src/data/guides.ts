/** Content for the Guides section. */

export const GUIDE_TYPES = [
  "All",
  "Beginner",
  "Walkthrough",
  "Builds",
  "Collectibles",
  "Endgame",
] as const;

export type GuideType = (typeof GUIDE_TYPES)[number];

export type Difficulty = "Starter" | "Intermediate" | "Advanced";

export type Guide = {
  id: string;
  game: string;
  title: string;
  summary: string;
  type: Exclude<GuideType, "All">;
  difficulty: Difficulty;
  readTime: string;
  updated: string;
  author: string;
};

export const LEAD_GUIDE = {
  id: "g-lead",
  game: "Ashen Trials",
  title: "The complete Ashen Trials starter guide",
  summary:
    "Thirty minutes of reading that will save you the ten hours most players lose to the first region. Stat priorities, the three weapons worth upgrading early, and the two bosses you should walk past.",
  type: "Beginner" as const,
  difficulty: "Starter" as const,
  readTime: "18 min",
  updated: "Updated 2 days ago",
  author: "Renata Solís",
  chapters: [
    "Reading the stamina bar",
    "Stat priorities for the first 20 hours",
    "Weapons worth upgrading early",
    "Bosses you can safely skip",
    "When to leave the Ash Reach",
  ],
};

export const GUIDES: Guide[] = [
  {
    id: "g1",
    game: "Ashen Trials",
    title: "Every Ember Shrine location, in route order",
    summary: "All 34 shrines mapped into a single loop that never doubles back.",
    type: "Collectibles",
    difficulty: "Intermediate",
    readTime: "12 min",
    updated: "Updated yesterday",
    author: "Dan Whitfield",
  },
  {
    id: "g2",
    game: "Ashen Trials",
    title: "The three builds that carry you through the Ash Reach",
    summary: "Bleed, poise-break, and a caster build that actually works before level 60.",
    type: "Builds",
    difficulty: "Advanced",
    readTime: "15 min",
    updated: "Updated 3 days ago",
    author: "Renata Solís",
  },
  {
    id: "g3",
    game: "Hollow Vector",
    title: "How to read a Hollow Vector run in the first two rooms",
    summary: "The seed tells you what it wants. Here is how to listen before you commit.",
    type: "Beginner",
    difficulty: "Starter",
    readTime: "8 min",
    updated: "Updated 4 days ago",
    author: "Amara Osei",
  },
  {
    id: "g4",
    game: "Hollow Vector",
    title: "Ascension 12 without the meta relics",
    summary: "A clear route through the hardest difficulty using only common drops.",
    type: "Endgame",
    difficulty: "Advanced",
    readTime: "20 min",
    updated: "Updated 5 days ago",
    author: "Dan Whitfield",
  },
  {
    id: "g5",
    game: "Driftbound",
    title: "Braking points for all sixteen launch tracks",
    summary: "Marker-by-marker, with the two corners on each track that decide the lap.",
    type: "Walkthrough",
    difficulty: "Intermediate",
    readTime: "22 min",
    updated: "Updated 1 week ago",
    author: "Amara Osei",
  },
  {
    id: "g6",
    game: "Driftbound",
    title: "Tuning setups that survive the wet-weather rounds",
    summary: "Three loadouts covering every surface the season two ladder throws at you.",
    type: "Builds",
    difficulty: "Advanced",
    readTime: "11 min",
    updated: "Updated 1 week ago",
    author: "Tomás Bauman",
  },
  {
    id: "g7",
    game: "Cinder Watch",
    title: "Ghosting the Harbour District",
    summary: "A no-alarm, no-takedown route through the game's hardest open level.",
    type: "Walkthrough",
    difficulty: "Advanced",
    readTime: "14 min",
    updated: "Updated 1 week ago",
    author: "Ilse Zawadzka",
  },
  {
    id: "g8",
    game: "Loam",
    title: "Your first four seasons, planned",
    summary: "What to plant, what to ignore, and the one building worth rushing.",
    type: "Beginner",
    difficulty: "Starter",
    readTime: "9 min",
    updated: "Updated 2 weeks ago",
    author: "Ana Bautista",
  },
  {
    id: "g9",
    game: "Marrow Deep",
    title: "Every resource cache before the second descent",
    summary: "Enough ammo and filters to reach the final act without rationing.",
    type: "Collectibles",
    difficulty: "Intermediate",
    readTime: "10 min",
    updated: "Updated 2 weeks ago",
    author: "Ilse Zawadzka",
  },
];

export const POPULAR_GUIDES = [
  { title: "Ashen Trials: stat priorities cheat sheet", views: "184k" },
  { title: "Hollow Vector: relic tier list, season 3", views: "142k" },
  { title: "Driftbound: the ten-minute setup guide", views: "97k" },
  { title: "Loam: crop profit table, year one", views: "88k" },
  { title: "Cinder Watch: all silent takedown tools", views: "71k" },
];
