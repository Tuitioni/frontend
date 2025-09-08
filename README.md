This is a Next.js 14 app (App Router) for Tuitioni.

## Getting Started

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Project Conventions

- Directory aliases: use `@/` from project root (see `tsconfig.json`).
- UI components live under `components/` and `app/**/components/` when route-specific.
- API routes under `app/api/**` follow RESTful naming.
- Prefer server components by default; mark client components with `"use client"`.
- Use `services/` for API helpers and side-effect utilities.
- Shared types in `types/` and `lib/types/**`.
- Images: whitelist domains in `next.config.mjs`. Use `next/image`.

## Tooling

- Lint: `npm run lint` (extends Next core-web-vitals)
- Format: Prettier is configured via `.prettierrc` and `.prettierignore`.
- Editor consistency via `.editorconfig`.

## Scripts

```bash
npm run build
npm run start
npm run lint
```
