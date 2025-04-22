<script setup lang="ts">
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  email: "",
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "Subscribed to newsletter.",
    color: "success",
  });
  console.log(event.data);
}
</script>

<template>
  <div
    class="flex w-full justify-between items-center border rounded lg:flex-nowrap mt-5"
  >
    <div class="flex-1 w-full mb-5 md:mb-0 md:pr-5 lg:pr-10 md:w-2/3 p-5">
      <h3 class="mb-2 text-2xl font-bold">
        {{ $t("Subscribe to Newsletter") }}
      </h3>
      <p>
        {{ $t("Provide your email to get email notification for new updates") }}
      </p>
    </div>
    <div class="w-full px-5 md:w-1/3">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UButtonGroup size="xl">
          <UInput
            v-model="state.email"
            :placeholder="$t('Enter your email address')"
          />
          <UButton type="submit"> {{ $t("Subscribe") }} </UButton>
        </UButtonGroup>
      </UForm>
    </div>
  </div>
</template>
