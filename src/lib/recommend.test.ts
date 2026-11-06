import { describe, expect, it } from "vitest";
import { GAMES } from "../data/games";
import { PICK_COUNT, PROMPT_MAX, sanitizePicks, systemPrompt, validatePrompt } from "./recommend";

describe("sanitizePicks", () => {
  it("keeps only catalogue games, in order, with catalogue scores", () => {
    const out = sanitizePicks(
      { picks: [
        { id: "quietstone", reason: "slow and kind" },
        { id: "not-a-game", reason: "invented" },
        { id: "loam", reason: "soil over harvests" },
      ] },
      GAMES,
    );
    expect(out.map((p) => p.id)).toEqual(["quietstone", "loam"]);
    expect(out[0]!.score).toBe(77);
    expect(out[0]!.title).toBe("Quietstone");
  });

  it("drops duplicates and caps at the pick count", () => {
    const ids = GAMES.slice(0, PICK_COUNT + 2).map((g) => g.id);
    const out = sanitizePicks(
      { picks: [...ids, ids[0]!].map((id) => ({ id, reason: "x" })) },
      GAMES,
    );
    expect(out).toHaveLength(PICK_COUNT);
    expect(new Set(out.map((p) => p.id)).size).toBe(PICK_COUNT);
  });

  it("tolerates whitespace around an id", () => {
    expect(sanitizePicks({ picks: [{ id: "  loam ", reason: "x" }] }, GAMES)).toHaveLength(1);
  });
});

describe("validatePrompt", () => {
  it("normalizes whitespace and enforces the bounds", () => {
    expect(validatePrompt("  cozy   and\nslow ")).toBe("cozy and slow");
    expect(validatePrompt("hi")).toBeNull();
    expect(validatePrompt("x".repeat(PROMPT_MAX + 1))).toBeNull();
    expect(validatePrompt(42)).toBeNull();
    expect(validatePrompt(undefined)).toBeNull();
  });
});

describe("systemPrompt", () => {
  it("lists every catalogue id so the model can only cite real games", () => {
    const text = systemPrompt(GAMES);
    for (const g of GAMES) expect(text).toContain(`${g.id} | ${g.title}`);
  });
});
