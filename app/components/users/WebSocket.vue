<template>
  <div class="w-full p-4">
    <div class="mb-4">
      <span
        :class="statusClass"
        class="inline-block px-3 py-1 rounded-full text-sm font-medium"
      >
        {{ status }}
      </span>
    </div>
    <UButton @click="sendPing" :disabled="status !== 'OPEN'"> Ping </UButton>
  </div>
</template>

<script setup>
import { useWebSocket } from "@vueuse/core";

// WebSocket URL based on environment
const protocol = import.meta.env.DEV ? "ws" : "wss";
const wsUrl = `${protocol}://${window.location.host}/websocket`;
console.log(wsUrl);
// WebSocket setup
const { status, send, data } = useWebSocket(wsUrl, {
  autoReconnect: true,
});

// Computed class for connection status styling
const statusClass = computed(() => ({
  "bg-green-100 text-green-800": status.value === "OPEN",
  "bg-yellow-100 text-yellow-800": status.value === "CONNECTING",
  "bg-red-100 text-red-800": status.value === "CLOSED",
}));

// Send ping message
const sendPing = () => {
  send("ping");
};

watch(data, (incoming) => {
  console.log(incoming);
});
</script>
