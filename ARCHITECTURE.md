# Architecture

How the Sibi Gamers site is built and why. Product direction, roadmap and the
decision log live in [sibi-gamers-master.md](sibi-gamers-master.md) — that
document decides *what* we build. This one describes *how the code works*, in
enough detail to change it safely.

Companion docs: [SCHEMA.md](SCHEMA.md) for data shapes, [README.md](README.md)
for running it.

---

## 1. The constraint everything else follows from

This is an SEO business. The game page carries the aggregated score and the
affiliate buy links; news and guides are the traffic that feeds it. So the
non-negotiable requirement is that a crawler receives **complete HTML per
route, with its own title, description and canonical**.

That single requirement chose the stack, the islands policy, the filter
implementation and the motion strategy. When a change conflicts with it, the
change loses.

## 2. Stack

**Astro 7 · React 19 (islands only) · GSAP 3 · TypeScript · pnpm**

A client-rendered SPA was built first and discarded: it handed crawlers an
empty `<div>`, one shared `<title>`, and a slow LCP. It was replaced before more
pages existed, while the migration was still cheap (decision log, Aug 2026).

## 3. Rendering model

`output: "static"`. Every route is prerendered to HTML at build time. The
Vercel adapter is installed, but no route has opted into SSR, so nothing runs on
a server yet.

| Route | Source | Count |
| --- | --- | --- |
| `/` | `pages/index.astro` | 1 |
| `/reviews/`, `/news/`, `/guides/` | index pages, `getCollection()` | 3 |
| `/reviews/[slug]/` | `content/reviews/*.md` | 13 |
| `/news/[slug]/` | `content/news/*.md` | 11 |
| `/guides/[slug]/` | `content/guides/*.md` | 10 |

**38 pages total.** Detail routes use `getStaticPaths()` over the collection and
`render(entry)` for the body. Each carries prev/next within its own section,
ordered by date for reviews and news and by the `order` field for guides.

`Base.astro` owns `<head>`: title, description, canonical, Open Graph. Detail
pages pass `ogType="article"`; everything else defaults to `website`. Detail
pages also emit JSON-LD — `Review` with `reviewRating`, `NewsArticle`, and
`HowTo` with the guide's chapters as steps.

## 4. JavaScript budget

Measured on the current build, gzipped, including transitive imports:

| Page | JS | What it is |
| --- | --- | --- |
| Article pages (34) | **1.6 kB** | the motion module, nothing else |
| Section indices (3) | **1.7 kB** | motion + the filter script |
| Homepage | **~64 kB** | the above **plus React**, for two islands |

The homepage is the outlier and it is worth being precise about it: it hydrates
`RankingsBoard` with `client:load` and `PromptBox` with `client:visible`. Both
need the React runtime, and `client:load` puts most of it on the critical path.
It still beats the 129 kB SPA that was discarded, but it is not the 1.7 kB the
other 37 pages ship.

If the homepage's LCP becomes a problem, the lever is `RankingsBoard`: the year
picker is the only genuinely stateful part, and the ranking table underneath it
could be server-rendered with the island reduced to the picker alone.

## 5. Islands policy

> **Nothing becomes an island unless it holds state.**

Animation does not justify hydration. Static markup opts into behaviour through
data attributes instead. There are exactly two islands:

- `islands/RankingsBoard.tsx` — decade/year picker plus the ranking it drives
- `islands/PromptBox.tsx` — the natural-language recommender

Everything else is `.astro` and ships zero client JS.

## 6. Content pipeline

Editorial content is Markdown in `src/content/`, loaded through Astro content
collections with Zod schemas in `src/content.config.ts`. The schema validates
frontmatter on **every build** — a missing or mistyped field fails the build
rather than rendering a broken card. Field-by-field reference: [SCHEMA.md](SCHEMA.md).

The split is deliberate:

- **Editorial content is Markdown**, because it is written by people.
- **Game and score data is not**, because it will come from IGDB/RAWG and a
  curated source table. It lives in TypeScript today and must not be disguised
  as Markdown.

### The score module

`src/lib/score/` turns per-outlet rows into an aggregate: `normalize.ts` maps a
published verdict onto 0-100, `aggregate.ts` derives count, mean, median,
histogram and band from one deduped row set. Nothing is stored, so the numbers
on a page cannot drift apart from the rows behind them.

The rule that matters: **a source count only ever comes from
`sourceCountFor()`**, which counts real rows. Three games are seeded; the rest
render with no count rather than an invented one. Model, thresholds and what is
still placeholder: [SCHEMA.md](SCHEMA.md) §4.

## 7. The design system boundary

`src/ds/tokens/*.css` are a **literal copy** from the Claude Design project.
Do not hand-edit them. Re-syncing means replacing the files wholesale; an edit
made here is silently lost on the next sync.

Page-level overrides belong in `src/styles/app.css`. That includes overriding a
token's value inside a media query — as the responsive container scaling does —
rather than changing the token file.

```
src/ds/
  tokens/colors.css       fire ramp: ink #03071E → amber flame #FFBA08
  tokens/typography.css   Big Shoulders (display) + IBM Plex Sans (body)
  tokens/spacing.css      4px scale, radii, shadows, motion timings
  scoreColor.ts           the 0-100 → band → colour mapping
```

`scoreColor.ts` is the brand's core logic: a score is always printed in its
band's colour. Bands are `top` ≥85, `high` ≥70, `mid` ≥50, `low` below. The
score-band filter on `/reviews/` derives its options from the same function, so
the filter can never drift from the colours.

## 8. Motion

One module, `scripts/motion.ts`, for the whole site. Static markup opts in:

| Attribute | Effect |
| --- | --- |
| `data-reveal` / `data-reveal-item` | staggered section reveal |
| `data-count="94"` | score counts up when scrolled into view |
| `data-hover-lift` / `data-hover-bar` | card lift and underline expand |
| `data-thumb-stack` | ranking row's ember plates slide out |
| `data-flame` | logomark idle flicker |

Three properties make this safe:

1. **GSAP loads on idle**, dynamically imported, never on the critical path.
2. **It is not downloaded at all** under `prefers-reduced-motion: reduce`.
3. **It is strictly additive.** Scores render their final value in the HTML and
   reveals only fade content *in*. If the module never runs, the page is
   complete and correct — just still.

## 9. Filters without a framework

`scripts/filters.ts` (831 B raw) drives the score-band, category and type
filters on the three index pages, using `data-filter-*` attributes.

**All cards are always present in the HTML.** The filter only toggles `hidden`.
It never re-renders and never fetches. The crawler therefore sees the full
catalogue rather than whatever subset the default filter selects — which is the
entire point.

## 10. Responsive architecture

Breakpoints are content-driven — placed where the design actually breaks, not
on device names.

| Query | Purpose |
| --- | --- |
| `max-width: 1100px` | hero drops to 2-up; rail and columns stack |
| `max-width: 860px` | nav wraps to a scrolling strip; lead feature stacks |
| `max-width: 720px` | hero drops to 1-up |
| `max-width: 640px` | ranking row sheds columns; prev/next stacks |
| `max-height: 500px` + landscape | sticky nav released |
| `pointer: coarse` | 44px hit areas |
| `min-width: 1600px` / `2100px` | container grows to 1440px / 1560px |

Two decisions worth keeping:

**Touch sizing is keyed to the pointer, not the width.** A 1024px tablet needs
44px targets; a 1024px laptop does not. Under `pointer: coarse`, hit areas grow
without the visual design moving — nav links expand via an `::after` box so the
animated underline bars stay put, and cards become stretched links so the whole
card is tappable. Stretched links are scoped to touch so pointer users keep
normal text selection inside a card.

**Large displays widen the container, not the prose.** Above 1600px the shell
grows and the card grids gain a column. Reading measure is unaffected: article
bodies are held at 72ch by `.article__body`.

Verified across 84 page × width combinations from 320px to 2560px. Two failure
modes caused every overflow found and are worth recognising on sight:

- `grid-template-columns: 1fr` keeps an implicit *min-content* minimum, so a
  wide child stretches the track. Use `minmax(0, 1fr)`.
- `justify-self: start` sizes a grid item to its own content, so it overflows
  its track no matter what `min-width` says. Use `stretch` and let
  `overflow-x` scroll.

## 11. Build and deploy

```bash
pnpm build    # astro check (typecheck) && astro build → dist/
pnpm test     # vitest — the score model's arithmetic
```

`astro check` runs first, so a type error fails the build. `pnpm test` is not
wired into `build`; it covers `src/lib/score/`, where the failure mode is a
wrong number rather than a type error.

`@astrojs/vercel` is installed and wired in `astro.config.mjs`, so a route can
opt into SSR with `export const prerender = false`. None does yet, which is why
`/api/recommend` still does not exist and `PromptBox` serves from a static
recommendation bank (`REC_BANK`).

The site is deployed to Vercel at **https://sibi-gamers.vercel.app** (project
`sibi-gamers`, personal scope, GitHub repo connected — pushes to `main` deploy).

**Open:** `astro.config.mjs` sets `site: "https://sibigamers.gg"`, so every
canonical and OG URL points at a domain that is not attached to the deployment
and does not resolve. Deliberately deferred until the project is closer to done;
it must be settled before the site is submitted for indexing.

## 12. Invariants

Break these and the model breaks with them:

1. Never make something an island because it animates.
2. Never filter by re-rendering; keep every card in the HTML.
3. Never hand-edit `src/ds/tokens/`.
4. Never make motion load-bearing — the page must read correctly with JS off.
5. Never put game/score data in Markdown; it comes from APIs.
6. Never author a source count. It comes from `sourceCountFor()` counting real
   rows, or the page renders without it.

## 13. Known gaps

- **No game detail page.** The design is chosen (direction A) and the score
  model it was blocked on now exists, so this is the next thing to build. Every
  game link in the islands still points at `#`, and those links are also the
  only remaining sub-44px touch targets.
- **No real score data.** The score model is built and tested
  (`src/lib/score/`), but the rows feeding it are invented: 133 placeholder
  scores across three games, attributed to real outlets for games that do not
  exist. Curating real scores is manual work that has not started. See
  SCHEMA.md §4.
- **All copy is placeholder.** Every verdict, headline, critic and studio name is
  invented and must be replaced before launch.
- **Three dead data modules.** `src/data/reviews.ts`, `news.ts` and `guides.ts`
  (518 lines) have zero importers since content moved to Markdown.
- **Footer links go nowhere.** About, Contact, Press, Terms, Privacy and "How we
  score" all resolve to `/`. Social icons are `#`.
