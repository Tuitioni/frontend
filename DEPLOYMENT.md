# Frontend Deployment — Vercel

The frontend deploys to **Vercel** (auto-deploy on push to `main`). The full
end-to-end runbook (database, storage, backend, wiring, domains) lives in the
**backend repo**: `Tuitioni/backend → DEPLOYMENT.md`.

## Quick version

1. [vercel.com](https://vercel.com) → **Add New → Project** → import `Tuitioni/frontend`.
   Next.js is auto-detected; no build config needed.
2. Set environment variables:
   ```
   TUITIONI_API         = https://<backend>.up.railway.app   # server-side proxy target
   NEXT_PUBLIC_API_URL  = https://<backend>.up.railway.app   # admin dashboard (browser)
   NEXT_PUBLIC_SITE_URL = https://<project>.vercel.app        # this site (SEO/sitemap)
   ```
3. Deploy. Then set the backend's `ALLOWED_ORIGINS` to this Vercel URL (CORS).

## Notes

- `next.config.mjs` has `output: 'standalone'` — harmless on Vercel (used by the
  Docker image in `Dockerfile`/`docker-compose.yml` for self-hosting if ever needed).
- `.github/workflows/ci.yml` runs lint / typecheck / test / build as PR checks;
  Vercel handles the actual deploy.
- Custom domain: add it in Vercel → Domains, then set `NEXT_PUBLIC_SITE_URL` to it.
