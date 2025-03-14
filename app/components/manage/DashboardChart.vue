<script setup lang="ts">
import { DateTime } from "luxon";

const { t } = useI18n();

// --- Data Generation Functions ---

const generateVisitorData = () => {
  const today = DateTime.now();
  return Array.from({ length: 30 }, (_, i) => {
    const date = today.minus({ days: i }).toISODate();
    return {
      Date: formatDateTime(date!),
      Visitors: Math.round(50 + Math.random() * 200),
    };
  }).reverse();
};

const generateCostData = () => {
  const today = DateTime.now();
  return Array.from({ length: 30 }, (_, i) => {
    const date = today.minus({ days: i }).toISODate();
    return {
      Date: formatDateTime(date!),
      Cost: Math.round(10 + Math.random() * 90) / 10,
    };
  }).reverse();
};

const mergeData = () => {
  const visitors = generateVisitorData();
  const cost = generateCostData();
  return visitors.map((visitor, index) => ({
    Date: visitor.Date,
    Visitors: visitor.Visitors,
    Cost: cost[index].Cost,
  }));
};

// --- Chart Configuration ---

const option = computed(() => {
  const mergedData = mergeData();
  return {
    animation: false,
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
    },
    legend: {
      data: ["Visitors", "Cost"],
    },
    dataset: {
      dimensions: ["Date", "Visitors", "Cost"],
      source: mergedData,
    },
    xAxis: {
      type: "category",
    },
    yAxis: [
      { type: "value", name: t("Visitors") },
      { type: "value", name: t("$ Cost"), position: "right" },
    ],
    series: [
      {
        type: "bar",
        name: "Visitors",
        encode: { x: "Date", y: "Visitors" },
      },
      {
        type: "bar",
        name: "Cost",
        yAxisIndex: 1,
        encode: { x: "Date", y: "Cost" },
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
