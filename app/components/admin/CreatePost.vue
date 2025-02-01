<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const options = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
];

const state = reactive({
  title: undefined,
  category: undefined,
  body: "",
});

const schema = z.object({
  title: z.string().min(5),
  category: z.string().min(5),
});

type Schema = z.infer<typeof schema>;

const form = ref();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}

const isTyping = (data: string) => {
  state.body = data;
};
</script>

<template>
  <div>
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- <div class="flex w-full justify-between pb-3 gap-3 items-end">
        <UFormGroup name="title" label="عنوان" class="basis-10/12" size="md">
          <UInput v-model="state.title" />
        </UFormGroup>
        <UFormGroup
          name="category"
          label="دسته بدنی"
          class="basis-2/12"
          size="md"
        >
          <USelect
            v-model="state.category"
            placeholder="Select..."
            :options="options"
          />
        </UFormGroup>
        <UButtonGroup
          orientation="horizontal"
          class="basis-1/12 flex justify-end h-10"
        >
          <UButton
            icon="i-heroicons-check"
            color="gray"
            type="submit"
            class="text-md"
            >انتشار</UButton
          >
          <UButton icon="i-heroicons-chevron-down" color="gray" />
        </UButtonGroup>
      </div> -->
      <AdminEditor :body="state.body" @update="isTyping" />
    </UForm>
  </div>
</template>
