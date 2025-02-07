<script setup lang="ts">
const updateIsOpen = ref(false);
const changePasswordIsOpen = ref(false);
const { loggedIn, user, clear } = useUserSession();

const { locale, t } = useI18n();
// const loginIsOpen = ref(false);

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

// const items = computed(() => [
//   [
//     {
//       label: t("Dashboard"),
//       icon: "i-heroicons-user",
//       to: `/${locale.value}/user`,
//     },
//   ],
//   [
//     {
//       label: "تغییر حساب",
//       icon: "i-heroicons-arrow-left-on-rectangle",
//       click: () => {
//         loginIsOpen.value = true;
//       },
//     },
//     {
//       label: t("Update user"),
//       icon: "i-heroicons-user",
//       click: () => {
//         updateIsOpen.value = true;
//       },
//     },
//     {
//       label: t("Change Password"),
//       icon: "i-heroicons-key",
//       click: () => {
//         changePasswordIsOpen.value = true;
//       },
//     },
//   ],
// ]);
</script>

<template>
  <div class="relative flex">
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8,
      }"
      class="rtl"
    >
      <UButton icon="i-lucide-settings" variant="ghost" size="xs" />
    </UDropdownMenu>
  </div>
</template>
