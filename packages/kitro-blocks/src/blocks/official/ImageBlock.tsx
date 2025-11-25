import React from "react"
import { defineBlock } from "../../index.js"

export const ImageBlock = defineBlock<{
  src: string
  alt?: string
  width?: number
  height?: number
  variant?: "default" | "rounded" | "circle"
}>({
  meta: {
    name: "ImageBlock",
    label: "Image",
    icon: "🖼️",
    category: "media",
    variants: ["default", "rounded", "circle"],
    schema: {
      src: "string",
      alt: "string",
      width: "number",
      height: "number",
      variant: "string",
    },
    ai: {
      enhance: true,
    },
  },
  render: (props) => {
    const variantStyles = {
      default: { borderRadius: "0" },
      rounded: { borderRadius: "12px" },
      circle: { borderRadius: "50%" },
    }

    return (
      <img
        src={props.src}
        alt={props.alt || ""}
        width={props.width}
        height={props.height}
        style={{
          maxWidth: "100%",
          height: "auto",
          ...variantStyles[props.variant || "default"],
        }}
      />
    )
  },
})
