import viteCompression from "vite-plugin-compression";

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/eslint",
    "nitro-cloudflare-dev",
    "nuxt-auth-utils",
  ],

  css: ["~/assets/css/main.css","~/assets/css/extra.scss"],
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
      sourcemap: false,
      minify: true,
      rollupOptions: { treeshake: true },
    },
  },

  nitro: {
    preset: "cloudflare-pages",
    compressPublicAssets: true,
    minify: true,
  },
  ui: {
    fonts: false,
  },
  imports: {
    dirs: ["composables/**"],
  },
});
