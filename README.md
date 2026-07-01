# Flipbook Maker (Internal)

Internal flipbook tool with login, PostgreSQL database, and dashboard.

## Setup

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Copy `.env.example` to `.env` and set your PostgreSQL `DATABASE_URL` plus auth credentials.

See **PostgreSQL setup** below for first-time local installation.

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

PostgreSQL via Prisma. Browse data: `npm run db:studio`

### PostgreSQL setup (local, Windows)

1. **Install PostgreSQL** — https://www.postgresql.org/download/windows/  
   Use the installer; remember the `postgres` superuser password. Default port: `5432`.

2. **Create database and user** — open **SQL Shell (psql)** or pgAdmin, then run:

```sql
CREATE USER flipbook WITH PASSWORD 'flipbook';
CREATE DATABASE flipbook OWNER flipbook;
GRANT ALL PRIVILEGES ON DATABASE flipbook TO flipbook;
```

Use your own password instead of `flipbook` in production.

3. **Configure `.env`:**

```
DATABASE_URL="postgresql://flipbook:flipbook@localhost:5432/flipbook?schema=public"
```

4. **Apply schema and seed default user:**

```bash
npm run db:push
npm run db:seed
```

Creates the login user from `AUTH_USERNAME` / `AUTH_PASSWORD` in `.env` (default: `admin` / `admin123`).

5. **Start the app:**

```bash
npm run dev
```

The default login user is created by `npm run db:seed` (or on first sign-in if you skip seeding).

### Move to a live server later

1. Create PostgreSQL on your host (Neon, Supabase, Railway, RDS, or VPS).
2. Set production `DATABASE_URL` on the server (same format, remote host).
3. Run `npx prisma db push` or `npx prisma migrate deploy` on deploy.
4. Set strong `JWT_SECRET`, `AUTH_USERNAME`, and `AUTH_PASSWORD` in production.
