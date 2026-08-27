import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

/**
 * Editorial content lives in Markdown. Structured game data does not — games,
 * scores and metadata come from IGDB/RAWG (master doc §8d), so they stay in
 * `src/data/games.ts` until the API layer exists.
 */

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    /** Aggregated 0-100 score. Drives every colour decision on the card. */
    score: z.number().min(0).max(100),
    verdict: z.string(),
    critic: z.string(),
    date: z.coerce.date(),
    platforms: z.array(z.string()),
    genre: z.string(),
    studio: z.string(),
    hours: z.string(),
    sourceCount: z.number(),
    /** Exactly one review may be the lead; it renders as the hero feature. */
    lead: z.boolean().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    headline: z.string(),
    standfirst: z.string(),
    source: z.string(),
    category: z.enum(["Industry", "Releases", "Patches", "Esports"]),
    date: z.coerce.date(),
    /** Human-facing relative time; the feed groups by `bucket`. */
    displayDate: z.string(),
    bucket: z.enum(["Today", "Yesterday", "Earlier this week"]),
    byline: z.string().optional(),
    lead: z.boolean().default(false),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    game: z.string(),
    summary: z.string(),
    type: z.enum(["Beginner", "Walkthrough", "Builds", "Collectibles", "Endgame"]),
    difficulty: z.enum(["Starter", "Intermediate", "Advanced"]),
    readTime: z.string(),
    updated: z.string(),
    author: z.string(),
    order: z.number().default(0),
    chapters: z.array(z.string()).optional(),
    lead: z.boolean().default(false),
  }),
});

export const collections = { reviews, news, guides };
