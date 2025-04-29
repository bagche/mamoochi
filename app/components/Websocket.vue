<template>
  <div class="w-full p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">WebSocket Tester</h1>

    <!-- Connection Status -->
    <div class="mb-4">
      <p class="text-lg font-semibold text-gray-700">Connection Status:</p>
      <span
        :class="statusClass"
        class="inline-block px-3 py-1 rounded-full text-sm font-medium"
      >
        {{ status }}
      </span>
    </div>

    <!-- Ping-Pong Test -->
    <div class="mb-4">
      <p class="text-lg font-semibold text-gray-700">Ping-Pong Test:</p>
      <button
        :disabled="status !== 'OPEN'"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        @click="sendPing"
      >
        Send Ping
      </button>
      <p v-if="lastPong" class="mt-2 text-sm text-gray-600">
        Last Pong: {{ lastPong }}
      </p>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup>
import { useWebSocket } from "@vueuse/core";
import { computed, ref, watch } from "vue";

// Build the WS URL based on current origin
const wsUrl = computed(() => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window?.location?.host;
  const room = "test"; // change as needed
  return `${protocol}//${host}/websocket?room=${room}`;
});

// Initialize WebSocket
const {
  status,
  data,
  send,
  close,
  open,
  error: wsError,
} = useWebSocket(wsUrl, {
  autoReconnect: true,
  // optional: reconnect intervals, etc.
});

// Local reactive state
const lastPong = ref("");
const error = ref("");

// Style status badge
const statusClass = computed(() => ({
  "bg-green-100 text-green-800": status.value === "OPEN",
  "bg-yellow-100 text-yellow-800": status.value === "CONNECTING",
  "bg-red-100 text-red-800": status.value === "CLOSED",
}));

// Watch for incoming messages
watch(data, (raw) => {
  console.log("incoming", raw);
});

// Watch for WebSocket errors
watch(wsError, (e) => {
  if (e) error.value = `WebSocket error: ${e.message || e}`;
});

// Send a ping
function sendPing() {
  console.log("ping");
  send(JSON.stringify({ type: "ping" }));
}

// Optionally open/close hooks for debugging
watch(status, (s) => {
  console.debug(`[WebSocket] status changed to ${s}`);
});
</script>
