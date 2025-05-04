<script setup lang="ts">
const { t, locale } = useI18n();

const items = [
  {
    label: t("Comments"),
    slot: "comments",
  },
  {
    label: t("websocket"),
    slot: "websocket",
    enable: true,
  },
];
</script>

<template>
  <UTabs
    defaultValue="1"
    :items="items"
    color="neutral"
    variant="link"
    class="w-full"
    :unmountOnHide="true"
  >
    <template #comments="{ item }">
      <CommentsSelf />
    </template>
    <template #websocket="{ item }">
      <ClientOnly>
        <UsersWebSocket />
      </ClientOnly>
    </template>
  </UTabs>
</template>
