import React from "react"

interface HeadingBlockProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  content: string
  style?: React.CSSProperties
}

export function HeadingBlock({ level, content, style }: HeadingBlockProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  const defaultStyle: React.CSSProperties = {
    marginTop: level === 1 ? "0" : "2rem",
    marginBottom: "1rem",
    fontWeight: level <= 2 ? "700" : "600",
    fontSize: level === 1 ? "2.5rem" : level === 2 ? "2rem" : level === 3 ? "1.5rem" : "1.25rem",
    lineHeight: "1.2",
    color: "#111827",
    ...style
  }
  
  return <Tag style={defaultStyle}>{content}</Tag>
}

