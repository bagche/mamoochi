import fs from "fs";
import path from "path";

/**
 * Generates routes for Nuxt Content full-static prerendering.
 * Matches filesystem paths exactly to avoid mismatches.
 */
export const generateRoutes = (): string[] => {
  const contentDir = path.join(process.cwd(), "content");
  const routes = new Set<string>();

  if (!fs.existsSync(contentDir)) {
    console.warn("Content directory not found:", contentDir);
    return ["/"];
  }

  const locales = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const locale of locales) {
    const localeDir = path.join(contentDir, locale);
    const localeRoutes = scanDirectory(localeDir, localeDir, locale);
    localeRoutes.forEach((route) => {
      // Exclude dynamic routes
      if (!route.includes("/profile") && !route.includes("/manage")) {
        routes.add(route);
      }
    });
  }

  // Add root and locale roots
  routes.add("/");
  locales.forEach((locale) => routes.add(`/${locale}`));

  const routeList = Array.from(routes);
  return routeList;
};

/**
 * Recursively scans a directory for markdown files and builds Nuxt Content routes.
 */
const scanDirectory = (
  directory: string,
  baseDir: string,
  locale: string
): string[] => {
  const routes: string[] = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      routes.push(...scanDirectory(fullPath, baseDir, locale));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // Calculate route from relative path
      const relativePath = path.relative(baseDir, fullPath);
      const parts = relativePath.split(path.sep);
      const fileName = parts.pop()!;
      const slug = fileName.replace(/\.md$/, "");

      // Build route: start with locale
      let routePath = `/${locale}`;

      // Append subdirectories
      if (parts.length > 0) {
        routePath += `/${parts.join("/")}`;
      }

      // Only append slug if not index.md
      if (slug !== "index") {
        routePath += `/${slug}`;
      }

      // Normalize path (remove duplicate/trailing slashes)
      routePath = routePath.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
      routes.push(routePath);
    }
  }

  return routes;
};
