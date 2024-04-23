import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), solidJs(), db()],
  optimizeDeps: { exclude: ["astro:db"] },
  output: "server",
});
