# KitroJS Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)
[![Status: Dev Edition v0.1.1](https://img.shields.io/badge/Status-Dev%20Edition%20v0.1.1-brightgreen.svg)]()
[![Made by Nico Vermaeck](https://img.shields.io/badge/Made%20by-Nico%20Vermaeck-blueviolet.svg)]()

KitroJS is een modern, TypeScript-first web framework gebouwd op:

- **React** voor UI
- **File-based routing** voor pages & API
- **Block-based UI** voor herbruikbare componenten
- **Hono** voor superlichte HTTP/API handling

Deze repository bevat de **KitroJS Dev Edition v0.1.1** – een lichte, developer-focussed setup zonder CMS of admin-panel. Perfect om:

- snel een prototype te bouwen  
- de core van KitroJS te leren kennen  
- eigen sites/apps bovenop de runtime te bouwen  

---

## ✨ Features

- 🔁 **File-based routing**  
  Iedere file in `src/pages` wordt automatisch een route.

- 🧱 **Block-based UI**  
  Blocks zijn gewoon React components – geen speciale magie, gewoon TypeScript + props.

- ⚡ **API routes out-of-the-box**  
  Files in `src/pages/api` worden Hono-powered API endpoints.

- 🧠 **TypeScript-first**  
  Volledige type support, duidelijke interfaces en sterke DX.

- 🚀 **Snelle setup**  
  Unzip → `pnpm install` → `pnpm run dev:devdemo` → je bent bezig.

- 🧩 **Geen vendor lock-in**  
  Alles is gewoon React + TS + Hono. Je kunt eenvoudig integreren in bestaande stacks.

---

## 📦 Inhoud van deze Dev Edition

Deze Dev Edition bevat:

- `packages/kitro-runtime` – HTTP server + runtime
- `packages/kitro-router` – file-based routing
- `packages/kitro-blocks` – basis blocks + helpers
- `apps/kitro-dev-demo` – voorbeeldapp met pages, blocks en API routes
- OSS-bestanden: `LICENSE`, `NOTICE`, `AUTHORS`, `CONTRIBUTING.md`, `SECURITY.md`, `COPYRIGHT.txt`

**Let op:**  
Deze edition bevat **geen** CMS, admin of Studio. Dit is bewust, zodat developers de core zo simpel mogelijk kunnen gebruiken.

---

## ✅ Systeemvereisten

- Node.js **18+**
- pnpm **8+** of **10+**  
- Git (optioneel, voor version control)

---

## 🚀 Snel starten

```bash
# 1. Dependencies installeren
pnpm install

# 2. Development server starten
pnpm run dev:devdemo
```

Standaard draait de dev-server op http://localhost:3000 (check de console-output om dit te bevestigen).

---

## 🧬 Projectstructuur

Een minimale setup ziet er zo uit:

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

**Belangrijkste mappen:**

- `apps/kitro-dev-demo/src/pages` → alle UI pages (React components)
- `apps/kitro-dev-demo/src/pages/api` → API routes (Hono handlers)
- `packages/kitro-blocks` → gedeelde blocks (Heading, Text, Card, enz.)

---

## 📄 Pages & Routing

Elke file in `src/pages` wordt automatisch een route.

**Voorbeeld: `src/pages/about.tsx`:**

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

**Regels:**
- `index.tsx` → `/`
- `docs.tsx` → `/docs`
- `contact.tsx` → `/contact`

Geen extra config nodig.

---

## 🧱 Blocks

Blocks zijn herbruikbare React components met duidelijke TypeScript props.

**Voorbeeld: een eenvoudige CustomBlock:**

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

**Gebruik in een page:**

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

## 🌐 API routes met Hono

Alle files in `src/pages/api` worden API endpoints.

**Voorbeeld: `src/pages/api/hello.ts`:**

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

**Nieuwe API route maken?**

Maak simpelweg een nieuw bestand, bijvoorbeeld:
- `src/pages/api/test.ts` → `/api/test`

---

## 🔄 Hot Reload (Dev mode)

De Dev Edition is ingesteld op fast feedback tijdens development:

1. Code aanpassen in `src/pages` of `packages/kitro-blocks`
2. Browser herlaadt automatisch (of via hot reload, afhankelijk van dev-server setup)

**Als je niet zeker weet of hot reload werkt:**

1. Start dev-server: `pnpm run dev:devdemo`
2. Open browser op `http://localhost:3000`
3. Pas een tekst in `src/pages/index.tsx` aan
4. Sla op → check of de wijziging direct zichtbaar is

---

## 🏗️ Production build & deploy (basis)

Let op: Dev Edition focust op DX. Onderstaande is een basisvoorbeeld; pas het aan op jouw infra.

**1. Build**

```bash
pnpm run build:devdemo
```

Dit genereert een productie-build voor de demo-app.

**2. Start in production mode**

```bash
pnpm run start:devdemo
```

Je kunt dit met PM2 of systemd runnen:

**PM2 voorbeeld:**

```bash
pm2 start "pnpm run start:devdemo" --name kitrojs-dev
pm2 save
```

---

## 🧪 Testing (planning)

Er is nog geen officiële testing guide, maar dit is de geplande richting:

- **Pages & Blocks:** React Testing Library + Vitest/Jest
- **API routes:** Hono + supertest/undici

Voorstellen en PR's voor een testing setup zijn welkom in `CONTRIBUTING.md`.

---

## 🗺️ Roadmap (Dev Edition)

Korte roadmap voor toekomstige versies:

- Uitgebreide hot-reload documentatie
- Officiële testing setup & voorbeelden
- Performance tips & best practices
- Integratievoorbeelden (auth, database, etc.)
- Voorbeelden van grotere apps (dashboard, blog, landing pages)

---

## 🤝 Contributing

We verwelkomen bijdragen!

**Lees eerst:** [CONTRIBUTING.md](CONTRIBUTING.md)

**Korte samenvatting:**

1. Fork de repository
2. Maak een feature branch: `git checkout -b feature/my-feature`
3. Commit je wijzigingen: `git commit -m "Add my new feature"`
4. Push naar je fork: `git push origin feature/my-feature`
5. Open een Pull Request

---

## 🔐 Security

Veiligheidsissues?

Lees [SECURITY.md](SECURITY.md) en mail:

**security@kitrojs.com**

Meld vulnerabilities niet openbaar in issues of PR titles.

---

## 📜 License & Copyright

- **License:** [MIT](LICENSE)
- **Copyright:** [COPYRIGHT.txt](COPYRIGHT.txt)
- **Notice:** [NOTICE](NOTICE)
- **Authors:** [AUTHORS](AUTHORS)

---

## 💜 Credits

KitroJS is ontwikkeld door Nico Vermaeck en zal stap voor stap groeien met community-bijdragen.

Als je KitroJS gebruikt in een project, vinden we het leuk als je ergens een kleine verwijzing plaatst zoals:

**"Built with KitroJS"**

Maar het is niet verplicht.

