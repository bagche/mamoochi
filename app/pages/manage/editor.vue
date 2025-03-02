<script lang="ts" setup>
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const route = useRoute();

const props = defineProps<{ pagePath: string }>();
const { t } = useI18n();

const { data: page }: any = await useAsyncData(route.path, () => {
  return queryCollection("content")
    .where("path", "LIKE", "%" + props.pagePath)
    .first();
});

const state = reactive({
  title: page?.value?.title ?? "title",
  body: page?.value?.rawbody.replace(/\\n/g, "\n") ?? "",
});
const toast = useToast();
const submitting = ref(false);

const schema = z.object({
  title: z.string().min(5),
  body: z.string().min(5),
});

type Schema = z.infer<typeof schema>;

const form = ref();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true;
  try {
    await $fetch("/api/editor/new", {
      method: "POST",
      body: JSON.stringify({
        path: props.pagePath,
        body: event.data.body,
      }),
    });
    submitting.value = false;
    toast.add({
      title: t("Success"),
      description: t("Content saved successfully"),
      color: "green",
    });
  } catch (error) {
    submitting.value = false;
    toast.add({
      title: error.data?.message || error.message,
      description: error.data?.data?.issues[0]?.message || error.data?.data,
      color: "red",
    });
  }
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

                <UButton
                  icon="i-lucide-cloud"
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
