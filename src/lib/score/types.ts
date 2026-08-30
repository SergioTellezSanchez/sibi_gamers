import { z } from "zod";

/**
 * The score model. Everything here describes *evidence* — one published
 * verdict from one outlet — never an aggregate. Aggregates are derived in
 * `aggregate.ts` and never stored, so they cannot drift from the rows they
 * summarise (SCHEMA.md §5 rule 2).
 */

/** How an outlet publishes its verdict. Drives parsing in `normalize.ts`. */
export const SCALES = ["10-point", "5-star", "letter", "100-point", "verdict"] as const;
export type Scale = (typeof SCALES)[number];

export const outletSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "outlet id must be a lowercase slug"),
  name: z.string().min(1),
  scale: z.enum(SCALES),
  /**
   * Reserved. The MVP treats every outlet equally and the arithmetic ignores
   * this; it exists so weighting can arrive without a data migration.
   */
  weight: z.number().positive().default(1),
  /**
   * Required for `verdict` outlets, forbidden for every other scale: badges
   * like Eurogamer's *Essential* only mean something per publication.
   */
  verdicts: z.record(z.string(), z.number().min(0).max(100)).optional(),
});

export type Outlet = z.infer<typeof outletSchema>;

export const scoreRowSchema = z.object({
  gameId: z.string().min(1),
  outletId: z.string().min(1),
  /** Exactly as published: "9.5/10", "4/5", "B+", "Essential", "94/100". */
  native: z.string().min(1),
  /**
   * Required. A row without a link to the original review is not evidence,
   * and the transparency claim is the entire differentiator (SCHEMA.md §5
   * rule 3). Seed rows use the reserved `.invalid` TLD so a placeholder can
   * never be mistaken for a real citation.
   */
  reviewUrl: z.url(),
  publishedAt: z.coerce.date(),
  critic: z.string().optional(),
  /**
   * Set when an outlet re-scored the game. The aggregate keeps one row per
   * outlet — the latest `publishedAt` wins — so a revision replaces rather
   * than joins the original.
   */
  supersedes: z.string().optional(),
});

export type ScoreRow = z.infer<typeof scoreRowSchema>;

/** A row with its normalized 0-100 value resolved. */
export type ResolvedScore = ScoreRow & {
  outlet: Outlet;
  normalized: number;
};
