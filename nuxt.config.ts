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
    "nuxt-booster",
  ],

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
      autoSubfolderIndex: false,
    },
  },
  ui: { fonts: false }, // Nuxt Booster can handle font optimization, kept as false to avoid conflicts

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
    "/:locale/**": { prerender: true },
    "/api/**": { ssr: true },
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
      "LegendComponent",
    ],
  },

  runtimeConfig: {
    githubToken: "",
    githubOwner: "",
    githubRepo: "",
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
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

  // Nuxt Booster Configuration
  booster: {
    modern: true, // Serve modern ES modules to modern browsers
    lazyHydration: true, // Enable lazy hydration (replaces nuxt-delay-hydration)
    criticalCss: true, // Enable critical CSS extraction
    lowPriorityAssets: true, // Optimize low-priority asset loading
    fontOptimization: {
      enabled: true, // Optimize font loading
      fonts: [
        {
          family: "Vazirmatn",
          src: "/fonts/Vazirmatn[wght].woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      ],
    },
    imageOptimization: {
      enabled: true, // Works with @nuxt/image
      sizes: [320, 640, 960, 1280, 1920], // Responsive image sizes
      formats: ["webp", "avif"], // Matches your @nuxt/image config
    },
    performance: {
      http2: true, // Enable HTTP/2 push
      compression: true, // Works with viteCompression and nitro compressPublicAssets
    },
  },
});
