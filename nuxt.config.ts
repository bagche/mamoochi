import viteCompression from "vite-plugin-compression";

import { generateRoutes } from "./scripts/prerender";

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/eslint",
    "nitro-cloudflare-dev",
    "nuxt-auth-utils",
    "nuxt-tiptap-editor",
    "@nuxtjs/i18n",
    "nuxt-authorization",
  ],

  css: ["~/assets/css/main.css", "~/assets/css/extra.css"],
  vite: {
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
    // preset: "cloudflare-pages",
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: false,
      routes: generateRoutes(),
    },
  },
  ui: {
    fonts: true,
  },
  i18n: {
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
    strategy: "prefix",
    experimental: {
      localeDetector: "localeDetector.ts",
    },
  },
  routeRules: {
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
});
