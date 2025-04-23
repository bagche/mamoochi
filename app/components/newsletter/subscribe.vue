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
    class="flex flex-col lg:flex-row w-full items-center border rounded mt-5"
  >
    <div class="flex-1 w-full p-5">
      <h3 class="mb-2 text-2xl font-bold">
        {{ $t("Subscribe to Newsletter") }}
      </h3>
      <p>
        {{ $t("Provide your email to get email notification for new updates") }}
      </p>
    </div>
    <div class="w-full px-5 md:w-1/2 lg:w-1/3">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="subscribe"
      >
        <UButtonGroup size="xl">
          <UInput
            v-model="state.email"
            :placeholder="$t('Enter your email address')"
            :disabled="submitting"
          />
          <UButton type="submit" :loading="submitting">
            {{ $t("Subscribe") }}
          </UButton>
        </UButtonGroup>
      </UForm>
    </div>
  </div>
</template>
