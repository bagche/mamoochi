<script setup lang="ts">
const { locale, t } = useI18n();
const appConfig = useAppConfig();
const { loggedIn } = useUserSession();
const route = useRoute();

const items = computed(() => {
  if (route.path.startsWith("/manage") && loggedIn.value) {
    // When the route starts with /manage and user is logged in,
    // load the dashboard menu (dashMenu) and translate labels.
    return appConfig.dashMenu.map((group) =>
      group.map((item: any) => {
        const newItem = {
          ...item,
          label: item.label ? t(item.label) : item.label,
        };
        if (Array.isArray(item.children)) {
          newItem.children = item.children.map((child: any) => ({
            ...child,
            label: child.label ? t(child.label) : child.label,
          }));
        }
        return newItem;
      })
    );
  } else {
    // Otherwise, use the default mainMenu and filter out "Manage" if not logged in.
    return appConfig.mainMenu.map((group) =>
      group
        .filter((item) => {
          if (item.label === "Manage" && !loggedIn?.value) {
            return false;
          }
          return true;
        })
        .map((item: any) => ({
          ...item,
          label: item.label ? t(item.label as string) : item.label,
          to: item.to ? `/${locale.value}${item.to}` : undefined,
        }))
    );
  }
});
</script>

<template>
  <UNavigationMenu
    highlight
    highlight-color="primary"
    orientation="horizontal"
    :items="items"
    class="data-[orientation=horizontal]:w-full"
  >
    <template #theme="{ item }">
      <DarkMode class="" />
    </template>
    <template #i18n="{ item }">
      <LanguageSelector class="" />
    </template>
    <template #avatar="{ item }">
      <UsersAvatarMenu class="" />
    </template>
    <template #manage="{ item }">
      <Bouncer :ability="readDashboard">
        <template #can>
          <AdminButton class="" />
        </template>

        <template #cannot>
          <div class="-my-10" />
        </template>
      </Bouncer>
    </template>
  </UNavigationMenu>
</template>
