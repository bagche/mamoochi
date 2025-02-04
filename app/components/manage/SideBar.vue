<script setup lang="ts">
const { locale, t } = useI18n();
const appConfig = useAppConfig();
const navDir = computed(() => (locale.value === "fa" ? "rtl" : ""));
const items = computed(() => {
  return appConfig.dashMenu.map((group) =>
    group.map((item: any) => {
      // Translate the item's own label
      const newItem = {
        ...item,
        label: item.label ? t(item.label) : item.label,
      };

      // If the item has children, translate their labels, too
      if (Array.isArray(item.children)) {
        newItem.children = item.children.map((child: any) => ({
          ...child,
          label: child.label ? t(child.label) : child.label,
        }));
      }

      return newItem;
    })
  );
});
</script>

<template>
  <UNavigationMenu
    :ui="{
      root: navDir,
    }"
    orientation="vertical"
    :items="items"
    class="data-[orientation=vertical]:w-60 bg-gray-100 dark:bg-slate-900 dark:border-slate-100 pt-5 px-2 justify-between"
  />
</template>
