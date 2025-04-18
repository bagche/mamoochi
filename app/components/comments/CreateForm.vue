<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";
const { loggedIn, clear, user } = useUserSession();

const toast = useToast();
const { t } = useI18n();
const route = useRoute();

const state = reactive({
  message: "",
});

const emit = defineEmits<{
  (e: "commentPosted"): void;
}>();

const schema = z.object({
  message: z.string().min(5, t("Comment must be at least 5 characters")),
});
type Schema = z.infer<typeof schema>;

const form = ref();
const sending = ref(false);

const canCreate = await allows(createComment);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  sending.value = true;
  try {
    await $fetch("/api/comments/new", {
      method: "POST",
      body: JSON.stringify({
        routePath: route.path, // current route as the content reference
        commentBody: event.data.message,
      }),
    });
    toast.add({
      title: t("Success"),
      description: t("Comment posted successfully"),
      color: "success",
    });
    state.message = "";
  } catch (error: any) {
    toast.add({
      title: t("Error"),
      description:
        error.data?.message || error.message || t("Failed to post comment"),
      color: "error",
    });
  } finally {
    sending.value = false;
    emit("commentPosted");
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.value?.submit();
  }
};
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit">
    <UCard
      variant="soft"
      :ui="{
        root: 'p-0 rounded-sm',
        body: ' border-none',
        header: 'border-none',
      }"
    >
      <UFormField name="message">
        <UTextarea
          v-model="state.message"
          :ui="{ base: 'p-5 bg-transparent' }"
          :placeholder="$t('Write your comment...')"
          :padded="false"
          variant="ghost"
          color="primary"
          class="w-full"
          size="xl"
          autoresize
          :disabled="!canCreate"
          @keydown="handleKeyDown"
        />
      </UFormField>
      <template #footer>
        <div v-if="loggedIn" class="flex justify-end">
          <UButton
            :disabled="!canCreate"
            class="px-3 py-2"
            icon="i-lucide-message-square-plus"
            variant="outline"
            color="primary"
            type="submit"
            :loading="sending"
          >
            {{ $t("Send Comment") }}
          </UButton>
        </div>
        <div v-else class="flex justify-end">
          <UPopover>
            <UButton
              class="px-3 py-2"
              icon="i-lucide-message-square-plus"
              variant="outline"
              color="secondary"
            >
              {{ $t("Verify Yourself") }}
            </UButton>

            <template #content>
              <div class="p-3">
                <AuthGuestRegisterForm @close-modal="registerIsOpen = false" />
              </div>
            </template>
          </UPopover>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
