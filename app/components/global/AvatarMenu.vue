<script setup lang="ts">
const { loggedIn, clear, user } = useUserSession();
const { profile, logout } = useUser();
const { t } = useI18n();

const updateProfileIsOpen = ref(false);
const changePasswordIsOpen = ref(false);
const loginIsOpen = ref(false);
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
    to: `profile`,
  },
  {
    label: t("Update Profile"),
    icon: "i-lucide-user-pen",
    onSelect: () => {
      updateProfileIsOpen.value = true;
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
      loginIsOpen.value = true;
    },
  },
];

// Exit action for logged in users
const exitItem = {
  label: t("Exit"),
  icon: "i-lucide-log-out",
  onSelect: async () => {
    await clear();
    logout();
    reloadNuxtApp();
    window.location.reload();
  },
};

// Theme group holds the dark mode login slot
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
          :alt="profile.displayName"
          size="xs"
          src="/mamoochi-tiny.webp"
          class="avatar-button"
          placeholder
          provider="cloudflare"
          :modifiers="{ fit: 'contain' }"
          preload
          loading="lazy"
        />
        <!-- Account slot -->
        <template #account="{ item }">
          <UAvatar
            :alt="profile.displayName"
            size="2xs"
            src="/mamoochi-tiny.webp"
            class="avatar-button"
            placeholder
            provider="cloudflare"
            :modifiers="{ fit: 'contain' }"
            preload
            loading="lazy"
          />
          <p class="text-sm">{{ profile.displayName }}</p>
        </template>

        <!-- Theme slot with DarkMode login -->
        <template #theme="{ item }">
          <DarkMode />
        </template>
      </UDropdownMenu>
    </UChip>
    <UModal
      v-model:open="registerIsOpen"
      :dismissible="false"
      :title="$t('Register User')"
    >
      <template #body>
        <AuthRegisterForm @close-modal="registerIsOpen = false" />
      </template>
    </UModal>
    <UModal
      v-model:open="loginIsOpen"
      :dismissible="false"
      :title="$t('Login User')"
    >
      <template #body>
        <AuthLoginForm @close-modal="loginIsOpen = false" />
      </template>
    </UModal>
    <UModal
      v-model:open="changePasswordIsOpen"
      :dismissible="false"
      :title="$t('Change Password')"
    >
      <template #body>
        <AuthChangePasswordForm @close-modal="changePasswordIsOpen = false" />
      </template>
    </UModal>
    <UModal
      v-model:open="updateProfileIsOpen"
      :dismissible="false"
      :title="$t('Update Profile')"
    >
      <template #body>
        <AuthUpdateProfileForm @close-modal="updateProfileIsOpen = false" />
      </template>
    </UModal>
  </div>
</template>

<style lang="scss">
.avatar-button img {
  width: auto !important;
}
</style>
