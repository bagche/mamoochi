<script setup lang="ts">
import { DateTime } from "luxon";
import { useRoute } from "vue-router";
const { locale, t } = useI18n();
const route = useRoute();

function formatDate(inputDate: string) {
  const dt = DateTime.fromISO(inputDate);
  if (locale.value === "fa") {
    return dt
      .reconfigure({ outputCalendar: "persian" })
      .setLocale("fa")
      .toFormat("dd MMMM"); // e.g. "12 اسفند"
  }
  return dt
    .reconfigure({ outputCalendar: "iso8601" })
    .setLocale("en")
    .toFormat("dd MMMM"); // e.g. "12 December"
}

function formatDay(inputDate: string) {
  const dt = DateTime.fromISO(inputDate);
  if (locale.value === "fa") {
    return dt
      .reconfigure({ outputCalendar: "persian" })
      .setLocale("fa")
      .toFormat("cccc"); // e.g. "دوشنبه"
  }
  return dt
    .reconfigure({ outputCalendar: "iso8601" })
    .setLocale("en")
    .toFormat("cccc"); // e.g. "Monday"
}

const todayISO = DateTime.now().toISO();
const formattedDate = formatDate(todayISO);
const formattedDay = formatDay(todayISO);
</script>

<template>
  <div class="flex items-center justify-center whitespace-nowrap">
    <NuxtLink
      :to="route.path.startsWith('/manage') ? '/manage' : '/' + locale"
      class="flex items-baseline"
    >
      <template v-if="route.path.startsWith('/manage')">
        <span class="font-bold text-2xl">
          {{ formattedDay }}
        </span>
        <span class="font-thin mx-2text-2xl">/</span>
        <span class="font-thin mr-1 text-2xl">
          {{ formattedDate }}
        </span>
      </template>
      <!-- Otherwise, show the standard title and description -->
      <template v-else>
        <span class="font-bold text-2xl">
          {{ $t("titleFirst") }}
        </span>
        <span class="font-thin text-2xl">
          {{ $t("titleSecond") }}
        </span>
        <span class="font-thin mx-2 text-2xl">/</span>
        <span class="font-thin text-xl">
          {{ $t("description") }}
        </span>
      </template>
    </NuxtLink>
  </div>
</template>
