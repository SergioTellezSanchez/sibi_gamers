# Data schema

Every shape the site reads, what is real today, and what is still a proposal.
Structural context lives in [ARCHITECTURE.md](ARCHITECTURE.md).

**Status** — `LIVE` implemented and validated on every build · `SEED` implemented
as placeholder data · `PROPOSED` does not exist in code.

---

## 1. The data layers

| Layer | Lives in | Source of truth | Status |
| --- | --- | --- | --- |
| Editorial — reviews, news, guides | `src/content/**/*.md` | Markdown, written by people | LIVE |
| Game catalogue | `src/data/games.ts` | hand-written, 20 games | SEED |
| Outlet table | `src/data/outlets.ts` | hand-written, 53 outlets | SEED |
| Per-outlet scores | `src/data/scores.ts` | hand-written, 3 games, 133 rows | SEED |
| Aggregates (mean, median, histogram) | `src/lib/score/` | derived, never stored | LIVE |
| Game metadata + art | *nothing yet* | IGDB/RAWG | PROPOSED |

The split is deliberate: editorial content is Markdown because humans write it;
game data is not, because it will arrive from APIs and must not be disguised as
prose. Aggregates get their own row because they are computed on every read and
stored nowhere — see §5 rule 2.

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
| `lead` | boolean = false | at most one; renders as the hero feature |

There is deliberately **no `sourceCount` field**. A review is one critic; the
aggregate belongs to the game. The page derives it from `src/data/scores.ts`
via `sourceCountFor()`, keyed by the slug, so the printed count is always the
number of rows behind it. Reviews of games with no rows print no count.

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

## 3. Game catalogue — SEED

`src/data/games.ts` holds one record per game, and everything else derives
from it: the ranking, the podium, the game pages, the recommender bank, the
source counts. When IGDB/RAWG arrive they replace `GAMES` and nothing
downstream changes shape.

```ts
CatalogGame     { id, title, released, platforms[], genre, score, studio,
                  country, director, budget, length, blurb }

GAMES: CatalogGame[]                       // 20 entries, all 2026
getGame(id) · findGameByTitle(title)       // reviews are keyed by title
scoreFor(id): { rows, aggregate }          // the game page's data
sourceCountFor(id): number | undefined     // the only source of a count
relatedGames(game, n = 4)                  // same genre, then nearest score
```

`id` is the route slug (`/games/<id>/`) and the key `scores.ts` rows cite.
`score` is hand-picked; where rows exist it **must equal** the computed mean
(pinned by `score.test.ts`), so the homepage and the game page print the same
number.

The homepage reads through `getYearData(year)`, which projects the catalogue
onto the shapes the islands render:

```ts
Game            { id, rank, title, date, platforms[], score, studio, country,
                  director, budget, genre, length, sourceCount? }
TopGame         { id, rank, title, platforms[], genres[], score, sourceCount? }
Recommendation  { id, title, reason, score }
YearData        { topGames: TopGame[], rankedGames: Game[] }
```

Also exported: `CURRENT_YEAR` (2026), `GRADIENTS` (cover fills from the ember
ramp), `DECADES`, `STOREFRONTS`, `REC_BANK` (the static responses
`/api/recommend` falls back to; see §4b).

`sourceCount` is optional and never authored. `sourceCountFor(id)` derives it
from `src/data/scores.ts`, so only the three seeded games carry one; the other
17 render their hand-picked `score` without the caption.

Years other than 2026 are **generated**: the seed is reshuffled with a
year-seeded PRNG and scores are nudged, so the picker produces a distinct but
reproducible ranking. None of it is real data, and none of those rows carries a
source count — there is nothing to count.

---

## 4. Aggregated score model — BUILT, on placeholder rows

The arithmetic exists and is tested. The data behind it does not: the outlets
are real publications, the scores attributed to them are invented, and the
games do not exist.

### What is built — `src/lib/score/`

| File | Does |
| --- | --- |
| `types.ts` | `Outlet` and `ScoreRow`, with Zod schemas parsed at module load |
| `normalize.ts` | native scale to 0-100, by the published table below |
| `aggregate.ts` | count, mean, median, histogram, band, publish threshold |

`src/lib/score/score.test.ts` covers it — `pnpm test`.

```ts
Outlet  { id, name, scale, weight, verdicts? }
ScoreRow { gameId, outletId, native, reviewUrl, publishedAt, critic?, supersedes? }
```

`mean`, `median`, `count`, `distribution` and `band` all come out of one
`aggregate()` call on one deduped row set, so they cannot disagree. Nothing is
stored.

### Decisions taken

- **Minimum 5 sources** (`MIN_SOURCES`) before a headline score publishes,
  matching OpenCritic. Under it `published` is false: no source count, no
  `aggregateRating`, no score in the meta description. The number itself stays
  on the page: the game page falls back to the catalogue's hand-picked `score`
  and labels it editorial, and the homepage prints it with no label. The
  breakdown table still renders, because the reviews are real evidence even when
  the aggregate is not yet meaningful.
- **No weighting.** Every outlet counts once. `Outlet.weight` exists and is
  ignored, so weighting can arrive without a data migration.
- **A revision replaces its original.** `aggregate()` keeps one row per outlet,
  latest `publishedAt` wins, so re-scoring can never double-count.
- **Buckets are five wide**, with 100 in a bucket of its own, trimmed to the
  populated range. On the seeded Ashen Trials rows this reproduces the chosen
  design's five columns exactly.

### Normalization rules

Published at `/how-we-score/`, which renders `LETTER_SCORES`, `MIN_SOURCES`
and every outlet's `verdicts` map straight from the code, so the page cannot
drift from the arithmetic.

| Native scale | Rule | Example |
| --- | --- | --- |
| N/10 | `N × 10` | 9.5/10 → 95 |
| N/5 | `N × 20` | 4.5/5 → 90 |
| N/100 | identity | 94 → 94 |
| Letter | 95/85/75/65 for A/B/C/D, ±3 for the suffix; F is 50 | B+ → 88 |
| Verdict badge | per-outlet `verdicts` map | Eurogamer *Essential* → 95 |

Anything unparseable throws `NormalizeError` rather than guessing, so a typo
fails the build instead of quietly moving a score.

> The design canvas prints Digital Foundry's `A` as 93. The table above is
> normative and makes it 95; the artboard predates the table. Nothing else in
> `.design/Main.dc.html` disagrees with the model.

### What is seeded — `src/data/scores.ts`

Three games only: Ashen Trials (51 rows), Hollow Vector (38), Driftbound (44).
The other 17 games in `games.ts` carry no rows, so they have no aggregate and
print no source count — see §5 rule 4. They still print and rank by their
hand-picked `score`, as described under the minimum above.

Every `reviewUrl` uses the reserved `.invalid` TLD (RFC 2606) and can never
resolve, so no placeholder row can be mistaken for a citation.

### Still missing

- **Real scores.** Semi-automated curation of the top 20–30 games of 2026,
  ~10–15 outlets each. Manual work; roughly 450 rows. Small enough to stay
  generated JSON in the repo — it does not need a database.
- **Game metadata and art** — IGDB (free, via a Twitch dev account) and RAWG.
  Neither account exists. Verify commercial terms before launch; the free tiers
  are aimed at non-commercial use.

## 4b. Recommender contract — LIVE

`POST /api/recommend` with `{ "prompt": string }` (3–300 characters).

```ts
RecommendResponse { picks: Recommendation[]; source: "claude" | "bank" }
Recommendation    { id, title, reason, score }     // from the catalogue, not the model
```

The model returns `{ picks: [{ id, reason }] }` under a Zod-derived structured
output; `sanitizePicks()` then drops unknown or duplicate ids, takes title and
score from the catalogue, and caps at five. The model's only authored words
are the reasons. `source` is honest: the island labels bank answers.

400 on a bad prompt, 405 on GET. Every failure past validation — no key, a
rate limit, a refusal, a parse miss — returns the bank with 200, so the visitor
always gets five picks and the operator finds the cause in function logs.

## 5. Consistency rules to preserve

Whatever the score model becomes, these must hold:

1. **A score's colour is always `scoreColor(score)`.** Never a hardcoded hex.
2. **Mean, median and histogram are derived from the same rows**, never authored
   separately — they contradict each other the moment they are.
3. **Every source row links to its original review.** A row without a URL is not
   evidence.
4. **`sourceCount` must equal the number of rows**, or it is a false claim on
   the most important number on the page.

All four now hold in code: 1 and 2 by construction inside `aggregate()`, 3 by
`scoreRowSchema` requiring a URL, 4 by `sourceCountFor()` being the only way a
count reaches a page. `score.test.ts` pins 2 and 4 against the design's figures.
