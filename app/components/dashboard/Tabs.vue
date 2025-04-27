<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const { t } = useI18n();

// Tab items
const items = [
  { label: t("Comments"), slot: "comments" as const, key: "comments" },
  { label: t("Users"), slot: "users" as const, key: "users" },
] satisfies TabsItem[];
</script>

<template>
  <div class="w-full min-h-screen flex-col">
    <UContainer>
      <div
        class="max-w-7xl mx-auto flex flex-col items-center pt-10 px-4 gap-7"
      >
        <UTabs
          color="neutral"
          variant="link"
          :items="items"
          class="w-full"
          size="xl"
        >
          <template #comments="{ item }">
            <CommentsManage status="new" />
          </template>
          <template #users="{ item }">
            <UsersManage />
          </template>
        </UTabs>
      </div>
    </UContainer>
  </div>
</template>
