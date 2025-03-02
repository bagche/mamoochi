<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
const { profile } = useUser();

const updateIsOpen = ref(false);
const changePasswordIsOpen = ref(false);
const { locale, t } = useI18n();
const switchIsOpen = ref(false);
const registerIsOpen = ref(false);

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
  ],
  [
    {
      label: t("Register"),
      icon: "i-lucide-log-in",
      onSelect: () => {
        console.log("register");
        registerIsOpen.value = true;
      },
    },
    {
      label: t("Switch Profile"),
      icon: "i-lucide-arrow-right-left",
      onSelect: () => {
        switchIsOpen.value = true;
      },
    },
  ],
  [
    {
      label: t("Exit"),
      icon: "i-lucide-log-out",
      onSelect: async () => {
        // await $wipeDexie();
        await clear();
        reloadNuxtApp();
      },
    },
  ],
]);
// console.log(user)
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
          :alt="user?.displayName ?? profile.displayName"
          size="xs"
          src="/totoro_render.webp"
          class="avatar-button"
          placeholder
        />

        <template #account="{ item }">
          <p class="text- w-full font-normal">
            {{ user?.displayName ?? profile.displayName }}
          </p>
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
