<script setup lang="ts">
const { locale, t } = useI18n();
const appConfig = useAppConfig();

const navDir = computed(() =>
  locale.value === "fa" ? "flex-row-reverse rtl" : "flex-row"
);
const items = computed(() => {
  return appConfig.mainMenu.map((group) =>
    group.map((item) => ({
      ...item,
      label: item.label ? t(item.label as string) : item.label,
      to: item.to ? `/${locale.value}${item.to}` : undefined, // Prefix the locale
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
