import { useEffect, useRef, useState } from "react";
import { REC_BANK, type Recommendation } from "../data/games";
import { scoreColor } from "../ds/scoreColor";
import type { RecommendResponse } from "../lib/recommend";

/**
 * Differentiator from master doc §2: describe a mood, get five picks.
 *
 * Submits to `/api/recommend`, the site's one server route. If that route is
 * unconfigured or unreachable the static bank answers instead, and the
 * caption says so: a fallback that looks like the real thing is a lie.
 */
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; picks: Recommendation[]; source: RecommendResponse["source"] };

export default function PromptBox() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "done") document.dispatchEvent(new CustomEvent("sibi:content"));
  }, [state]);

  const submit = async () => {
    const prompt = value.trim();
    if (prompt.length < 3 || state.status === "loading") return;
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`recommend ${res.status}`);
      const data = (await res.json()) as RecommendResponse;
      setState({ status: "done", picks: data.picks, source: data.source });
    } catch {
      setState({ status: "done", picks: REC_BANK, source: "bank" });
    }
  };

  const loading = state.status === "loading";

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
              if (e.key === "Enter") void submit();
            }}
            maxLength={300}
            placeholder="e.g. something cozy and slow-paced I can finish in a weekend"
            aria-label="Describe what you want to play"
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => void submit()}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Thinking" : "Ask"}
          </button>
        </div>

        {state.status === "done" && (
          <div
            className="promptbox__results"
            ref={resultsRef}
            data-reveal
            data-reveal-stagger="0.06"
            aria-live="polite"
          >
            {state.picks.map((rec) => (
              <div className="rec" key={rec.id} data-reveal-item>
                <div>
                  <a className="rec__title" href={`/games/${rec.id}/`}>
                    {rec.title}
                  </a>
                  <div className="rec__reason">{rec.reason}</div>
                </div>
                <div className="rec__score" style={{ color: scoreColor(rec.score) }}>
                  {rec.score}
                </div>
              </div>
            ))}
            {state.source === "bank" && (
              <p className="promptbox__note">
                Standing picks: the recommender is not connected yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
