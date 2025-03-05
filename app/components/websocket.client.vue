<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${wsProto}//${window.location.host}/api/ws`;

const { status, data, send, open, close } = useWebSocket(wsUrl);

watch(data, () => {
  console.log(data);
});
</script>
<template>
  {{ status }}
</template>
