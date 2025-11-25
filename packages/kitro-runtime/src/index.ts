import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { loadKitroConfig, KitroApp } from "@kitro/core"
import { buildRoutes } from "@kitro/router"
import { ReactRenderer } from "@kitro/renderer"
import { loadModules } from "@kitro/modules"
import { createAIProvider } from "@kitro/ai"
import { join } from "path"
import { cwd } from "process"

// Export rate limiting
export { rateLimit } from "./rateLimit.js"
export type { RateLimitOptions } from "./rateLimit.js"

// Export module system
export {
  ModuleManager,
  type KitroModule,
  type KitroAdminPage,
  type KitroMobileCapability,
  type KitroRouteRegistration,
  type KitroBlockRegistration,
  type ModuleManagerOptions,
} from "./modules.js"

// Export version info
export { KITRO_VERSION, KITRO_SIGNATURE } from "./version.js"

export interface KitroServerOptions {
  rootDir: string
  port?: number
  host?: string
  dev?: boolean
}

export async function startKitroServer(opts: KitroServerOptions): Promise<void> {
  const { rootDir, port = 3000, host = "localhost", dev = false } = opts

  console.log(`🚀 Starting Kitro server...`)
  console.log(`   Root: ${rootDir}`)
  console.log(`   Mode: ${dev ? "development" : "production"}\n`)

  // Load config
  const config = await loadKitroConfig(rootDir)

  // Create app
  const app = new KitroApp(config)

  // Setup router
  const pagesDir = join(rootDir, "src", "pages")
  const routes = await buildRoutes(pagesDir, config)
  app.router = { routes }

  // Setup renderer
  app.renderer = new ReactRenderer()

  // Load modules
  await loadModules(app, rootDir)

  // Setup AI provider
  if (config.ai.enabled) {
    app.aiProvider = createAIProvider(config.ai)
  }

  // Initialize app
  await app.init()

  // Create Hono app
  const server = new Hono()

  // Register module API routes
  const registeredPaths = new Set<string>()
  for (const module of app.modules) {
    if ((module as any).api) {
      const api = (module as any).api
      for (const [method, handlers] of Object.entries(api)) {
        if (typeof handlers === "object" && handlers !== null) {
          for (const [path, handler] of Object.entries(handlers)) {
            const routeKey = `${method}:${path}`
            if (registeredPaths.has(routeKey)) {
              console.warn(`⚠️  Duplicate API route: ${method.toUpperCase()} ${path}`)
            }
            registeredPaths.add(routeKey)

            const routeMethod = method.toLowerCase() as "get" | "post" | "put" | "delete"
            if (server[routeMethod]) {
              server[routeMethod](path, async (c) => {
                try {
                  const ctx = {
                    req: c.req.raw,
                    json: (data: any) => c.json(data),
                  }
                  const result = await (handler as any)(ctx)
                  // If handler returns something, use it
                  if (result !== undefined) {
                    return c.json(result)
                  }
                } catch (error) {
                  return c.json({ error: String(error) }, 500)
                }
              })
              console.log(`   API: ${method.toUpperCase()} ${path}`)
            }
          }
        }
      }
    }
  }

  // Kitro Studio API routes
  server.get("/__kitro/page/:path*", async (c) => {
    const path = c.req.param("path") || "/"
    const pagePath = join(rootDir, "src", "pages", `${path === "/" ? "index" : path}.page.json`)
    
    try {
      const { readFileSync, existsSync } = await import("fs")
      if (existsSync(pagePath)) {
        const content = readFileSync(pagePath, "utf-8")
        return c.json(JSON.parse(content))
      }
      return c.json({ path, blocks: [] })
    } catch (error) {
      return c.json({ error: String(error) }, 500)
    }
  })

  server.post("/__kitro/page/:path*", async (c) => {
    const path = c.req.param("path") || "/"
    const pagePath = join(rootDir, "src", "pages", `${path === "/" ? "index" : path}.page.json`)
    const body = await c.req.json()
    
    try {
      const { writeFileSync, mkdirSync } = await import("fs")
      const { dirname } = await import("path")
      mkdirSync(dirname(pagePath), { recursive: true })
      writeFileSync(pagePath, JSON.stringify(body, null, 2))
      return c.json({ success: true })
    } catch (error) {
      return c.json({ error: String(error) }, 500)
    }
  })

  // SSR/SPA route handler
  server.get("*", async (c) => {
    const url = new URL(c.req.url)
    const pathname = url.pathname

    // Find matching route
    const route = routes.find((r) => {
      // Simple matching for now (can be improved with proper router)
      if (r.path === pathname) return true
      // Handle dynamic routes (basic)
      const pattern = r.path.replace(/:[^/]+/g, "[^/]+")
      return new RegExp(`^${pattern}$`).test(pathname)
    })

    if (!route) {
      return c.text("404 Not Found", 404)
    }

    if (config.ssr) {
      // SSR mode
      const html = await app.renderer.renderToString({
        route,
        url: pathname,
        rootDir,
      })
      return c.html(html)
    } else {
      // SPA mode - return client bundle HTML
      return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kitro App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/app.tsx"></script>
</body>
</html>`)
    }
  })

  // Start server
  serve(
    {
      fetch: server.fetch,
      port,
      hostname: host,
    },
    (info) => {
      console.log(`\n✅ Kitro server running at http://${host}:${port}`)
      console.log(`\n📊 Status:`)
      console.log(`   SSR: ${config.ssr ? "✅ on" : "❌ off"}`)
      console.log(`   Multi-tenant: ${config.multiTenant ? "✅ on" : "❌ off"}`)
      console.log(
        `   AI: ${config.ai.enabled ? `✅ enabled (${config.ai.provider})` : "❌ disabled"}`
      )
      console.log(`   Modules: ${config.modules.length > 0 ? config.modules.join(", ") : "none"}`)
      console.log(`   Routes: ${routes.length} found\n`)
    }
  )
}

