# Ahmed Eid — ALF · Portfolio

Bilingual (English / Arabic, full RTL) portfolio for **Ahmed Eid (ALF)**, an AI-focused IT student at Borg El Arab Technological University (BATU).

Live: https://7lf.vercel.app

## Stack

- **Next.js 16** (App Router, static prerender) + **TypeScript** + **Tailwind CSS v4**
- **three.js**: the hero "ALF" mark is a real-time 3D satin ribbon built from a hand-authored centreline, with curvature-driven folds and a shader that writes the ribbon in on load
- **GSAP ScrollTrigger** + **Lenis**: pinned process walkthrough and scroll-scrubbed reveals
- **GitHub-backed projects**: public repository catalogue, native project dialogs, real screenshot galleries, optional videos, and safe Markdown documentation
- Respects `prefers-reduced-motion`; falls back to a static image when WebGL is unavailable

## Structure

```
src/content/site.ts        interface copy (EN + AR) and site links
src/content/github.ts      cached public GitHub repository feed
src/content/project-details.ts  on-demand GitHub project details
content/project-showcases.json  GitHub-managed screenshots, videos and optional project copy
src/content/meta.ts        metadata, Open Graph, JSON-LD
src/app/(en)/              English root layout  → /
src/app/(ar)/ar/           Arabic root layout   → /ar  (lang="ar" dir="rtl")
src/components/            Portfolio sections, header, motion, 3D ribbon stage
public/cv/                 downloadable CV
```

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

## Project showcases

See [the Arabic project-content guide](docs/project-showcases.md) for adding screenshots, video demos, bilingual descriptions, and captions through GitHub. Existing repositories without media still open a details dialog; screenshots and demo videos are never fabricated.
