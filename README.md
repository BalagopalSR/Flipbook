# Flipbook Maker (Internal)

Internal flipbook tool with login, SQLite database, and dashboard.

## Setup

```bash
npm install
npm run db:push
npm run dev
```

Copy `.env.example` to `.env` and adjust credentials:

```
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
JWT_SECRET=your-secret-key
DATABASE_URL="file:./dev.db"
```

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

SQLite file: `prisma/dev.db`

View data: `npm run db:studio`
