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
});
