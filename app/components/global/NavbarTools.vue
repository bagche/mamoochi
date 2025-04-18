<script setup lang="ts">
const { loggedIn, clear, user } = useUserSession();
const { profile, logout } = useUser();
const { t, locale, setLocale } = useI18n();
const route = useRoute();

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
    label: t("Login"),
    icon: "i-lucide-arrow-right-left",
    onSelect: () => {
      loginIsOpen.value = true;
    },
  },
  {
    label: t("Register"),
    icon: "i-lucide-log-in",
    onSelect: () => {
      registerIsOpen.value = true;
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

const items = computed(() => {
  return loggedIn.value
    ? [accountGroup, loggedInItems, [exitItem]]
    : [accountGroup, loggedOutItems];
});
</script>

<template>
  <div class="relative flex">
    <UButtonGroup class="gap-3" color="success">
      <Can :ability="createCommit">
        <UButton
          :to="'/' + locale + '/manage/editor' + route.path"
          size="xs"
          icon="i-lucide-square-pen"
          variant="ghost"
        />
      </Can>
      <Can :ability="readDashboard">
        <UButton
          v-if="route.path.includes('manage')"
          icon="i-lucide-home"
          variant="ghost"
          size="xs"
          :to="'/' + locale + '/'"
        />
        <UButton
          v-else
          icon="i-lucide-settings"
          variant="ghost"
          size="xs"
          :to="'/' + locale + '/manage'"
        />
      </Can>
      <UDropdownMenu
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 8,
        }"
      >
        <UAvatar
          class="bg-transparent cursor-pointer -mx-2"
          icon="i-lucide-user"
          placeholder
          provider="cloudflare"
          :modifiers="{ fit: 'contain' }"
          :src="profile.avatar"
          preload
          loading="lazy"
        />
        <!-- Account slot -->
        <template #account="{ item }">
          <NuxtLinkLocale class="-mx-1 gap-2 flex items-center" to="profile">
            <UAvatar
              icon="i-lucide-user"
              placeholder
              provider="cloudflare"
              :modifiers="{ fit: 'contain' }"
              :src="profile.avatar"
              preload
              loading="lazy"
            />
            <span>{{ profile.displayName }}</span>
          </NuxtLinkLocale>
        </template>
      </UDropdownMenu>
    </UButtonGroup>
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
      :open="changePasswordIsOpen"
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
