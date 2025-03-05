<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

// Props: Modal open state and the target user ID.
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  userId: { type: Number, required: true },
});
const emit = defineEmits(["update:isOpen"]);

// Two‑way binding for modal open state.
const modelIsOpen = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emit("update:isOpen", value),
});

const { t } = useI18n();
const toast = useToast();
const submitting = ref(false);
const form = ref();
// Fetch all roles from the API endpoint.
// Assumes GET /api/roles/all returns { roles: [ { id, name, description }, ... ] }
const {
  data: rolesData,
  error: rolesError,
  refresh,
} = useFetch("/api/roles/all", {
  method: "GET",
});

// Map API roles into items for USelectMenu.
// Each item will have a label (role name) and value (role id as string).
const rolesItems = computed(() => {
  if (rolesData.value && rolesData.value.roles) {
    return rolesData.value.roles.map((role: any) => ({
      label: role.name,
      value: role.id.toString(),
    }));
  }
  return [];
});

// Zod schema for the form.
const schema = z.object({
  roleIds: z.array(z.string()).min(1, t("At least one role must be selected")),
});
type Schema = z.infer<typeof schema>;

// Reactive state for form values.
const state = reactive<Schema>({
  roleIds: [], // Initially no roles selected.
});

// Submit handler: posts the userId and selected roleIds to the API.
const addUserRole = async (event: FormSubmitEvent<Schema>) => {
  try {
    submitting.value = true;
    await $fetch("/api/roles/add-user", {
      method: "POST",
      body: JSON.stringify({
        userId: props.userId,
        roleIds: state.roleIds,
      }),
    });
    submitting.value = false;
    toast.add({
      title: t("Success"),
      description: t("Roles added successfully"),
      color: "green",
    });
    modelIsOpen.value = false;
  } catch (error: any) {
    console.error(error);
    toast.add({
      color: "red",
      title: t("Error"),
      description: error.statusMessage || t("Failed to add roles to user"),
    });
    submitting.value = false;
  }
};
</script>

<template>
  <UModal v-model:open="modelIsOpen" :title="$t('Add Role to User')">
    <template #body>
      <p class="mb-4 text-base text-gray-600">
        {{ t("Select one or more roles to assign to the user.") }}
      </p>
      <UForm ref="form" :schema="schema" :state="state" @submit="addUserRole">
        <div class="flex flex-col gap-4">
          <UFormField :label="$t('Roles')" name="roleIds">
            <USelectMenu
              v-model="state.roleIds"
              multiple
              :items="rolesItems"
              class="w-full"
              value-key="value"
            />
          </UFormField>
          <UButton
            block
            variant="outline"
            type="submit"
            :label="$t('Add Role')"
            size="xl"
            :loading="submitting"
            color="primary"
            :disabled="state.roleIds.length === 0"
            @click="addUserRole"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
