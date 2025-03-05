<script setup lang="ts">
const { dbConnected, checkDbConnections } = useInstaller();
checkDbConnections();
</script>

<template>
  <div class="w-full gap-5 flex flex-col">
    <div class="flex flex-col gap-5 justify-between">
      <UAlert
        v-if="dbConnected"
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
      <UAlert
        v-else
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
