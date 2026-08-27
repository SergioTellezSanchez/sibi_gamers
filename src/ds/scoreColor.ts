/**
 * The score bands are the core of the brand: a title's number is always
 * printed in the colour of its band, from brick ember up to amber flame.
 */
export type ScoreBand = "low" | "mid" | "high" | "top";

export function scoreBand(score: number): ScoreBand {
  if (score >= 85) return "top";
  if (score >= 70) return "high";
  if (score >= 50) return "mid";
  return "low";
}

export function scoreColor(score: number): string {
  return `var(--score-${scoreBand(score)})`;
}
