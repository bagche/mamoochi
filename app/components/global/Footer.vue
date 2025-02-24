<script lang="ts" setup>
import { DateTime } from "luxon";
const { locale } = useI18n();
const appConfig = useAppConfig();

const currentYear = computed(() => {
  const now = DateTime.now();
  const calendar = locale.value === "fa" ? "persian" : "iso8601";
  return now
    .reconfigure({ outputCalendar: calendar })
    .setLocale(locale.value)
    .toFormat("yyyy");
});

// Select the footer text based on the current locale
const footerText = computed(() =>
  locale.value === "fa" ? appConfig.app.footer_fa : appConfig.app.footer_en
);
</script>

<template>
  <div
    class="w-full mx-auto p-4 text-center text-sm border-t border-gray-100 dark:border-slate-800"
  >
    {{ footerText }} © {{ currentYear }}
  </div>
</template>
