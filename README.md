# Tuitioni Frontend

The frontend for **Tuitioni**, a platform that connects students who need private tutors with teachers who offer tutoring (focused on Bangladesh). This is the part users actually see and click: the public website for browsing tutors and jobs, the teacher dashboard, and the admin dashboard.

This document explains, in plain English, how the frontend is built and how it fits together with the backend.

---

## The big picture

- **What it is:** A web application - all the pages and screens people interact with in their browser.
- **Built with:** [Next.js 14](https://nextjs.org/) using the **App Router** (the modern, folder-based way of defining pages in Next.js).
- **Language:** TypeScript.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for styling, with [shadcn/ui](https://ui.shadcn.com/) components (built on Radix) for buttons, dialogs, etc., and Tremor + Recharts for charts on the admin dashboard.
- **Talks to:** The Tuitioni backend API (the separate NestJS service).

An important architectural point: **the browser usually does not call the backend directly.** Instead, the Next.js server sits in the middle. The browser calls Next.js, and Next.js forwards the request to the real backend. This "middleman" pattern (called a BFF - Backend For Frontend) keeps the backend's address and details hidden from the browser and lets the frontend reshape data as needed.

```
Browser  ->  Next.js server (this app)  ->  Backend API (NestJS)  ->  MongoDB
   |               |
   |               +-- app/api/* route handlers act as a secure proxy
   +-- React pages, styled with Tailwind
```

---

## How the pages are organized (route groups)

In the App Router, folders inside `app/` become URLs. Tuitioni splits its pages into four **route groups** - the folder names in parentheses do not appear in the URL; they just group pages that share a layout and access level:

| Route group         | Who it's for                | Examples                                                                                        |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------- |
| `(unauthenticated)` | Anyone, logged in or not    | Home, About Us, Contact, browse Tutors, browse Jobs, Login, Register                            |
| `(auth)`            | The sign-in flow            | Admin sign-in page                                                                              |
| `(authenticated)`   | Logged-in teachers/students | The user dashboard, identity verification upload                                                |
| `(admin)`           | Admins only                 | The full admin dashboard (students, teachers, tuitions, payments, reports, announcements, jobs) |

The admin dashboard is the largest area. It has full management screens for each type of record, and most of them follow the same pattern: a list page, a detail page (`[id]`), and an edit page (`[id]/edit`).

---

## The "middleman" API layer

Inside `app/api/` there are server-side route handlers. These run on the Next.js server, not in the browser. Their job is to receive a request from the frontend, forward it to the real backend (using the `TUITIONI_API` address from the environment settings), and pass the answer back.

For example, when a teacher logs in:

1. The browser sends the username and password to `app/api/login/teacher`.
2. That handler forwards it to the backend's `/auth/login/teacher` endpoint.
3. The backend replies with a token, which flows back to the browser.

This layer covers things like login, registration, fetching and filtering teachers/tutors, posts, jobs, teacher profiles, and verification uploads. The benefit is that the browser never needs to know the backend's real URL, and error handling is consistent.

---

## How login and access control work

There are effectively two audiences with slightly different login handling:

- **Teachers / students** - after logging in, their JWT token is stored in a **cookie** (`access_token`). See `lib/auth/token.ts`.
- **Admins** - their token (`admin_token`) is stored in `localStorage` and mirrored to a cookie. The `AuthContext` (`contexts/AuthContext.tsx`) watches this token, automatically logs the admin out when it expires (it re-checks every 30 seconds), and redirects to the sign-in page.

**`middleware.ts`** is the gatekeeper that runs before pages load. It checks whether a valid token exists and:

- redirects users away from protected pages (`/dashboard`, `/profile`, `/admin-dashboard`) to the correct login page if they are not logged in, and
- redirects already-logged-in users away from the login/register pages.

A token is just a signed string from the backend that proves who the user is; the frontend attaches it to requests so the backend knows the request is authorized.

---

## The supporting folders

Beyond the pages themselves, the code is organized into reusable pieces:

| Folder        | What's in it                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | Reusable React building blocks: `ui/` (shadcn buttons, dialogs, tables), `layout/` (navbar and page structure), `landing/` (home-page sections), `auth/` (login-related pieces). |
| `contexts/`   | Shared state that any component can read - mainly `AuthContext` for the current login state.                                                                                     |
| `hooks/`      | Custom reusable logic, e.g. `useAuth`, `useToken`, `useAuthFetch` (making API calls with the token attached), `useDistrictsData`.                                                |
| `lib/`        | Helpers and services: `auth/` (token handling), `env.ts` (safely reading environment variables), `formatters.ts`, `utils.ts`, `ImageLoader.ts`.                                  |
| `constants/`  | Static data used across the app (dropdown data, testimonials, etc.).                                                                                                             |
| `types/`      | TypeScript definitions describing the shape of data (Student, Teacher, Post, Payment, Tuition, Report, Announcement, and so on) - these mirror the backend's data model.         |
| `public/`     | Static files like images and icons.                                                                                                                                              |

---

## Configuration (environment variables)

Settings live in a `.env` file (copy `.env.example` to start). The key ones:

```bash
# Backend API URL - used by the server-side API routes (the middleman layer)
TUITIONI_API=http://localhost:8000

# Backend API URL exposed to the browser (used by the admin dashboard)
NEXT_PUBLIC_API_URL=http://localhost:8000

# This site's own public address (used for SEO: sitemap and robots.txt)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Anything starting with `NEXT_PUBLIC_` is visible to the browser; everything else stays on the server only.

---

## Running it locally

You need Node.js and the backend running (or pointed at a deployed backend via `TUITIONI_API`).

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Useful commands:

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start the development server     |
| `npm run build`         | Create a production build        |
| `npm run start`         | Run the production build         |
| `npm run lint`          | Check code style with ESLint     |
| `npm run format`        | Auto-format with Prettier        |
| `npm run test`          | Run tests (Vitest) in watch mode |
| `npm run test:run`      | Run tests once                   |
| `npm run test:coverage` | Run tests with a coverage report |

---

## Tooling and deployment

- **Testing:** Vitest + Testing Library.
- **Code quality:** ESLint + Prettier, enforced automatically on every commit via Husky + lint-staged.
- **Containerization:** A `Dockerfile` and `docker-compose.yml` are provided for running the app in Docker.
- **CI/CD:** GitHub Actions (see `.github/`).

For a deeper file-by-file breakdown, see [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md).

---

## Folder reference

```
frontend/
├── app/                     # All pages and the server-side API proxy
│   ├── (unauthenticated)/   # Public pages: home, about, contact, tutors, jobs, login, register
│   ├── (auth)/              # Sign-in flow (admin)
│   ├── (authenticated)/     # Logged-in user dashboard + verification
│   ├── (admin)/             # Admin dashboard (manage everything)
│   ├── api/                 # Server-side "middleman" routes that forward to the backend
│   ├── layout.tsx           # The root layout wrapping every page
│   └── page.tsx             # The home page
├── components/              # Reusable UI: ui, layout, landing, auth
├── contexts/                # Shared state (AuthContext)
├── hooks/                   # Reusable logic (useAuth, useToken, useAuthFetch, ...)
├── lib/                     # Helpers and services (auth, env, formatters, utils)
├── constants/               # Static data
├── types/                   # TypeScript data definitions (mirror the backend model)
├── public/                  # Images and static assets
├── middleware.ts            # Route guard (redirects based on login state)
├── next.config.mjs          # Next.js configuration
└── tailwind.config.ts       # Styling configuration
```
