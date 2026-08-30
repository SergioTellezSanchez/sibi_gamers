import { scoreBand, type ScoreBand } from "../../ds/scoreColor";
import { normalize } from "./normalize";
import type { Outlet, ResolvedScore, ScoreRow } from "./types";

/**
 * Below this many sources a number is not an aggregate, it is one person's
 * opinion with extra steps. Five matches OpenCritic, which makes the choice
 * defensible on the "How we score" page. Under it the breakdown table still
 * renders — the reviews are real evidence — but no headline score publishes.
 */
export const MIN_SOURCES = 5;

/** Buckets are a flat five wide, with 100 alone because it caps the scale. */
export type Bucket = { label: string; min: number; max: number; count: number };

export type Aggregate = {
  count: number;
  /** The published number. Integer, because that is what the page prints. */
  mean: number;
  /** Unrounded, for tests and for anyone checking our arithmetic. */
  meanRaw: number;
  median: number;
  band: ScoreBand;
  /** Trimmed to the populated range; an all-empty tail is noise, not data. */
  distribution: Bucket[];
  /** False when `count < MIN_SOURCES`; the caller must then hide the score. */
  published: boolean;
};

/**
 * One row per outlet: a re-scored review replaces the original rather than
 * joining it, so an outlet can never be counted twice. Latest wins.
 */
export function dedupe(rows: ResolvedScore[]): ResolvedScore[] {
  const latest = new Map<string, ResolvedScore>();
  for (const row of rows) {
    const held = latest.get(row.outletId);
    if (!held || row.publishedAt > held.publishedAt) latest.set(row.outletId, row);
  }
  return [...latest.values()];
}

export function resolve(rows: ScoreRow[], outlets: Map<string, Outlet>): ResolvedScore[] {
  return rows.map((row) => {
    const outlet = outlets.get(row.outletId);
    if (!outlet) throw new Error(`score row cites unknown outlet "${row.outletId}"`);
    return { ...row, outlet, normalized: normalize(row.native, outlet) };
  });
}

function buckets(values: number[]): Bucket[] {
  const all: Bucket[] = [];
  for (let min = 0; min < 100; min += 5) {
    all.push({ label: `${min}–${min + 4}`, min, max: min + 4, count: 0 });
  }
  all.push({ label: "100", min: 100, max: 100, count: 0 });

  for (const value of values) {
    const bucket = all.find((b) => value >= b.min && value <= b.max);
    if (bucket) bucket.count += 1;
  }

  const first = all.findIndex((b) => b.count > 0);
  if (first === -1) return [];
  const last = all.findLastIndex((b) => b.count > 0);
  return all.slice(first, last + 1);
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]!
    : Math.round((sorted[mid - 1]! + sorted[mid]!) / 2);
}

/**
 * Mean, median and histogram all come out of this one call, off the same
 * deduped rows, so they cannot contradict each other (SCHEMA.md §5 rule 2).
 * `weight` is deliberately ignored: the MVP treats every outlet equally.
 */
export function aggregate(rows: ResolvedScore[]): Aggregate {
  const unique = dedupe(rows);
  const values = unique.map((r) => r.normalized).sort((a, b) => a - b);

  if (values.length === 0) {
    return {
      count: 0, mean: 0, meanRaw: 0, median: 0,
      band: scoreBand(0), distribution: [], published: false,
    };
  }

  const meanRaw = values.reduce((sum, v) => sum + v, 0) / values.length;
  const mean = Math.round(meanRaw);

  return {
    count: values.length,
    mean,
    meanRaw,
    median: median(values),
    band: scoreBand(mean),
    distribution: buckets(values),
    published: values.length >= MIN_SOURCES,
  };
}
