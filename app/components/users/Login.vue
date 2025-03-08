<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
});
const emit = defineEmits(["update:isOpen"]);

const modelIsOpen = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emit("update:isOpen", value),
});

const { t } = useI18n();
const form = ref();
const toast = useToast();
const submitting = ref(false);
const showPassword = ref(false);

const schema = z.object({
  userName: z.string().min(3, t("Must be at least 3 characters")),
  password: z.string().min(4, t("Password must be at least 6 characters")),
});
type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  userName: "",
  password: "",
});

// Import the new useUser methods
const { profile, login: userLogin } = useUser();

// Updated login function: include the public key from useUser and update the profile after API call
const login = async (event: FormSubmitEvent<Schema>) => {
  try {
    submitting.value = true;

    // Send the public key from our useUser profile along with the credentials
    const response = await $fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        userName: event.data.userName,
        password: event.data.password,
        pub: profile.value.pub, // Include public key from device profile
      }),
    });

    // Update the profile via our useUser hook.
    // We assume the API returns new profile fields (firstName, lastName, displayName, about, etc.)
    userLogin({
      firstName: response.firstName,
      lastName: response.lastName,
      displayName: response.displayName ?? "",
      about: response.about ?? "",
    });

    submitting.value = false;
    toast.add({
      title: t("Success"),
      description: t("User logged in successfully"),
      color: "success",
    });
    modelIsOpen.value = false;
    reloadNuxtApp();
  } catch (error: any) {
    console.error(error.statusMessage);
    toast.add({
      color: "error",
      title: t("Error"),
      description: error.statusMessage || t("Login failed"),
    });
    submitting.value = false;
  }
};
</script>

<template>
  <UModal v-model:open="modelIsOpen" :title="$t('Switch User')">
    <template #body>
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
              :placeholder="$t('Enter password')"
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
    </template>
  </UModal>
</template>
