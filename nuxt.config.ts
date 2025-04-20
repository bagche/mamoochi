import { resolve } from "path";
import viteCompression from "vite-plugin-compression";

import { generateRoutes } from "./scripts/prerender";

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/seo",
    "@nuxt/image",
    "@nuxt/eslint",
    "nitro-cloudflare-dev",
    "nuxt-auth-utils",
    "nuxt-tiptap-editor",
    "@nuxtjs/i18n",
    "nuxt-authorization",
    "nuxt-echarts",
    "@nuxtjs/turnstile",
    "@nuxtjs/mdc",
    // "nuxt-delay-hydration",
  ],
  app: {
    head: {
      link: [
        {
          rel: "preload",
          href: "/fonts/Vazirmatn[wght].woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css", "~/assets/css/extra.css"],
  build: { transpile: ["echarts-liquidfill"] },

  vite: {
    resolve: {
      alias: { "echarts/lib/util/number": "echarts/lib/util/number.js" },
    },
    css: {
      preprocessorOptions: {
        scss: { api: "modern" },
      },
    },
    plugins: [
      viteCompression({
        algorithm: "brotliCompress",
        threshold: 1024,
      }),
    ],
    build: {
      minify: "esbuild",
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue", "echarts", "vue-router"],
            charts: ["echarts-liquidfill"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["echarts", "echarts-liquidfill"],
      exclude: ["shiki", "oniguruma"],
    },
  },
  nitro: {
    preset: "cloudflare-pages",
    compressPublicAssets: { brotli: true },
    minify: true,
    prerender: {
      crawlLinks: false,
      routes: generateRoutes(),
      failOnError: true,
      // concurrency: 10,
      // autoSubfolderIndex: true,
    },
  },
  ui: { fonts: false },

  image: {
    cloudflare: {
      baseURL: "https://mamoochi.bagche.app",
    },
    formats: ["webp", "avif"],
    density: [1, 2],
    quality: 80,
  },

  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n",
      redirectOn: "root",
    },
    locales: [
      {
        name: "فارسی",
        dir: "rtl",
        code: "fa",
        file: "fa.js",
      },
      {
        name: "English",
        dir: "ltr",
        code: "en",
        file: "en.js",
      },
    ],
    langDir: "locales",
    defaultLocale: "fa",
    strategy: "prefix",
    experimental: {
      localeDetector: "localeDetector.ts",
      generatedLocaleFilePathFormat: "off",
    },
  },

  routeRules: {
    "/": { prerender: true },
    "/fa/": { prerender: true },
    "/en/": { prerender: true },
    "/:locale/**": { prerender: true },
    "/api/**": { ssr: true },
    "/manage": { prerender: false, ssr: false, robots: false },
    "/manage/**": { prerender: false, ssr: false, robots: false },
    "/:locale/manage": { prerender: false, ssr: false, robots: false },
    "/:locale/manage/**": { prerender: false, ssr: false, robots: false },
  },

  experimental: {
    restoreState: true,
    payloadExtraction: false,
  },

  echarts: {
    ssr: true,
    renderer: ["svg"],
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
    turnstile: {
      secretKey: "",
    },
  },

  seo: {
    automaticDefaults: true,
  },

  linkChecker: { enabled: false },
  turnstile: {
    siteKey: "0x4AAAAAABMfNmOrYsdJl6yK",
    addValidateEndpoint: true,
  },
  alias: {
    "#velite": resolve(__dirname, "./.velite"), // Absolute path to .velite/index.js
  },
  mdc: {
    highlight: false,
  },
  // delayHydration: { mode: "mount" },
});
