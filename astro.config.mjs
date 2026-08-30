// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  // Static by default: every page ships as HTML so crawlers get the full
  // content. The Vercel adapter is present so individual routes can opt into
  // SSR via `export const prerender = false` — that is the path for the
  // Claude-powered recommender endpoint (see master doc §Fase 3). Adding it
  // does not move any existing page off the prerendered path.
  output: "static",
  adapter: vercel(),
  integrations: [react()],
  site: "https://sibigamers.gg",
});
