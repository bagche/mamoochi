<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${wsProto}//${window.location.host}/api/ws`;

const { status, data, send, open, close } = useWebSocket(wsUrl);

watch(data, (newData) => {
  console.log(newData);
});
</script>
<template>
  <span class="text-center bg-gray-300 p-2">
    websocket status : {{ status }}
  </span>
</template>
