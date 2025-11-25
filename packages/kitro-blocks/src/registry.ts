// BlockRegistry - separate file to avoid circular dependencies
import type { KitroBlockDefinition } from "./index.js"

export class BlockRegistry {
  private static blocks = new Map<string, KitroBlockDefinition>()

  static register(block: KitroBlockDefinition) {
    if (this.blocks.has(block.meta.name)) {
      console.warn(`⚠️  Block "${block.meta.name}" is already registered. Overwriting.`)
    }
    this.blocks.set(block.meta.name, block)
  }

  static get(name: string): KitroBlockDefinition | undefined {
    return this.blocks.get(name)
  }

  static all(): KitroBlockDefinition[] {
    return Array.from(this.blocks.values())
  }

  static byCategory(category: string): KitroBlockDefinition[] {
    return this.all().filter((b) => b.meta.category === category)
  }

  static clear() {
    this.blocks.clear()
  }
}

