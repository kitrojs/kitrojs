import React from "react"
import { HeadingBlock, TextBlock, CardBlock } from "../blocks/index.js"

export default function DocsPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <HeadingBlock level={1} content="KitroJS Dev Edition Documentation" />
      
      <section style={{ marginTop: "3rem" }}>
        <HeadingBlock level={2} content="Creating a Page" />
        <TextBlock 
          content="Pages are created in the src/pages/ directory. Each .tsx file becomes a route."
        />
        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "6px", marginTop: "1rem" }}>
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.875rem" }}>
{`// src/pages/about.tsx
import React from "react"

export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page.</p>
    </div>
  )
}`}
          </pre>
        </div>
        <TextBlock 
          content="This page will be available at /about automatically."
        />
      </section>

      <section style={{ marginTop: "3rem" }}>
        <HeadingBlock level={2} content="Adding Blocks" />
        <TextBlock 
          content="Blocks are reusable UI components. Import and use them in your pages."
        />
        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "6px", marginTop: "1rem" }}>
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.875rem" }}>
{`// src/pages/my-page.tsx
import { HeadingBlock, TextBlock } from "../blocks/index.js"

export default function MyPage() {
  return (
    <div>
      <HeadingBlock level={1} content="My Page" />
      <TextBlock content="This is my page content." />
    </div>
  )
}`}
          </pre>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <HeadingBlock level={2} content="Creating Custom Blocks" />
        <TextBlock 
          content="Create your own blocks in src/blocks/ and export them."
        />
        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "6px", marginTop: "1rem" }}>
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.875rem" }}>
{`// src/blocks/MyHeroBlock.tsx
import React from "react"

export function MyHeroBlock({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section style={{ padding: "4rem 2rem", background: "#6A32FF", color: "white" }}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </section>
  )
}`}
          </pre>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <HeadingBlock level={2} content="API Routes" />
        <TextBlock 
          content="API routes are created in src/pages/api/. They return JSON responses."
        />
        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "6px", marginTop: "1rem" }}>
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.875rem" }}>
{`// src/pages/api/hello.ts
export default function handler(c: any) {
  return c.json({ message: "Hello from Kitro runtime" })
}`}
          </pre>
        </div>
        <TextBlock 
          content="This API route will be available at /api/hello."
        />
      </section>

      <section style={{ marginTop: "3rem" }}>
        <HeadingBlock level={2} content="SSR vs SPA" />
        <TextBlock 
          content="KitroJS Dev Edition uses Server-Side Rendering (SSR) by default. Pages are rendered on the server and sent to the client as HTML. This provides better SEO and initial load performance."
        />
        <CardBlock
          title="SSR Benefits"
          content="• Better SEO - content is available to search engines\n• Faster initial load - HTML is ready immediately\n• Works without JavaScript - graceful degradation"
        />
      </section>

      <div style={{ marginTop: "3rem", padding: "1.5rem", background: "#e8f5e9", borderRadius: "6px" }}>
        <HeadingBlock level={3} content="Next Steps" />
        <TextBlock 
          content="Try creating your own page at src/pages/about.tsx and visit /about to see it in action!"
        />
        <a 
          href="/" 
          style={{ 
            display: "inline-block", 
            marginTop: "1rem", 
            color: "#6A32FF", 
            textDecoration: "none" 
          }}
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}

