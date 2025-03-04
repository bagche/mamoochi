<script lang="ts" setup>
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const route = useRoute();
const props = defineProps<{ pagePath: string }>();
const { t } = useI18n();

// Fetch the content data based on the current route and pagePath.
const { data: page }: any = await useAsyncData(route.path, () => {
  return queryCollection("content").path(props.pagePath).first();
});

// Helper function to sanitize the raw body text.
function sanitizeBody(rawBody: string): string {
  return (
    rawBody
      .replace(/\\n/g, "\n")
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "") ?? ""
  );
}

const state = reactive({
  title: page?.value?.title ?? "title",
  body: page?.value?.rawbody ? sanitizeBody(page.value.rawbody) : "",
});

const toast = useToast();
const submitting = ref(false);
const codeEditor = ref(false);

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
    toast.add({
      title: t("Success"),
      description: t("Content saved successfully"),
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: error.data?.message || error.message,
      description: error.data?.data?.issues?.[0]?.message || error.data?.data,
      color: "warning",
    });
  } finally {
    submitting.value = false;
  }
}

const isTyping = (data: string) => {
  state.body = data;
};
</script>

<template>
  <UContainer>
    <div class="max-w-7xl mx-auto flex flex-col items-center pt-10 px-4">
      <ClientOnly>
        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="space-y-4 w-full"
          @submit="onSubmit"
        >
          <div class="flex w-full flex-col">
            <div class="flex w-full justify-between pb-3 gap-3 items-end">
              <UFormField label="عنوان" class="w-full" size="md">
                <UInput v-model="state.title" class="w-full" />
              </UFormField>
              <UButtonGroup size="md">
                <UButton
                  :icon="codeEditor ? 'i-lucide-brush' : 'i-lucide-code'"
                  color="secondary"
                  variant="outline"
                  @click="codeEditor = !codeEditor"
                >
                  {{ codeEditor ? $t("Visual") : $t("Code") }}
                </UButton>
                <UButton
                  icon="i-lucide-cloud"
                  type="submit"
                  color="success"
                  variant="outline"
                >
                  {{ $t("Save") }}
                </UButton>
              </UButtonGroup>
            </div>

            <UTextarea
              v-if="codeEditor"
              v-model="state.body"
              class="w-full ltr text-xl flex"
              autoresize
              :rows="30"
            />

            <Editor
              v-else
              :body="state.body"
              class="prose prose-lg dark:prose-invert"
              @update="isTyping"
            />
          </div>
        </UForm>
      </ClientOnly>
    </div>
  </UContainer>
</template>

<style>
.ltr {
  direction: ltr;
}
</style>
