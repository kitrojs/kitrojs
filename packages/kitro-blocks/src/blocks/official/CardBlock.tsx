import React from "react"
import { defineBlock } from "../../index.js"

export const CardBlock = defineBlock<{
  title?: string
  subtitle?: string
  content?: string
  image?: string
  variant?: "default" | "elevated" | "outlined"
}>({
  meta: {
    name: "CardBlock",
    label: "Card",
    icon: "🃏",
    category: "content",
    variants: ["default", "elevated", "outlined"],
    schema: {
      title: "string",
      subtitle: "string",
      content: "text",
      image: "string",
      variant: "string",
    },
  },
  render: (props) => {
    const variantStyles = {
      default: {
        background: "rgba(15, 23, 42, 0.96)",
        border: "1px solid rgba(30, 64, 175, 0.4)",
        boxShadow: "0 18px 50px rgba(15, 23, 42, 0.9)",
      },
      elevated: {
        background: "rgba(15, 23, 42, 0.96)",
        border: "none",
        boxShadow: "0 24px 70px rgba(15, 23, 42, 0.95)",
      },
      outlined: {
        background: "transparent",
        border: "2px solid rgba(30, 64, 175, 0.6)",
        boxShadow: "none",
      },
    }

    return (
      <div
        style={{
          ...variantStyles[props.variant || "default"],
          borderRadius: "16px",
          padding: "20px",
          color: "#e5e7eb",
        }}
      >
        {props.image && (
          <img
            src={props.image}
            alt={props.title || ""}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
        )}
        {props.title && (
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>{props.title}</h3>
        )}
        {props.subtitle && (
          <p style={{ opacity: 0.7, marginBottom: "12px", fontSize: "14px" }}>
            {props.subtitle}
          </p>
        )}
        {props.content && <p style={{ lineHeight: "1.6" }}>{props.content}</p>}
      </div>
    )
  },
})
