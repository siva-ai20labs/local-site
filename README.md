# LocalSite AI — Admin Dashboard

Full-stack admin dashboard for **LocalSite AI**: scrape high-rated local-business
prospects, manage them with role-gated access, and build a professional static
website for any prospect that lacks one.

## Stack

- **Next.js 14 (App Router) + TypeScript + Tailwind** — UI and API routes in one app
- **Prisma + SQLite** — file-based, zero-infra (swappable to Postgres later)
- **Auth** — email/password (bcrypt) + HMAC-signed session cookie; roles `admin` / `user`,
  enforced **server-side on every API route** (401 unauthenticated, 403 non-admin)

## Quick start

```bash
cp .env.example .env          # adjust SESSION_SECRET / credentials as needed
npm install                   # also runs `prisma generate`
npm run db:migrate            # apply migrations (creates prisma/dev.db)
npm run db:seed               # seed admin + viewer users and 8 Austin prospects
npm run dev                   # http://localhost:3000
```

Production-style run: `npm run build && npm run start`.

## Seeded credentials

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| admin | `admin@localsite.ai`   | `admin1234` |
| user  | `viewer@localsite.ai`  | `viewer1234`|

(Overridable via `ADMIN_*` / `USER_*` env vars — see `.env.example`.)

## How it works

- **Scraper** (`src/lib/scraper/`) — provider-based. Default `seed` provider loads the
  curated Austin Leads dataset; set `APIFY_TOKEN` to switch to the Apify Google Maps
  adapter. Runs upsert-dedup on `(businessName, address)` and log each run to
  `scraper_runs`. Manual trigger: admin-only `POST /api/scraper/run`.
- **Dashboard** (`/dashboard`) — role-gated prospect table with expandable detail rows
  (contact, hours, rating, top reviews, Maps link, scrape source/date), filter + sort,
  and a "Run Scraper" button.
- **Conditional action** — `has_website = true` shows **Visit Site** (opens the existing
  site); `has_website = false` shows **Build Site**, which synchronously generates a
  static site under `sites/<slug>/`, writes `built_site_url` back, flips status to
  `site_built`, and switches the button to **View Site**. Failures surface a **Retry**
  without losing prospect data.
- **Built sites** are served by `GET /sites/<slug>/` (see `src/app/sites/[...slug]/`).

## API

| Method | Route                         | Access | Purpose                          |
|--------|-------------------------------|--------|----------------------------------|
| POST   | `/api/auth/login`             | public | Sign in, set session cookie      |
| POST   | `/api/auth/logout`            | public | Clear session                    |
| GET    | `/api/auth/me`                | any    | Current user (or null)           |
| GET    | `/api/prospects`              | admin  | Paginated/filtered/sorted list   |
| POST   | `/api/scraper/run`            | admin  | Run the active scraper provider  |
| POST   | `/api/prospects/:id/build`    | admin  | Build a static site for a lead   |

Non-admins receive **403** and unauthenticated requests **401** on every admin route.

## Existing static sites

`sites/bylizstudio/` is a hand-built reference site and is served via the same route.

