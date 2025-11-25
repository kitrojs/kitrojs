import React from "react"
import { defineBlock } from "../index.js"
import { BlockRegistry } from "../index.js"

export const HeadingBlock = defineBlock<{ text: string; level?: number }>({
  meta: {
    name: "HeadingBlock",
    label: "Heading",
    icon: "📰",
    category: "content",
    schema: {
      text: "string",
      level: "number",
    },
    ai: {
      enhance: true,
    },
  },
  render: (props) => {
    const level = props.level || 1
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    return (
      <Tag style={{ fontSize: level === 1 ? "32px" : level === 2 ? "24px" : "20px", fontWeight: 600, color: "#e5e7eb" }}>
        {props.text}
      </Tag>
    )
  },
})

BlockRegistry.register(HeadingBlock)

