# Flipbook Maker (Internal)

Internal flipbook tool with login, file-based storage, and dashboard.

## Setup (local)

```bash
npm install
cp .env.example .env
npm run dev
```

Flipbooks are saved as JSON files in `data/flipbooks/` (no database).

Login uses environment variables only:

```
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
JWT_SECRET=your-secret-key
```

## Deploy to Vercel

No database required.

1. Push the project to GitHub and import it in Vercel.
2. Add **Vercel Blob** storage: Vercel Dashboard → **Storage** → **Blob** → Connect to your project.  
   This sets `BLOB_READ_WRITE_TOKEN` automatically.
3. Add environment variables:
   - `JWT_SECRET` — long random string
   - `AUTH_USERNAME` — login username
   - `AUTH_PASSWORD` — login password
4. Deploy. Flipbooks are stored as private JSON files in Vercel Blob.

## Usage

1. Open the app and sign in
2. Create flipbooks from **Create** — they are saved as files
3. Revisit them anytime from the **Dashboard**

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

## Storage

| Environment | Where flipbooks live |
|-------------|----------------------|
| Local dev | `data/flipbooks/{id}.json` |
| Vercel | Vercel Blob (`flipbooks/{id}.json`) |

Recent view history stays in the browser (`localStorage`), not on the server.
