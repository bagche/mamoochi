<script setup lang="ts">
import { DateTime } from "luxon";

const chart = ref(null);

 

// Generate random visitor data for the last 7 days
function generateVisitorData() {
  const today = DateTime.now();
  return Array.from({ length: 30 }, (_, i) => {
    const date = today.minus({ days: i }).toISODate();
    return {
      Date: formatDateTime(date!),
      Visitors: Math.round(50 + Math.random() * 200), // Random visitors count between 50 and 250
    };
  }).reverse(); // Reverse to show in ascending order
}

function getData(): ECOption {
  return {
    animation: false,
    tooltip: {
      trigger: 'axis',
      className: "echarts-tooltip",
    },
    dataset: {
      dimensions: ["Date", "Visitors"],
      source: generateVisitorData(),
    },
    xAxis: { type: "category" },
    yAxis: { type: "value", name: "Visitors" },
    itemStyle: { borderRadius: 3 },
    series: [{ type: "bar" }],
  };
}

const option = shallowRef(getData());
</script>

<template>
  <div class="w-full h-full">
    <h3 class="m-0 p-0 text-xl">{{ $t("App Visitor Monitor") }}</h3>
    <VChart ref="chart" :option="option" class="chart" />
  </div>
</template>
 