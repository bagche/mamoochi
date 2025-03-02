<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
  <div>
    <UButton
      variant="ghost"
      size="xs"
      class="flex dark:hidden cursor-pointer"
      icon="i-lucide-moon"
      @click="colorMode.preference = 'dark'"
    />
    <UButton
      variant="ghost"
      size="xs"
      class="hidden dark:flex cursor-pointer"
      icon="i-lucide-sun"
      @click="colorMode.preference = 'light'"
    />
  </div>
</template>
