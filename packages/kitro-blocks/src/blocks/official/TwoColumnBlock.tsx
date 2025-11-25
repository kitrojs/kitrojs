import React from "react"
import { defineBlock } from "../../index.js"

export const TwoColumnBlock = defineBlock<{
  left: React.ReactNode
  right: React.ReactNode
  ratio?: "50-50" | "60-40" | "40-60"
  gap?: "sm" | "md" | "lg"
}>({
  meta: {
    name: "TwoColumnBlock",
    label: "Two Column",
    icon: "📐",
    category: "layout",
    schema: {
      ratio: "string",
      gap: "string",
    },
  },
  render: (props) => {
    const ratios = {
      "50-50": ["1fr", "1fr"],
      "60-40": ["3fr", "2fr"],
      "40-60": ["2fr", "3fr"],
    }

    const gapStyles = {
      sm: "16px",
      md: "24px",
      lg: "40px",
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: ratios[props.ratio || "50-50"].join(" "),
          gap: gapStyles[props.gap || "md"],
        }}
      >
        <div>{props.left}</div>
        <div>{props.right}</div>
      </div>
    )
  },
})
