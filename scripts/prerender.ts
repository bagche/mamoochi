import fs from "fs";
import path from "path";

/**
 * Generates routes by scanning all locales under the "content" folder.
 */
export const generateRoutes = (): string[] => {
  const contentDir = path.join(process.cwd(), "content");
  // Get locale folders (e.g. "en", "fa")
  const locales = fs
    .readdirSync(contentDir)
    .filter((entry) => fs.statSync(path.join(contentDir, entry)).isDirectory());

  const routes: string[] = [];

  for (const locale of locales) {
    const localeDir = path.join(contentDir, locale);
    // Just scan everything; no excluded folders, no second pass for "items".
    const localeRoutes = scanDirectory(localeDir, localeDir, locale);
    routes.push(...localeRoutes);
  }
  return routes;
};

/**
 * Recursively scans a directory for markdown files and builds routes.
 *
 * @param directory The current directory being scanned
 * @param baseDir   The base directory used to calculate the relative path
 * @param locale    The locale code (from the top-level folder)
 * @returns An array of route paths
 */
const scanDirectory = (
  directory: string,
  baseDir: string,
  locale: string
): string[] => {
  const routes: string[] = [];
  const entries = fs.readdirSync(directory);

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);

    if (fs.statSync(fullPath).isDirectory()) {
      // Recurse
      routes.push(...scanDirectory(fullPath, baseDir, locale));
    } else if (entry.endsWith(".md")) {
      // Calculate subpath
      const relativePath = path.relative(baseDir, fullPath);
      const parts = relativePath.split(path.sep);
      const fileName = parts.pop()!;
      // remove ".md" to get the slug
      const slug = fileName.replace(/\.md$/, "");

      // Start building the route: /{locale}
      let routePath = `/${locale}`;

      // If there are any subfolders, append them:
      if (parts.length > 0) {
        routePath += `/${parts.join("/")}`;
      }

      // If the file isn't index.md, append the slug
      if (slug !== "index") {
        routePath += `/${slug}`;
      }

      // Normalize slashes and remove trailing slash if needed
      routePath = routePath.replace(/\/+/g, "/").replace(/\/$/, "");
      routes.push(routePath);
    }
  }

  return routes;
};
