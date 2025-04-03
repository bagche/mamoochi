<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";
const { user, fetch: fetchSession }: any = useUserSession();
const { profile, login: userLogin } = useUser();
const emit = defineEmits(["close-modal"]);

const { t } = useI18n();

const toast = useToast();
const submitting = ref(false);

// Validation schema
const schema = z.object({
  firstName: z.string().min(3, t("Must be at least 3 characters")),
  lastName: z.string().min(3, t("Must be at least 3 characters")),
  about: z.string().min(3, t("Must be at least 3 characters")),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  firstName: user?.value?.firstName,
  lastName: user?.value.lastName,
  about: user?.value.about,
});

onMounted(() => {
  state.firstName = profile.value.firstName || "";
  state.lastName = profile.value.lastName || "";
  state.about = profile.value.about;
});

// Handle form submission
const updateProfile = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true;

  try {
    const response = await $fetch("/api/users/update-profile", {
      method: "PUT",
      body: JSON.stringify(event.data),
    });
    submitting.value = false;

    toast.add({
      title: t("Success"),
      description: t("Profile updated successfully"),
      color: "green",
    });
    await fetchSession();
    userLogin({
      firstName: response.firstName,
      lastName: response.lastName,
      displayName: response.displayName ?? "",
      about: response.about ?? "",
    });
    emit("close-modal");
  } catch (error: any) {
    submitting.value = false;

    toast.add({
      title: t("Error"),
      description: error.data?.message || error.message,
      color: "red",
    });
  }
};
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="updateProfile">
    <div class="flex flex-col gap-5">
      <div class="flex gap-3">
        <UFormField
          :label="$t('First Name')"
          name="firstName"
          class="basis-1/2"
        >
          <UInput
            v-model="state.firstName"
            :placeholder="$t('Your First Name')"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="$t('Last Name')" name="lastName" class="basis-1/2">
          <UInput
            v-model="state.lastName"
            :placeholder="$t('Your Last Name')"
            class="w-full"
          />
        </UFormField>
      </div>
      <UFormField :label="$t('About')" name="about">
        <UTextarea
          v-model="state.about"
          class="w-full"
          :placeholder="$t('Ex: Developer Lead')"
        />
      </UFormField>

      <UButton
        block
        variant="outline"
        type="submit"
        :label="$t('Update Profile')"
        size="xl"
        :loading="submitting"
        color="primary"
      />
    </div>
  </UForm>
</template>
