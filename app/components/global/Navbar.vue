<script setup lang="ts">
const { locale, t } = useI18n();
const appConfig = useAppConfig();
const { loggedIn } = useUserSession();

const navDir = computed(() =>
  locale.value === "fa" ? "flex-row-reverse rtl" : "flex-row"
);
const items = computed(() => {
  return appConfig.mainMenu.map((group) =>
    group
      .filter((item) => {
        // Hide "Manage" if user is not logged in
        if (item.label === "Manage" && !loggedIn?.value) {
          return false;
        }
        return true;
        console.log(loggedIn.value);
      })
      .map((item) => ({
        ...item,
        label: item.label ? t(item.label as string) : item.label,
        to: item.to ? `/${locale.value}${item.to}` : undefined,
      }))
  );
});
</script>

<template>
  <UNavigationMenu
    highlight
    highlight-color="primary"
    orientation="horizontal"
    :items="items"
    :ui="{
      root: navDir,
      label: 'text-3xl',
    }"
    class="navbar data-[orientation=horizontal]:w-full"
  >
    <template #theme="{ item }">
      <ClientOnly>
        <DarkMode class="" />
      </ClientOnly>
    </template>
    <template #i18n="{ item }">
      <ClientOnly>
        <LanguageSelector class="" />
      </ClientOnly>
    </template>
    <template #avatar="{ item }"> <UsersAvatarMenu class="" /> </template>
    <template v-if="loggedIn" #manage="{ item }">
      <ManageNavMenu class="" />
    </template>
  </UNavigationMenu>
</template>
<style>
.rtl * {
  direction: rtl;
}
</style>
