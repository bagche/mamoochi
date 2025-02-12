<script setup lang="ts">
const { t } = useI18n();

// const appConfig = useAppConfig();
// const items = computed(() => {
//   return appConfig.dashMenu.map((group) =>
//     group.map((item: any) => {
//       // Translate the item's own label
//       const newItem = {
//         ...item,
//         label: item.label ? t(item.label) : item.label,
//       };

//       // If the item has children, translate their labels, too
//       if (Array.isArray(item.children)) {
//         newItem.children = item.children.map((child: any) => ({
//           ...child,
//           label: child.label ? t(child.label) : child.label,
//         }));
//       }

//       return newItem;
//     })
//   );
// });
</script>

<template>
  <div class="relative flex">
    <UButton icon="i-lucide-settings" variant="ghost" size="xs" to="/manage" />
    <!-- <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8,
      }"
      class="rtl"
    >
      <UButton icon="i-lucide-settings" variant="ghost" size="xs" />
    </UDropdownMenu> -->
  </div>
</template>
