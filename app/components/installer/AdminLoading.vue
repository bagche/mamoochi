<script lang="ts" setup>
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const { adminLoaded } = useInstaller();
const { t } = useI18n();
const { fetch: fetchProfile } = useUserSession();
const toast = useToast();
const form = ref();
const adminLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const adminState = reactive({
  firstName: "",
  lastName: "",
  about: "",
  userName: "",
  password: "",
  confirmPassword: "",
});

const schema = z
  .object({
    firstName: z.string().min(3, t("Must be at least 3 characters")),
    lastName: z.string().min(3, t("Must be at least 3 characters")),
    about: z.string().min(3, t("Must be at least 3 characters")),
    userName: z.string().min(3, t("Must be at least 3 characters")),
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
const runAdminLoading = async (event: FormSubmitEvent<Schema>) => {
  adminLoading.value = true;
  try {
    await $fetch("/api/install/admin-loading", {
      method: "POST",
      body: JSON.stringify({
        firstName: event.data.firstName,
        lastName: event.data.lastName,
        about: event.data.about,
        userName: event.data.userName,
        password: event.data.password,
      }),
    });
    adminLoaded.value = true;
    adminLoading.value = false;
    await fetchProfile();
    toast.add({
      title: t("Success"),
      description: t("User registered successfully"),
      color: "success",
    });
  } catch (error: any) {
    adminLoaded.value = false;
    adminLoading.value = false;
    toast.add({
      title: error.data?.message || error.message,
      description: error.data?.data?.issues[0]?.message || error.data?.data,
      color: "warning",
    });
  }
};
</script>
<template>
  <div class="w-full min-h-50">
    <UForm
      ref="form"
      :schema="schema"
      :state="adminState"
      @submit="runAdminLoading"
    >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-10">
          <div class="flex gap-3">
            <UFormField
              :label="$t('Username')"
              name="userName"
              class="basis-2/2"
            >
              <UInput
                v-model="adminState.userName"
                class="w-full"
                :placeholder="$t('Your username')"
              />
            </UFormField>
          </div>

          <!-- Password Fields with Show/Hide Toggle -->
          <div class="flex gap-3">
            <UFormField
              :label="$t('Password')"
              name="password"
              class="basis-1/2"
            >
              <UInput
                v-model="adminState.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('Enter password')"
                class="w-full"
                :ui="{ trailing: 'pr-0.5' }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="
                      showPassword ? $t('Hide password') : $t('Show password')
                    "
                    :aria-pressed="showPassword"
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
                v-model="adminState.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :placeholder="$t('Confirm password')"
                class="w-full"
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
                    :aria-label="
                      showConfirmPassword
                        ? $t('Hide password')
                        : $t('Show password')
                    "
                    :aria-pressed="showConfirmPassword"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>

        <USeparator :label="$t('Personal Details')" class="mt-5" />

        <div class="flex gap-3 w-full">
          <UFormField
            :label="$t('First Name')"
            name="firstName"
            class="basis-1/2"
          >
            <UInput
              v-model="adminState.firstName"
              class="w-full"
              :placeholder="$t('Your first name')"
            />
          </UFormField>
          <UFormField
            :label="$t('Last Name')"
            name="lastName"
            class="basis-1/2"
          >
            <UInput
              v-model="adminState.lastName"
              class="w-full"
              :placeholder="$t('Your last name')"
            />
          </UFormField>
        </div>

        <UFormField :label="$t('About')" name="about" class="basis-2/2">
          <UTextarea
            v-model="adminState.about"
            class="w-full"
            :placeholder="$t('Ex: Developer Lead')"
          />
        </UFormField>
      </div>

      <UButton
        :disabled="adminLoaded"
        class="mt-5"
        variant="outline"
        type="submit"
        color="success"
        size="xl"
        block
        icon="i-lucide-shield-user"
        :label="$t('Adding Admin User')"
        :loading="adminLoading"
      />
    </UForm>
  </div>
</template>
