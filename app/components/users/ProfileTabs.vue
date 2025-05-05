<script setup lang="ts">
const { t } = useI18n();

const items = [
  {
    label: t("Comments"),
    slot: "comments",
  },
];
</script>

<template>
  <UTabs
    :items="items"
    color="neutral"
    variant="link"
    class="w-full"
    :unmount-on-hide="true"
  >
    <template #comments="{ item }">
      <CommentsSelf />
    </template>
  </UTabs>
</template>
