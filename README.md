# Flipbook Maker (Internal)

Internal flipbook tool with login, PostgreSQL database, and dashboard.

## Setup (local)

1. Create a free [Neon](https://neon.tech) Postgres database (or use any Postgres host).
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, `AUTH_USERNAME`, and `AUTH_PASSWORD`.
3. Run:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Deploy to Vercel

SQLite (`file:./dev.db`) **does not work** on Vercel — serverless functions have no persistent local disk.

1. Create a Neon Postgres database and copy its connection string.
2. In the Vercel project → **Settings → Environment Variables**, add:
   - `DATABASE_URL` — Neon connection string (`?sslmode=require`)
   - `JWT_SECRET` — long random string
   - `AUTH_USERNAME` — login username
   - `AUTH_PASSWORD` — login password
3. Redeploy. The build runs `prisma db push` and seeds the admin user automatically.

## Usage

1. Open http://localhost:3000
2. Sign in with your credentials
3. You are redirected to the **Dashboard**
4. Create flipbooks from **Create** — they are saved to the database

## Routes

| Route | Description |
|-------|-------------|
| `/` | Login page |
| `/dashboard` | Flipbook library |
| `/upload` | Create flipbook |
| `/viewer/[id]` | View flipbook |
| `/customize/[id]` | Customize |
| `/analytics/[id]` | Analytics (mock) |
| `/settings` | Settings |

## API

- `POST /api/auth/login` — Sign in
- `POST /api/auth/logout` — Sign out
- `GET /api/flipbooks` — List flipbooks
- `GET/PUT/DELETE /api/flipbooks/[id]` — CRUD
- `POST /api/flipbooks/[id]/duplicate` — Duplicate

## Database

PostgreSQL (recommended: [Neon](https://neon.tech) free tier).

View data: `npm run db:studio`
