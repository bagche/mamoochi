<script setup lang="ts">
import { z } from "zod";

const emit = defineEmits(["close-modal"]);

const { t } = useI18n();
const { fetch: fetchProfile } = useUserSession();
const { generateNewNames, profile } = useUser();
const toast = useToast();

// Refs
const turnstile = ref();
const token = ref();
const submitting = ref(false);

// Form state
const state = reactive({
  firstName: "",
  lastName: "",
  about: "",
});

// Validation errors
const errors = reactive({
  firstName: "",
  lastName: "",
  about: "",
});

// Validation schema
const schema = z.object({
  firstName: z.string().min(2, { message: t("Must be at least 2 characters") }),
  lastName: z.string().min(3, { message: t("Must be at least 3 characters") }),
  about: z.string().min(3, { message: t("Must be at least 3 characters") }),
});

// Initialize form state
const initializeForm = () => {
  state.firstName = profile.value.firstName || "";
  state.lastName = profile.value.lastName || "";
  state.about = profile.value.about || "";
};

// Load initial values and watch for profile changes
onMounted(initializeForm);
watch(profile, initializeForm);

// Reset turnstile
const resetTurnstile = () => {
  turnstile.value?.reset();
};

// Clear errors
const clearErrors = () => {
  errors.firstName = "";
  errors.lastName = "";
  errors.about = "";
};

// Validate form
const validateForm = async (): Promise<boolean> => {
  clearErrors();
  try {
    await schema.parseAsync(state);
    return true;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path[0] === "firstName") errors.firstName = err.message;
        if (err.path[0] === "lastName") errors.lastName = err.message;
        if (err.path[0] === "about") errors.about = err.message;
      });
    }
    toast.add({
      title: t("Validation Error"),
      description: t("Please check all fields"),
      color: "warning",
    });
    return false;
  }
};

// Handle submission
const handleSubmit = async () => {
  console.log("handleSubmit called with data:", toRaw(state));

  if (!token.value) {
    toast.add({
      title: t("Error"),
      description: t("Please complete the verification"),
      color: "warning",
    });
    return;
  }

  const isValid = await validateForm();
  if (!isValid) {
    console.log("Form validation failed, errors:", toRaw(errors));
    return;
  }

  submitting.value = true;

  try {
    await $fetch("/api/auth/guest-register", {
      method: "POST",
      body: {
        token: token.value,
        firstName: state.firstName,
        lastName: state.lastName,
        about: state.about,
        pub: profile.value.pub,
      },
    });

    await fetchProfile();

    toast.add({
      title: t("Success"),
      description: t("User registered successfully"),
      color: "success",
    });

    resetTurnstile();
    emit("close-modal");
    // window.location.hash = "#comments";
    // window.location.reload();
  } catch (error: any) {
    const errorMessage = error.data?.message || error.message;
    const errorDetails =
      error.data?.data?.issues?.[0]?.message || error.data?.data;

    toast.add({
      title: errorMessage,
      description: errorDetails,
      color: "warning",
    });
  } finally {
    submitting.value = false;
  }
};

// Debug token changes
watch(token, (newToken) => {
  console.debug("Turnstile token updated:", newToken);
});
</script>

<template>
  <div class="flex flex-col px-2">
    <div class="flex border-b pb-1 w-full justify-between mb-3">
      <div class="text-md">{{ $t("Your Basic Info") }}</div>
      <UButton
        class="cursor-pointer flex"
        variant="link"
        icon="i-lucide-refresh-ccw"
        color="secondary"
        size="xs"
        :label="$t('New Random Name')"
        @click="generateNewNames()"
      />
    </div>

    <div class="flex flex-col gap-3">
      <div class="basis-1/2">
        <label class="block text-sm font-medium text-gray-700">{{
          $t("First Name")
        }}</label>
        <UInput
          v-model="state.firstName"
          class="w-full"
          variant="subtle"
          :placeholder="$t('Your first name')"
        />
        <p v-if="errors.firstName" class="text-red-500 text-xs mt-1">
          {{ errors.firstName }}
        </p>
      </div>

      <div class="basis-1/2">
        <label class="block text-sm font-medium text-gray-700">{{
          $t("Last Name")
        }}</label>
        <UInput
          v-model="state.lastName"
          class="w-full"
          variant="subtle"
          :placeholder="$t('Your last name')"
        />
        <p v-if="errors.lastName" class="text-red-500 text-xs mt-1">
          {{ errors.lastName }}
        </p>
      </div>

      <div class="basis-2/2">
        <label class="block text-sm font-medium text-gray-700">{{
          $t("About")
        }}</label>
        <UTextarea
          v-model="state.about"
          class="w-full"
          variant="subtle"
          :placeholder="$t('Ex: Developer Lead')"
        />
        <p v-if="errors.about" class="text-red-500 text-xs mt-1">
          {{ errors.about }}
        </p>
      </div>

      <div class="flex justify-center gap-2 flex-col w-75">
        <NuxtTurnstile
          ref="turnstile"
          v-model="token"
          class="h-16 bg-gray-100"
        />
        <UButton
          size="xl"
          block
          type="button"
          variant="subtle"
          icon="i-lucide-plus"
          color="success"
          :label="$t('Register As Guest')"
          :disabled="!token || submitting"
          :loading="submitting"
          @click="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>
