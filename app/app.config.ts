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
      to: "/",
    },
    {
      label: "logs",
      to: "/logs",
    },
    {
      label: "About",
      to: "/about",
    },
  ],
  dashMenu: [
    {
      label: "Dashboard",
      to: "/manage",
    },
    {
      label: "Pages",
      to: "/manage/pages",
    },
    {
      label: "Comments",
      to: "/manage/comments",
    },
    {
      label: "Newsletter",
      to: "/manage/newsletter",
    },
    {
      label: "Users",
      to: "/manage/users",
    },
    {
      label: "Builds",
      to: "/manage/builds",
    },
    {
      label: "Settings",
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
    default_banner: "/content/gnu.webp",
  },
  cats: ["books", "notes", "projects"],
});
