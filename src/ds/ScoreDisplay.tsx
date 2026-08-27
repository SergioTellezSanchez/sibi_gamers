import { scoreColor } from "./scoreColor";

type ScoreDisplayProps = {
  score: number;
  size?: "hero" | "card" | "row";
  sourceCount?: number;
  /** Count up from zero when scrolled into view (design system §motion). */
  countUp?: boolean;
};

/**
 * React twin of components/ScoreDisplay.astro. Both render the same classes
 * and both defer animation to scripts/motion.ts via `data-count`, so the two
 * cannot drift visually.
 */
export function ScoreDisplay({
  score,
  size = "card",
  sourceCount,
  countUp = true,
}: ScoreDisplayProps) {
  const value = Math.round(score);

  return (
    <div className={`score score--${size}`} style={{ color: scoreColor(score) }}>
      <div className="score__value" data-count={countUp ? value : undefined}>
        {value}
      </div>
      <div className="score__rule" />
      {sourceCount != null && (
        <div className="score__caption">based on {sourceCount} sources</div>
      )}
    </div>
  );
}
