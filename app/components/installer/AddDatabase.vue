<script setup lang="ts">
const { dbConnected } = useInstaller();
</script>
<template>
  <div class="w-full min-h-50">
    <USeparator />
    <div class="mt-10">
      <UAlert
        v-if="dbConnected"
        color="success"
        :title="$t('Database Connected')"
        :description="$t('database in Connected')"
        icon="i-lucide-terminal"
      />
      <UAlert
        v-else
        color="error"
        :title="$t('No Database')"
        :description="$t('database in Not Connected')"
        icon="i-lucide-terminal"
      />
    </div>
  </div>
</template>
