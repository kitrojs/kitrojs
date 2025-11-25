import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { buildRoutes } from "@kitro/router"
import { defineKitroConfig, type KitroConfig } from "@kitro/core"
import { renderToString } from "react-dom/server"
import React from "react"
import { readFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath, pathToFileURL } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = new Hono()

// In production (dist), pages are in dist/pages
// In development (src), pages are in src/pages
const pagesDir = existsSync(join(__dirname, "pages")) 
  ? join(__dirname, "pages")
  : join(__dirname, "../src/pages")

// Create full KitroConfig for Dev Edition
const config: KitroConfig = defineKitroConfig({
  ssr: true,
  multiTenant: false,
  modules: [],
  ai: {
    enabled: false,
    provider: "none",
    allow: {
      scaffold: false,
      pageBuilder: false,
      rewrite: false,
      translate: false,
      imageGen: false,
      optimizeBuild: false,
    },
  },
  theme: {
    name: "default",
  },
})

// Build routes from pages directory
let routes: any[] = []

async function initializeRoutes() {
  try {
    routes = await buildRoutes(pagesDir, config)
    console.log(`✅ Loaded ${routes.length} routes:`)
    routes.forEach(route => {
      console.log(`   ${route.path} → ${route.file}`)
    })
  } catch (error) {
    console.error("❌ Failed to build routes:", error)
    process.exit(1)
  }
}

// Initialize routes on startup
await initializeRoutes()

// Basic HTML template
function getHTMLTemplate(body: string, title: string = "KitroJS Dev Edition") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f9fafb;
      color: #111827;
      line-height: 1.6;
    }
    nav {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
      margin-bottom: 2rem;
    }
    nav a {
      color: #6A32FF;
      text-decoration: none;
      margin-right: 1.5rem;
      font-weight: 500;
    }
    nav a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/docs">Docs</a>
    <a href="/api/hello">API</a>
  </nav>
  ${body}
</body>
</html>`
}

// Handle API routes
app.get("/api/*", async (c) => {
  const path = c.req.path
  
  // Find matching API route
  const apiRoute = routes.find(r => r.path === path && r.file.includes("/api/"))
  
  if (apiRoute) {
    try {
      const fileUrl = pathToFileURL(apiRoute.file).href
      const handler = (await import(fileUrl)).default
      if (typeof handler === "function") {
        return handler(c)
      }
    } catch (error: any) {
      console.error(`Error loading API route ${path}:`, error)
      return c.json({ error: "Internal server error" }, 500)
    }
  }
  
  return c.json({ error: "Not found" }, 404)
})

// Handle page routes
app.get("*", async (c) => {
  const path = c.req.path === "/" ? "/" : c.req.path
  
  // Find matching route
  const route = routes.find(r => {
    if (r.path === path) return true
    // Handle dynamic routes (simplified - for production use proper matching)
    if (r.path.includes(":")) {
      const pattern = r.path.replace(/:[^/]+/g, "[^/]+")
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(path)
    }
    return false
  })
  
  if (!route) {
    const html = getHTMLTemplate(`
      <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p style="margin-top: 1rem;">
          <a href="/" style="color: #6A32FF; text-decoration: none;">← Back to Home</a>
        </p>
        <div style="margin-top: 2rem; padding: 1rem; background: #fee2e2; border-radius: 6px;">
          <p style="color: #dc2626; font-size: 0.875rem;">
            <strong>Kitro renderer:</strong> No page module found for route '${path}' in '${pagesDir}'
          </p>
        </div>
      </div>
    `, "404 - Not Found")
    return c.html(html, 404)
  }
  
  try {
    // Import and render the page component
    const fileUrl = pathToFileURL(route.file).href
    const PageComponent = (await import(fileUrl)).default
    
    if (!PageComponent) {
      throw new Error(`Page component not exported as default from ${route.file}`)
    }
    
    // Render React component to string
    const body = renderToString(React.createElement(PageComponent))
    
    // Get page title (try to extract from component or use route name)
    const title = route.name === "index" ? "KitroJS Dev Edition" : 
                  route.name.charAt(0).toUpperCase() + route.name.slice(1).replace(/-/g, " ")
    
    const html = getHTMLTemplate(body, title)
    return c.html(html)
  } catch (error: any) {
    console.error(`Error rendering page ${path}:`, error)
    
    const html = getHTMLTemplate(`
      <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
        <h1>500 - Server Error</h1>
        <p>An error occurred while rendering this page.</p>
        <div style="margin-top: 1rem; padding: 1rem; background: #fee2e2; border-radius: 6px;">
          <p style="color: #dc2626; font-size: 0.875rem; font-family: monospace;">
            ${error.message}
          </p>
        </div>
        <p style="margin-top: 1rem;">
          <a href="/" style="color: #6A32FF; text-decoration: none;">← Back to Home</a>
        </p>
      </div>
    `, "500 - Server Error")
    return c.html(html, 500)
  }
})

const port = parseInt(process.env.PORT || "3000", 10)

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`✅ KitroJS Dev Edition running at http://localhost:${port}`)
    console.log(`   Routes: ${routes.length} loaded`)
    console.log(`   Try: http://localhost:${port}/`)
    console.log(`   Docs: http://localhost:${port}/docs`)
    console.log(`   API: http://localhost:${port}/api/hello`)
  }
)

