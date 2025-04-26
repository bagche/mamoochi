<script lang="ts" setup>
import * as locales from "@nuxt/ui/locale";
import { onMounted } from "vue";

import Vazirmatn from "~/assets/fonts/Vazirmatn[wght].woff2";

const { locale } = useI18n();
const { initDevice } = useUser();
const appConfig = useAppConfig();

// Determine the proper locale object from @nuxt/ui/locale.
const appLocales = computed(() => {
  const localeKey = locale.value === "fa" ? "fa_ir" : locale.value;
  return locales[localeKey];
});

// Derived computed properties for language code and text direction.
const lang = computed(() => appLocales.value.code);
const dir = computed(() => appLocales.value.dir);

// Compute site name based on the current locale.
const siteName = computed(() =>
  locale.value === "fa"
    ? appConfig.app.site_name_fa
    : appConfig.app.site_name_en
);

// Compute description based on the current locale.
const description = computed(() =>
  locale.value === "fa"
    ? appConfig.app.description_fa
    : appConfig.app.description_en
);

// Update head metadata reactively when locale or other values change.
useHead({
  title: siteName.value,
  titleTemplate: `%s - ${siteName.value} • ${description.value}`,
  htmlAttrs: {
    lang: lang.value,
    dir: dir.value,
  },

  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon.png" },
    {
      rel: "preload",
      href: Vazirmatn,
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
  ],
});
onMounted(() => {
  initDevice();
});
</script>

<template>
  <UApp :locale="appLocales">
    <Installer v-if="!appConfig.installed" />
    <NuxtLayout v-else>
      <NuxtLoadingIndicator />
      <!-- <HydrationStatus /> -->
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
