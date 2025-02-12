<script setup lang="ts">
definePageMeta({
  layout: "manage",
});
const addRoleIsOpen = ref(false);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <h2 class="text-2xl text-bolder">{{ $t("Manage Users") }}</h2>

      <UButtonGroup size="md">
        <UButton
          color="neutral"
          variant="subtle"
          :label="$t('Add New Role')"
          icon="i-heroicons-key"
          @click="addRoleIsOpen = true"
        />
        <!-- <UButton
          color="primary"
          variant="subtle"
          :label="$t('Add New User')"
          icon="i-heroicons-user-plus"
        /> -->
      </UButtonGroup>
    </div>
    <div class="min-h-40 flex gap-3">
      <div class="basis-4/6"><UsersAll /></div>
      <div class="basis-2/6"><UsersRoles /></div>
    </div>
    <UsersNewRole v-model:is-open="addRoleIsOpen" />
  </div>
</template>
