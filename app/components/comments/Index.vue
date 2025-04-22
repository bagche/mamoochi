<script setup lang="ts">
const route = useRoute();

// State for pagination and comments
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// Fetch comments in parent
const {
  data: commentsData,
  refresh: refreshComments,
  error,
  execute,
} = await useFetch<{
  comments: Comment[];
  total: number;
}>("/api/comments/single", {
  query: {
    page,
    pageSize,
    path: route.path,
  },
  watch: [page, pageSize],
  immediate: false,
});

// Computed for comments
const comments = computed(() => commentsData.value?.comments || []);

// Update total when data changes
watch(commentsData, () => {
  if (commentsData.value?.total !== undefined) {
    total.value = commentsData.value.total;
  }
});

// Handle comment posted event
const handleCommentPosted = async () => {
  page.value = 1; // Reset to first page
  await refreshComments(); // Refresh comments
};

// Handle page change from child
const handlePageChange = (newPage: number) => {
  page.value = newPage;
};
onMounted(() => {
  execute();
});
</script>

<template>
  <section id="comments" class="w-full">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-semibold">{{ $t("Comments") }}</h2>
    </div>
    <CommentsCreateForm @comment-posted="handleCommentPosted" />

    <CommentsLists
      :comments="comments"
      :total="total"
      :page="page"
      :page-size="pageSize"
      :is-loading="isLoading"
      :error-message="errorMessage"
      @update:page="handlePageChange"
    />
  </section>
</template>
