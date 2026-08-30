/**
 * The game catalogue — PLACEHOLDER.
 *
 * One record per game, and everything else on the site derives from it: the
 * homepage ranking, the podium, the game pages, the recommender bank, the
 * source counts. When IGDB/RAWG arrive they replace `GAMES` and nothing
 * downstream changes shape.
 *
 * Every field is invented. The studios, countries, directors and budgets are
 * placeholders, and the scores are hand-picked numbers — except where
 * `scores.ts` has rows, in which case the aggregate is computed and the number
 * here must agree with it (pinned by `score.test.ts`).
 */

import { aggregate, resolve, type Aggregate, type ResolvedScore } from "../lib/score";
import { OUTLETS_BY_ID } from "./outlets";
import { rowsForGame } from "./scores";

export const CURRENT_YEAR = 2026;

export type CatalogGame = {
  /** Route slug: `/games/<id>/`. Also the key `scores.ts` rows cite. */
  id: string;
  title: string;
  /** ISO date. The ranking row prints the month; the game page prints it all. */
  released: string;
  platforms: string[];
  genre: string;
  score: number;
  studio: string;
  country: string;
  director: string;
  budget: string;
  length: string;
  /** Two sentences for the game page's About block. */
  blurb: string;
};

export const GAMES: CatalogGame[] = [
  { id: "ashen-trials", title: "Ashen Trials", released: "2026-07-28", platforms: ["PC", "PS5"], genre: "Action RPG", score: 94, studio: "Vault Nine", country: "Mexico", director: "L. Ochoa", budget: "$38M", length: "42h",
    blurb: "Vault Nine's combat has never been this legible or this cruel. Ashen Trials strips away the map markers, the quest log and most of the tutorial, then spends forty hours proving it never needed them. The result is the rarest thing in the genre: a game that gets harder and clearer at the same time." },
  { id: "hollow-vector", title: "Hollow Vector", released: "2026-05-19", platforms: ["PC", "Xbox", "Switch"], genre: "Roguelike", score: 91, studio: "Foldtable", country: "Japan", director: "H. Sato", budget: "$11M", length: "31h",
    blurb: "A roguelike with the discipline to stop adding things. Every run is twenty minutes, every item changes how you move rather than how hard you hit, and the game trusts that to be enough." },
  { id: "driftbound", title: "Driftbound", released: "2026-06-11", platforms: ["PS5", "Xbox"], genre: "Racing", score: 89, studio: "Tidewright", country: "Brazil", director: "M. Andrade", budget: "$45M", length: "19h",
    blurb: "The best-feeling racer in a decade, and it knows it. Driftbound's handling model rewards commitment over caution, and its coastal circuits are the first since the PS2 era to feel like actual places." },
  { id: "cinder-watch", title: "Cinder Watch", released: "2026-03-12", platforms: ["PC", "PS5"], genre: "Stealth action", score: 88, studio: "Vault Nine", country: "Sweden", director: "M. Lindqvist", budget: "$48M", length: "24h",
    blurb: "A stealth game built around light rather than sound. Every torch, window and ember is a system, and Cinder Watch is at its best when it lets you set fire to the plan." },
  { id: "static-fields", title: "Static Fields", released: "2026-02-05", platforms: ["PC"], genre: "Sim", score: 86, studio: "Halfmast", country: "Canada", director: "R. Okonkwo", budget: "$9M", length: "60h+",
    blurb: "A radio-station management sim that turns into something much stranger by its third year. Static Fields is patient, dense and quietly one of the best-written games of 2026." },
  { id: "loam", title: "Loam", released: "2026-01-22", platforms: ["Switch", "PC"], genre: "Farming", score: 84, studio: "Cortina Studio", country: "Mexico", director: "A. Bautista", budget: "$4M", length: "40h",
    blurb: "A farming game about soil, not harvests. Loam's seasons are slow and its rewards are structural: the land you leave behind is the score." },
  { id: "nightfall-courier", title: "Nightfall Courier", released: "2026-04-09", platforms: ["Xbox", "PC"], genre: "Open world", score: 82, studio: "Grey Harbour", country: "UK", director: "J. Whitlock", budget: "$31M", length: "35h",
    blurb: "An open world with one job in it: deliver the parcel. Nightfall Courier makes the route the story, and its night-time city is the most convincing of the year." },
  { id: "marrow-deep", title: "Marrow Deep", released: "2026-12-03", platforms: ["PS5"], genre: "Survival horror", score: 79, studio: "Kettle & Bone", country: "Poland", director: "I. Zawadzka", budget: "$22M", length: "18h",
    blurb: "A tense, methodical survival game let down by a thin final act. For its first twelve hours, though, Marrow Deep is as controlled as horror gets." },
  { id: "quietstone", title: "Quietstone", released: "2026-05-07", platforms: ["PC", "Switch"], genre: "Adventure", score: 77, studio: "Northlight Craft", country: "Finland", director: "S. Aalto", budget: "$6M", length: "12h",
    blurb: "Confident world design, though the pacing sags around the midpoint. Quietstone is a walk through a village that remembers you, and the memory is the mechanic." },
  { id: "vellum-and-ash", title: "Vellum & Ash", released: "2026-02-19", platforms: ["PC"], genre: "Deckbuilder", score: 75, studio: "Foldtable", country: "Japan", director: "K. Mori", budget: "$3M", length: "50h+",
    blurb: "A patient card-based strategy game with real depth. Vellum & Ash gives you a hundred cards and a reason to read every one of them." },
  { id: "skiff-runner", title: "Skiff Runner", released: "2026-06-25", platforms: ["PS5", "Xbox", "PC"], genre: "Platformer", score: 74, studio: "Tidewright", country: "Brazil", director: "L. Ferreira", budget: "$27M", length: "15h",
    blurb: "Excellent traversal held back by a forgettable story. The skiff itself, a boat you carry, is the best movement idea in a platformer this year." },
  { id: "ferrous-dawn", title: "Ferrous Dawn", released: "2026-03-26", platforms: ["PC"], genre: "RTS", score: 71, studio: "Anvil Grade", country: "Germany", director: "T. Baumann", budget: "$14M", length: "30h",
    blurb: "Solid mechanics, but the game rarely surprises. Ferrous Dawn is a competent, well-balanced RTS in a year that wanted more from the genre." },
  { id: "paper-tide", title: "Paper Tide", released: "2026-01-15", platforms: ["Switch"], genre: "Puzzle", score: 69, studio: "Sunfold", country: "South Korea", director: "H. Jeong", budget: "$2M", length: "8h",
    blurb: "An origami puzzle game with one great idea and eight hours of it. Paper Tide is charming, short and exactly as long as it should be." },
  { id: "coldsprings", title: "Coldsprings", released: "2026-04-23", platforms: ["PC", "PS5"], genre: "Mystery", score: 66, studio: "Ninth Parallel", country: "Norway", director: "E. Dahl", budget: "$19M", length: "16h",
    blurb: "An atmospheric, unhurried mystery that never quite earns its reveal. Coldsprings looks and sounds superb; the case underneath is thinner than the fog." },
  { id: "undertow-kings", title: "Undertow Kings", released: "2026-05-28", platforms: ["Xbox"], genre: "Action", score: 63, studio: "Blacktide Works", country: "Australia", director: "C. Mahoney", budget: "$25M", length: "20h",
    blurb: "A brawler with great weight and no ideas about where to put it. Undertow Kings is fun in the hands and forgettable everywhere else." },
  { id: "brass-and-bone", title: "Brass & Bone", released: "2026-02-12", platforms: ["PC"], genre: "CRPG", score: 61, studio: "Longcoat", country: "Argentina", director: "V. Salgado", budget: "$5M", length: "70h+",
    blurb: "A sprawling CRPG with more systems than it can hold together. There is a great forty-hour game inside Brass & Bone's seventy." },
  { id: "salt-circuit", title: "Salt Circuit", released: "2026-06-04", platforms: ["PC", "Switch"], genre: "Racing", score: 58, studio: "Dry Season", country: "Spain", director: "N. Herrera", budget: "$7M", length: "10h",
    blurb: "A budget racer with a strong track editor and a weak everything else. Salt Circuit's community will outlive its campaign." },
  { id: "wraithlight", title: "Wraithlight", released: "2026-03-05", platforms: ["PS5"], genre: "Shooter", score: 55, studio: "Pale Signal", country: "France", director: "A. Rousseau", budget: "$33M", length: "14h",
    blurb: "A handsome shooter that mistakes volume for intensity. Wraithlight's set-pieces are loud, frequent and interchangeable." },
  { id: "duskrunner-zero", title: "Duskrunner Zero", released: "2026-01-29", platforms: ["PC"], genre: "Roguelite", score: 52, studio: "Ninefold", country: "India", director: "P. Raghavan", budget: "$8M", length: "25h",
    blurb: "A roguelite that ships its balance patch a month too late. What is here is fast and stylish; what is missing is a reason to run again." },
  { id: "hollow-circuit", title: "Hollow Circuit", released: "2026-04-16", platforms: ["Xbox", "PC"], genre: "Looter shooter", score: 48, studio: "Machine Hymn", country: "USA", director: "D. Alvarez", budget: "$41M", length: "45h",
    blurb: "A looter shooter that confuses a spreadsheet with a game. Hollow Circuit's gunplay is fine, and fine is not enough at this budget." },
];

const GAMES_BY_ID = new Map(GAMES.map((g) => [g.id, g]));

export function getGame(id: string): CatalogGame | undefined {
  return GAMES_BY_ID.get(id);
}

/** Reviews are keyed by title in their frontmatter, not by id. */
export function findGameByTitle(title: string): CatalogGame | undefined {
  return GAMES.find((g) => g.title === title);
}

/** Everything a page needs to show a score honestly: the rows and the maths. */
export function scoreFor(id: string): { rows: ResolvedScore[]; aggregate: Aggregate } {
  const rows = resolve(rowsForGame(id), OUTLETS_BY_ID);
  return { rows, aggregate: aggregate(rows) };
}

/**
 * The only source of a source count. Three games have rows in `scores.ts`;
 * everything else returns undefined and renders without the caption, which is
 * the honest outcome — we have no sources for them yet.
 */
export function sourceCountFor(id: string): number | undefined {
  const a = scoreFor(id).aggregate;
  return a.published ? a.count : undefined;
}

/**
 * "More like this": same genre first, then whatever sits closest in score.
 * Deterministic so the page is stable across builds.
 */
export function relatedGames(game: CatalogGame, count = 4): CatalogGame[] {
  return GAMES.filter((g) => g.id !== game.id)
    .sort((a, b) => {
      const genreA = a.genre === game.genre ? 0 : 1;
      const genreB = b.genre === game.genre ? 0 : 1;
      if (genreA !== genreB) return genreA - genreB;
      return Math.abs(a.score - game.score) - Math.abs(b.score - game.score);
    })
    .slice(0, count);
}

/* ------------------------------------------------------ homepage shapes -- */

export type Game = {
  id: string;
  rank: number;
  title: string;
  /** "Mar 2026" — the ranking row shows the month only. */
  date: string;
  platforms: string[];
  score: number;
  studio: string;
  country: string;
  director: string;
  budget: string;
  genre: string;
  length: string;
  /**
   * Absent unless real score rows back it. A count with nothing behind it is
   * a false claim on the most important number on the page (SCHEMA.md §5).
   */
  sourceCount?: number;
};

export type TopGame = {
  id: string;
  rank: number;
  title: string;
  platforms: string[];
  genres: string[];
  score: number;
  sourceCount?: number;
};

export type Recommendation = {
  id: string;
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function month(iso: string): string {
  return MONTHS[Number(iso.slice(5, 7)) - 1] ?? "";
}

/** Static answers standing in for `/api/recommend`. */
const REC_IDS: [string, string][] = [
  ["loam", "Slow-paced, low-stakes exploration"],
  ["quietstone", "Cozy tone, gentle difficulty curve"],
  ["vellum-and-ash", "Methodical, turn-based pacing"],
  ["paper-tide", "Short sessions, minimal pressure"],
  ["coldsprings", "Atmospheric, unhurried world"],
];

export const REC_BANK: Recommendation[] = REC_IDS.map(([id, reason]) => {
  const g = GAMES_BY_ID.get(id);
  if (!g) throw new Error(`REC_BANK cites unknown game "${id}"`);
  return { id, title: g.title, reason, score: g.score };
});

/** Storefronts per ranking row. Placeholder until affiliate links exist. */
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

function toRow(g: CatalogGame, rank: number, year: number, score = g.score): Game {
  return {
    id: g.id,
    rank,
    title: g.title,
    date: `${month(g.released)} ${year}`,
    platforms: g.platforms,
    score,
    studio: g.studio,
    country: g.country,
    director: g.director,
    budget: g.budget,
    genre: g.genre,
    length: g.length,
  };
}

function toTop(g: Game): TopGame {
  return {
    id: g.id,
    rank: g.rank,
    title: g.title,
    platforms: g.platforms,
    genres: [g.genre],
    score: g.score,
    sourceCount: g.sourceCount,
  };
}

/**
 * The catalogue describes 2026. For any other year we re-shuffle it with a
 * year-seeded PRNG and nudge the scores, so the picker produces a distinct but
 * reproducible ranking. Replace with a real fetch when the API exists.
 */
export function getYearData(year: number): YearData {
  if (year === CURRENT_YEAR) {
    const rows = [...GAMES]
      .sort((a, b) => b.score - a.score)
      .map((g, i) => ({ ...toRow(g, i + 1, year), sourceCount: sourceCountFor(g.id) }));
    return { topGames: rows.slice(0, 3).map(toTop), rankedGames: rows.slice(3) };
  }

  // Generated years carry no source count at all: the scores are PRNG output,
  // so there is nothing to count and claiming a number would be inventing one.
  const rand = seededRandom(year);
  const rows = shuffled(GAMES, rand)
    .map((g) => toRow(g, 0, year, clampScore(g.score + Math.round((rand() - 0.5) * 18))))
    .sort((a, b) => b.score - a.score)
    .map((g, i): Game => ({ ...g, rank: i + 1 }));

  return { topGames: rows.slice(0, 3).map(toTop), rankedGames: rows.slice(3) };
}

function clampScore(n: number) {
  return Math.max(31, Math.min(97, n));
}
