# Sibi Gamers

Critic-aggregated game rankings, reviews, news and guides.

| Document | For |
| --- | --- |
| [sibi-gamers-master.md](sibi-gamers-master.md) | Source of truth — brand, roadmap, decision log |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the code works and the invariants behind it |
| [SCHEMA.md](SCHEMA.md) | Data shapes; what is real vs proposed |
| [CLAUDE.md](CLAUDE.md) | Orientation for AI coding sessions |

This file only covers running the code.

**Stack:** Astro 7 · React 19 (islands only) · TypeScript · GSAP 3

This project uses **pnpm** (see `packageManager` in `package.json`).
If you don't have it: `corepack enable` or `npm i -g pnpm`.

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # astro check && astro build → 59 pages + one function
pnpm test      # vitest — score model and recommender logic
pnpm preview   # serve the production build
pnpm lint      # oxlint
```

## Routes

| Route | Source | Interactive part |
| --- | --- | --- |
| `/` | `pages/index.astro` | `RankingsBoard` + `PromptBox` islands |
| `/reviews/` | `content/reviews/*.md` | score-band filter (no framework) |
| `/news/` | `content/news/*.md` | category filter (no framework) |
| `/guides/` | `content/guides/*.md` | type filter (no framework) |
| `/reviews/[slug]/` · `/news/[slug]/` · `/guides/[slug]/` | the same Markdown | none |
| `/games/[slug]/` | `data/games.ts` catalogue | none — "show all sources" is a `<details>` |
| `/how-we-score/` | `pages/how-we-score.astro` | none |
| `POST /api/recommend` | `pages/api/recommend.ts` | the one server route (Vercel function) |

## Layout

```
src/
  pages/            one file per route → static HTML
  layouts/Base      shell + per-page <head> (title, description, canonical, OG)
  content/          reviews · news · guides as Markdown
  content.config.ts Zod schemas — bad frontmatter fails the build
  ds/               design system ported from the Claude Design bundle
    tokens/         colors · typography · spacing · fonts (copied verbatim)
  components/       .astro components — zero client JS
  islands/          the only React that hydrates
  pages/api/        recommend.ts — Claude API, SSR; lib/recommend.ts is its pure half
  lib/score/        normalization + aggregation, unit-tested
  scripts/
    motion.ts       all site motion, via data-attributes
    filters.ts      list filtering, 428 B gz
  data/games.ts     the catalogue; everything derives from it (IGDB/RAWG later)
  data/outlets.ts   outlets and their scales
  data/scores.ts    per-outlet score rows (placeholder)
  styles/app.css    page styles + the design's token overrides
```

## The three rules worth knowing before editing

**1. Nothing becomes an island just to animate.** Static markup opts into motion with
data-attributes — `data-reveal` / `data-reveal-item`, `data-count`, `data-hover-lift`,
`data-hover-bar`, `data-thumb-stack`, `data-flame`. `scripts/motion.ts` picks them up.
Only genuine state (the year picker, the prompt box) earns a React island. When an
island swaps its own content it dispatches `sibi:content` and the motion script
re-scans.

**2. Filters hide, they don't re-render.** Every card is server-rendered and stays in
the DOM; a filter toggles `hidden`. Crawlers get the whole catalogue rather than
whichever subset the default filter selects, and the pages work identically before the
428-byte script loads — they just start on "All".

**3. Motion is strictly additive.** GSAP is ~44 kB gz, so it is imported dynamically on
`requestIdleCallback` and **not downloaded at all** under `prefers-reduced-motion`.
Scores render their final value in the HTML and reveals only fade content *in*, so if
the script never runs the page is complete and correct — just still.

Result: **1.7 kB gz of JS per page**, versus 129 kB gz for the Vite SPA this replaced.

## Content

Add a Markdown file to `src/content/<collection>/` and it appears on its section page
and in the homepage digest — no component changes. Frontmatter is validated by the Zod
schemas in `src/content.config.ts`; a typo fails the build rather than rendering blank.

Exactly one entry per collection may set `lead: true` — that one renders as the hero
feature at the top of its section.

## Known gaps

- **Deployed at https://sibi-gamers.vercel.app**, but canonical URLs still say
  `sibigamers.gg`, which is not attached. Settle before asking for indexing.
- **The recommender is on the static bank in production** until `ANTHROPIC_API_KEY`
  is set on the Vercel project (`vercel env add ANTHROPIC_API_KEY production`). The
  island labels bank answers. No per-visitor rate limit yet.
- **Score data is invented.** The arithmetic is real and tested; the 133 rows behind
  three games are placeholders. The other 17 games publish no score.
- **All copy is placeholder.** Verdicts, headlines, guide text and every critic byline
  are invented, sized to exercise the layouts. Replace before launch.
- **Fonts are substitutes.** Big Shoulders and IBM Plex Sans stand in via Google Fonts;
  no brand font files were supplied. Replace `src/ds/tokens/fonts.css` when they arrive.
