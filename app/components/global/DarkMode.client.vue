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
  <div>
    <USwitch
      v-model="isDark"
      size="xs"
      :label="isDark ? $t('Dark Mode') : $t('Light Mode')"
    />
  </div>
</template>
