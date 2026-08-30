import { z } from "zod";
import type { CatalogGame, Recommendation } from "../data/games";

/**
 * The recommender's pure half: the contract, the prompt and the validation.
 * Nothing here touches the network, so it is unit-tested; the endpoint in
 * `pages/api/recommend.ts` is a thin wrapper around it.
 */

export const PICK_COUNT = 5;
export const PROMPT_MIN = 3;
export const PROMPT_MAX = 300;

/** What the model is asked to produce. Ids are validated against the catalogue after. */
export const picksSchema = z.object({
  picks: z
    .array(
      z.object({
        id: z.string().describe("A game id from the catalogue, verbatim."),
        reason: z
          .string()
          .describe("One short clause, under twelve words, on why it fits the request."),
      }),
    )
    .describe(`Exactly ${PICK_COUNT} games, best match first.`),
});

export type Picks = z.infer<typeof picksSchema>;

/** The wire shape the island consumes. `source` says whether Claude answered. */
export type RecommendResponse = {
  picks: Recommendation[];
  source: "claude" | "bank";
};

/**
 * Stable across requests, so it is cached: the whole catalogue in a compact
 * line-per-game form. 20 games is a few hundred tokens; at IGDB scale this
 * becomes a retrieval step, not a prompt.
 */
export function systemPrompt(games: CatalogGame[]): string {
  const lines = games.map(
    (g) =>
      `${g.id} | ${g.title} | ${g.genre} | ${g.platforms.join("/")} | ${g.length} | score ${g.score} | ${g.blurb}`,
  );
  return [
    "You recommend games from the Sibi Gamers catalogue below and nothing else.",
    "A visitor describes a mood, a craving or a constraint in their own words.",
    `Choose exactly ${PICK_COUNT} games that fit it, best match first, and give each one reason:`,
    "a short clause about fit, in the register of a knowledgeable friend, not marketing copy.",
    "Score is a signal, not the answer: a lower-scored game that fits the request beats a",
    "higher-scored one that does not. If the request is not about games, pick what a patient",
    "reader would still enjoy and keep the reasons honest about the stretch.",
    "",
    "Catalogue (id | title | genre | platforms | length | score | blurb):",
    ...lines,
  ].join("\n");
}

/**
 * The model's picks are a claim; this makes them true. Unknown ids and
 * duplicates are dropped, scores come from the catalogue rather than the
 * model, and the list is capped. Fewer than PICK_COUNT is allowed — a short
 * honest list beats padding.
 */
export function sanitizePicks(raw: Picks, games: CatalogGame[]): Recommendation[] {
  const byId = new Map(games.map((g) => [g.id, g]));
  const seen = new Set<string>();
  const out: Recommendation[] = [];

  for (const pick of raw.picks) {
    const game = byId.get(pick.id.trim());
    if (!game || seen.has(game.id)) continue;
    seen.add(game.id);
    out.push({ id: game.id, title: game.title, reason: pick.reason.trim(), score: game.score });
    if (out.length === PICK_COUNT) break;
  }
  return out;
}

export function validatePrompt(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const prompt = input.trim().replace(/\s+/g, " ");
  if (prompt.length < PROMPT_MIN || prompt.length > PROMPT_MAX) return null;
  return prompt;
}
