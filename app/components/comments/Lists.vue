<script setup lang="ts">
defineProps<{
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  errorMessage: string | null;
}>();

// Emit page change event
const emit = defineEmits<{
  (e: "update:page", page: number): void;
}>();
</script>

<template>
  <div class="flex w-full flex-col mt-5">
    <UCard
      v-for="comment in comments"
      :id="`#comment-${comment.id}`"
      :key="comment.id"
      :href="`#comment-${comment.id}`"
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
              icon="i-lucide-user"
              size="xl"
              placeholder
              provider="cloudflare"
              :modifiers="{ fit: 'contain' }"
              :src="comment.author.avatar"
              preload
              loading="lazy"
              class="tracking-wide"
            />

            <span class="text-lg font-medium">
              {{ comment.author.displayName }}
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
            variant="subtle"
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
      v-if="total > pageSize"
      :page="page"
      :total="total"
      :page-size="pageSize"
      class="justify-center w-full flex"
      @update:page="emit('update:page', $event)"
    />
  </div>
</template>
