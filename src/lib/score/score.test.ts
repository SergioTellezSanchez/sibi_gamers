import { describe, expect, it } from "vitest";
import { OUTLETS, OUTLETS_BY_ID } from "../../data/outlets";
import { rowsForGame, SCORE_ROWS } from "../../data/scores";
import { aggregate, MIN_SOURCES, resolve } from "./aggregate";
import { LETTER_SCORES, normalize, NormalizeError } from "./normalize";
import type { Outlet } from "./types";

const outlet = (scale: Outlet["scale"], verdicts?: Record<string, number>): Outlet =>
  ({ id: "x", name: "X", scale, weight: 1, verdicts });

describe("normalize", () => {
  it("applies the published rules from SCHEMA.md §4", () => {
    expect(normalize("9/10", outlet("10-point"))).toBe(90);
    expect(normalize("9.5 / 10", outlet("10-point"))).toBe(95);
    expect(normalize("4.5/5", outlet("5-star"))).toBe(90);
    expect(normalize("4/5", outlet("5-star"))).toBe(80);
    expect(normalize("94/100", outlet("100-point"))).toBe(94);
    expect(normalize("B+", outlet("letter"))).toBe(88);
    expect(normalize("Essential", outlet("verdict", { Essential: 95 }))).toBe(95);
  });

  it("accepts a bare number and the unicode minus in a grade", () => {
    expect(normalize("88", outlet("100-point"))).toBe(88);
    expect(normalize("A−", outlet("letter"))).toBe(92);
    expect(normalize("a-", outlet("letter"))).toBe(92);
  });

  it("rejects anything it cannot place rather than guessing", () => {
    expect(() => normalize("11/10", outlet("10-point"))).toThrow(NormalizeError);
    expect(() => normalize("9/10", outlet("5-star"))).toThrow(NormalizeError);
    expect(() => normalize("great", outlet("letter"))).toThrow(NormalizeError);
    expect(() => normalize("Essential", outlet("verdict", { Avoid: 40 }))).toThrow(NormalizeError);
  });

  it("keeps letter grades on their stated pattern", () => {
    // 95/85/75/65 for A/B/C/D, ±3 for the suffix. F breaks the pattern on purpose.
    for (const [letter, base] of [["A", 95], ["B", 85], ["C", 75], ["D", 65]] as const) {
      expect(LETTER_SCORES[letter]).toBe(base);
      expect(LETTER_SCORES[`${letter}+`]).toBe(base + 3);
      expect(LETTER_SCORES[`${letter}-`]).toBe(base - 3);
    }
    expect(LETTER_SCORES.F).toBe(50);
  });
});

describe("aggregate", () => {
  const rows = (values: number[]) =>
    resolve(
      values.map((v, i) => ({
        gameId: "g", outletId: `o${i}`, native: `${v}/100`,
        reviewUrl: "https://placeholder.invalid/x", publishedAt: new Date("2026-01-01"),
      })),
      new Map(values.map((_, i) => [`o${i}`, { ...outlet("100-point"), id: `o${i}` }])),
    );

  it("derives mean, median and histogram from the same rows", () => {
    const a = aggregate(rows([80, 90, 100]));
    expect(a.mean).toBe(90);
    expect(a.median).toBe(90);
    expect(a.count).toBe(3);
    expect(a.distribution.reduce((n, b) => n + b.count, 0)).toBe(3);
  });

  it("averages the two middle values on an even count", () => {
    expect(aggregate(rows([80, 85, 90, 95])).median).toBe(88);
  });

  it("puts 100 in a bucket of its own and trims empty tails", () => {
    const a = aggregate(rows([95, 100]));
    expect(a.distribution.map((b) => b.label)).toEqual(["95–99", "100"]);
  });

  it("withholds a score below the minimum source count", () => {
    expect(aggregate(rows(Array(MIN_SOURCES - 1).fill(90))).published).toBe(false);
    expect(aggregate(rows(Array(MIN_SOURCES).fill(90))).published).toBe(true);
  });

  it("counts one row per outlet, keeping the latest revision", () => {
    const map = new Map([["ign", { ...outlet("100-point"), id: "ign" }]]);
    const a = aggregate(resolve([
      { gameId: "g", outletId: "ign", native: "70/100", reviewUrl: "https://placeholder.invalid/a", publishedAt: new Date("2026-01-01") },
      { gameId: "g", outletId: "ign", native: "90/100", reviewUrl: "https://placeholder.invalid/b", publishedAt: new Date("2026-06-01"), supersedes: "a" },
    ], map));
    expect(a.count).toBe(1);
    expect(a.mean).toBe(90);
  });

  it("reports nothing rather than NaN with no rows", () => {
    const a = aggregate([]);
    expect(a).toMatchObject({ count: 0, mean: 0, published: false, distribution: [] });
  });
});

describe("seed data", () => {
  it("every row cites a known outlet and normalizes", () => {
    expect(() => resolve(SCORE_ROWS, OUTLETS_BY_ID)).not.toThrow();
  });

  it("cites no outlet twice for the same game", () => {
    const seen = new Set(SCORE_ROWS.map((r) => `${r.gameId}/${r.outletId}`));
    expect(seen.size).toBe(SCORE_ROWS.length);
  });

  it("uses only non-resolving placeholder URLs", () => {
    for (const row of SCORE_ROWS) {
      expect(new URL(row.reviewUrl).hostname.endsWith(".invalid")).toBe(true);
    }
  });

  it("has unique outlet ids", () => {
    expect(new Set(OUTLETS.map((o) => o.id)).size).toBe(OUTLETS.length);
  });

  // The chosen design (.design/Main.dc.html) prints these numbers. If the model
  // stops reproducing them, the page and the artboard have diverged.
  it("reproduces the Ashen Trials figures from the design canvas", () => {
    const a = aggregate(resolve(rowsForGame("ashen-trials"), OUTLETS_BY_ID));
    expect(a.count).toBe(51);
    expect(a.meanRaw).toBe(94);
    expect(a.median).toBe(94);
    expect(a.published).toBe(true);
    expect(a.distribution.map((b) => b.label)).toEqual(["80–84", "85–89", "90–94", "95–99", "100"]);
    expect(a.distribution.map((b) => b.count)).toEqual([2, 6, 18, 14, 11]);
  });

  it("matches the source counts the homepage claims", () => {
    for (const [gameId, count, mean] of [
      ["ashen-trials", 51, 94], ["hollow-vector", 38, 91], ["driftbound", 44, 89],
    ] as const) {
      const a = aggregate(resolve(rowsForGame(gameId), OUTLETS_BY_ID));
      expect([gameId, a.count, a.mean]).toEqual([gameId, count, mean]);
    }
  });
});
