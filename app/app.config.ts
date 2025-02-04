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
        // label: "Manage",
        icon: "i-lucide-settings",
        to: "/manage",
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
        type: "label",
      },
      {
        label: "Posts",
        icon: "i-lucide-book-open",
        active: true,
        defaultOpen: true,
        children: [
          {
            label: "All Posts",
            icon: "i-lucide-file-text",
            description: "Use NuxtLink with superpowers.",
            // to: "/components/link",
          },
          {
            label: "Category",
            icon: "i-lucide-file-text",
            description: "Display a modal within your application.",
            // to: "/components/modal",
          },
        ],
      },
      {
        label: "Comments",
        icon: "i-lucide-database",
      },
      {
        label: "Users",
        icon: "i-lucide-box",
        // to: "/components",
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
