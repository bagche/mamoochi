<script lang="ts" setup>
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const { locale } = useI18n();
const route = useRoute();

const filePath = "%" + route?.params?.slug?.join("/");

const { data: page }: any = await useAsyncData(route.path, () => {
  return queryCollection("content").where("path", "LIKE", filePath).first();
});

const state = reactive({
  title: page.value.title,
  category: "d",
  body: page.value.rawbody.replace(/\\n/g, "\n"),
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
  <div class="pt-10">
    <UContainer>
      <div class="flex max-w-7xl mx-auto gap-10">
        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="flex w-full justify-between pb-3 gap-3 items-end">
            <UFormField label="عنوان" class="basis-10/12" size="md">
              <UInput v-model="state.title" />
            </UFormField>
            <UFormField
              name="category"
              label="دسته بدنی"
              class="basis-2/12"
              size="md"
            >
              <UInput v-model="state.category" placeholder="Select..." />
            </UFormField>
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
          <ManageEditor
            :body="state.body"
            class="prose prose-xl dark:prose-invert mt-10"
            @update="isTyping"
          />
        </UForm>
      </div>
    </UContainer>
  </div>
</template>
