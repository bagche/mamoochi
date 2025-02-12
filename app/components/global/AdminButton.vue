<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
</script>

<template>
  <div class="relative flex">
    <UButton
      v-if="route.path.startsWith('/manage')"
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
      to="/manage"
    />
  </div>
</template>
