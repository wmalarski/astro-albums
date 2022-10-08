/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLanguage: "en",
  i18next: {
    backend: {
      loadPath: "./src/locales/{{lng}}.json",
    },
    debug: false,
    initImmediate: false,
  },
  i18nextPlugins: { fsBackend: "i18next-fs-backend" },
  supportedLanguages: ["en"],
};
