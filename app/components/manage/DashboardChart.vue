<script setup lang="ts">
import { DateTime } from "luxon";

const { t } = useI18n();
// Generate random visitor data for the last 30 days
function generateVisitorData() {
  const today = DateTime.now();
  return Array.from({ length: 30 }, (_, i) => {
    const date = today.minus({ days: i }).toISODate();
    return {
      Date: formatDateTime(date!),
      Visitors: Math.round(50 + Math.random() * 200),
    };
  }).reverse();
}

// Generate random cost data for the last 30 days
function generateCostData() {
  const today = DateTime.now();
  return Array.from({ length: 30 }, (_, i) => {
    const date = today.minus({ days: i }).toISODate();
    return {
      Date: formatDateTime(date!),
      Cost: Math.round(10 + Math.random() * 90) / 10,
    };
  }).reverse();
}

// Merge the two arrays into one dataset based on date
function mergeData() {
  const visitors = generateVisitorData();
  const cost = generateCostData();
  // Assuming both arrays have the same order and dates
  return visitors.map((visitor, index) => ({
    Date: visitor.Date,
    Visitors: visitor.Visitors,
    Cost: cost[index].Cost,
  }));
}

// Create the merged chart option
function getData() {
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
    // Use dual yAxes if the scales are different
    yAxis: [
      { type: "value", name: t("Visitors") },
      { type: "value", name: t("$ Cost"), position: "right" },
    ],
    series: [
      {
        type: "bar",
        name: "  " + t("Visitors"),
        encode: { x: "Date", y: "Visitors" },
      },
      {
        type: "bar",
        name: "  " + t("Cost"),
        yAxisIndex: 1, // use the second y-axis for cost
        encode: { x: "Date", y: "Cost" },
      },
    ],
  };
}

const chart = ref(null);
const option = shallowRef(getData());
</script>

<template>
  <div class="w-full h-full">
    <h3 class="m-0 p-0 text-xl">{{ $t("Stats") }}</h3>
    <VChart ref="chart" :option="option" class="chart" />
  </div>
</template>
