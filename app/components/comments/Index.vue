<script setup lang="ts"></script>

<template>
  <section class="w-full mt-10">
    <div class="flex justify-between items-center my-5">
      <h2 class="text-3xl font-semibold">{{ $t("Comments") }}</h2>
      <!-- <div>
        <SocialStreamFilters />
      </div> -->
    </div>
    <CommentsCreateForm />
    <!-- <CommentsLists /> -->
  </section>
</template>

<style lang="scss" scoped>
h3 {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
