<script setup lang="ts">
const items = ref([
  [
    {
      label: "Home",
      icon: "i-lucide-home",
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
    class="data-[orientation=horizontal]:border-b border-[var(--ui-border)] data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48 items-center"
  >
    <template #theme="{ item }"> <DarkMode class="" /> </template>
    <template #avatar="{ item }"> <AvatarMenu class="" /> </template>
  </UNavigationMenu>
</template>
