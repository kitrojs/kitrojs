// Separate file for block registration to avoid circular dependencies
import { BlockRegistry } from "../index.js"
import { SectionBlock } from "./official/SectionBlock.js"
import { ButtonBlock } from "./official/ButtonBlock.js"
import { ImageBlock } from "./official/ImageBlock.js"
import { GalleryBlock } from "./official/GalleryBlock.js"
import { TwoColumnBlock } from "./official/TwoColumnBlock.js"
import { CardBlock } from "./official/CardBlock.js"
import { DonationBlock } from "./official/DonationBlock.js"

// Register all official blocks
BlockRegistry.register(SectionBlock)
BlockRegistry.register(ButtonBlock)
BlockRegistry.register(ImageBlock)
BlockRegistry.register(GalleryBlock)
BlockRegistry.register(TwoColumnBlock)
BlockRegistry.register(CardBlock)
BlockRegistry.register(DonationBlock)

