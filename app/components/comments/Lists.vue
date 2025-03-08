<script setup lang="ts">
// const { currentComments } = useComments();
const { $dexie } = useNuxtApp();

const { profile } = useUser();
const currentChannelId = ref("test");
const currentComments = useLiveQuery(async () => {
  return await $dexie.events
    .orderBy("created_at")
    // .filter(
    //   (event: any) =>
    //     event.kind === 42 &&
    //     event.tags.some(
    //       (tag: any) => tag[0] === "e" && tag[1] === currentChannelId.value
    //     )
    // )
    .reverse()
    .limit(20)
    .toArray();
}, [currentChannelId]);
</script>

<template>
  <div class="flex w-full flex-col">
    <UCard
      v-for="comment in currentComments"
      :key="comment.id"
      class="mb-10 w-full"
      :ui="{
        ring: 'ring-0',
        shadow: 'shadow-none',
        base: 'border-b',
        rounded: 'rounded-sm',
        body: { padding: 'px-5 py-2 sm:py-3 sm:px-5' },
      }"
    >
      <template #header>
        <div class="w-full flex justify-between">
          <div class="flex items-center gap-2">
            <UAvatar
              chip-color="primary"
              chip-text=""
              chip-position="top-right"
              src="/totoro_render.webp"
              size="sm"
              class="avatar-button"
            />
            <span class="text-base font-medium">
              {{ profile.displayName }}
            </span>
          </div>
          <div class="flex gap-2 text-sm">
            <span> {{ comment.status }}</span>
          </div>
        </div>
      </template>

      <span class="text-gray-500 dark:text-gray-400 text-base">
        {{ comment.content }}
      </span>

      <template #footer>
        <div class="flex justify-between items-center text-sm">
          <span> {{ eventFormatTimeAgo(comment.created_at) }}</span>
          <UButton
            variant="outline"
            color="gray"
            size="sm"
            :ui="{ rounded: 'rounded-md' }"
          >
            {{ $t("Reply") }}
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
