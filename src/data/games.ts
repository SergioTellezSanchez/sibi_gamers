/**
 * Static content for the homepage.
 *
 * This is the seed dataset lifted from the design. Everything is served
 * through `getYearData()`, so swapping in a real API later means replacing
 * that one function — no component touches these arrays directly.
 */

export const CURRENT_YEAR = 2026;

export type Game = {
  rank: number;
  title: string;
  /** Month only in the seed data; `getYearData` appends the selected year. */
  date: string;
  platforms: string[];
  score: number;
  studio: string;
  country: string;
  director: string;
  budget: string;
  genre: string;
  length: string;
  sourceCount: number;
};

export type TopGame = {
  rank: number;
  title: string;
  platforms: string[];
  genres: string[];
  score: number;
  sourceCount: number;
};

export type NewsItem = {
  source: string;
  headline: string;
  date: string;
};

export type ReviewItem = {
  title: string;
  excerpt: string;
  score: number;
};

export type Recommendation = {
  title: string;
  reason: string;
  score: number;
};

/** Cover / thumbnail fills, drawn from the ember end of the brand ramp. */
export const GRADIENTS = [
  "#6A040F",
  "#9D0208",
  "#D00000",
  "#DC2F02",
  "#7C030C",
  "#B00105",
];

export const DECADES = [
  { label: "2020s", start: 2020, end: 2029 },
  { label: "2010s", start: 2010, end: 2019 },
  { label: "2000s", start: 2000, end: 2009 },
  { label: "1990s", start: 1990, end: 1999 },
  { label: "1980s", start: 1980, end: 1989 },
] as const;

export type Decade = (typeof DECADES)[number];

const TOP_GAMES: TopGame[] = [
  {
    rank: 1,
    title: "Ashen Trials",
    platforms: ["PC", "PS5"],
    genres: ["Action RPG"],
    score: 94,
    sourceCount: 51,
  },
  {
    rank: 2,
    title: "Hollow Vector",
    platforms: ["PC", "Xbox", "Switch"],
    genres: ["Roguelike"],
    score: 91,
    sourceCount: 38,
  },
  {
    rank: 3,
    title: "Driftbound",
    platforms: ["PS5", "Xbox"],
    genres: ["Racing"],
    score: 89,
    sourceCount: 44,
  },
];

/** Seed rows carry no `sourceCount`; `getYearData` derives it. */
type SeedGame = Omit<Game, "sourceCount">;

const RANKED_GAMES: SeedGame[] = [
  { rank: 4, title: "Cinder Watch", date: "Mar", platforms: ["PC", "PS5"], score: 88, studio: "Vault Nine", country: "Sweden", director: "M. Lindqvist", budget: "$48M", genre: "Stealth action", length: "24h" },
  { rank: 5, title: "Static Fields", date: "Feb", platforms: ["PC"], score: 86, studio: "Halfmast", country: "Canada", director: "R. Okonkwo", budget: "$9M", genre: "Sim", length: "60h+" },
  { rank: 6, title: "Loam", date: "Jan", platforms: ["Switch", "PC"], score: 84, studio: "Cortina Studio", country: "Mexico", director: "A. Bautista", budget: "$4M", genre: "Farming", length: "40h" },
  { rank: 7, title: "Nightfall Courier", date: "Apr", platforms: ["Xbox", "PC"], score: 82, studio: "Grey Harbour", country: "UK", director: "J. Whitlock", budget: "$31M", genre: "Open world", length: "35h" },
  { rank: 8, title: "Marrow Deep", date: "Dec", platforms: ["PS5"], score: 79, studio: "Kettle & Bone", country: "Poland", director: "I. Zawadzka", budget: "$22M", genre: "Survival horror", length: "18h" },
  { rank: 9, title: "Quietstone", date: "May", platforms: ["PC", "Switch"], score: 77, studio: "Northlight Craft", country: "Finland", director: "S. Aalto", budget: "$6M", genre: "Adventure", length: "12h" },
  { rank: 10, title: "Vellum & Ash", date: "Feb", platforms: ["PC"], score: 75, studio: "Foldtable", country: "Japan", director: "K. Mori", budget: "$3M", genre: "Deckbuilder", length: "50h+" },
  { rank: 11, title: "Skiff Runner", date: "Jun", platforms: ["PS5", "Xbox", "PC"], score: 74, studio: "Tidewright", country: "Brazil", director: "L. Ferreira", budget: "$27M", genre: "Platformer", length: "15h" },
  { rank: 12, title: "Ferrous Dawn", date: "Mar", platforms: ["PC"], score: 71, studio: "Anvil Grade", country: "Germany", director: "T. Baumann", budget: "$14M", genre: "RTS", length: "30h" },
  { rank: 13, title: "Paper Tide", date: "Jan", platforms: ["Switch"], score: 69, studio: "Sunfold", country: "South Korea", director: "H. Jeong", budget: "$2M", genre: "Puzzle", length: "8h" },
  { rank: 14, title: "Coldsprings", date: "Apr", platforms: ["PC", "PS5"], score: 66, studio: "Ninth Parallel", country: "Norway", director: "E. Dahl", budget: "$19M", genre: "Mystery", length: "16h" },
  { rank: 15, title: "Undertow Kings", date: "May", platforms: ["Xbox"], score: 63, studio: "Blacktide Works", country: "Australia", director: "C. Mahoney", budget: "$25M", genre: "Action", length: "20h" },
  { rank: 16, title: "Brass & Bone", date: "Feb", platforms: ["PC"], score: 61, studio: "Longcoat", country: "Argentina", director: "V. Salgado", budget: "$5M", genre: "CRPG", length: "70h+" },
  { rank: 17, title: "Salt Circuit", date: "Jun", platforms: ["PC", "Switch"], score: 58, studio: "Dry Season", country: "Spain", director: "N. Herrera", budget: "$7M", genre: "Racing", length: "10h" },
  { rank: 18, title: "Wraithlight", date: "Mar", platforms: ["PS5"], score: 55, studio: "Pale Signal", country: "France", director: "A. Rousseau", budget: "$33M", genre: "Shooter", length: "14h" },
  { rank: 19, title: "Duskrunner Zero", date: "Jan", platforms: ["PC"], score: 52, studio: "Ninefold", country: "India", director: "P. Raghavan", budget: "$8M", genre: "Roguelite", length: "25h" },
  { rank: 20, title: "Hollow Circuit", date: "Apr", platforms: ["Xbox", "PC"], score: 48, studio: "Machine Hymn", country: "USA", director: "D. Alvarez", budget: "$41M", genre: "Looter shooter", length: "45h" },
];

export const NEWS_ITEMS: NewsItem[] = [
  { source: "IGN", headline: "Ashen Trials gets a day-one patch addressing frame pacing on PS5", date: "2 hours ago" },
  { source: "Polygon", headline: "Hollow Vector director discusses the decision to cut multiplayer", date: "5 hours ago" },
  { source: "Eurogamer", headline: "Driftbound season two content roadmap detailed", date: "1 day ago" },
  { source: "Kotaku", headline: "Cinder Watch delayed on Switch to address performance", date: "1 day ago" },
  { source: "GameSpot", headline: "Static Fields crosses two million players in first month", date: "2 days ago" },
];

export const REVIEW_ITEMS: ReviewItem[] = [
  { title: "Marrow Deep", excerpt: "A tense, methodical survival game let down by a thin final act.", score: 79 },
  { title: "Quietstone", excerpt: "Confident world design, though the pacing sags around the midpoint.", score: 77 },
  { title: "Vellum & Ash", excerpt: "A patient card-based strategy game with real depth.", score: 75 },
  { title: "Skiff Runner", excerpt: "Excellent traversal held back by a forgettable story.", score: 74 },
  { title: "Ferrous Dawn", excerpt: "Solid mechanics, but the game rarely surprises.", score: 71 },
];

export const REC_BANK: Recommendation[] = [
  { title: "Loam", reason: "Slow-paced, low-stakes exploration", score: 84 },
  { title: "Quietstone", reason: "Cozy tone, gentle difficulty curve", score: 77 },
  { title: "Vellum & Ash", reason: "Methodical, turn-based pacing", score: 75 },
  { title: "Paper Tide", reason: "Short sessions, minimal pressure", score: 69 },
  { title: "Coldsprings", reason: "Atmospheric, unhurried world", score: 66 },
];

export const STOREFRONTS: string[][] = [
  ["Steam", "PS Store", "Game Pass"],
  ["Steam", "Epic", "eShop"],
  ["PS Store", "Xbox"],
  ["Steam", "Game Pass"],
  ["Steam", "GOG"],
  ["eShop", "Steam"],
  ["Xbox", "Steam", "Epic"],
  ["PS Store"],
  ["Steam", "eShop", "GOG"],
  ["Steam"],
  ["PS Store", "Xbox", "Steam"],
  ["Steam", "Epic"],
  ["eShop"],
  ["Steam", "Game Pass", "PS Store"],
  ["Xbox", "Game Pass"],
  ["Steam", "GOG"],
  ["Xbox", "Steam"],
];

/**
 * Deterministic PRNG (mulberry32). Seeded by year so every visitor sees the
 * same ranking for a given year, and re-selecting a year is stable.
 */
function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type YearData = {
  topGames: TopGame[];
  rankedGames: Game[];
};

/**
 * The seed dataset describes 2026. For any other year we re-shuffle it with a
 * year-seeded PRNG and nudge the scores, so the picker produces a distinct but
 * reproducible ranking. Replace with a real fetch when the API exists.
 */
export function getYearData(year: number): YearData {
  const withYear = (g: SeedGame, sourceCount: number): Game => ({
    ...g,
    date: `${g.date} ${year}`,
    sourceCount,
  });

  if (year === CURRENT_YEAR) {
    return {
      topGames: TOP_GAMES.map((g) => ({ ...g })),
      // Source counts in the seed data are decorative; derive them stably.
      rankedGames: RANKED_GAMES.map((g, i) => withYear(g, 28 + ((i * 7) % 24))),
    };
  }

  const rand = seededRandom(year);
  const pool = shuffled([...TOP_GAMES.map(toSeedGame), ...RANKED_GAMES], rand);

  // Re-sort by the jittered score so rank order still reads as a ranking.
  const scored = pool
    .map((g) => withYear(g, 24 + Math.floor(rand() * 34)))
    .map((g) => ({ ...g, score: clampScore(g.score + Math.round((rand() - 0.5) * 18)) }))
    .sort((a, b) => b.score - a.score)
    .map((g, i): Game => ({ ...g, rank: i + 1 }));

  return {
    topGames: scored.slice(0, 3).map(
      (g): TopGame => ({
        rank: g.rank,
        title: g.title,
        platforms: g.platforms,
        genres: [g.genre],
        score: g.score,
        sourceCount: g.sourceCount,
      }),
    ),
    rankedGames: scored.slice(3),
  };
}

function toSeedGame(t: TopGame): SeedGame {
  return {
    rank: t.rank,
    title: t.title,
    date: "Nov",
    platforms: t.platforms,
    score: t.score,
    studio: "Sibi Collective",
    country: "Mexico",
    director: "—",
    budget: "—",
    genre: t.genres[0] ?? "Action",
    length: "—",
  };
}

function clampScore(n: number) {
  return Math.max(31, Math.min(97, n));
}
