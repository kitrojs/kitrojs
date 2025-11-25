import type { Context } from "hono"

export default function handler(c: Context) {
  return c.json({ 
    message: "Hello from Kitro runtime",
    version: "0.1.0",
    timestamp: new Date().toISOString()
  })
}

