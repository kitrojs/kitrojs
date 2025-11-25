import React from "react"

interface CardBlockProps {
  title: string
  content: string
  style?: React.CSSProperties
}

export function CardBlock({ title, content, style }: CardBlockProps) {
  const defaultStyle: React.CSSProperties = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    ...style
  }
  
  return (
    <div style={defaultStyle}>
      <h3 style={{ marginTop: "0", marginBottom: "0.75rem", fontSize: "1.25rem", color: "#111827" }}>
        {title}
      </h3>
      <p style={{ margin: "0", color: "#6b7280", lineHeight: "1.6", whiteSpace: "pre-line" }}>
        {content}
      </p>
    </div>
  )
}

