<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";
const appConfig = useAppConfig();

// Props for modal open state
const props = defineProps({
  isOpen: { type: Boolean, required: true },
});
const emit = defineEmits(["update:isOpen"]);

const modelIsOpen = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emit("update:isOpen", value),
});

const { t } = useI18n();
const toast = useToast();
const submitting = ref(false);
const form = ref();

// Define a static list of permission items.
const permissionItems = ref(corePermissions);

// Zod schema including the permissions field.
const schema = z.object({
  roleName: z.string().min(3, t("Must be at least 3 characters")),
  description: z.string().min(3, t("Must be at least 3 characters")),
  permissions: z
    .array(z.string())
    .min(1, t("At least one permission must be selected")),
});
type Schema = z.infer<typeof schema>;

// Reactive state for form values.
const state = reactive<Schema>({
  roleName: "",
  description: "",
  permissions: [], // default selected permissions
});

// Function to add a new role via the API.
const addRole = async (event: FormSubmitEvent<Schema>) => {
  try {
    submitting.value = true;
    await $fetch("/api/roles/new", {
      method: "POST",
      body: JSON.stringify({
        roleName: event.data.roleName,
        description: event.data.description,
        permissions: event.data.permissions,
      }),
    });
    submitting.value = false;
    toast.add({
      title: t("Success"),
      description: t("Role added successfully"),
      color: "green",
    });
    modelIsOpen.value = false;
  } catch (error: any) {
    console.error(error);
    toast.add({
      color: "red",
      title: t("Error"),
      description: error.statusMessage || t("Failed to add role"),
    });
    submitting.value = false;
  }
};
</script>

<template>
  <UModal v-model:open="modelIsOpen" :title="$t('Add New Role')">
    <template #body>
      <p class="mb-4 text-base text-gray-600">
        {{
          t(
            "Please provide a role name, a description, and select the appropriate permissions."
          )
        }}
      </p>
      <UForm ref="form" :schema="schema" :state="state" @submit="addRole">
        <div class="flex flex-col gap-4">
          <UFormField :label="$t('Role Name')" name="roleName">
            <UInput
              v-model="state.roleName"
              class="w-full"
              :placeholder="$t('Enter role name')"
            />
          </UFormField>
          <UFormField :label="$t('Description')" name="description">
            <UTextarea
              v-model="state.description"
              class="w-full"
              :placeholder="$t('Enter role description')"
            />
          </UFormField>
          <UFormField :label="$t('Permissions')" name="permissions">
            <USelectMenu
              v-model="state.permissions"
              :ui="{
                content: 'ltr',
              }"
              multiple
              :items="permissionItems"
              class="w-full"
              icon="i-lucide-user"
            />
          </UFormField>
          <UButton
            block
            variant="subtle"
            type="submit"
            :label="$t('Add Role')"
            size="xl"
            :loading="submitting"
            color="primary"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<style>
.ltr * {
  direction: ltr !important;
}
</style>
