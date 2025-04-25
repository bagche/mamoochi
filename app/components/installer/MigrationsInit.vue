<script setup lang="ts">
const { dbMigrated, isMigrating } = useInstaller();
</script>

<template>
  <div class="w-full">
    <!-- Migrations Completed -->
    <UAlert
      v-if="dbMigrated"
      color="success"
      variant="subtle"
      :title="$t('Database Schema Initialized')"
      :description="
        $t(
          'Your database schema has been successfully initialized. You may now proceed to the next installation step.'
        )
      "
      icon="i-lucide-database"
    />

    <!-- Migrations in Progress -->
    <div v-else-if="isMigrating" class="w-full">
      <UAlert
        color="info"
        variant="subtle"
        :title="$t('Running Migrations')"
        :description="
          $t('Please wait while we apply the necessary database migrations...')
        "
        icon="i-lucide-loader"
      />
    </div>

    <!-- Migrations Not Run -->
    <div v-else class="w-full flex flex-col gap-5 items-center">
      <UAlert
        color="warning"
        variant="subtle"
        :title="$t('Database Schema Not Initialized')"
        :description="
          $t(
            'It looks like your database schema has not been set up yet. Click the button below to run the required migrations and initialize your database schema.'
          )
        "
        icon="i-lucide-alert-circle"
      />
    </div>
  </div>
</template>
