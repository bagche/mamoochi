<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";
const { t } = useI18n();
const toast = useToast();
const submitting = ref(false);
const emit = defineEmits(["close-modal"]);

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
    await $fetch("/api/users/change-password", {
      method: "PUT",
      body: {
        oldPassword: event.data.oldPassword,
        newPassword: event.data.password,
      },
    });

    submitting.value = false;
    emit("close-modal");

    toast.add({
      title: t("Success"),
      description: t("Password changed successfully"),
      color: "green",
    });
  } catch (error: any) {
    submitting.value = false;

    toast.add({
      title: t("Error"),
      description:
        error.data?.message || error.message || t("Failed to change password"),
      color: "red",
    });
  }
};
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="changePassword">
    <div class="flex flex-col gap-5">
      <UFormField :label="$t('Current Password')" name="oldPassword">
        <UInput
          v-model="state.oldPassword"
          class="w-full"
          variant="subtle"
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
            variant="subtle"
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

        <UFormField
          :label="$t('Confirm Password')"
          name="confirmPassword"
          class="basis-1/2"
        >
          <UInput
            v-model="state.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('Confirm Password')"
            variant="subtle"
            :ui="{ trailing: 'pr-0.5' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="
                  showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                "
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </UInput>
        </UFormField>
      </div>
      <UButton
        block
        variant="outline"
        type="submit"
        :label="$t('Change Password')"
        size="xl"
        :loading="submitting"
        color="primary"
      />
    </div>
  </UForm>
</template>
