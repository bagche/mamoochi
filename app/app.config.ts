export default defineAppConfig({
  mainMenu: [
    [
      {
        label: "Home",
        // icon: "i-lucide-home",
        to: "/",
      },
      {
        label: "Explorer",
        // icon: "i-lucide-search",
        to: "/explorer",
      },
      {
        label: "About",
        // icon: "i-lucide-info",
        to: "/about",
      },
      {
        label: "Contact",
        // icon: "i-lucide-mail",
        to: "/contact",
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
        label: "Manage",
        slot: "manage",
      },
      {
        label: "avatar",
        slot: "avatar",
      },
    ],
  ],
  dashMenu: [
    [
      {
        label: "Dashboard",
        // type: "label",
        // icon: "i-lucide-book-open",
        to: "/manage",
      },
      {
        label: "Items",
        // icon: "i-lucide-book-open",
        // active: true,
        defaultOpen: true,
        to: "/manage/items",
      },
      {
        label: "Comments",
        // icon: "i-lucide-database",
        to: "/manage/comments",
      },
      {
        label: "Users",
        // icon: "i-lucide-box",
        to: "/manage/users",
        defaultOpen: true,
      },
      {
        label: "Builds",
        // type: "label",
        // icon: "i-lucide-book-open",
        to: "/manage/builds",
      },
      {
        label: "Settings",
        // type: "label",
        // icon: "i-lucide-book-open",
        to: "/manage/settings",
      },
    ],
    [
      {
        label: "Help",
        // icon: "i-lucide-circle-help",
        // disabled: true,
      },
      {
        label: "i18n",
        slot: "i18n",
      },

      {
        label: "theme",
        slot: "theme",
      },
      {
        label: "Manage",
        slot: "manage",
      },
      {
        label: "avatar",
        slot: "avatar",
      },
    ],
  ],
});
