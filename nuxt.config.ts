import viteCompression from "vite-plugin-compression";

import { generateRoutes } from "./scripts/prerender";

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/seo",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/eslint",
    "nitro-cloudflare-dev",
    "nuxt-auth-utils",
    "nuxt-tiptap-editor",
    "@nuxtjs/i18n",
    "nuxt-authorization",
    "nuxt-echarts",
  ],

  css: ["~/assets/css/main.css", "~/assets/css/extra.css"],
  build: { transpile: ["echarts-liquidfill"] },

  vite: {
    resolve: {
      alias: { "echarts/lib/util/number": "echarts/lib/util/number.js" },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    },
    plugins: [viteCompression({ algorithm: "brotliCompress" })],
    build: {
      minify: true,
    },
  },

  nitro: {
    preset: "cloudflare-pages",
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: false,
      routes: generateRoutes(),
    },
  },
  ui: {
    fonts: false,
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    locales: [
      {
        name: "فارسی",
        dir: "rtl",
        code: "fa",
        file: "fa.json",
      },
      {
        name: "English",
        dir: "ltr",
        code: "en",
        file: "en.json",
      },
    ],
    langDir: "locales",
    defaultLocale: "fa",
    strategy: "prefix_and_default",
    experimental: {
      localeDetector: "localeDetector.ts",
    },
  },
  routeRules: {
    // Disable prerender (and SSR) for any manage routes:
    "/manage": { prerender: false, ssr: false, robots: false },
    "/manage/**": { prerender: false, ssr: false, robots: false },
    "/:locale/manage": { prerender: false, ssr: false, robots: false },
    "/:locale/manage/**": { prerender: false, ssr: false, robots: false },

    // ISR rules for logs (all locales)
    "/:locale/logs": { isr: 3600 },
    "/:locale/logs/**": { isr: true },

    // ISR rules for cats (all locales)
    "/:locale/cats/**": { isr: true },

    // Profile routes: disable robots indexing (all locales)
    "/:locale/profile/**": { robots: false },

    // Default: prerender everything else
    "/**": { prerender: true },
  },
  experimental: {
    restoreState: true,
  },
  content: {
    database: {
      type: "d1",
      bindingName: "DB",
    },
  },
  echarts: {
    ssr: true,
    renderer: ["canvas", "svg"],
    charts: ["BarChart", "LineChart"],
    components: [
      "DatasetComponent",
      "GridComponent",
      "TooltipComponent",
      "ToolboxComponent",
      "GeoComponent",
      "VisualMapComponent",
    ],
  },
  runtimeConfig: {
    githubToken: "",
    githubOwner: "",
    githubRepo: "",
  },
});
