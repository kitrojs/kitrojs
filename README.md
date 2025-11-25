# KitroJS Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)
[![Status: Dev Edition v0.1.1](https://img.shields.io/badge/Status-Dev%20Edition%20v0.1.1-brightgreen.svg)]()
[![Made by Nico Vermaeck](https://img.shields.io/badge/Made%20by-Nico%20Vermaeck-blueviolet.svg)]()

KitroJS is a modern, TypeScript-first web framework built on:

- **React** for UI
- **File-based routing** for pages & API
- **Block-based UI** for reusable components
- **Hono** for super-lightweight HTTP/API handling

This repository contains **KitroJS Dev Edition v0.1.1** – a lightweight, developer-focused setup without CMS or admin panel. Perfect for:

- quickly building prototypes  
- learning the core of KitroJS  
- building your own sites/apps on top of the runtime  

---

## ✨ Features

- 🔁 **File-based routing**  
  Every file in `src/pages` automatically becomes a route.

- 🧱 **Block-based UI**  
  Blocks are just React components – no special magic, just TypeScript + props.

- ⚡ **API routes out-of-the-box**  
  Files in `src/pages/api` become Hono-powered API endpoints.

- 🧠 **TypeScript-first**  
  Full type support, clear interfaces and strong DX.

- 🚀 **Quick setup**  
  Unzip → `pnpm install` → `pnpm run dev:devdemo` → you're ready to go.

- 🧩 **No vendor lock-in**  
  Everything is just React + TS + Hono. You can easily integrate into existing stacks.

---

## 📦 Contents of this Dev Edition

This Dev Edition contains:

- `packages/kitro-runtime` – HTTP server + runtime
- `packages/kitro-router` – file-based routing
- `packages/kitro-blocks` – base blocks + helpers
- `apps/kitro-dev-demo` – example app with pages, blocks and API routes
- OSS files: `LICENSE`, `NOTICE`, `AUTHORS`, `CONTRIBUTING.md`, `SECURITY.md`, `COPYRIGHT.txt`

**Note:**  
This edition contains **no** CMS, admin or Studio. This is intentional, so developers can use the core as simply as possible.

---

## ✅ System Requirements

- Node.js **18+**
- pnpm **8+** or **10+**  
- Git (optional, for version control)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm run dev:devdemo
```

By default, the dev server runs on http://localhost:3000 (check the console output to confirm).

---

## 🧬 Project Structure

A minimal setup looks like this:

```
apps/
  kitro-dev-demo/
    src/
      pages/
        index.tsx
        docs.tsx
        about.tsx
        api/
          hello.ts
packages/
  kitro-runtime/
  kitro-router/
  kitro-blocks/
LICENSE
NOTICE
AUTHORS
CONTRIBUTING.md
SECURITY.md
COPYRIGHT.txt
README.md
```

**Key directories:**

- `apps/kitro-dev-demo/src/pages` → all UI pages (React components)
- `apps/kitro-dev-demo/src/pages/api` → API routes (Hono handlers)
- `packages/kitro-blocks` → shared blocks (Heading, Text, Card, etc.)

---

## 📄 Pages & Routing

Every file in `src/pages` automatically becomes a route.

**Example: `src/pages/about.tsx`:**

```tsx
import React from "react";

export default function AboutPage() {
  return (
    <main>
      <h1>About KitroJS</h1>
      <p>KitroJS is a modern React/TypeScript framework.</p>
    </main>
  );
}
```

**Route:** `/about`

**Rules:**
- `index.tsx` → `/`
- `docs.tsx` → `/docs`
- `contact.tsx` → `/contact`

No extra config needed.

---

## 🧱 Blocks

Blocks are reusable React components with clear TypeScript props.

**Example: a simple CustomBlock:**

```tsx
// packages/kitro-blocks/src/CustomBlock.tsx
import React from "react";

export interface CustomBlockProps {
  title: string;
  description?: string;
}

export function CustomBlock({ title, description }: CustomBlockProps) {
  return (
    <section>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </section>
  );
}
```

**Export in `index.ts`:**

```ts
export * from "./CustomBlock";
```

**Use in a page:**

```tsx
import React from "react";
import { CustomBlock } from "@kitro/blocks";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to KitroJS</h1>
      <CustomBlock
        title="Blocks are just React"
        description="No magic, just components and props."
      />
    </main>
  );
}
```

---

## 🌐 API routes with Hono

All files in `src/pages/api` become API endpoints.

**Example: `src/pages/api/hello.ts`:**

```ts
import type { Context } from "hono";

export default async function handler(c: Context) {
  const name = c.req.query("name") ?? "Developer";
  return c.json({ message: `Hello, ${name}!` });
}
```

**Routes:**
- `/api/hello` → `{"message": "Hello, Developer!"}`
- `/api/hello?name=Nico` → `{"message": "Hello, Nico!"}`

**Want to create a new API route?**

Simply create a new file, for example:
- `src/pages/api/test.ts` → `/api/test`

---

## 🔄 Hot Reload (Dev mode)

The Dev Edition is set up for fast feedback during development:

1. Modify code in `src/pages` or `packages/kitro-blocks`
2. Browser reloads automatically (or via hot reload, depending on dev-server setup)

**If you're not sure if hot reload works:**

1. Start dev server: `pnpm run dev:devdemo`
2. Open browser at `http://localhost:3000`
3. Modify some text in `src/pages/index.tsx`
4. Save → check if the change is immediately visible

---

## 🏗️ Production build & deploy (basic)

Note: Dev Edition focuses on DX. The following is a basic example; adjust it to your infrastructure.

**1. Build**

```bash
pnpm run build:devdemo
```

This generates a production build for the demo app.

**2. Start in production mode**

```bash
pnpm run start:devdemo
```

You can run this with PM2 or systemd:

**PM2 example:**

```bash
pm2 start "pnpm run start:devdemo" --name kitrojs-dev
pm2 save
```

---

## 🧪 Testing (planned)

There is no official testing guide yet, but this is the planned direction:

- **Pages & Blocks:** React Testing Library + Vitest/Jest
- **API routes:** Hono + supertest/undici

Suggestions and PRs for a testing setup are welcome in `CONTRIBUTING.md`.

---

## 🗺️ Roadmap (Dev Edition)

Short roadmap for future versions:

- Extended hot-reload documentation
- Official testing setup & examples
- Performance tips & best practices
- Integration examples (auth, database, etc.)
- Examples of larger apps (dashboard, blog, landing pages)

---

## 🤝 Contributing

We welcome contributions!

**Read first:** [CONTRIBUTING.md](CONTRIBUTING.md)

**Quick summary:**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my new feature"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 🔐 Security

Security issues?

Read [SECURITY.md](SECURITY.md) and email:

**security@kitrojs.com**

Do not report vulnerabilities publicly in issues or PR titles.

---

## 📜 License & Copyright

- **License:** [MIT](LICENSE)
- **Copyright:** [COPYRIGHT.txt](COPYRIGHT.txt)
- **Notice:** [NOTICE](NOTICE)
- **Authors:** [AUTHORS](AUTHORS)

---

## 💜 Credits

KitroJS is developed by Nico Vermaeck and will gradually grow with community contributions.

If you use KitroJS in a project, we'd love it if you place a small reference somewhere like:

**"Built with KitroJS"**

But it's not required.
