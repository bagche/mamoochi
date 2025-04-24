<script setup>
const { t } = useI18n();
const UPagination = resolveComponent("UPagination");
const { loggedIn: sessionLoggedIn } = useUserSession();

// Pagination state
const pagination = ref({
  pageIndex: 0,
  pageSize: 20,
});

// Query parameters
const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  pageSize: pagination.value.pageSize,
  // status: "new",
}));

// Fetch comments
const { data, error, refresh } = useFetch("/api/comments/self", {
  query: queryParams,
  watch: [queryParams],
});
</script>

<template>
  <div class="w-full space-y-4 pt-4">
    <div v-if="sessionLoggedIn && data?.comments?.length" class="px-5 md:m-0">
      <ol>
        <li v-for="comment in data.comments" :key="comment.id" class="mb-2">
          <div class="md:inline-flex">
            <NuxtLink
              :to="`${comment.routePath}#comment-${comment.id}`"
              class="hover:!underline"
            >
              {{ comment.body }}
            </NuxtLink>
            <span class="font-thin block">
              / {{ formatDateTime(comment.createdAt) }}
            </span>
          </div>
        </li>
      </ol>

      <!-- Pagination -->
      <div
        v-if="data?.total > pagination.pageSize"
        class="flex justify-center border-t border-(--ui-border) pt-4"
      >
        <UPagination
          :page="pagination.pageIndex"
          :page-count="Math.ceil(data.total / pagination.pageSize)"
          :total="data.total"
          :page-size="pagination.pageSize"
          @update:page="pagination.pageIndex = $event - 1"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-else class="mt-4">
      {{ t("Failed to load comments") }}
    </div>
  </div>
</template>
