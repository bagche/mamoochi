import type { RouterConfig } from "@nuxt/schema";

export default {
  // routes: (_routes) => [
  //   ..._routes,
  //   {
  //     name: "editor",
  //     path: "/manage/editor/:pathMatch(.*)*",
  //     component: () => import("~/pages/manage/editor"),
  //     props: (route) => {
  //       // Define the prefix we want to remove.
  //       const prefix = "/manage/editor";
  //       // Use fullPath so that even if pathMatch is undefined we still get something.
  //       let pagePath = route.fullPath.slice(prefix.length);
  //       // Ensure pagePath always starts with a "/".
  //       if (!pagePath.startsWith("/")) {
  //         pagePath = "/" + pagePath;
  //       }
  //       // If nothing remains, default to "/".
  //       return { pagePath };
  //     },
  //   },
  // ],
  scrollBehavior(to, from, savedPosition) {
    if (to && to.hash) {
      return {
        el: to.hash,
        top: 81, // Add here the padding or margin top that you want
        behavior: "smooth",
      };
    } else {
      return { top: 0, left: 0, behavior: "smooth" };
    }
  },
} satisfies RouterConfig;
