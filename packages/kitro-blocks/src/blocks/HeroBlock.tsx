import React from "react"
import { defineBlock } from "../index.js"
import { BlockRegistry } from "../index.js"

export const HeroBlock = defineBlock<{ title: string; subtitle?: string }>({
  meta: {
    name: "HeroBlock",
    label: "Hero",
    icon: "🎯",
    category: "content",
    schema: {
      title: "string",
      subtitle: "string",
    },
    ai: {
      enhance: true,
    },
  },
  render: (props) => {
    return (
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: 700, margin: "0 0 16px", color: "#fff" }}>
          {props.title}
        </h1>
        {props.subtitle && (
          <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.9)", margin: 0 }}>
            {props.subtitle}
          </p>
        )}
      </div>
    )
  },
})

BlockRegistry.register(HeroBlock)

