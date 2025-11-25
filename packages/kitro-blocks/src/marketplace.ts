import { BlockRegistry, KitroBlockDefinition } from "./index.js"

export interface Blockpack {
  name: string
  version: string
  blocks: KitroBlockDefinition[]
}

export class MarketplaceRegistry {
  private static blockpacks = new Map<string, Blockpack>()

  static registerBlockpack(blockpack: Blockpack) {
    // Validate blocks
    for (const block of blockpack.blocks) {
      const existing = BlockRegistry.get(block.meta.name)
      if (existing) {
        console.warn(
          `⚠️  Block "${block.meta.name}" from blockpack "${blockpack.name}" conflicts with existing block. Skipping.`
        )
        continue
      }

      // Validate schema
      if (!block.meta.schema || Object.keys(block.meta.schema).length === 0) {
        console.warn(
          `⚠️  Block "${block.meta.name}" has invalid schema. Skipping.`
        )
        continue
      }

      BlockRegistry.register(block)
    }

    this.blockpacks.set(blockpack.name, blockpack)
    console.log(`✅ Blockpack "${blockpack.name}" registered with ${blockpack.blocks.length} blocks`)
  }

  static getBlockpack(name: string): Blockpack | undefined {
    return this.blockpacks.get(name)
  }

  static allBlockpacks(): Blockpack[] {
    return Array.from(this.blockpacks.values())
  }
}

