<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

definePageMeta({
  middleware: "permissions",
  permission: "users.edit",
});

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const addRoleIsOpen = ref(false);

type Tabs = "users" | "roles";

// Base path for comments routes (without trailing slash)
const BASE_PATH = `/${locale.value}/manage/users`;

// Tab items
const items = [
  { label: t("Users"), slot: "users" as const, key: "users" },
  { label: t("Roles"), slot: "roles" as const, key: "roles" },
] satisfies TabsItem[];

const active = computed({
  get: () => {
    const status = route.params.tab?.[0] as string;
    const index = items.findIndex((item) => item.key === status);
    return index >= 0 ? index.toString() : "0";
  },
  set: (newIndex: string) => {
    const tab = items[Number(newIndex)]?.key as Tabs;
    const newPath = tab === "users" ? BASE_PATH : `${BASE_PATH}/${tab}`;
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
          <h2 class="text-2xl text-bolder">{{ $t("Manage Users") }}</h2>
          <UButtonGroup size="sm">
            <UButton
              color="neutral"
              variant="subtle"
              :label="$t('Add New Role')"
              icon="i-lucide-key"
              @click="addRoleIsOpen = true"
            />
            <UButton
              color="neutral"
              variant="subtle"
              :label="$t('Add New User')"
              icon="i-lucide-user-plus"
            />
          </UButtonGroup>
        </div>
        <UTabs
          v-model="active"
          color="neutral"
          variant="link"
          :items="items"
          class="w-full"
        >
          <template #users="{ item }">
            <UsersManage />
          </template>
          <template #roles="{ item }">
            <UsersRoles />
          </template>
        </UTabs>
      </div>
      <UsersNewRole v-model:is-open="addRoleIsOpen" />
    </UContainer>
  </div>
</template>
