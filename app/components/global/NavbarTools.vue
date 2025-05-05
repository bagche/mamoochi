<script setup lang="ts">
const { loggedIn, clear } = useUserSession();
const { profile, logout } = useUser();
const { t, locale } = useI18n();
const route = useRoute();

// Account group always shows the avatar
const accountGroup = [
  {
    label: "",
    slot: "account",
  },
];

// Items for logged in users
const loggedInItems = [
  {
    label: t("Profile"),
    icon: "i-lucide-user",
    to: `/${locale.value}/profile`,
  },
];

// Items for guests
const loggedOutItems = [
  {
    label: t("Login"),
    icon: "i-lucide-arrow-right-left",
    to: `/${locale.value}/login`,
  },
  {
    label: t("Register"),
    icon: "i-lucide-log-in",
    to: `/${locale.value}/register`,
  },
];

// Exit action for logged in users
const exitItem = {
  label: t("Exit"),
  icon: "i-lucide-log-out",
  onSelect: async () => {
    await clear();
    logout();
    window.location.replace("/");
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
          v-if="!route.path.includes('manage')"
          :to="'/' + locale + '/manage/editor' + route.path"
          size="xs"
          icon="i-lucide-square-pen"
          variant="ghost"
        />
        <UButton
          :to="'/' + locale + '/manage/editor' + route.path"
          size="xs"
          icon="i-lucide-pen-line"
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
      <UDropdownMenu :items="items">
        <UButton variant="ghost" icon="i-lucide-user" size="xs" />
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
  </div>
</template>
