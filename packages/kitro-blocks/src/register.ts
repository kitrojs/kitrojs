// Separate registration file - NOT exported by index.tsx to avoid circular dependency
import { BlockRegistry } from "./registry.js"
import { SectionBlock } from "./blocks/official/SectionBlock.js"
import { ButtonBlock } from "./blocks/official/ButtonBlock.js"
import { ImageBlock } from "./blocks/official/ImageBlock.js"
import { GalleryBlock } from "./blocks/official/GalleryBlock.js"
import { TwoColumnBlock } from "./blocks/official/TwoColumnBlock.js"
import { CardBlock } from "./blocks/official/CardBlock.js"
import { DonationBlock } from "./blocks/official/DonationBlock.js"

export function registerDefaultBlocks() {
  BlockRegistry.register(SectionBlock)
  BlockRegistry.register(ButtonBlock)
  BlockRegistry.register(ImageBlock)
  BlockRegistry.register(GalleryBlock)
  BlockRegistry.register(TwoColumnBlock)
  BlockRegistry.register(CardBlock)
  BlockRegistry.register(DonationBlock)
}

