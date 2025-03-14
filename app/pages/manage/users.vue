<script setup lang="ts">
const addRoleIsOpen = ref(false);
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
        <div class="flex justify-between w-full">
          <h2 class="text-2xl text-bolder">{{ $t("Manage Users") }}</h2>

          <UButtonGroup size="md">
            <UButton
              color="neutral"
              variant="subtle"
              :label="$t('Add New Role')"
              icon="i-lucide-key"
              @click="addRoleIsOpen = true"
            />
            <!-- <UButton
          color="primary"
          variant="subtle"
          :label="$t('Add New User')"
          icon="i-lucide-user-plus"
        /> -->
          </UButtonGroup>
        </div>
        <div class="flex gap-3 w-full">
          <div class="basis-4/6"><UsersAll /></div>
          <div class="basis-2/6"><UsersRoles /></div>
        </div>
        <UsersNewRole v-model:is-open="addRoleIsOpen" />
      </div>
    </UContainer>
  </div>
</template>
