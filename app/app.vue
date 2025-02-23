<script lang="ts" setup>
const { locale, t } = useI18n();
const { registerNew } = useUser();
const dir = computed(() => (locale.value === "en" ? "ltr" : "rtl"));
const appConfig = useAppConfig();

const siteName = computed(() => {
  return appConfig.app.site_name_fa ?? "";
});

const description = computed(() => {
  return appConfig.app.description_fa ?? "";
});
useHead({
  title: siteName.value,
  titleTemplate: `%s - ${siteName.value}:// ${description.value} `,
  htmlAttrs: {
    lang: locale.value,
    dir,
  },
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "e5e7eb" },
    {
      hid: "description",
      name: "description",
      content: description.value,
    },
  ],

  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      href: "/icon.png",
    },
  ],
});
registerNew();
</script>
<template>
  <UApp>
    <NuxtLayout class="dark:bg-slate-700">
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
