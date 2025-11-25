import type { Hono } from "hono"

/**
 * Admin page definition for module
 */
export interface KitroAdminPage {
  id: string
  path: string // e.g., "/admin/blog"
  label: string // e.g., "Blog"
  icon?: string // simple icon key/name
  section?: string // e.g., "Content", "Settings", "System"
}

/**
 * Route registration interface
 */
export interface KitroRouteRegistration {
  register(app: Hono): void
}

/**
 * Block registration interface
 */
export interface KitroBlockRegistration {
  registerBlocks(): void
}

/**
 * Mobile/app capability metadata
 */
export interface KitroMobileCapability {
  enabled: boolean
  screens?: string[] // e.g., ["blog_list", "blog_detail"]
  apiPrefixes?: string[] // e.g., ["/api/blog"]
}

/**
 * Kitro module interface
 */
export interface KitroModule {
  id: string
  name: string
  version: string
  description?: string

  routes?: KitroRouteRegistration[]
  adminPages?: KitroAdminPage[]
  registerBlocks?: KitroBlockRegistration["registerBlocks"]

  // Mobile/app metadata (for app manifest)
  mobile?: KitroMobileCapability

  // Extensible hooks
  migrations?: string[] // paths to migration files
  onInit?: (ctx: unknown) => Promise<void> | void
}

/**
 * Module manager options
 */
export interface ModuleManagerOptions {
  modules: KitroModule[]
  app: Hono
}

/**
 * Module manager for loading and managing Kitro modules
 */
export class ModuleManager {
  constructor(private options: ModuleManagerOptions) {}

  /**
   * Initialize all modules
   */
  async init(): Promise<void> {
    const { modules, app } = this.options

    for (const mod of modules) {
      // Register routes
      mod.routes?.forEach((r) => {
        try {
          r.register(app)
        } catch (error) {
          console.error(`[Kitro ModuleManager] Route registration error in ${mod.id}:`, error)
        }
      })

      // Register blocks
      if (mod.registerBlocks) {
        try {
          mod.registerBlocks()
        } catch (error) {
          console.error(`[Kitro ModuleManager] Block registration error in ${mod.id}:`, error)
        }
      }

      // Run onInit hook
      if (mod.onInit) {
        try {
          await mod.onInit({})
        } catch (error) {
          console.error(`[Kitro ModuleManager] onInit error in ${mod.id}:`, error)
        }
      }
    }
  }

  /**
   * Get all admin pages from all modules, sorted by section and label
   */
  getAdminPages(): KitroAdminPage[] {
    return this.options.modules
      .flatMap((m) => m.adminPages ?? [])
      .sort((a, b) => {
        const sectionCompare = (a.section || "").localeCompare(b.section || "")
        if (sectionCompare !== 0) return sectionCompare
        return a.label.localeCompare(b.label)
      })
  }

  /**
   * Get all registered modules
   */
  getModules(): KitroModule[] {
    return this.options.modules
  }

  /**
   * Get modules with mobile capabilities enabled
   */
  getMobileCapabilities(): { modules: KitroModule[] } {
    return {
      modules: this.options.modules.filter((m) => m.mobile && m.mobile.enabled),
    }
  }
}

