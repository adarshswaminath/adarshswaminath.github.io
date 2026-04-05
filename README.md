# Adarsh.dev — Portfolio

Personal portfolio built with **Astro**, **Tailwind CSS v4**, and
**TypeScript**.

## Quick Start

```bash
npm install
npm run dev       # → localhost:4321
npm run build     # → static output in /dist
```

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Reusable atoms (button, tag, meta-label, divider)
│   ├── sections/            # Page sections (hero, about, projects, experience, blog-preview, contact)
│   └── layout/              # Structural wrappers and global UI
│       ├── Navbar.astro     # Site navigation
│       ├── Footer.astro     # Site footer
│       ├── Section.astro    # Wrapper with consistent padding/heading
│       ├── CodeWindow.astro # Terminal-style code display
│       ├── ProjectDrawer.astro # Slide-in project detail panel
│       └── TracingBeam.astro # Scroll-tracking line on the left
│
├── data/                    # Content & constants (no UI)
│   ├── projects.ts          # All project data with rich metadata
│   ├── experiences.ts       # Work experience entries
│   ├── navigation.ts        # Nav items, stack tags, achievements, social links
│   └── types.ts             # Shared TypeScript interfaces
│
├── scripts/                 # Client-side JavaScript (runs in browser)
│   ├── typing.ts            # Code typing animation
│   ├── tracing-beam.ts      # Scroll beam animation
│   └── drawer.ts            # Project drawer open/close logic
│
├── layouts/
│   ├── Layout.astro         # Base HTML shell (fonts, meta, body)
│   └── BlogLayout.astro     # Blog post wrapper
│
├── pages/
│   ├── index.astro          # Homepage — composes section components
│   └── blog/
│       ├── index.astro      # Blog listing page
│       └── *.md             # Blog posts (markdown)
│
└── styles/
    └── global.css           # Tailwind import + drawer animations + prose styles
```

## How It's Organized

- **`pages/index.astro`** is just composition — it imports sections and wires
  them together (~45 lines)
- **`data/`** holds all content separately from UI, so you can update
  projects/experience without touching components
- **`components/ui/`** has small reusable pieces (buttons, tags, labels) used
  across multiple sections
- **`components/layout/`** contains structural wrappers and global UI elements
  like the Navbar, Footer, and sliding Drawer
- **`components/sections/`** has self-contained page sections — each one owns
  its own markup and imports its data
- **`scripts/`** has client-side JS split by feature — each file exports one
  setup function

## Key Patterns

| Pattern                | Where                            | Why                                           |
| ---------------------- | -------------------------------- | --------------------------------------------- |
| Data separated from UI | `data/*.ts` → `sections/*.astro` | Update content without touching components    |
| Reusable UI atoms      | `ui/index.ts` (barrel export)    | Consistent styling, single source of truth    |
| Shared types           | `data/types.ts`                  | Type safety between data files and components |
| Script modules         | `scripts/*.ts`                   | Clean separation, tree-shakeable              |

## Adding Content

- **New project** → add entry to `src/data/projects.ts`
- **New blog post** → create `src/pages/blog/your-post.md` with frontmatter
- **New experience** → add entry to `src/data/experiences.ts`
- **New section** → create `src/components/sections/YourSection.astro`, add to
  `pages/index.astro`

## Tech

- [Astro 6](https://astro.build) — static site generator
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first CSS
- [Lucide icons](https://lucide.dev) — via `lucide-astro`
- Fonts: Inter (sans) + JetBrains Mono (mono) via Google Fonts
