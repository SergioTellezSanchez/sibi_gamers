import { useEffect, useRef, useState } from "react";
import { REC_BANK } from "../data/games";
import { scoreColor } from "../ds/scoreColor";

/**
 * Differentiator from master doc §2: describe a mood, get five picks.
 *
 * The recommendation bank is static for now. When the SSR adapter lands this
 * submits to a `/api/recommend` endpoint backed by the Claude API, and the
 * results shape below is what that endpoint returns.
 */
export default function PromptBox() {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<typeof REC_BANK | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results) document.dispatchEvent(new CustomEvent("sibi:content"));
  }, [results]);

  const submit = () => setResults(REC_BANK);

  return (
    <section className="promptbox">
      <span className="promptbox__layer promptbox__layer--back" />
      <span className="promptbox__layer promptbox__layer--mid" />

      <div className="promptbox__face">
        <h2 className="promptbox__title">What do you want to play?</h2>
        <p className="promptbox__subtitle">
          Describe a mood or a craving. Get five picks.
        </p>

        <div className="promptbox__field">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="e.g. something cozy and slow-paced I can finish in a weekend"
            aria-label="Describe what you want to play"
          />
          <button type="button" className="btn btn--primary btn--sm" onClick={submit}>
            Ask
          </button>
        </div>

        {results && (
          <div
            className="promptbox__results"
            ref={resultsRef}
            data-reveal
            data-reveal-stagger="0.06"
          >
            {results.map((rec) => (
              <div className="rec" key={rec.title} data-reveal-item>
                <div>
                  {/* Master doc §2: recommendations link to their game pages.
                      Wire these up once the game detail route exists. */}
                  <a className="rec__title" href="#">
                    {rec.title}
                  </a>
                  <div className="rec__reason">{rec.reason}</div>
                </div>
                <div className="rec__score" style={{ color: scoreColor(rec.score) }}>
                  {rec.score}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
