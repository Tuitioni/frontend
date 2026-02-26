# Project Structure

```
tuitioni-frontend/
├── app/                              # Next.js App Router — routes and pages only
│   ├── (admin)/                      # Admin dashboard route group (protected)
│   │   ├── layout.tsx                # Admin layout with sidebar + auth guard
│   │   └── admin-dashboard/          # All admin CRUD pages
│   │       ├── page.tsx              # Dashboard overview with charts
│   │       ├── teacher/              # Teacher management (list, detail, edit)
│   │       ├── student/              # Student management
│   │       ├── tuition/              # Tuition management
│   │       ├── payment/              # Payment management
│   │       ├── report/               # Report management
│   │       ├── announcement/         # Announcement management
│   │       ├── job/                  # Job post management
│   │       └── setting/              # Admin settings
│   ├── (auth)/                       # Admin authentication route group
│   │   └── signin/                   # Admin sign-in page
│   ├── (authenticated)/              # Teacher dashboard route group (protected)
│   │   └── dashboard/                # Teacher profile and verification
│   ├── (unauthenticated)/            # Public pages route group
│   │   ├── layout.tsx                # Public layout with Navbar + Footer
│   │   ├── login/                    # Teacher login
│   │   ├── register/                 # Teacher registration
│   │   ├── tutors/                   # Browse tutors
│   │   ├── jobs/                     # Browse teaching jobs
│   │   ├── contact/                  # Contact form
│   │   └── aboutUs/                  # About page + FAQ
│   ├── api/                          # API route handlers (Next.js server)
│   │   ├── auth/                     # Authentication endpoints
│   │   ├── teacher/                  # Teacher CRUD endpoints
│   │   ├── jobs/                     # Job listing endpoints
│   │   ├── health/                   # Health check endpoint
│   │   └── ...                       # Other API routes
│   ├── page.tsx                      # Home/landing page
│   ├── layout.tsx                    # Root layout (fonts, Toaster, metadata)
│   ├── globals.css                   # Global CSS with Tailwind + CSS variables
│   ├── error.tsx                     # Root error boundary
│   ├── loading.tsx                   # Root loading state
│   ├── not-found.tsx                 # 404 page
│   ├── global-error.tsx              # Global error handler
│   ├── robots.ts                     # SEO robots.txt generation
│   └── sitemap.ts                    # SEO sitemap generation
│
├── components/                       # Shared React components
│   ├── ui/                           # Base UI components
│   │   ├── admin/                    # Admin-specific UI (DataTable, Sidebar, AdminCard, Form)
│   │   ├── button.tsx, card.tsx...   # shadcn/ui primitives (lowercase convention)
│   │   ├── LoadingSpinner.tsx        # Custom loading indicators
│   │   ├── badge.tsx                 # Status badge with variants
│   │   ├── empty-state.tsx           # Empty state placeholder
│   │   ├── toast.tsx, toaster.tsx    # Toast notification system
│   │   └── use-toast.ts             # Toast hook
│   ├── auth/                         # Authentication form components
│   │   ├── AuthFormContainer.tsx     # Login/register form with token handling
│   │   ├── AuthForm.tsx              # Form wrapper
│   │   ├── AuthCard.tsx              # Card wrapper for auth pages
│   │   ├── withAuth.tsx              # HOC for protected routes
│   │   └── index.ts                  # Barrel export
│   ├── layout/                       # Layout components (Navbar, Footer, MobileMenu)
│   └── landing/                      # Landing page components (Hero, TopTutors, etc.)
│
├── constants/                        # Static data and configuration constants
│   ├── data.ts                       # Education levels, YouTube config, channel config
│   ├── testimonials.ts               # Testimonial data
│   └── index.ts                      # Barrel export
│
├── contexts/                         # React context providers
│   └── AuthContext.tsx               # Admin authentication state (login, logout)
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Teacher auth (token-based, cookies)
│   ├── useAuthFetch.ts               # Authenticated fetch wrapper (admin)
│   ├── useToken.ts                   # JWT token decoder
│   ├── useDistrictsData.ts           # Bangladesh districts data fetcher
│   └── index.ts                      # Barrel export
│
├── lib/                              # Utilities, services, and helpers
│   ├── auth/                         # Authentication services
│   │   ├── token.ts                  # Token CRUD (cookies, teacher auth)
│   │   └── admin.ts                  # Admin token validation + error handling
│   ├── __tests__/                    # Unit tests for utilities
│   │   ├── utils.test.ts
│   │   └── env.test.ts
│   ├── utils.ts                      # Tailwind cn() class merger
│   ├── env.ts                        # Environment variable accessor
│   ├── formatters.ts                 # Date formatting utility
│   └── ImageLoader.ts               # Next.js image optimization loader
│
├── types/                            # TypeScript type definitions
│   ├── index.ts                      # Shared enums (Gender, Medium, PaymentMethod, etc.)
│   ├── auth.ts                       # Auth form types (LoginFormData, RegisterFormData)
│   ├── teacher.ts                    # Teacher interfaces
│   ├── Student.ts                    # Student interfaces
│   ├── Tuition.ts                    # Tuition interfaces
│   ├── Payment.ts                    # Payment interfaces
│   ├── Report.ts                     # Report interfaces
│   ├── Announcement.ts              # Announcement interfaces
│   ├── Post.ts                       # Job post interfaces
│   └── Testimonial.ts               # Testimonial interface
│
├── public/                           # Static assets served at root
│   ├── favicon.ico                   # Primary favicon
│   ├── Logo.svg                      # Brand logo
│   └── [favicon variants]           # Apple touch icon, Android Chrome icons
│
├── .github/workflows/               # CI/CD pipeline (GitHub Actions)
├── .husky/                           # Git hooks (pre-commit: lint-staged)
│
├── Dockerfile                        # Production Docker image
├── docker-compose.yml                # Docker Compose for local dev
├── middleware.ts                      # Next.js middleware (route protection)
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration with path aliases
├── vitest.config.ts                  # Vitest test configuration
├── .env.example                      # Environment variables template
└── package.json                      # Dependencies and scripts
```

## Key Conventions

| Category             | Convention               | Example                              |
| -------------------- | ------------------------ | ------------------------------------ |
| Folders              | kebab-case               | `admin/`, `ui/`, `landing/`          |
| Components           | PascalCase               | `DataTable.tsx`, `AdminCard.tsx`     |
| shadcn/ui components | lowercase                | `button.tsx`, `card.tsx`             |
| Hooks                | camelCase + `use` prefix | `useAuth.ts`, `useToken.ts`          |
| Utilities            | camelCase                | `formatters.ts`, `utils.ts`          |
| Types                | PascalCase (domain)      | `Teacher.ts`, `Student.ts`           |
| Constants            | UPPER_SNAKE_CASE values  | `EDUCATION_LEVELS`, `YOUTUBE_CONFIG` |

## Import Aliases

All imports use absolute paths via TypeScript path aliases:

```
@/components/*  → components/*
@/constants/*   → constants/*
@/contexts/*    → contexts/*
@/hooks/*       → hooks/*
@/lib/*         → lib/*
@/types/*       → types/*
```
