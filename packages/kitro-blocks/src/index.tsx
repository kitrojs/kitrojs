import React from "react"
import { BlockRegistry } from "./registry.js"

export type BlockSchemaType = "string" | "text" | "image" | "number" | "boolean"

export interface KitroBlockSchema {
  [key: string]: BlockSchemaType
}

export interface BlockServerContext {
  request: Request
  params: Record<string, string>
  user?: any
  db?: any
}

export interface KitroBlockMeta {
  name: string
  label: string
  icon?: string
  category?: "layout" | "content" | "media" | "advanced"
  variants?: string[]
  schema: KitroBlockSchema
  ai?: {
    enhance?: boolean
    translate?: boolean
  }
}

export interface KitroBlockDefinition<Props = any> {
  meta: KitroBlockMeta
  render: (props: Props) => React.ReactNode
  serverData?: (ctx: BlockServerContext) => Promise<any>
  useBlockState?: () => any // optional reactive state (client)
}

export function defineBlock<Props = any>(
  def: KitroBlockDefinition<Props>
): KitroBlockDefinition<Props> {
  return def
}

export interface BlockInstance {
  id?: string
  type: string
  variant?: string
  props: Record<string, any>
  children?: BlockInstance[]
}

// Export BlockRegistry from separate file
export { BlockRegistry } from "./registry.js"

export function renderBlock(
  block: BlockInstance,
  serverData?: any
): React.ReactNode {
  // BlockRegistry imported at top level from separate file (no circular dependency)
  const definition = BlockRegistry.get(block.type)
  if (!definition) {
    return React.createElement("div", null, `Unknown block: ${block.type}`)
  }

  // Merge server data with props
  const props = {
    ...block.props,
    ...(serverData || {}),
    variant: block.variant,
  }

  // Render children if present
  if (block.children && block.children.length > 0) {
    return React.createElement(
      React.Fragment,
      {},
      definition.render(props),
      ...block.children.map((child) => renderBlock(child))
    )
  }

  return definition.render(props)
}

// Export blocks only - NO side effects, NO registration
export { TextBlock } from "./blocks/TextBlock.js"
export { HeadingBlock } from "./blocks/HeadingBlock.js"
export { HeroBlock } from "./blocks/HeroBlock.js"
export { SectionBlock } from "./blocks/official/SectionBlock.js"
export { ButtonBlock } from "./blocks/official/ButtonBlock.js"
export { ImageBlock } from "./blocks/official/ImageBlock.js"
export { GalleryBlock } from "./blocks/official/GalleryBlock.js"
export { TwoColumnBlock } from "./blocks/official/TwoColumnBlock.js"
export { CardBlock } from "./blocks/official/CardBlock.js"
export { DonationBlock } from "./blocks/official/DonationBlock.js"

// NOTE: register.ts is NOT exported here to avoid circular dependency
// Import it directly: import { registerDefaultBlocks } from "@kitro/blocks/register"
