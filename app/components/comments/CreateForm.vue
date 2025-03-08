<script setup lang="ts">
import { z } from "zod";

import type { FormSubmitEvent } from "#ui/types";

const state = reactive({
  message: "",
});
const { $dexie } = useNuxtApp();

const schema = z.object({
  message: z.string().min(5),
});

type Schema = z.infer<typeof schema>;

const form = ref();
const sending = ref(false);
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  sending.value = true;
  console.log(event.data.message);
  //   if (!certs.value?.pub) {
  //     sending.value = false;
  //     throw new Error("User profile is not loaded");
  //   }
  //   if (!currentChannelId.value) {
  //     sending.value = false;
  //     throw new Error("Channel ID is not loaded");
  //   }

  // const event: NostrEvent = finalizeEvent(
  //   {
  //     kind: 42,
  //     created_at: Math.floor(Date.now()),
  //     content: event.data.message,
  //     tags: [["e", currentChannelId.value as string]],
  //   },
  //   hexToBytes(certs.value.priv)
  // );

  // $dexie.events.add({
  //   ...event,
  //   status: "Sending",
  // });

  sending.value = false;
  // await sendComment(event.data.message);
  state.message = "";
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
      variant="outline"
      :ui="{
        root: 'p-0 rounded-sm dark:bg-slate-600 bg-gray-50',
        body: 'sm:p-1 p-2',
        footer: 'sm:p-2 p-2',
      }"
    >
      <UFormField name="textarea">
        <UTextarea
          v-model="state.message"
          :ui="{
            base: 'p-5 bg-transparent',
          }"
          :placeholder="$t('Write Your Comment ...')"
          :padded="false"
          variant="ghost"
          color="primary"
          class="w-full"
          autoresize
          @keydown="handleKeyDown"
        />
      </UFormField>
      <template #footer>
        <div class="flex justify-end">
          <UButton
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
      </template>
    </UCard>
  </UForm>
</template>
