<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

definePageMeta({
  middleware: "permissions",
  permission: "comments.edit",
});

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

// Define valid statuses
type Status = "new" | "published" | "spam";

// Base path for comments routes (without trailing slash)
const BASE_PATH = `/${locale.value}/manage/comments`;

// Tab items
const items = [
  { label: t("New"), slot: "new" as const, key: "new" },
  { label: t("Published"), slot: "published" as const, key: "published" },
  { label: t("Spam"), slot: "spam" as const, key: "spam" },
] satisfies TabsItem[];

// Compute active tab index with getter and setter
const active = computed({
  get: () => {
    const status = route.params.tab?.[0] as string;
    const index = items.findIndex((item) => item.key === status);
    return index >= 0 ? index.toString() : "0";
  },
  set: (newIndex: string) => {
    const status = items[Number(newIndex)].key as Status;
    const newPath = status === "new" ? BASE_PATH : `${BASE_PATH}/${status}`;
    router.push(newPath);
  },
});
</script>

<template>
  <div class="w-full min-h-screen flex-col">
    <UContainer>
      <div
        class="max-w-7xl mx-auto flex flex-col items-center pt-10 px-4 gap-7"
      >
        <div class="flex justify-between w-full">
          <h2 class="text-2xl text-bolder">{{ $t("Manage Comments") }}</h2>
        </div>
        <UTabs
          v-model="active"
          color="neutral"
          variant="link"
          :items="items"
          class="w-full"
        />
        <CommentsManage :status="items[Number(active)].key" />
      </div>
    </UContainer>
  </div>
</template>
