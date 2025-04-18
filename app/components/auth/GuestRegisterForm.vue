<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";
const turnstile = ref();

function reset() {
  turnstile.value?.reset();
}

const { t } = useI18n();
const { fetch: fetchProfile } = useUserSession();
const toast = useToast();
const submitting = ref(false);
const form = ref();
const emit = defineEmits(["close-modal"]);

// Get initial profile from useUser composable
const { profile } = useUser();

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
    await $fetch("/api/users/register", {
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
    emit("close-modal");

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
  <div class="flex flex-col px-2 gap-3">
    <div class="flex gap-3 w-full">
      <UFormField :label="$t('First Name')" name="firstName" class="basis-1/2">
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
    <UButtonGroup class="flex w-full" size="md">
      <UButton
        block
        class="cursor-pointer"
        variant="outline"
        :label="$t('Reset from handler')"
        color="success"
        size="xl"
        @click="reset"
      />
      <UButton
        block
        class="cursor-pointer"
        variant="outline"
        :label="$t('Reset Token Template')"
        color="success"
        size="xl"
        @click="turnstile.reset()"
      />
    </UButtonGroup>
    <div class="flex justify-center">
      <NuxtTurnstile ref="turnstile" />
    </div>
  </div>
</template>
