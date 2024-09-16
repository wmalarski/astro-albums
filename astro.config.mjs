import db from "@astrojs/db";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [tailwind(), solidJs(), db()],
  output: "server",
  vite: {
    optimizeDeps: {
      exclude: ["astro:db", "oslo"],
    },
  },
});
