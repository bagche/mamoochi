import type { RouterConfig } from "@nuxt/schema";

export default {
  routes: (_routes) => [
    ..._routes,
    {
      name: "editor",
      path: "/manage/editor/:pathMatch(.*)*",
      component: () => import("~/pages/manage/editor"),
      props: (route) => {
        // Define the prefix we want to remove.
        const prefix = "/manage/editor";
        // Use fullPath so that even if pathMatch is undefined we still get something.
        let pagePath = route.fullPath.slice(prefix.length);
        // Ensure pagePath always starts with a "/".
        if (!pagePath.startsWith("/")) {
          pagePath = "/" + pagePath;
        }
        // If nothing remains, default to "/".
        return { pagePath: pagePath === "/" ? "/" : pagePath };
      },
    },
  ],
} satisfies RouterConfig;
