<script setup lang="ts">
import { DateTime } from "luxon";
const { t } = useI18n();

const today = DateTime.now();
const startDate = today.minus({ days: 30 }).toISODate();
const endDate = today.toISODate();
const { data } = await useFetch("/api/analysis/traffic", {
  query: { startDate, endDate },
});

const option = computed(() => {
  return {
    animation: false,
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
    },
    legend: {
      data: [t("Page Views"), t("Unique Visits")],
    },
    dataset: {
      dimensions: ["date", "pageViews", "uniqueVisits"],
      source:
        data?.value?.map((item) => ({
          date: formatDateTime(item.date!),
          pageViews: item.pageViews,
          uniqueVisits: item.uniqueVisits,
        })) ?? [],
    },
    xAxis: {
      type: "category",
    },
    yAxis: [
      { type: "value", name: t("Page Views") },
      { type: "value", name: t("Unique Visits"), position: "right" },
    ],
    series: [
      {
        type: "bar",
        name: t("Page Views"),
        encode: { x: "date", y: "pageViews" },
      },
      {
        type: "bar",
        name: t("Unique Visits"),
        encode: { x: "date", y: "uniqueVisits" },
      },
    ],
  };
});

const chart = ref(null);
</script>

<template>
  <div class="w-full h-full">
    <h3 class="m-0 p-0 text-xl">{{ $t("Stats") }}</h3>
    <VChart ref="chart" :option="option" class="chart" />
  </div>
</template>
