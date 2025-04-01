<script setup lang="ts">
const { locale, t } = useI18n();
const appConfig = useAppConfig();
const { loggedIn } = useUserSession();
const route = useRoute();

const items = computed(() => {
  if (route.path.includes("manage") && loggedIn.value) {
    // When the route starts with /manage and user is logged in,
    // load the dashboard menu (dashMenu) and translate labels.
    return appConfig.dashMenu.map((item: any) => {
      const newItem = {
        ...item,
        label: item.label ? t(item.label) : item.label,
        to: item.to ? `/${locale.value}${item.to}` : undefined,
      };
      if (Array.isArray(item.children)) {
        newItem.children = item.children.map((child: any) => ({
          ...child,
          label: child.label ? t(child.label) : child.label,
          to: item.to ? `/${locale.value}${item.to}` : undefined,
        }));
      }
      return newItem;
    });
  } else {
    // Otherwise, use the default mainMenu and filter out "Manage" if not logged in.
    return appConfig.mainMenu.map((item: any) => ({
      ...item,
      label: item.label ? t(item.label as string) : item.label,
      to: item.to ? `/${locale.value}${item.to}` : undefined,
    }));
  }
});
</script>

<template>
  <UNavigationMenu
    highlight
    highlight-color="primary"
    orientation="horizontal"
    :items="items"
    class="navbar data-[orientation=horizontal]:w-full flex"
  />
</template>
