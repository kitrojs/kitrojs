import React from "react"
import { defineBlock } from "../../index.js"

export const ButtonBlock = defineBlock<{
  text: string
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}>({
  meta: {
    name: "ButtonBlock",
    label: "Button",
    icon: "🔘",
    category: "content",
    variants: ["primary", "secondary", "ghost"],
    schema: {
      text: "string",
      href: "string",
      variant: "string",
      size: "string",
    },
    ai: {
      enhance: true,
    },
  },
  render: (props) => {
    const variantStyles = {
      primary: {
        background: "linear-gradient(120deg, #a855f7, #ec4899, #22c55e)",
        color: "#020617",
        border: "none",
      },
      secondary: {
        background: "rgba(15, 23, 42, 0.96)",
        color: "#e5e7eb",
        border: "1px solid rgba(30, 64, 175, 0.4)",
      },
      ghost: {
        background: "transparent",
        color: "#e5e7eb",
        border: "1px solid rgba(30, 64, 175, 0.4)",
      },
    }

    const sizeStyles = {
      sm: { padding: "6px 12px", fontSize: "12px" },
      md: { padding: "8px 16px", fontSize: "14px" },
      lg: { padding: "12px 24px", fontSize: "16px" },
    }

    const style = {
      ...variantStyles[props.variant || "primary"],
      ...sizeStyles[props.size || "md"],
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 500,
      display: "inline-block",
      textDecoration: "none",
    }

    if (props.href) {
      return (
        <a href={props.href} style={style}>
          {props.text}
        </a>
      )
    }

    return (
      <button style={style} onClick={props.onClick}>
        {props.text}
      </button>
    )
  },
})
