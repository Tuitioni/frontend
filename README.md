# Tuitioni Frontend

A Next.js 14 (App Router) platform connecting students with tutors in Bangladesh. Features a public marketplace for browsing tutors and jobs, a teacher dashboard for profile management, and a full admin dashboard for platform administration.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS variables for theming
- **UI Components**: shadcn/ui (Radix primitives)
- **Charts**: Recharts + Tremor
- **Auth**: JWT-based (cookies for teachers, localStorage for admins)
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions + Docker

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Production build               |
| `npm run start`         | Start production server        |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format with Prettier           |
| `npm run test`          | Run tests in watch mode        |
| `npm run test:run`      | Run tests once                 |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for the full folder layout.

```
app/                    Routes and pages (4 route groups: admin, auth, authenticated, unauthenticated)
components/             Shared React components (ui, auth, layout, landing)
constants/              Static data and configuration
contexts/               React context providers (AuthContext)
hooks/                  Custom React hooks (useAuth, useToken, etc.)
lib/                    Utilities, services, and helpers
types/                  TypeScript type definitions
public/                 Static assets
```

## Conventions

- **Imports**: Always use absolute paths via `@/` aliases (e.g., `@/components/ui/button`)
- **Components**: PascalCase filenames (`DataTable.tsx`), shadcn/ui uses lowercase (`button.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Route groups**: `(admin)`, `(auth)`, `(authenticated)`, `(unauthenticated)` — each with its own layout
- **API routes**: RESTful naming under `app/api/`

## Tooling

- **Lint**: ESLint (extends Next core-web-vitals + import sorting + unused imports)
- **Format**: Prettier (configured via `.prettierrc`)
- **Pre-commit**: Husky + lint-staged (auto-lint and format on commit)
- **Editor**: `.editorconfig` for consistent formatting
- **Docker**: `Dockerfile` + `docker-compose.yml` for containerized deployment
