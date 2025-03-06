<script setup lang="ts">
import { computed } from "vue";

const colorMode = useColorMode();

const isDark = computed({
  get: () => colorMode.preference === "dark",
  set: (value: boolean) => {
    colorMode.preference = value ? "dark" : "light";
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
