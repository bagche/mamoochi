<script setup lang="ts">
import { computed, ref } from "vue";
const { loggedIn, user, clear } = useUserSession();
const { profile } = useUser();
const { t } = useI18n();

const updateIsOpen = ref(false);
const changePasswordIsOpen = ref(false);
const switchIsOpen = ref(false);
const registerIsOpen = ref(false);

// Account group always shows the avatar
const accountGroup = [
  {
    label: "",
    slot: "account",
    disabled: true,
  },
];

// Items for logged in users
const loggedInItems = [
  {
    label: t("Profile"),
    icon: "i-lucide-user",
    to: `/profile`,
  },
  {
    label: t("Update Profile"),
    icon: "i-lucide-user-pen",
    onSelect: () => {
      updateIsOpen.value = true;
    },
  },
  {
    label: t("Change Password"),
    icon: "i-lucide-key",
    onSelect: () => {
      changePasswordIsOpen.value = true;
    },
  },
];

// Items for guests
const loggedOutItems = [
  {
    label: t("Register"),
    icon: "i-lucide-log-in",
    onSelect: () => {
      registerIsOpen.value = true;
    },
  },
  {
    label: t("Login"),
    icon: "i-lucide-arrow-right-left",
    onSelect: () => {
      switchIsOpen.value = true;
    },
  },
];

// Exit action for logged in users
const exitItem = {
  label: t("Exit"),
  icon: "i-lucide-log-out",
  onSelect: async () => {
    await clear();
    reloadNuxtApp();
  },
};

// Theme group holds the dark mode switch slot
const themeGroup = [
  {
    label: "",
    slot: "theme",
  },
];

const items = computed(() => {
  return loggedIn.value
    ? [accountGroup, loggedInItems, themeGroup, [exitItem]]
    : [accountGroup, loggedOutItems, themeGroup];
});
</script>

<template>
  <div class="relative flex">
    <UChip color="success" size="sm" position="top-left" class="cursor-pointer">
      <UDropdownMenu
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 8,
        }"
      >
        <UAvatar
          :alt="user?.displayName ?? profile.displayName"
          size="xs"
          src="/totoro_render.webp"
          class="avatar-button"
          placeholder
        />

        <!-- Account slot -->
        <template #account="{ item }">
          <UAvatar
            :alt="user?.displayName ?? profile.displayName"
            size="2xs"
            src="/totoro_render.webp"
            class="avatar-button"
            placeholder
          />
          <p class="text-sm">{{ user?.displayName ?? profile.displayName }}</p>
        </template>

        <!-- Theme slot with DarkMode switch -->
        <template #theme="{ item }">
          <DarkMode />
        </template>
      </UDropdownMenu>
    </UChip>
    <UsersRegister v-model:is-open="registerIsOpen" />
    <UsersSwitch v-model:is-open="switchIsOpen" />
  </div>
</template>

<style lang="scss">
.avatar-button img {
  width: auto !important;
}
</style>
