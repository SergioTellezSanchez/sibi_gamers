// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Static by default: every page ships as HTML so crawlers get the full
  // content. Adding a Vercel/Netlify adapter later lets individual routes opt
  // into SSR via `export const prerender = false` — that is the path for the
  // Claude-powered recommender endpoint (see master doc §Fase 3).
  output: "static",
  integrations: [react()],
  site: "https://sibigamers.gg",
});
