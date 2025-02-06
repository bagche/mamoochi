<script lang="ts" setup>
const { locale, t } = useI18n();

const dir = computed(() => (locale.value === "en" ? "ltr" : "rtl"));
useHead({
  title: t("siteName"),
  titleTemplate: `%s - ${t("siteName")}:// ${t("description")} `,
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
      content: t("description"),
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
</script>
<template>
  <UApp>
    <NuxtLayout class="dark:bg-slate-700">
      <!-- <NuxtLoadingIndicator /> -->
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
