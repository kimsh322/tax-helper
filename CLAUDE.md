# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

## Architecture

This is a **Next.js 16 App Router** project with TypeScript and Tailwind CSS v4, managed with pnpm.

- `app/` — All routes and UI live here (App Router convention)
- `app/layout.tsx` — Root layout with fonts and metadata
- `app/page.tsx` — Home page
- `app/globals.css` — Global styles and Tailwind configuration
- `@/*` path alias maps to the project root

## Skills

This project uses Claude Code skills in `.agents/skills/`:

### `frontend-design`
Use when building UI components or pages. Commit to a bold, distinctive aesthetic direction before coding — choose a conceptual tone (brutally minimal, maximalist, retro-futuristic, etc.) and execute it precisely. Avoid generic AI aesthetics: no Inter/Roboto/Arial fonts, no purple gradients on white, no cookie-cutter layouts. Use distinctive typography pairings, cohesive color with CSS variables, CSS animations and Motion library for React, and unexpected spatial composition.

### `vercel-react-best-practices`
Apply when writing or reviewing React/Next.js code. Key priorities:
1. **Eliminating Waterfalls** (CRITICAL): `Promise.all()` for independent fetches, start promises early in API routes, use Suspense boundaries
2. **Bundle Size** (CRITICAL): Import directly (no barrel files), `next/dynamic` for heavy components, defer third-party scripts post-hydration
3. **Server-Side**: `React.cache()` for per-request dedup, parallelize server component fetches, minimize data passed to client
4. **Re-renders**: Primitive effect dependencies, functional setState, no inline component definitions, derive state during render not in effects

Full rules are in `.agents/skills/vercel-react-best-practices/rules/` and compiled in `AGENTS.md`.
