<script lang="ts" setup>
const { locale, defaultLocale } = useI18n();
const route = useRoute();
const appConfig = useAppConfig();

// Determine the active locale.
const currentLocale = computed(() => locale.value || defaultLocale);

// Compute title and description based on locale.
const title = computed(() =>
  currentLocale.value === "fa"
    ? appConfig.app.title_fa || ""
    : appConfig.app.title_en || ""
);

// Split title into two computed parts.
const titleFirst = computed(() => {
  const parts = title.value.split(" ");
  return parts[0] || "";
});
const titleSecond = computed(() => {
  const parts = title.value.split(" ");
  return parts[1] || "";
});
</script>

<template>
  <div
    class="flex items-center justify-center whitespace-nowrap text-2xl logo py-1"
  >
    <NuxtLinkLocale
      :to="route.path.includes('manage') ? '/manage/' : '/'"
      class="flex items-baseline"
    >
      <span class="font-extrabold">{{ titleFirst }}</span>
      <span class="font-thin">{{ titleSecond }}</span>
    </NuxtLinkLocale>
  </div>
</template>
