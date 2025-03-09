<script setup lang="ts">
definePageMeta({
  middleware: "permissions",
  permission: "dashboard.read",
});
</script>

<template>
  <div class="w-full min-h-screen flex-col">
    <UContainer>
      <div
        class="max-w-7xl mx-auto flex flex-col items-center pt-10 px-4 gap-7"
      >
        <div class="w-full flex h-[calc(100vh-35rem)]">
          <ManageDashboardChart />
        </div>
        <ManageDashboardTabs />
      </div>
    </UContainer>
  </div>
</template>
