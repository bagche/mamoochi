<script setup lang="ts">
const { t, locale } = useI18n();

const items = [
  {
    label: t("Comments"),
    slot: "comments",
  },
];
</script>

<template>
  <UTabs :items="items" color="neutral" variant="link" class="w-full">
    <template #comments="{ item }">
      <CommentsSelf />
    </template>
  </UTabs>
</template>
