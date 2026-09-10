# Sibol Backend — Local Setup

## Prerequisites
- Node.js (v24+)
- PostgreSQL (v18+), running locally

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a local Postgres database named `sibol`:
   ```
   psql -U postgres -h localhost
   ```
   then inside psql:
   ```sql
   CREATE DATABASE sibol;
   ```

3. Copy the env template and fill in your own values:
   ```
   cp .env.example .env
   ```
   - `PGPASSWORD` — your local Postgres password
   - `SESSION_SECRET` — any random string (used to sign session cookies)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — **ask Tristan for these directly** (Discord/Messenger, never commit them). They're tied to the Sibol Google Cloud project. The server will fail to start without these set to *something*, even if you're not testing Google login yourself.
   - If you want to actually log in with Google yourself (not just have the server boot), also ask Tristan to add your Google account as a "test user" in the Google Cloud Console — the app isn't public/verified yet, so only approved accounts can log in.

4. Load the database schema:
   ```
   psql -U postgres -d sibol -h localhost
   ```
   then inside psql:
   ```
   \i db/schema.sql
   ```

5. Start the server:
   ```
   npm run dev
   ```

6. Confirm it's working:
   ```
   curl -UseBasicParsing http://localhost:3000/api/health
   ```
   Should return `{"status":"ok","dbTime":"..."}`.

## API reference

| Method | Route | Body | Notes |
|---|---|---|---|
| POST | `/api/signup` | `{ name, email, password }` | Password: 8-16 chars, 1 uppercase, 1 number |
| POST | `/api/login` | `{ email, password }` | Sets a session cookie |
| GET | `/auth/google` | — | Redirect the browser here directly (not a fetch call) |
| POST | `/api/logout` | — | Clears the session |
| GET | `/api/me` | — | Returns the logged-in user, or `401` if not logged in. Use this to decide whether to show gated UI. |
| POST | `/api/connect` | — | Gated example route — `401` unless logged in |

**Important for frontend integration:** this backend uses session cookies, not tokens. Every request must be sent with `credentials: "include"` (fetch) or `withCredentials: true` (axios), or the login session won't be recognized.
