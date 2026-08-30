# Data schema

Every shape the site reads, what is real today, and what is still a proposal.
Structural context lives in [ARCHITECTURE.md](ARCHITECTURE.md).

**Status** — `LIVE` implemented and validated on every build · `SEED` implemented
as placeholder data · `PROPOSED` does not exist in code.

---

## 1. The two data layers

| Layer | Lives in | Source of truth | Status |
| --- | --- | --- | --- |
| Editorial — reviews, news, guides | `src/content/**/*.md` | Markdown, written by people | LIVE |
| Homepage game seed | `src/data/games.ts` | hand-written TypeScript | SEED |
| Aggregated score + sources | *nothing yet* | IGDB/RAWG + curated outlet table | PROPOSED |

The split is deliberate: editorial content is Markdown because humans write it;
game data is not, because it will arrive from APIs and must not be disguised as
prose.

---

## 2. Content collections — LIVE

Defined in `src/content.config.ts` with Zod. Frontmatter is validated on every
build — a missing or mistyped field is a build failure, not a broken card.

The **filename is the slug**: `src/content/reviews/ashen-trials.md` →
`/reviews/ashen-trials/`. Nothing else derives the URL.

### `reviews` — 13 entries

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | game name |
| `score` | number 0–100 | drives every colour on the card via `scoreBand()` |
| `verdict` | string | one-line judgement, used as the meta description |
| `critic` | string | **a single author**, not an aggregate — see §4 |
| `date` | date | coerced; orders the index and prev/next |
| `platforms` | string[] | rendered as neutral tags |
| `genre` | string | rendered as the accent tag |
| `studio` | string | |
| `hours` | string | e.g. `"42h"` — free text, not a number |
| `sourceCount` | number | printed as "based on N sources"; **currently decorative** |
| `lead` | boolean = false | at most one; renders as the hero feature |

### `news` — 11 entries

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | string | |
| `standfirst` | string | used as the meta description |
| `source` | string | outlet credited on the page |
| `category` | enum | `Industry` · `Releases` · `Patches` · `Esports` — drives the filter |
| `date` | date | real timestamp; orders prev/next |
| `displayDate` | string | human-facing, e.g. `"7 hours ago"` |
| `bucket` | enum | `Today` · `Yesterday` · `Earlier this week` — groups the feed |
| `byline` | string? | optional |
| `lead` | boolean = false | |

`date`, `displayDate` and `bucket` are three separate fields carrying
overlapping information. `displayDate` and `bucket` are frozen strings and will
drift as time passes — they should eventually be derived from `date` rather
than authored.

### `guides` — 10 entries

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | |
| `game` | string | free text; **not** a foreign key to any game record |
| `summary` | string | used as the meta description |
| `type` | enum | `Beginner` · `Walkthrough` · `Builds` · `Collectibles` · `Endgame` |
| `difficulty` | enum | `Starter` · `Intermediate` · `Advanced` |
| `readTime` | string | e.g. `"12 min"` |
| `updated` | string | free text, not a date |
| `author` | string | |
| `order` | number = 0 | editorial sequence; orders the index and prev/next |
| `chapters` | string[]? | rendered as "In this guide" and as JSON-LD `HowTo` steps |
| `lead` | boolean = false | |

Chapters are labels only. The bodies have no matching headings, so the contents
list is not linked — wire anchors when real sectioned copy lands.

### Adding a piece of content

1. Create `src/content/<collection>/<slug>.md`.
2. Fill in every required field above. `pnpm build` tells you what is missing.
3. The detail page, the index card, the filters, prev/next and the JSON-LD all
   follow automatically. No component needs touching.

---

## 3. Homepage game data — SEED

`src/data/games.ts` (258 lines) is the seed dataset lifted from the design.
Everything reaches components through `getYearData(year)`, so replacing it with
a real fetch means rewriting that one function.

```ts
Game            { rank, title, date, platforms[], score, studio, country,
                  director, budget, genre, length, sourceCount }
TopGame         { rank, title, platforms[], genres[], score, sourceCount }
NewsItem        { source, headline, date }
ReviewItem      { title, excerpt, score }
Recommendation  { title, reason, score }
YearData        { topGames: TopGame[], rankedGames: Game[] }

getYearData(year): YearData
```

Also exported: `CURRENT_YEAR` (2026), `GRADIENTS` (cover fills from the ember
ramp), `DECADES`, `STOREFRONTS`, `REC_BANK` (the static recommender responses
standing in for `/api/recommend`).

Years other than 2026 are **generated**: the seed is reshuffled with a
year-seeded PRNG and scores are nudged, so the picker produces a distinct but
reproducible ranking. None of it is real data.

`NewsItem` and `ReviewItem` here duplicate what the `news` and `reviews`
collections already hold. They feed the homepage digest columns and should be
replaced by `getCollection()` calls.

### Dead modules

`src/data/reviews.ts`, `src/data/news.ts` and `src/data/guides.ts` — **518 lines,
zero importers.** Superseded when editorial content moved to Markdown
collections. Safe to delete.

---

## 4. Aggregated score model — PROPOSED, not built

**This does not exist in code.** It is the gap between what the site claims and
what it computes, and it blocks the game detail page.

Today a review carries one `critic`, one `verdict`, and a `sourceCount` of e.g.
51 — and the page prints "based on 51 sources" with no source table behind it.
The AOTY-style breakdown is the product's core differentiator and has no data
model yet.

Master doc §8d sets the constraints: no mass scraping (ToS), scores are factual
data, always link the original review, IGDB `aggregated_rating` as a fallback.

### Proposed shape

```ts
Game {
  id            // internal slug, e.g. "ashen-trials"
  igdbId?       // IGDB id
  rawgId?       // RAWG id
  title, studio, country, director, budget
  releaseDate, platforms[], genres[]
  coverUrl, screenshots[]        // from IGDB/RAWG
}

Outlet {
  id            // "ign", "eurogamer"
  name
  scale         // "10-point" | "5-star" | "letter" | "100-point" | "verdict"
  weight        // reserved; MVP treats every outlet equally
}

Score {
  gameId, outletId
  native        // as published: "9/10", "4.5/5", "B+", "Essential"
  normalized    // 0-100, by the published rule below
  reviewUrl     // required — the transparency claim depends on it
  publishedAt
  critic?
}
```

Derived per game, never stored: `mean`, `median`, `count`, `distribution`
(histogram buckets), `band` (from `scoreColor.ts`).

### Normalization rules

Publish these on a "How we score" page; the claim against Metacritic is that
the arithmetic is public.

| Native scale | Rule | Example |
| --- | --- | --- |
| N/10 | `N × 10` | 9/10 → 90 |
| N/5 | `N × 20` | 4.5/5 → 90 |
| N/100 | identity | 94 → 94 |
| Letter | fixed table | A+ 98 · A 95 · A− 92 · B+ 88 · B 85 · B− 82 · C+ 78 |
| Verdict badge | per-outlet mapping | Eurogamer *Essential* → 95 |

Open decisions: the minimum source count before a score publishes; whether
outlets are ever weighted; how a revised review is handled.

### Where it needs to come from

- **Metadata and images** — IGDB (free, via a Twitch dev account) and RAWG.
  Neither account exists yet. Verify commercial terms before launch; free tiers
  are aimed at non-commercial use.
- **Per-outlet scores** — semi-automated curation of the top 20–30 games of
  2026, ~10–15 outlets each, roughly 450 rows. That is small enough to live as
  generated JSON in the repo; it does not need a database. See the stack notes
  in the master doc.

---

## 5. Consistency rules to preserve

Whatever the score model becomes, these must hold:

1. **A score's colour is always `scoreColor(score)`.** Never a hardcoded hex.
2. **Mean, median and histogram are derived from the same rows**, never authored
   separately — they contradict each other the moment they are.
3. **Every source row links to its original review.** A row without a URL is not
   evidence.
4. **`sourceCount` must equal the number of rows**, or it is a false claim on
   the most important number on the page.
