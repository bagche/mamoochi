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
        icon: "i-lucide-book-open",
        to: "/manage",
      },
      {
        label: "Items",
        icon: "i-lucide-book-open",
        // active: true,
        defaultOpen: true,
        // to: "/manage/items",
        children: [
          {
            label: "All",
            icon: "i-lucide-file-text",
            description: "Use NuxtLink with superpowers.",
            to: "/manage/items",
          },
          {
            label: "Category",
            icon: "i-lucide-file-text",
            description: "Display a modal within your application.",
            to: "/manage/items/category",
            // to: "/components/modal",
          },
          {
            label: "Comments",
            icon: "i-lucide-database",
            to: "/manage/items/comments",
          },
        ],
      },

      {
        label: "Users",
        icon: "i-lucide-box",
        to: "/users",
        defaultOpen: true,
        children: [
          {
            label: "All",
            icon: "i-lucide-file-text",
            description: "Use NuxtLink with superpowers.",
            to: "/manage/users",
          },
          {
            label: "Roles",
            icon: "i-lucide-file-text",
            description: "Display a modal within your application.",
            to: "/manage/users/roles",
          },
        ],
      },
      {
        label: "Settings",
        // type: "label",
        icon: "i-lucide-book-open",
        to: "/manage/settings",
      },
    ],
    [
      {
        label: "GitHub",
        icon: "i-simple-icons-github",
        badge: "3.8k",
        to: "https://github.com/bagche/Mamoochi",
        target: "_blank",
      },
      {
        label: "Help",
        icon: "i-lucide-circle-help",
        // disabled: true,
      },
    ],
  ],
});
