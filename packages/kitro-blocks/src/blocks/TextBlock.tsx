import React from "react"
import { defineBlock } from "../index.js"
import { BlockRegistry } from "../index.js"

export const TextBlock = defineBlock<{ text: string }>({
  meta: {
    name: "TextBlock",
    label: "Text",
    icon: "📝",
    category: "content",
    schema: {
      text: "text",
    },
    ai: {
      enhance: true,
      translate: true,
    },
  },
  render: (props) => {
    return <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#e5e7eb" }}>{props.text}</p>
  },
})

BlockRegistry.register(TextBlock)

