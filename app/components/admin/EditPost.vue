<script setup lang="ts">
import { decode } from "js-base64";
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";
const route = useRoute();
const { data } = await useAsyncData("page-data", () =>
  queryContent(route.path).findOne()
);

const fileData = await $fetch("/api/github/get-file-data", {
  method: "post",
  body: { name: data.value._file },
});

const testData = await extractMarkdownData(decode(fileData.content));

console.log(testData);

// const options = [
//   { label: "Option 1", value: "option-1" },
//   { label: "Option 2", value: "option-2" },
//   { label: "Option 3", value: "option-3" },
// ];

const state = reactive({
  title: data.value.title,
  category: testData.frontmatter.category,
  body: testData.body,
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
      <div class="flex w-full justify-between pb-3 gap-3 items-end">
        <UFormGroup name="title" label="عنوان" class="basis-10/12" size="md">
          <UInput v-model="state.title" />
        </UFormGroup>
        <UFormGroup
          name="category"
          label="دسته بدنی"
          class="basis-2/12"
          size="md"
        >
          <!-- <USelect
            v-model="state.category"
            placeholder="Select..."
            :options="options"
          />    -->
          <UInput v-model="state.category" placeholder="Select..." />
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
      </div>
      <Editor :body="state.body" @update="isTyping" />
    </UForm>
  </div>
</template>
