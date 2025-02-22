import fs from "fs";
import path from "path";

export const generateRoutes = (): string[] => {
  const contentDir = path.join(process.cwd(), "content");
  // Get locale folders (e.g. "en", "fa")
  const locales = fs
    .readdirSync(contentDir)
    .filter((entry) => fs.statSync(path.join(contentDir, entry)).isDirectory());

  const routes: string[] = [];

  // Process each locale folder
  for (const locale of locales) {
    const localeDir = path.join(contentDir, locale);
    // Scan pages: all markdown files except in the "items" subfolder
    const pagesRoutes = scanDirectory(localeDir, localeDir, "", locale, [
      "items",
    ]);
    routes.push(...pagesRoutes);

    // Scan items: if an "items" folder exists, add a route prefix for items.
    const itemsDir = path.join(localeDir, "items");
    if (fs.existsSync(itemsDir) && fs.statSync(itemsDir).isDirectory()) {
      const itemsRoutes = scanDirectory(itemsDir, itemsDir, "item", locale);
      routes.push(...itemsRoutes);
    }
  }

  return routes;
};

/**
 * Recursively scans a directory for markdown files and builds routes.
 *
 * @param directory The current directory being scanned.
 * @param baseDir The base directory used to calculate the relative path.
 * @param routePrefix An optional prefix to add (for items).
 * @param locale The locale code (from the top-level folder).
 * @param excludeDirs An optional array of subdirectory names to skip.
 * @returns An array of routes.
 */
const scanDirectory = (
  directory: string,
  baseDir: string,
  routePrefix: string,
  locale: string,
  excludeDirs: string[] = []
): string[] => {
  const routes: string[] = [];
  const entries = fs.readdirSync(directory);
  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      if (excludeDirs.includes(entry)) {
        continue;
      }
      routes.push(
        ...scanDirectory(fullPath, baseDir, routePrefix, locale, excludeDirs)
      );
    } else if (entry.endsWith(".md")) {
      // Calculate the relative path to determine any subdirectories.
      const relativePath = path.relative(baseDir, fullPath);
      const parts = relativePath.split(path.sep);
      const fileName = parts.pop()!;
      // Remove the '.md' extension; files are expected to be named simply as slug.md.
      const slug = fileName.replace(/\.md$/, "");
      // Build the route starting with the locale.
      let routePath = `/${locale}`;
      if (routePrefix) {
        routePath += `/${routePrefix}`;
      }
      if (parts.length) {
        routePath += `/${parts.join("/")}`;
      }
      // Only add the slug if it is not 'index'
      if (slug !== "index") {
        routePath += `/${slug}`;
      }
      // Normalize: remove duplicate slashes and any trailing slash (unless it is the root).
      routePath = routePath.replace(/\/+/g, "/").replace(/\/$/, "");
      routes.push(routePath);
    }
  }
  return routes;
};
