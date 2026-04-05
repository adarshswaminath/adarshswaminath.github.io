# Adarsh.dev — Portfolio

Personal portfolio built with **Astro**, **Tailwind CSS v4**, and
**TypeScript**.

## Quick Start

With **Bun** (this repo includes a `bun.lock`):

```bash
bun install
bun run dev       # → http://localhost:4321
bun run build     # → static output in /dist
```

With **npm**:

```bash
npm install
npm run dev
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/                       # Small reusable pieces (button, tag, labels, dividers)
│   ├── sections/home-page/       # Homepage sections (hero, about, projects, …)
│   └── layout/                   # Navbar, Footer, Section wrapper, drawer, code window, tracing beam
│
├── data/                         # Content and constants (no UI)
│   ├── projects.ts
│   ├── experiences.ts
│   ├── navigation.ts
│   └── types.ts
│
├── lib/                          # Shared helpers (e.g. className utilities)
│
├── assets/                       # Images and SVGs used in components
│
├── scripts/                      # Client-side JS (browser) — one setup per file
│   ├── typing.ts
│   ├── tracing-beam.ts
│   ├── drawer.ts
│   └── mermaid-drawer.ts
│
├── layouts/
│   ├── Layout.astro              # Base HTML shell
│   └── BlogLayout.astro          # Blog post wrapper
│
├── pages/
│   ├── index.astro               # Homepage — composes sections
│   └── blog/
│       ├── index.astro           # Blog listing
│       └── *.md                  # Blog posts
│
└── styles/
    └── global.css                # Tailwind + global styles
```

## How It's Organized

- **`pages/index.astro`** pulls in homepage sections and keeps the file short
- **`data/`** holds projects, experience, and nav content away from markup
- **`components/ui/`** holds small building blocks used across sections
- **`components/layout/`** holds site chrome (nav, footer) and shared layout pieces
- **`components/sections/home-page/`** holds each homepage block as its own file
- **`lib/`** holds tiny shared utilities
- **`scripts/`** holds browser scripts, split so each file has one clear job

## Key Patterns

| Pattern                | Where                                      | Why                                        |
| ---------------------- | ------------------------------------------ | ------------------------------------------ |
| Data separated from UI | `data/*.ts` → section components           | Change copy without hunting through markup |
| Reusable UI atoms      | `components/ui/` (barrel in `ui/index.ts`) | One place for buttons, tags, and labels    |
| Shared types           | `data/types.ts`                            | Same shapes for data and components        |
| Script modules         | `scripts/*.ts`                             | Easier to read and maintain                |

## Adding Content

- **New project** → `src/data/projects.ts`
- **New blog post** → `src/pages/blog/your-post.md` with frontmatter
- **New experience** → `src/data/experiences.ts`
- **New homepage section** → add `src/components/sections/home-page/YourSection.astro`, export it from `sections/home-page/index.ts`, then import it in `src/pages/index.astro`

## Keeping the code tidy

**Prettier** keeps spacing, quotes, and line breaks consistent. **ESLint** flags likely bugs and style problems before they reach production.

Useful commands:

| Command            | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `bun run lint`     | Check code with ESLint (`npm run lint` works too) |
| `bun run format:check` | Check formatting with Prettier                |
| `bun run format`   | Auto-fix formatting across the repo             |
| `bun run lint:fix` | Auto-fix what ESLint can fix safely             |

GitHub Actions runs **lint** and **format:check** before building and deploying (see `.github/workflows/deploy.yml`), so running them locally avoids surprise CI failures.

## Tech

- [Astro 6](https://astro.build)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/)
- [Lucide icons](https://lucide.dev)
