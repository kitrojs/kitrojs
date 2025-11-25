import React from "react"
import { defineBlock } from "../../index.js"

export const GalleryBlock = defineBlock<{
  images: Array<{ src: string; alt?: string }>
  columns?: 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
}>({
  meta: {
    name: "GalleryBlock",
    label: "Gallery",
    icon: "🖼️",
    category: "media",
    schema: {
      images: "string", // JSON string in schema
      columns: "number",
      gap: "string",
    },
  },
  render: (props) => {
    const gapStyles = {
      sm: "8px",
      md: "16px",
      lg: "24px",
    }

    const images = Array.isArray(props.images) ? props.images : []

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
          gap: gapStyles[props.gap || "md"],
        }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt || ""}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        ))}
      </div>
    )
  },
})
