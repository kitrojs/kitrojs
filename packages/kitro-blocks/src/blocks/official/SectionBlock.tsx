import React from "react"
import { defineBlock } from "../../index.js"

export const SectionBlock = defineBlock<{
  title?: string
  subtitle?: string
  variant?: "default" | "dark" | "accent"
  padding?: "none" | "sm" | "md" | "lg"
  children?: React.ReactNode
}>({
  meta: {
    name: "SectionBlock",
    label: "Section",
    icon: "📦",
    category: "layout",
    variants: ["default", "dark", "accent"],
    schema: {
      title: "string",
      subtitle: "string",
      variant: "string",
      padding: "string",
    },
  },
  render: (props) => {
    const variantStyles = {
      default: { background: "#020617", color: "#e5e7eb" },
      dark: { background: "#000", color: "#e5e7eb" },
      accent: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
      },
    }

    const paddingStyles = {
      none: "0",
      sm: "20px",
      md: "40px",
      lg: "80px",
    }

    const style = {
      ...variantStyles[props.variant || "default"],
      padding: paddingStyles[props.padding || "md"],
    }

    return (
      <section style={style}>
        {props.title && <h2 style={{ marginTop: 0 }}>{props.title}</h2>}
        {props.subtitle && <p style={{ opacity: 0.8 }}>{props.subtitle}</p>}
        {props.children}
      </section>
    )
  },
})
