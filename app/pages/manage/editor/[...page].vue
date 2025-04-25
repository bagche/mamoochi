<script lang="ts" setup>
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const filPath = route.params.page.join("/");

const { data: page, error }: any = await useAsyncData(
  `page:${route.path}`,
  async () => {
    try {
      return await $fetch("/api/content/single", {
        query: {
          path: filPath,
        },
      });
    } catch (error) {
      console.error("Error fetching page content:", error);
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
      });
    }
  },
  {
    dedupe: "defer",
    transform: (data) => data || null,
    lazy: false,
    server: true,
  }
);
/**
 * Converts literal "\n" to real newlines, then extracts the front matter block
 * (from the start of the file until the second triple-dash) and the remaining content.
 */
const parseFrontMatter = (
  raw: string
): { frontMatter: string; content: string } => {
  const replaced = raw.replace(/\\n/g, "\n");
  const match = replaced.match(/^---\n[\s\S]*?\n---\n?/);
  return match
    ? { frontMatter: match[0], content: replaced.replace(match[0], "") }
    : { frontMatter: "", content: replaced };
};

const body = page?.value?.body || "";
const { frontMatter, content } = parseFrontMatter(body);

const state = reactive({
  title: page?.value?.title ?? "title",
  frontMatter, // Save the extracted front matter for later
  body: content, // Show only the content in the editor
});

const submitting = ref(false);
const codeEditor = ref(false);

const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(5),
});
type Schema = z.infer<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>): Promise<void> => {
  submitting.value = true;
  try {
    const finalBody = state.frontMatter
      ? `${state.frontMatter.trim()}\n\n${event.data.body}`
      : event.data.body;
    await $fetch("/api/builds/commit", {
      method: "POST",
      body: JSON.stringify({
        path: page?.value?.id,
        body: finalBody,
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
};

const isTyping = (data: string): void => (state.body = data);

// definePageMeta({
//   middleware: "permissions",
//   permission: "commit.create",
// });
</script>

<template>
  <UContainer>
    <div class="max-w-7xl mx-auto flex flex-col items-center pt-10 px-4">
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
                variant="subtle"
                @click="
                  () => {
                    codeEditor = !codeEditor;
                  }
                "
              >
                {{ codeEditor ? $t("Visual") : $t("Code") }}
              </UButton>
              <UButton
                icon="i-lucide-cloud"
                type="submit"
                color="success"
                variant="subtle"
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
    </div>
  </UContainer>
</template>

<style>
.ltr {
  direction: ltr;
}
</style>
