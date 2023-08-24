import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";
import astroI18next from "astro-i18next";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [tailwind(), solidJs(), astroI18next()],
  output: "server",
});
