<script setup lang="ts">
import { computed } from "vue";

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <div class="flex items-center">
    <UButton
      :aria-label="$t('Theme Switcher')"
      :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
      class="cursor-pointer"
      size="xs"
      variant="link"
      @click="isDark ? (isDark = false) : (isDark = true)"
    />
  </div>
</template>
