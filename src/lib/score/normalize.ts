import type { Outlet } from "./types";

/**
 * Native scale to 0-100. These rules are the product: the claim against
 * Metacritic is that the arithmetic is public, so this table is published
 * verbatim on the "How we score" page and must not diverge from it.
 */

/**
 * Letter grades sit at 95/85/75/65 for A/B/C/D, plus or minus 3 for the
 * suffix. F is 50 — a fail is a judgement, not a point on the curve, so it
 * does not continue the pattern down to 55.
 */
export const LETTER_SCORES: Readonly<Record<string, number>> = {
  "A+": 98, A: 95, "A-": 92,
  "B+": 88, B: 85, "B-": 82,
  "C+": 78, C: 75, "C-": 72,
  "D+": 68, D: 65, "D-": 62,
  F: 50,
};

export class NormalizeError extends Error {}

/** Accepts "9.5 / 10", "9.5/10" and a bare "9.5". */
function fraction(native: string, denominator: number): number {
  const match = native.match(/^\s*(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?)\s*)?$/);
  if (!match) throw new NormalizeError(`cannot parse "${native}" as a fraction`);

  const value = Number(match[1]);
  const stated = match[2] === undefined ? denominator : Number(match[2]);
  if (stated !== denominator) {
    throw new NormalizeError(`"${native}" is not out of ${denominator}`);
  }
  if (value > denominator) {
    throw new NormalizeError(`"${native}" exceeds its own scale`);
  }
  return value;
}

export function normalize(native: string, outlet: Outlet): number {
  const raw = normalizeRaw(native, outlet);
  if (raw < 0 || raw > 100) {
    throw new NormalizeError(`"${native}" normalizes to ${raw}, outside 0-100`);
  }
  // Outlets publish half-steps; the 0-100 scale is integers. Rounding here and
  // not at display time keeps the mean honest — it is the mean of the numbers
  // actually shown in the breakdown table, not of hidden fractions.
  return Math.round(raw);
}

function normalizeRaw(native: string, outlet: Outlet): number {
  switch (outlet.scale) {
    case "10-point":
      return fraction(native, 10) * 10;
    case "5-star":
      return fraction(native, 5) * 20;
    case "100-point":
      return fraction(native, 100);
    case "letter": {
      const key = native.trim().toUpperCase().replace(/[−–—]/g, "-");
      const score = LETTER_SCORES[key];
      if (score === undefined) throw new NormalizeError(`unknown letter grade "${native}"`);
      return score;
    }
    case "verdict": {
      const score = outlet.verdicts?.[native.trim()];
      if (score === undefined) {
        throw new NormalizeError(`${outlet.name} has no mapping for verdict "${native}"`);
      }
      return score;
    }
  }
}
