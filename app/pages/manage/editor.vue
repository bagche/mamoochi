<script lang="ts" setup>
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const route = useRoute();

const props = defineProps<{ pagePath: string }>();

// const { locale } = useI18n();

const { data: page }: any = await useAsyncData(route.path, () => {
  return queryCollection("content")
    .where("path", "LIKE", "%" + props.pagePath)
    .first();
});
console.log("Current page path:", page);

const state = reactive({
  title: page?.value?.title ?? "title",
  category: "d",
  body: page?.value?.rawbody.replace(/\\n/g, "\n") ?? "",
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

// const isTyping = (data: string) => {
//   state.body = data;
// };
</script>
<template>
  <div class="pt-5">
    <UContainer>
      <div class="flex max-w-7xl mx-auto gap-10">
        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="space-y-4 w-full"
          @submit="onSubmit"
        >
          <UCard>
            <template #header>
              <div class="flex w-full justify-between pb-3 gap-3 items-end">
                <UFormField label="عنوان" class="basis-10/12" size="2xl">
                  <UInput v-model="state.title" class="w-full" />
                </UFormField>
                <UFormField
                  name="category"
                  label="دسته بدنی"
                  class="basis-2/12"
                  size="2xl"
                >
                  <UInput v-model="state.category" placeholder="Select..." />
                </UFormField>
                <UButton
                  icon="i-heroicons-cloud"
                  type="submit"
                  class="text-md"
                  >{{ $t("Publish") }}</UButton
                >
              </div>
            </template>

            <UTextarea
              v-model="state.body"
              class="w-full ltr text-xl"
              autoresize
              :rows="40"
            />
          </UCard>

          <!-- <ManageEditor
            :body="state.body"
            class="prose prose-xl dark:prose-invert mt-10"
            @update="isTyping"
          /> -->
        </UForm>
      </div>
    </UContainer>
  </div>
</template>
