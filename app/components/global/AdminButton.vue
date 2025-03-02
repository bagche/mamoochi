<script setup lang="ts">
const { locale } = useI18n();
const route = useRoute();
</script>

<template>
  <div class="relative flex">
    <UButton
      v-if="route.path.includes('manage')"
      icon="i-lucide-home"
      variant="ghost"
      size="xs"
      to="/"
    />
    <UButton
      v-else
      icon="i-lucide-settings"
      variant="ghost"
      size="xs"
      :to="locale + '/manage'"
    />
  </div>
</template>
