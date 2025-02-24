<script lang="ts" setup>
import { DateTime } from "luxon";

const { locale, defaultLocale } = useI18n();
const route = useRoute();
const appConfig = useAppConfig();

// Format a date string based on the current locale.
function formatDate(isoString: string): string {
  const dt = DateTime.fromISO(isoString);
  const calendar = locale.value === "fa" ? "persian" : "iso8601";
  return dt
    .reconfigure({ outputCalendar: calendar })
    .setLocale(locale.value)
    .toFormat("dd MMMM");
}

// Format the weekday based on the current locale.
function formatDay(isoString: string): string {
  const dt = DateTime.fromISO(isoString);
  const calendar = locale.value === "fa" ? "persian" : "iso8601";
  return dt
    .reconfigure({ outputCalendar: calendar })
    .setLocale(locale.value)
    .toFormat("cccc");
}

const todayISO = DateTime.now().toISO();
const formattedDate = formatDate(todayISO);
const formattedDay = formatDay(todayISO);

// Get the current title and description based on locale.
const currentLocale = computed(() => locale.value || defaultLocale);
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

// Split title into two parts for display.
const [titleFirst, titleSecond] = computed(() => {
  const parts = title.value.split(" ");
  return [parts[0] || "", parts[1] || ""];
}).value;
</script>

<template>
  <div class="flex items-center justify-center whitespace-nowrap text-2xl">
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
