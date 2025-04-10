<script setup lang="ts">
const { profile } = useUser();
const route = useRoute();

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const { data: commentsData, refresh: refreshComments } = useFetch(
  "/api/comments/single",
  {
    query: { page, pageSize, path: route.path },
  }
);

defineExpose({ refreshComments });

const currentComments = computed(() => commentsData.value?.comments || []);

watch(commentsData, () => {
  if (commentsData.value?.total !== undefined) {
    total.value = commentsData.value.total;
  }
});
</script>

<template>
  <div class="flex w-full flex-col mt-5">
    <UCard
      v-for="comment in currentComments"
      :key="comment.id"
      class="mb-10 w-full"
      variant="soft"
      :ui="{
        root: 'p-0 rounded-sm  ',
        body: ' border-none',
        header: 'border-none',
      }"
    >
      <template #header>
        <div class="w-full flex justify-between">
          <div class="flex items-center gap-2">
            <UAvatar
              :alt="profile.displayName"
              size="2xl"
              src="/mamoochi-tiny.webp"
              placeholder
              provider="cloudflare"
              :modifiers="{ fit: 'contain' }"
              preload
              loading="lazy"
            />

            <span class="text-base font-medium">
              {{ profile.displayName }}
            </span>
          </div>
          <div class="flex gap-2 text-sm">
            <span>{{ comment.status }}</span>
          </div>
        </div>
      </template>

      <span class="text-base">
        {{ comment.body }}
      </span>

      <template #footer>
        <div class="flex justify-between items-center text-sm">
          <span>{{ formatTimeAgo(comment.createdAt) }}</span>
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
    <UPagination
      v-model:page="page"
      :total="total"
      :page-size="pageSize"
      class="justify-center w-full flex"
    />
  </div>
</template>
