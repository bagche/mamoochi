<script setup lang="ts">
// Reference to the comments list component
const commentsListRef = ref<InstanceType<typeof CommentsLists> | null>(null);

// Handle the event emitted from CommentsCreateForm and trigger refresh in CommentsLists.
const handleCommentPosted = () => {
  commentsListRef.value?.refreshComments();
};
</script>

<template>
  <section class="w-full">
    <div class="flex justify-between items-center my-5">
      <h2 class="text-3xl font-semibold">{{ $t("Comments") }}</h2>
    </div>
    <!-- Emit "commentPosted" event from the create form -->
    <CommentsCreateForm @comment-posted="handleCommentPosted" />
    <!-- Bind ref to allow refresh from parent -->
    <CommentsLists ref="commentsListRef" />
  </section>
</template>

<style lang="scss" scoped>
h3 {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
