import pkg from "fast-glob"
const { glob } = pkg
import { join, relative, dirname, basename, extname } from "path"
import type { KitroConfig } from "@kitro/core"

export interface RouteRecord {
  path: string
  file: string
  name: string
  layout?: string // Layout name (defaults to "default")
  ssr?: boolean
  middleware?: string[]
}

export async function buildRoutes(
  pagesDir: string,
  config: KitroConfig
): Promise<RouteRecord[]> {
  const routes: RouteRecord[] = []

  // Find all .tsx and .jsx files in pages directory
  const files = glob.sync(["**/*.{tsx,jsx}"], {
    cwd: pagesDir,
    absolute: false,
  })

  for (const file of files) {
    const fullPath = join(pagesDir, file)
    const relativePath = relative(pagesDir, fullPath)
    const route = await fileToRoute(relativePath, fullPath, config)
    if (route) {
      routes.push(route)
    }
  }

  // Sort routes: static first, then dynamic, then catch-all
  return routes.sort((a, b) => {
    const aDynamic = a.path.includes("[") || a.path.includes("]")
    const bDynamic = b.path.includes("[") || b.path.includes("]")
    if (aDynamic && !bDynamic) return 1
    if (!aDynamic && bDynamic) return -1
    return a.path.localeCompare(b.path)
  })
}

async function fileToRoute(
  filePath: string,
  fullPath: string,
  config: KitroConfig
): Promise<RouteRecord | null> {
  // Remove extension
  let path = filePath.replace(/\.(tsx|jsx)$/, "")

  // Handle index files
  if (path === "index" || basename(path) === "index") {
    path = dirname(path) === "." ? "/" : dirname(path)
  } else {
    path = "/" + path
  }

  // Convert [slug] to :slug
  path = path.replace(/\[([^\]]+)\]/g, ":$1")

  // Handle catch-all [...all]
  path = path.replace(/\[\.\.\.([^\]]+)\]/g, "*")

  // Normalize path
  if (path === "/index") path = "/"
  if (path.endsWith("/index")) path = path.slice(0, -6) || "/"

  const name = path === "/" ? "index" : path.slice(1).replace(/\//g, "-").replace(/:/g, "")

  // Try to read layout from page file
  let layout: string | undefined = "default"
  try {
    const pageModule = await import(fullPath)
    if (pageModule.layout) {
      layout = pageModule.layout
    }
  } catch (error) {
    // If import fails, use default
  }

  return {
    path,
    file: fullPath,
    name,
    layout,
    ssr: config.ssr,
  }
}

