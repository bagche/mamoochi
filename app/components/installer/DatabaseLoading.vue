<script setup lang="ts">
const { dbLoading, dbLoaded } = useInstaller();
</script>

<template>
  <div class="w-full">
    <!-- Database Setup Completed -->
    <UAlert
      v-if="dbLoading"
      color="success"
      variant="subtle"
      :title="$t('Database Ready')"
      :description="
        $t(
          'Your database setup is complete. You can now move forward with the installation process.'
        )
      "
      icon="i-lucide-database"
    />

    <!-- Database Setup in Progress -->
    <div v-else-if="dbLoaded" class="w-full">
      <UAlert
        color="info"
        variant="subtle"
        :title="$t('Preparing Database')"
        :description="
          $t(
            'We are setting up the necessary configurations. This may take a moment...'
          )
        "
        icon="i-lucide-loader"
      />
    </div>

    <!-- Database Setup Pending -->
    <div v-else class="w-full flex flex-col gap-5 items-center">
      <UAlert
        color="warning"
        variant="subtle"
        :title="$t('Database Setup Required')"
        :description="
          $t(
            'Your database needs to be initialized before you can continue. Click the button below to complete the setup.'
          )
        "
        icon="i-lucide-alert-circle"
      />
    </div>
  </div>
</template>
