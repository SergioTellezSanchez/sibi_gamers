import type { APIRoute } from "astro";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { GAMES, REC_BANK } from "../../data/games";
import {
  picksSchema,
  sanitizePicks,
  systemPrompt,
  validatePrompt,
  type RecommendResponse,
} from "../../lib/recommend";

/**
 * The one route on the site that runs on a server (master doc §2: describe a
 * mood, get five picks). Everything else is prerendered; this opts out so it
 * can call the Claude API with a key that never reaches the browser.
 *
 * Without ANTHROPIC_API_KEY it degrades to the static bank, so local builds
 * and preview deployments work with no configuration.
 */
export const prerender = false;

const SYSTEM = systemPrompt(GAMES);

function json(body: RecommendResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

const bank = (): RecommendResponse => ({ picks: REC_BANK, source: "bank" });

export const POST: APIRoute = async ({ request }) => {
  let prompt: string | null = null;
  try {
    prompt = validatePrompt((await request.json())?.prompt);
  } catch {
    prompt = null;
  }
  if (!prompt) {
    return new Response(JSON.stringify({ error: "prompt must be 3 to 300 characters" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) return json(bank());

  const client = new Anthropic();

  try {
    const response = await client.beta.messages.parse({
      model: "claude-opus-5",
      max_tokens: 1024,
      // Matching a sentence to twenty games is not hard; low effort keeps the
      // round trip short enough to feel like search rather than a wait.
      output_config: { effort: "low", format: zodOutputFormat(picksSchema) },
      // Route a safety decline to Anthropic's default fallback server-side
      // rather than surfacing it as a failure.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: prompt }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) return json(bank());

    const picks = sanitizePicks(response.parsed_output, GAMES);
    return picks.length ? json({ picks, source: "claude" }) : json(bank());
  } catch (error) {
    // Rate limits, outages and bad keys all land here. The visitor still gets
    // five picks; the operator gets the reason in the function logs.
    if (error instanceof Anthropic.APIError) {
      console.error(`recommend: Claude API ${error.status}: ${error.message}`);
    } else {
      console.error("recommend:", error);
    }
    return json(bank());
  }
};

export const GET: APIRoute = () =>
  new Response(null, { status: 405, headers: { allow: "POST" } });
