<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const { t } = useI18n();
const form = ref();

const toast = useToast();
const submitting = ref(false);

// Password visibility toggle
const showPassword = ref(false);

// Validation schema
const schema = z.object({
  userName: z.string().min(3, t("Must be at least 3 characters")),
  password: z.string().min(6, t("Password must be at least 6 characters")),
});

type Schema = z.output<typeof schema>;

// State
const state = reactive<Schema>({
  userName: "",
  password: "",
});

// Handle login form submission
const login = async (event: FormSubmitEvent<Schema>) => {
  try {
    submitting.value = true;

    // Send login data to the server
    await $fetch("/api/member/login", {
      method: "POST",
      body: JSON.stringify({
        userName: event.data.userName,
        password: event.data.password,
      }),
    });

    submitting.value = false;
    toast.add({
      title: t("Success"),
      description: t("User login successfully"),
      color: "green",
    });
    navigateTo("/");
    window.location.reload();

    // Handle login (set user session or redirect, as needed)
  } catch (error: any) {
    console.error(error.statusMessage);
    toast.add({
      color: "red",
      title: t("Error"),
      description: error.statusMessage || t("Login failed"),
    });
    submitting.value = false;
  }
};
</script>

<template>
  <UContainer class="min-h-screen flex items-center justify-center">
    <UCard class="w-[40rem]">
 
      <UForm ref="form" :schema="schema" :state="state" @submit="login">
        <div class="flex flex-col gap-4">
          <UFormField
            :label="$t('Username')"
            name="userName"
            class="basis-full"
          >
            <UInput
              v-model="state.userName"
              class="w-full"
              :placeholder="$t('Enter username')"
            />
          </UFormField>

          <UFormField
            :label="$t('Password')"
            name="password"
            class="basis-full"
          >
            <UInput
              v-model="state.password"
              class="w-full"
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
                  aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <UButton
            class="cursor-pointer"
            block
            variant="outline"
            type="submit"
            :label="$t('Login')"
            size="xl"
            :loading="submitting"
            color="primary"
          />
        </div>
      </UForm>
      <USeparator :label="$t('Dont have an account?')" class="mt-10" />
      <UButton
        class="mt-2 cursor-pointer"
        variant="outline"
        color="secondary"
        block
        :label="$t('Register')"
        @click="navigateTo('register')"
      />
    </UCard>
  </UContainer>
</template>
