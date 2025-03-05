<script setup lang="ts">
const { dbConnected, checkDbConnections } = useInstaller();
onMounted(() => {
  checkDbConnections();
});

</script>

<template>
  <div class="w-full gap-5 flex flex-col">
    <div v-if="dbConnected" class="flex flex-col gap-5 justify-between">
      <UAlert
        class="flex"
        color="success"
        variant="outline"
        :title="$t('Database Connection Established')"
        :description="
          $t(
            'Your application is successfully connected to the D1 database. You can now proceed with the installation process.'
          )
        "
        icon="i-lucide-terminal"
      />
      
    </div>
    <div v-else class="flex flex-col">
      <UAlert
        color="error"
        variant="outline"
        :title="$t('No Database Connection')"
        :description="
          $t(
            'The database schema has not been initialized. Please check your wrangler.toml configuration, ensure that migrations have been applied, and then refresh this page.'
          )
        "
        icon="i-lucide-terminal"
      />
    </div>
  </div>
</template>
