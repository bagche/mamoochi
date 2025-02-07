import fs from 'fs'
import path from 'path'

export const generateRoutes = (): string[] => {
  const pagesDir = path.join(process.cwd(),'content', 'pages')
  const itemsDir = path.join(process.cwd(),'content', 'items')

  const pagesRoutes = scanDirectory(pagesDir, pagesDir, '')
  const itemsRoutes = scanDirectory(itemsDir, itemsDir, 'item')

  return [...pagesRoutes, ...itemsRoutes]
}

const scanDirectory = (
  directory: string,
  baseDir: string,
  routePrefix: string
): string[] => {
  const routes: string[] = []
  const entries = fs.readdirSync(directory)
  for (const entry of entries) {
    const fullPath = path.join(directory, entry)
    if (fs.statSync(fullPath).isDirectory()) {
      routes.push(...scanDirectory(fullPath, baseDir, routePrefix))
    } else if (entry.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath)
      const parts = relativePath.split(path.sep)
      const fileName = parts.pop()
      // Expecting filenames in the format: slug.locale.md
      const match = fileName?.match(/^(.*)\.([^.]+)\.md$/)
      if (match) {
        const slug = match[1]
        const locale = match[2]
        let routePath = `/${locale}`

        if (routePrefix) {
          routePath += `/${routePrefix}`
        }
        if (parts.length) {
          routePath += `/${parts.join('/')}`
        }
        if (slug !== 'index') {
          routePath += `/${slug}`
        }
        routePath = routePath.replace(/\/+/g, '/')
        routes.push(routePath)
      }
    }
  }
  return routes
}
