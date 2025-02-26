<script lang="ts" setup>
import { DateTime } from "luxon";

const { locale, defaultLocale } = useI18n();
const route = useRoute();
const appConfig = useAppConfig();

// Compute formatted date values based on current locale.
const formattedDate = computed(() => {
  const dt = DateTime.now();
  const calendar = locale.value === "fa" ? "persian" : "iso8601";
  return dt
    .reconfigure({ outputCalendar: calendar })
    .setLocale(locale.value)
    .toFormat("dd MMMM"); // e.g. "12 اسفند" or "12 December"
});

const formattedDay = computed(() => {
  const dt = DateTime.now();
  const calendar = locale.value === "fa" ? "persian" : "iso8601";
  return dt
    .reconfigure({ outputCalendar: calendar })
    .setLocale(locale.value)
    .toFormat("cccc"); // e.g. "دوشنبه" or "Monday"
});

// Determine the active locale.
const currentLocale = computed(() => locale.value || defaultLocale);

// Compute title and description based on locale.
const title = computed(() =>
  currentLocale.value === "fa"
    ? appConfig.app.title_fa || ""
    : appConfig.app.title_en || ""
);
const description = computed(() =>
  currentLocale.value === "fa"
    ? appConfig.app.description_fa || ""
    : appConfig.app.description_en || ""
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
    :key="route.path"
    class="flex items-center justify-center whitespace-nowrap text-2xl"
  >
    <NuxtLink
      :to="route.path.startsWith('/manage') ? '/manage/' : '/' + locale + '/'"
      class="flex items-baseline"
    >
      <template v-if="route.path.startsWith('/manage')">
        <span class="font-bold">{{ formattedDay }}</span>
        <span class="mx-2 font-thin">/</span>
        <span class="mr-1 font-thin text-xs">{{ formattedDate }}</span>
      </template>
      <template v-else>
        <span class="font-extrabold">{{ titleFirst }}</span>
        <span class="font-thin">{{ titleSecond }}</span>
        <span class="mx-1 font-thin">/</span>
        <span class="font-thin text-lg">{{ description }}</span>
      </template>
    </NuxtLink>
  </div>
</template>