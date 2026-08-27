/** Content for the Reviews section. */

export type Review = {
  slug: string;
  title: string;
  score: number;
  verdict: string;
  body: string;
  critic: string;
  date: string;
  platforms: string[];
  genre: string;
  studio: string;
  hours: string;
  sourceCount: number;
};

export const REVIEW_FILTERS = [
  "All",
  "Acclaimed",
  "Recommended",
  "Mixed",
  "Panned",
] as const;

export type ReviewFilter = (typeof REVIEW_FILTERS)[number];

/** Maps a filter label onto the score bands defined in the design system. */
export function matchesFilter(score: number, filter: ReviewFilter): boolean {
  switch (filter) {
    case "Acclaimed":
      return score >= 85;
    case "Recommended":
      return score >= 70 && score < 85;
    case "Mixed":
      return score >= 50 && score < 70;
    case "Panned":
      return score < 50;
    default:
      return true;
  }
}

export const LEAD_REVIEW: Review = {
  slug: "ashen-trials",
  title: "Ashen Trials",
  score: 94,
  verdict: "A generational action RPG that trusts you completely",
  body: "Vault Nine's combat has never been this legible or this cruel. Ashen Trials strips away the map markers, the quest log, and most of the tutorial, then spends forty hours proving it never needed them. The result is the rarest thing in the genre: a game that gets harder and clearer at the same time.",
  critic: "Renata Solís",
  date: "28 Jul 2026",
  platforms: ["PC", "PS5"],
  genre: "Action RPG",
  studio: "Vault Nine",
  hours: "42h",
  sourceCount: 51,
};

export const REVIEWS: Review[] = [
  {
    slug: "hollow-vector",
    title: "Hollow Vector",
    score: 91,
    verdict: "A roguelike with the discipline to stop adding things",
    body: "Every run teaches you one more sentence of a language you did not know the game was speaking.",
    critic: "Dan Whitfield",
    date: "26 Jul 2026",
    platforms: ["PC", "Xbox", "Switch"],
    genre: "Roguelike",
    studio: "Foldtable",
    hours: "31h",
    sourceCount: 38,
  },
  {
    slug: "driftbound",
    title: "Driftbound",
    score: 89,
    verdict: "The best-feeling racer in a decade, and it knows it",
    body: "Weight, grip and momentum are modelled with a fidelity that makes rival racers feel like menus with engine noise.",
    critic: "Amara Osei",
    date: "24 Jul 2026",
    platforms: ["PS5", "Xbox"],
    genre: "Racing",
    studio: "Tidewright",
    hours: "19h",
    sourceCount: 44,
  },
  {
    slug: "cinder-watch",
    title: "Cinder Watch",
    score: 88,
    verdict: "Stealth design at its most confident",
    body: "A guard patrol you can read from three rooms away is worth more than any gadget, and Cinder Watch knows it.",
    critic: "Renata Solís",
    date: "21 Jul 2026",
    platforms: ["PC", "PS5"],
    genre: "Stealth action",
    studio: "Vault Nine",
    hours: "24h",
    sourceCount: 28,
  },
  {
    slug: "static-fields",
    title: "Static Fields",
    score: 86,
    verdict: "A simulation that rewards patience above all",
    body: "Nothing here is urgent, which is exactly why the first genuine emergency lands so hard.",
    critic: "Tomás Bauman",
    date: "19 Jul 2026",
    platforms: ["PC"],
    genre: "Sim",
    studio: "Halfmast",
    hours: "60h+",
    sourceCount: 35,
  },
  {
    slug: "marrow-deep",
    title: "Marrow Deep",
    score: 79,
    verdict: "Tense and methodical, let down by a thin final act",
    body: "Three quarters of a great survival horror game, and then a boss rush that belongs to something else entirely.",
    critic: "Ilse Zawadzka",
    date: "17 Jul 2026",
    platforms: ["PS5"],
    genre: "Survival horror",
    studio: "Kettle & Bone",
    hours: "18h",
    sourceCount: 32,
  },
  {
    slug: "quietstone",
    title: "Quietstone",
    score: 77,
    verdict: "Confident world design, sagging pace",
    body: "The midpoint asks you to walk the same three valleys until the story catches up with the map.",
    critic: "Saana Aalto",
    date: "15 Jul 2026",
    platforms: ["PC", "Switch"],
    genre: "Adventure",
    studio: "Northlight Craft",
    hours: "12h",
    sourceCount: 39,
  },
  {
    slug: "vellum-and-ash",
    title: "Vellum & Ash",
    score: 75,
    verdict: "A patient deckbuilder with real depth",
    body: "It takes nine hours to show you its actual game, which is both its greatest flaw and its best joke.",
    critic: "Kenji Mori",
    date: "12 Jul 2026",
    platforms: ["PC"],
    genre: "Deckbuilder",
    studio: "Foldtable",
    hours: "50h+",
    sourceCount: 46,
  },
  {
    slug: "ferrous-dawn",
    title: "Ferrous Dawn",
    score: 71,
    verdict: "Solid mechanics that rarely surprise",
    body: "Competent in every direction and daring in none — an RTS built entirely from other RTSs.",
    critic: "Dan Whitfield",
    date: "9 Jul 2026",
    platforms: ["PC"],
    genre: "RTS",
    studio: "Anvil Grade",
    hours: "30h",
    sourceCount: 36,
  },
  {
    slug: "coldsprings",
    title: "Coldsprings",
    score: 66,
    verdict: "Atmosphere in search of a mystery",
    body: "The town is superb. The case you are there to solve is a series of locked doors and convenient notes.",
    critic: "Erik Dahl",
    date: "6 Jul 2026",
    platforms: ["PC", "PS5"],
    genre: "Mystery",
    studio: "Ninth Parallel",
    hours: "16h",
    sourceCount: 50,
  },
  {
    slug: "undertow-kings",
    title: "Undertow Kings",
    score: 63,
    verdict: "Big swings, loose landings",
    body: "An action game with four good ideas and eleven hours of filler holding them apart.",
    critic: "Cara Mahoney",
    date: "3 Jul 2026",
    platforms: ["Xbox"],
    genre: "Action",
    studio: "Blacktide Works",
    hours: "20h",
    sourceCount: 33,
  },
  {
    slug: "salt-circuit",
    title: "Salt Circuit",
    score: 58,
    verdict: "Handling that never settles",
    body: "Ten hours spent fighting the car instead of the track, on courses that deserved better.",
    critic: "Amara Osei",
    date: "30 Jun 2026",
    platforms: ["PC", "Switch"],
    genre: "Racing",
    studio: "Dry Season",
    hours: "10h",
    sourceCount: 47,
  },
  {
    slug: "hollow-circuit",
    title: "Hollow Circuit",
    score: 48,
    verdict: "A live-service shooter with nothing to say",
    body: "Forty-five hours of loot tables in search of a reason to exist, priced as though it found one.",
    critic: "Tomás Bauman",
    date: "27 Jun 2026",
    platforms: ["Xbox", "PC"],
    genre: "Looter shooter",
    studio: "Machine Hymn",
    hours: "45h",
    sourceCount: 44,
  },
];
