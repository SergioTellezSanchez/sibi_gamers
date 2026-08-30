import { useEffect, useMemo, useState } from "react";
import { CURRENT_YEAR, DECADES, GRADIENTS, STOREFRONTS, getYearData } from "../data/games";
import { ScoreDisplay } from "../ds/ScoreDisplay";
import { Tag } from "../ds/Tag";

/**
 * The only stateful part of the homepage: the decade/year picker and the
 * ranking it drives. Astro server-renders this at CURRENT_YEAR, so the HTML a
 * crawler receives is the canonical "Best games of 2026" — hydration only adds
 * the ability to change year.
 */
export default function RankingsBoard() {
  const [decade, setDecade] = useState("2020s");
  const [year, setYear] = useState(CURRENT_YEAR);

  const { topGames, rankedGames } = useMemo(() => getYearData(year), [year]);

  // A new year swaps out every card and row; tell the motion script to
  // re-animate the content it now owns.
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("sibi:content"));
  }, [year]);

  const activeDecade = DECADES.find((d) => d.label === decade) ?? DECADES[0];
  const years: number[] = [];
  for (let y = Math.min(activeDecade.end, CURRENT_YEAR); y >= activeDecade.start; y--) {
    years.push(y);
  }

  const selectDecade = (label: string) => {
    const d = DECADES.find((x) => x.label === label);
    if (!d) return;
    setDecade(label);
    setYear(Math.min(d.end, CURRENT_YEAR));
  };

  const first = rankedGames[0]?.rank ?? 4;
  const last = rankedGames[rankedGames.length - 1]?.rank ?? 20;

  return (
    <>
      <div className="periods">
        <div className="periods__decades" role="group" aria-label="Decade">
          {DECADES.map((d) => (
            <button
              key={d.label}
              type="button"
              className="decade"
              aria-pressed={d.label === decade}
              onClick={() => selectDecade(d.label)}
            >
              {d.label}
              <span className="decade__fill decade__fill--1" />
              <span className="decade__fill decade__fill--2" />
              <span className="decade__fill decade__fill--3" />
            </button>
          ))}
        </div>

        <div className="periods__years">
          <div className="pill-group pill-group--center" role="group" aria-label="Year">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                className="pill"
                aria-pressed={y === year}
                onClick={() => setYear(y)}
              >
                <span className="pill__wash pill__wash--1" />
                <span className="pill__wash pill__wash--2" />
                <span className="pill__wash pill__wash--3" />
                <span className="pill__label">{y}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="hero">
        <div className="section-head hero__head">
          <h1 className="section-head__title">Best games of {year}</h1>
          <a className="eyebrow eyebrow--link" href="#">
            View all
          </a>
        </div>

        <div className="hero-grid">
          {topGames.map((game, i) => (
            <div className="hero-card" key={`${year}-${game.id}`} data-hover-lift>
              <span className="hero-card__layer hero-card__layer--back" />
              <span className="hero-card__layer hero-card__layer--mid" />
              <span className="hero-card__layer hero-card__layer--front" />

              <div className="hero-card__face">
                <div
                  className="hero-card__cover"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                >
                  <span className="hero-card__rank">#{game.rank}</span>
                </div>

                <div className="hero-card__body">
                  <a className="hero-card__title" href={`/games/${game.id}/`}>
                    {game.title}
                  </a>

                  <div className="hero-card__tags">
                    {game.platforms.map((p) => (
                      <span key={p} className="hero-card__tag hero-card__tag--platform">
                        {p}
                      </span>
                    ))}
                    {game.genres.map((g) => (
                      <span key={g} className="hero-card__tag hero-card__tag--genre">
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="hero-card__score">
                    <span className="hero-card__score-value" data-count={game.score}>
                      {game.score}
                    </span>
                    <span className="hero-card__score-rule" data-hover-bar />
                    {game.sourceCount != null && (
                      <span className="hero-card__score-caption">
                        based on {game.sourceCount} sources
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ranks">
        <div className="ranks__head">
          <h2 className="eyebrow">
            Rank {first}&ndash;{last}
          </h2>
          <a className="eyebrow eyebrow--link" href="#">
            Full rankings
          </a>
        </div>

        <ul className="ranks__body">
          {rankedGames.map((game, i) => (
            <li className="rank-row" key={`${year}-${game.id}`} data-thumb-stack>
              <div className="rank-row__num">{game.rank}</div>

              <div className="rank-row__thumb">
                <div className="rank-row__thumb-layer rank-row__thumb-layer--b" />
                <div className="rank-row__thumb-layer rank-row__thumb-layer--a" />
                <div
                  className="rank-row__thumb-layer"
                  style={{ background: GRADIENTS[(i + 2) % GRADIENTS.length] }}
                />
              </div>

              <div className="rank-row__main">
                <h3 className="rank-row__title">
                  <a href={`/games/${game.id}/`}>{game.title}</a>
                </h3>
                <div className="rank-row__meta">
                  {game.date} · {game.genre} · {game.platforms.join(" · ")}
                </div>
                <div className="rank-row__stores">
                  <span className="rank-row__stores-label">Play on</span>
                  {STOREFRONTS[i % STOREFRONTS.length].map((s) => (
                    <Tag key={s} tone="accent">
                      {s}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="rank-row__facts">
                {[
                  { k: "Studio", v: game.studio },
                  { k: "Country", v: game.country },
                  { k: "Director", v: game.director },
                  { k: "Budget", v: game.budget },
                  { k: "Length", v: game.length },
                ].map((f) => (
                  <div className="fact" key={f.k}>
                    <div className="fact__key">{f.k}</div>
                    <div className="fact__value">{f.v}</div>
                  </div>
                ))}
              </div>

              <div className="rank-row__score">
                <ScoreDisplay
                  score={game.score}
                  size="card"
                  sourceCount={game.sourceCount}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
