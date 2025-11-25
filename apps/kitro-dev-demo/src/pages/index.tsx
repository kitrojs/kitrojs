import React from "react"
import { HeadingBlock, TextBlock, CardBlock } from "../blocks/index.js"

export default function HomePage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <HeadingBlock level={1} content="KitroJS Dev Edition" />
      <TextBlock 
        content="Welcome to KitroJS Dev Edition - a lightweight framework for building modern web applications with TypeScript and React."
      />
      
      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <CardBlock
          title="Framework Core"
          content="Built with @kitro/runtime, @kitro/router, and @kitro/blocks. Lightweight and fast."
        />
        <CardBlock
          title="File-based Routing"
          content="Create pages in src/pages/ and they're automatically routed. No configuration needed."
        />
        <CardBlock
          title="Block System"
          content="Reusable blocks for building UIs. Create custom blocks or use the built-in ones."
        />
      </div>

      <div style={{ marginTop: "3rem" }}>
        <HeadingBlock level={2} content="Quick Start" />
        <TextBlock 
          content="Visit /docs to learn how to create pages, add blocks, and build your application."
        />
        <a 
          href="/docs" 
          style={{ 
            display: "inline-block", 
            marginTop: "1rem", 
            padding: "0.75rem 1.5rem", 
            background: "#6A32FF", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "6px" 
          }}
        >
          View Documentation →
        </a>
      </div>
    </div>
  )
}

