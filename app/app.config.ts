export default defineAppConfig({
  installed: true,
  ui: {
    colors: {
      primary: "zinc",
    },
  },
  mainMenu: [
    {
      label: "Home",
      // icon: "i-lucide-home",
      to: "/",
    },
    {
      label: "logs",
      // icon: "i-lucide-search",
      to: "/logs",
    },
    {
      label: "About",
      // icon: "i-lucide-info",
      to: "/about",
    },
  ],
  dashMenu: [
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
      // defaultOpen: true,
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
      // defaultOpen: true,
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
  app: {
    site_name_fa: "مَموچی",
    title_fa: "مَـ موچیــ",
    description_fa: "کوچولو و بازیگوش",
    site_name_en: "Mamoochi",
    title_en: "Ma moochi",
    description_en: "Tiny & Playful",
    footer_fa: "همه چیز به شکل شگفت انگیزی خوب باید باشد",
    footer_en: "Everything must be wonderful in every shape and form ",
  },
  cats: ["books", "notes", "projects"],
});
