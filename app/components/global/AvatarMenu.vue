<script setup lang="ts">
const updateIsOpen = ref(false);
const changePasswordIsOpen = ref(false);
const { loggedIn, user, clear } = useUserSession();

const { locale, t } = useI18n();
const loginIsOpen = ref(false);

const items = computed(() => [
  [
    {
      label: "",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "پروفایل",
      icon: "i-heroicons-user",
      to: `/${locale.value}/user`,
    },
  ],
  [
    {
      label: "تغییر حساب",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => {
        loginIsOpen.value = true;
      },
    },
    {
      label: t("Update user"),
      icon: "i-heroicons-user",
      click: () => {
        updateIsOpen.value = true;
      },
    },
    {
      label: t("Change Password"),
      icon: "i-heroicons-key",
      click: () => {
        changePasswordIsOpen.value = true;
      },
    },
  ],
  [
    {
      label: t("Exit"),
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        // await $wipeDexie();
        await clear();
        window.location.reload();
      },
    },
  ],
]);
</script>

<template>
  <div class="relative flex">
    <UChip
      :text="locale == 'fa' ? convertToPersianNumbers(0) : 0"
      size="2xl"
      position="top-left"
      class="cursor-pointer"
    >
      <UDropdownMenu
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 8,
        }"
        class=""
      >
        <UAvatar
          :alt="user?.displayName"
          src="/totoro_render.webp"
          size="xs"
          class="avatar-button"
        />

        <template #account="{ item }">
          <UAvatar
            :alt="user?.displayName"
            src="/totoro_render.webp"
            size="sm"
            class="avatar-button"
          />
          <p class="text-right w-full flex gap-2 justify-between">
            <span class="font-bold text-gray-900 dark:text-white">
              {{ user?.displayName }}
            </span>
          </p>
        </template>

        <template #item="{ item }: any">
          <div
            v-if="item.click"
            class="flex w-full cursor-pointer"
            @click="item.click"
          >
            <span class="truncate">{{ item.label }}</span>
            <UIcon
              :name="item.icon"
              class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
            />
          </div>
          <NuxtLink v-else-if="item.to" :to="item.to" class="flex w-full">
            <span class="truncate">{{ item.label }}</span>
            <UIcon
              :name="item.icon"
              class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
            />
          </NuxtLink>
          <div v-else class="flex w-full cursor-default">
            <span class="truncate">{{ item.label }}</span>
            <UIcon
              :name="item.icon"
              class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
            />
          </div>
        </template>
      </UDropdownMenu>
    </UChip>
    <!-- <MemberSwitch v-model:is-open="loginIsOpen" /> -->
    <!-- <UpdateMember v-model:is-open="updateIsOpen" />   -->
    <!-- <ChangePassword v-model:is-open="changePasswordIsOpen" />   -->
  </div>
</template>
<style lang="scss">
.avatar-button img {
  width: auto !important;
}
</style>
