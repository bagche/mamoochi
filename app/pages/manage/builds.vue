<script setup lang="ts">
definePageMeta({
  middleware: "permissions",
  permission: "builds.read",
});
</script>
<template>
  <div class="w-full min-h-screen flex-col">
    <UContainer>
      <div
        class="max-w-7xl mx-auto flex flex-col items-center pt-10 px-4 gap-7"
      >
        <div class="flex justify-between w-full">
          <h2 class="text-2xl text-bolder">{{ $t("Manage Builds") }}</h2>
        </div>
        <div class="flex gap-3 w-full">
          <BuildsManage />
        </div>
      </div>
    </UContainer>
  </div>
</template>
