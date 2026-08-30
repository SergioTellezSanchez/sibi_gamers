import { outletSchema, type Outlet } from "../lib/score/types";

/**
 * The outlet table — PLACEHOLDER.
 *
 * The publications are real and their scales are broadly right, but no row in
 * `scores.ts` reflects anything any of them published: the games do not exist.
 * Curating the real table is manual work (SCHEMA.md §4) and has not happened.
 *
 * `verdicts` maps a badge to a number for outlets that do not print one. Those
 * mappings are editorial judgements, so they get published on the "How we
 * score" page alongside the arithmetic.
 */
const OUTLET_SEED = [
  { id: "ign", name: "IGN", scale: "10-point" as const },
  { id: "gamespot", name: "GameSpot", scale: "10-point" as const },
  { id: "polygon", name: "Polygon", scale: "10-point" as const },
  { id: "edge", name: "Edge", scale: "10-point" as const },
  { id: "push-square", name: "Push Square", scale: "10-point" as const },
  { id: "shacknews", name: "Shacknews", scale: "10-point" as const },
  { id: "destructoid", name: "Destructoid", scale: "10-point" as const },
  { id: "videogamer", name: "VideoGamer", scale: "10-point" as const },
  { id: "god-is-a-geek", name: "God is a Geek", scale: "10-point" as const },
  { id: "game-informer", name: "Game Informer", scale: "10-point" as const },
  { id: "easy-allies", name: "Easy Allies", scale: "10-point" as const },
  { id: "metro-gamecentral", name: "Metro GameCentral", scale: "10-point" as const },
  { id: "thesixthaxis", name: "TheSixthAxis", scale: "10-point" as const },
  { id: "hardcore-gamer", name: "Hardcore Gamer", scale: "10-point" as const },
  { id: "noisy-pixel", name: "Noisy Pixel", scale: "10-point" as const },
  { id: "cubed3", name: "Cubed3", scale: "10-point" as const },
  { id: "giant-bomb", name: "Giant Bomb", scale: "5-star" as const },
  { id: "gamesradar", name: "GamesRadar+", scale: "5-star" as const },
  { id: "the-guardian", name: "The Guardian", scale: "5-star" as const },
  { id: "digital-trends", name: "Digital Trends", scale: "5-star" as const },
  { id: "windows-central", name: "Windows Central", scale: "5-star" as const },
  { id: "trusted-reviews", name: "Trusted Reviews", scale: "5-star" as const },
  { id: "screen-rant", name: "Screen Rant", scale: "5-star" as const },
  { id: "the-telegraph", name: "The Telegraph", scale: "5-star" as const },
  { id: "pc-gamer", name: "PC Gamer", scale: "100-point" as const },
  { id: "vandal", name: "Vandal", scale: "100-point" as const },
  { id: "meristation", name: "MeriStation", scale: "100-point" as const },
  { id: "3djuegos", name: "3DJuegos", scale: "100-point" as const },
  { id: "hobby-consolas", name: "Hobby Consolas", scale: "100-point" as const },
  { id: "areajugones", name: "Areajugones", scale: "100-point" as const },
  { id: "multiplayer-it", name: "Multiplayer.it", scale: "100-point" as const },
  { id: "everyeye", name: "Everyeye.it", scale: "100-point" as const },
  { id: "ign-italia", name: "IGN Italia", scale: "100-point" as const },
  { id: "spaziogames", name: "SpazioGames", scale: "100-point" as const },
  { id: "gamereactor", name: "Gamereactor", scale: "100-point" as const },
  { id: "pc-games", name: "PC Games", scale: "100-point" as const },
  { id: "gamestar", name: "GameStar", scale: "100-point" as const },
  { id: "4players", name: "4Players", scale: "100-point" as const },
  { id: "cogconnected", name: "COGconnected", scale: "100-point" as const },
  { id: "wccftech", name: "Wccftech", scale: "100-point" as const },
  { id: "checkpoint-gaming", name: "Checkpoint Gaming", scale: "100-point" as const },
  { id: "gaming-nexus", name: "Gaming Nexus", scale: "100-point" as const },
  { id: "digital-chumps", name: "Digital Chumps", scale: "100-point" as const },
  { id: "jeuxvideo", name: "Jeuxvideo.com", scale: "100-point" as const },
  { id: "digital-foundry", name: "Digital Foundry", scale: "letter" as const },
  { id: "slant", name: "Slant Magazine", scale: "letter" as const },
  { id: "av-club", name: "The A.V. Club", scale: "letter" as const },
  { id: "paste", name: "Paste Magazine", scale: "letter" as const },
  { id: "washington-post", name: "Washington Post", scale: "letter" as const },
  { id: "eurogamer", name: "Eurogamer", scale: "verdict" as const, verdicts: { "Essential": 95, "Recommended": 85, "Avoid": 40 } },
  { id: "rock-paper-shotgun", name: "Rock Paper Shotgun", scale: "verdict" as const, verdicts: { "Bestest Best": 96, "Recommended": 92, "Worth A Look": 80 } },
  { id: "ars-technica", name: "Ars Technica", scale: "verdict" as const, verdicts: { "Buy": 92, "Rent": 78, "Skip": 55 } },
  { id: "kotaku", name: "Kotaku", scale: "verdict" as const, verdicts: { "Yes": 90, "Not Yet": 72, "No": 50 } },
];

/** Parsed at module load: a malformed outlet fails the build, not a page. */
export const OUTLETS: Outlet[] = OUTLET_SEED.map((o) => outletSchema.parse(o));

export const OUTLETS_BY_ID = new Map(OUTLETS.map((o) => [o.id, o]));
