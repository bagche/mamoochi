<script setup lang="ts">
import { DateTime } from "luxon";

const { t } = useI18n();

const today = DateTime.now();
const startDate = today.minus({ days: 30 }).toISODate();
const endDate = today.toISODate();
const { data } = await useFetch("/api/stats/views", {
  query: { startDate, endDate },
});

const option = computed(() => {
  // const mergedData = mergeData();
  return {
    animation: false,
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
    },
    legend: {
      data: ["Page Views"],
    },
    dataset: {
      dimensions: ["date", "pageViews"],
      source:
        data?.value?.map((item) => {
          return {
            date: formatDateTime(item.date!),
            pageViews: item.pageViews,
          };
        }) ?? [],
    },
    xAxis: {
      type: "category",
    },
    yAxis: [{ type: "value", name: t("Page Views") }],
    series: [
      {
        type: "bar",
        name: t("Page Views"),
        encode: { x: t("Date"), y: t("Page Views") },
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
