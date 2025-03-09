<script setup lang="ts">
import { DateTime } from "luxon";

const chart = ref(null);



// Generate random cost data for the last 7 days
function generateCostData() {
  const today = DateTime.now();
  return Array.from({ length: 30 }, (_, i) => {
    const date = today.minus({ days: i }).toISODate();
    return {
      Date: formatDateTime(date!),
      Cost: Math.round(10 + Math.random() * 90) / 10, // Random cost between 10 and 100 dollars
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
      dimensions: ["Date", "Cost"],
      source: generateCostData(),
    },
    xAxis: { type: "category" },
    yAxis: { type: "value", name: "$ Cost" },
    itemStyle: { borderRadius: 3 },
    series: [{ type: "bar" }],
  };
}

const option = shallowRef(getData());
</script>

<template>
  <div class="w-full h-full">
    <h3 class="m-0 p-0 text-xl">{{ $t("App Cost Monitor") }}</h3>
    <VChart ref="chart" :option="option" class="chart" />
  </div>
</template>
 