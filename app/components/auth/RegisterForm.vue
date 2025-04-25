<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const { t } = useI18n();
const { fetch: fetchProfile } = useUserSession();
const toast = useToast();
const submitting = ref(false);
const form = ref();

// Get initial profile from useUser composable
const { profile } = useUser();

// Show/hide password toggles
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Initialize form state with data from the profile
const state = reactive({
  firstName: "",
  lastName: "",
  about: "",
  userName: "",
  password: "",
  confirmPassword: "",
});

// On mount, load initial values from useUser profile.
// Use a fallback for the about field with the device name.
onMounted(() => {
  state.firstName = profile.value.firstName || "";
  state.lastName = profile.value.lastName || "";
  state.about = profile.value.about;
});

// Validation schema
const schema = z
  .object({
    firstName: z.string().min(2, t("Must be at least 2 characters")),
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

// Handle form submission: include the device public key from useUser profile.
const profileActivate = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true;
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: event.data.firstName,
        lastName: event.data.lastName,
        about: event.data.about,
        userName: event.data.userName,
        password: event.data.password,
        pub: profile.value.pub, // send public key from useUser
      }),
    });
    await fetchProfile();
    submitting.value = false;

    toast.add({
      title: t("Success"),
      description: t("User registered successfully"),
      color: "success",
    });
    reloadNuxtApp();
  } catch (error: any) {
    submitting.value = false;
    toast.add({
      title: error.data?.message || error.message,
      description: error.data?.data?.issues?.[0]?.message || error.data?.data,
      color: "warning",
    });
  }
};
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="profileActivate">
    <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-10">
        <div class="flex gap-3">
          <UFormField :label="$t('Username')" name="userName" class="basis-2/2">
            <UInput
              v-model="state.userName"
              variant="subtle"
              class="w-full"
              :placeholder="$t('Your username')"
            />
          </UFormField>
        </div>

        <!-- Password Fields with Show/Hide Toggle -->
        <div class="flex gap-3">
          <UFormField :label="$t('Password')" name="password" class="basis-1/2">
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('Enter password')"
              class="w-full"
              variant="subtle"
              :ui="{ trailing: 'pr-0.5' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="
                    showPassword ? t('Hide password') : t('Show password')
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
              v-model="state.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :placeholder="$t('Confirm password')"
              variant="subtle"
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
                      ? t('Hide password')
                      : t('Show password')
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
            v-model="state.firstName"
            class="w-full"
            variant="subtle"
            :placeholder="$t('Your first name')"
          />
        </UFormField>
        <UFormField :label="$t('Last Name')" name="lastName" class="basis-1/2">
          <UInput
            v-model="state.lastName"
            class="w-full"
            variant="subtle"
            :placeholder="$t('Your last name')"
          />
        </UFormField>
      </div>

      <UFormField :label="$t('About')" name="about" class="basis-2/2">
        <UTextarea
          v-model="state.about"
          class="w-full"
          variant="subtle"
          :placeholder="$t('Ex: Developer Lead')"
        />
      </UFormField>
      <UButton
        class="cursor-pointer"
        block
        variant="subtle"
        type="submit"
        :label="$t('Register')"
        :loading="submitting"
        color="success"
        size="xl"
      />
    </div>
  </UForm>
</template>
