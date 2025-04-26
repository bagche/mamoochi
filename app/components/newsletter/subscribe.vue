<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { InferOutput } from "valibot";
import { email, object, parse, pipe, string } from "valibot";
import { reactive, ref } from "vue";

import { useRoute } from "#imports";

const toast = useToast();
const route = useRoute();
const submitting = ref(false);

// Validation schema
const schema = object({
  email: pipe(string(), email("Invalid email")),
});

type Schema = InferOutput<typeof schema>;

const state = reactive<Schema>({
  email: "",
});

const subscribe = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true;

  try {
    await $fetch("/api/newsletter/new", {
      method: "POST",
      body: {
        email: event.data.email,
        route: route.path,
      },
    });

    toast.add({
      title: "Success",
      description: "Subscribed successfully!",
      color: "success",
    });

    state.email = ""; // Clear input on success
  } catch (error: any) {
    console.error("Subscription failed", error);
    toast.add({
      title: "Error",
      description: error?.statusMessage || "Subscription failed.",
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col w-full items-center border rounded md:flex-row md:justify-between"
  >
    <div class="flex-1 w-full p-5">
      <h2 class="text-3xl font-semibold">
        {{ $t("Subscribe to Newsletter") }}
      </h2>
      <p>
        {{ $t("Provide your email to get email notification for new updates") }}
      </p>
    </div>
    <div
      class="w-full p-5 flex justify-center md:w-1/2 md:justify-end lg:w-1/3"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 w-full"
        @submit="subscribe"
      >
        <UButtonGroup size="xl" class="w-full flex">
          <UInput
            v-model="state.email"
            variant="subtle"
            :placeholder="$t('Enter your email address')"
            :disabled="submitting"
            class="w-full"
          />
          <UButton type="submit" :loading="submitting" variant="subtle">
            {{ $t("Subscribe") }}
          </UButton>
        </UButtonGroup>
      </UForm>
    </div>
  </div>
</template>
