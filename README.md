# Ranah Aksara

A personal serial novel website built with TanStack Start (React + Vite), deployed on Netlify. It provides a clean, minimalist reading experience with dark/light theme switching.

## Features

- **Novel library** — browse all novels with genre tags, status, and chapter count
- **Chapter reading** — clean reading mode with previous/next navigation
- **Upload guide** — step-by-step instructions for adding new content via GitHub, plus a frontmatter generator form
- **Dark/Light theme** — persisted in localStorage, initialized before first paint to avoid flash

## Tech Stack

- **Framework**: TanStack Start (React 19 + Vite)
- **Routing**: TanStack Router (file-based)
- **Content**: Content Collections (Markdown files compiled at build time)
- **Styling**: Custom CSS design system + Tailwind v4 utilities
- **Deployment**: Netlify

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Adding Content

Content lives in `content/cerita/`. No database, no CMS — just Markdown files.

**New novel** — create `content/cerita/your-novel-slug/novel.md`:
```yaml
---
title: "Your Novel Title"
author: "Author Name"
description: "Short description."
genres:
  - Fantasy
status: ongoing   # ongoing | completed | hiatus
cover_color: "#c8a44a"
updated_at: "2026-06-22"
---
```

**New chapter** — create `content/cerita/your-novel-slug/bab-1.md`:
```yaml
---
title: "Chapter Title"
chapter_number: 1
published_at: "2026-06-22"
---

Chapter content in Markdown...
```

Push to GitHub → Netlify redeploys automatically.

## URL Structure

| URL | Page |
|-----|------|
| `/` | Landing page |
| `/cerita` | All novels |
| `/cerita/[novel-slug]` | Chapter list |
| `/cerita/[novel-slug]/bab-1` | Reading mode |
| `/upload` | Upload guide & generator |
