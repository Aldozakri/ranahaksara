# Ranah Aksara — Agent Guide

Personal serial novel reading site. Static site (Netlify) — content is Markdown files compiled at build time via Content Collections. No database, no backend beyond Netlify hosting.

## Architecture

```
content/cerita/
  [novel-slug]/
    novel.md          # Novel metadata (title, author, desc, genres, status, cover_color)
    bab-1.md          # Chapter 1 (title, chapter_number, published_at + body)
    bab-2.md          # Chapter 2
    ...

src/
  routes/
    __root.tsx                      # HTML shell, global nav, ThemeToggle
    index.tsx                       # / — landing page with hero + featured novels
    cerita.tsx                      # Layout (Outlet only) for /cerita/*
    cerita.index.tsx                # /cerita — novels grid
    cerita.$novel.tsx               # Layout (Outlet only) for /cerita/$novel/*
    cerita.$novel.index.tsx         # /cerita/$novel — chapter list + novel header
    cerita.$novel.$bab.tsx          # /cerita/$novel/$bab — reading mode
    upload.tsx                      # /upload — admin guide + frontmatter generator
  components/
    ThemeToggle.tsx                 # Dark/light toggle, uses localStorage
    ui/card.tsx                     # Shadcn card (utility)
  styles.css                        # Full CSS design system (CSS vars + component styles)
  lib/utils.ts                      # cn() utility

content-collections.ts              # Defines `novels` and `chapters` collections
```

## Routing Conventions

Flat file routing (TanStack Router). Dots = path separators:
- `cerita.tsx` = layout for `/cerita/*` — renders `<Outlet/>` only
- `cerita.index.tsx` = page at `/cerita`
- `cerita.$novel.tsx` = layout for `/cerita/$novel/*` — renders `<Outlet/>` only
- `cerita.$novel.index.tsx` = page at `/cerita/$novel`
- `cerita.$novel.$bab.tsx` = page at `/cerita/$novel/$bab`

## Content Collections

Two collections in `content-collections.ts`:
- `novels`: matches `**/novel.md`, adds `novelSlug` (derived from directory name)
- `chapters`: matches `**/bab-*.md`, adds `novelSlug` + `babSlug`

Usage: `import { allNovels, allChapters } from 'content-collections'`

Always sort chapters by `chapter_number` asc before display.

## Design System

CSS custom properties in `src/styles.css`. Themes via `data-theme` on `<html>`:
- Dark (default): `--bg: #111009`, `--accent: #c8a44a` (warm gold)
- Light: `--bg: #faf7f2`, `--accent: #8b6625`

Font variables: `--font-display` (Cormorant Garamond), `--font-reading` (Lora), `--font-ui` (DM Sans).

## Coding Conventions

- Content data accessed synchronously (no loaders needed — static array)
- `notFound()` from TanStack Router thrown when novel/chapter is not found
- `marked` library for Markdown → HTML in reading pages
- CSS component classes over Tailwind for anything with semantic meaning
- No inline styles except for dynamic values (e.g. `cover_color`)
- `activeProps={{ className: 'active' }}` on nav Links for active state styling

## Adding Content

Create `content/cerita/slug/novel.md` + `bab-N.md` files, push to GitHub, Netlify redeploys.
