<script setup lang="ts">
const { locale, t } = useI18n();
const navDir = computed(() =>
  locale.value === "fa" ? "flex-row-reverse rtl" : "flex-row"
);
const items = ref([
  [
    {
      label: "Home",
      icon: "i-lucide-home",
      to: "/",
    },
    {
      label: "Explorer",
      icon: "i-lucide-search",
    },
    {
      label: "About",
      icon: "i-lucide-info",
    },
    {
      label: "Contact",
      icon: "i-lucide-mail",
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
    class="navbar data-[orientation=horizontal]:border-b border-[var(--ui-border)] data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48 items-center"
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
