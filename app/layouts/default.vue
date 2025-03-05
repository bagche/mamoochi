<template>
  <div class="flex flex-col justify-start">
    <Header />
    <div class="min-h-screen pb-10">
      <slot />
    </div>
    <Footer />
  </div>
</template>
<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${wsProto}//${window.location.host}/api/ws`;

const { status, data, send, open, close } = useWebSocket(wsUrl);

watch(status, () => {
  console.log(status);
});
</script>
