import React from "react"

interface TextBlockProps {
  content: string
  style?: React.CSSProperties
}

export function TextBlock({ content, style }: TextBlockProps) {
  const defaultStyle: React.CSSProperties = {
    marginBottom: "1rem",
    lineHeight: "1.7",
    color: "#374151",
    fontSize: "1rem",
    whiteSpace: "pre-line",
    ...style
  }
  
  return <p style={defaultStyle}>{content}</p>
}

