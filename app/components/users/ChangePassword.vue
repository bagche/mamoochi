<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";
const { t } = useI18n();
const toast = useToast();
const submitting = ref(false);

const props = defineProps({
  isOpen: { type: Boolean, required: true },
});
const emit = defineEmits(["update:isOpen"]);

const modelIsOpen = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emit("update:isOpen", value),
});

// Password visibility toggles
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation schema
const schema = z
  .object({
    oldPassword: z.string().min(6, t("Password must be at least 6 characters")),
    password: z.string().min(6, t("Password must be at least 6 characters")),
    confirmPassword: z
      .string()
      .min(6, t("Confirm Password must be at least 6 characters")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("Passwords do not match"),
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  oldPassword: "",
  password: "",
  confirmPassword: "",
});

// Handle form submission
const changePassword = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true;

  try {
    await $fetch("/api/member/change-password", {
      method: "PUT",
      body: {
        oldPassword: event.data.oldPassword,
        newPassword: event.data.password,
      },
    });

    submitting.value = false;
    modelIsOpen.value = false;

    toast.add({
      title: t("Success"),
      description: t("Password changed successfully"),
      color: "green",
    });
  } catch (error: any) {
    submitting.value = false;

    toast.add({
      title: t("Error"),
      description: error.data?.message || error.message || t("Failed to change password"),
      color: "red",
    });
  }
};
</script>

<template>
  <UModal v-model:open="modelIsOpen">
    <template #content>
      <UForm ref="form" :schema="schema" :state="state" @submit="changePassword">
        <UCard>
          <template #header>
            <h4 class="text-xl">{{ $t("Change Your Password") }}</h4>
          </template>
          <div class="flex flex-col gap-5">
            <UFormField :label="$t('Current Password')" name="oldPassword">
              <UInput
                v-model="state.oldPassword"
                class="w-full"
                :placeholder="$t('Your Current Password')"
                type="password"
              />
            </UFormField>

            <USeparator :label="$t('New Password')" />

            <div class="flex gap-3">
              <UFormField :label="$t('Password')" name="password" class="basis-1/2">
                <UInput
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('Enter Password')"
                  :ui="{ trailing: 'pr-0.5' }"
                >
                  <template #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </UInput>
              </UFormField>

              <UFormField :label="$t('Confirm Password')" name="confirmPassword" class="basis-1/2">
                <UInput
                  v-model="state.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :placeholder="$t('Confirm Password')"
                  :ui="{ trailing: 'pr-0.5' }"
                >
                  <template #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      @click="showConfirmPassword = !showConfirmPassword"
                    />
                  </template>
                </UInput>
              </UFormField>
            </div>
          </div>
          <template #footer>
            <UButton
              block
              variant="outline"
              type="submit"
              :label="$t('Change Password')"
              size="xl"
              :loading="submitting"
              color="primary"
            />
          </template>
        </UCard>
      </UForm>
    </template>
  </UModal>
</template>
