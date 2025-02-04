<script setup lang="ts">
const { locale, t } = useI18n();
const navDir = computed(() =>
  locale.value === "fa" ? "flex-row-reverse rtl" : "flex-row"
);
const items = computed(() => [
  [
    {
      label: "Home",
      // icon: "i-lucide-home",
      to: "/" + locale.value + "/",
    },
    {
      label: "Explorer",
      // icon: "i-lucide-search",
      to: "/" + locale.value + "/explorer",
    },
    {
      label: "About",
      // icon: "i-lucide-info",
      to: "/" + locale.value + "/about",
    },
    {
      label: "Contact",
      // icon: "i-lucide-mail",
      to: "/" + locale.value + "/contact",
    },
  ],
  [
    {
      label: "i18n",
      slot: "i18n",
    },
    {
      label: "theme",
      slot: "theme",
    },
    {
      // label: "Manage",
      icon: "i-lucide-settings",
      to: "/manage",
    },
    {
      label: "avatar",
      slot: "avatar",
    },
  ],
]);
</script>

<template>
  <UNavigationMenu
    highlight
    highlight-color="primary"
    orientation="horizontal"
    :items="items"
    :ui="{
      root: navDir,
    }"
    class="navbar data-[orientation=horizontal]:w-full items-center text-2xl"
  >
    <template #theme="{ item }"> <DarkMode class="" /> </template>
    <template #i18n="{ item }"> <LanguageSelector class="" /> </template>
    <template #avatar="{ item }"> <AvatarMenu class="" /> </template>
  </UNavigationMenu>
</template>
<style>
.rtl * {
  direction: rtl;
}
</style>
