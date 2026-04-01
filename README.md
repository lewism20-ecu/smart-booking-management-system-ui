# Smart Booking Management System UI

Frontend foundation for the SBMS React app.

Current scope:

- React + Vite application foundation
- Single login page (MUI)
- Login supports mock-first testing, then real API integration

## Tech Stack

- React (JavaScript)
- Vite
- React Router
- MUI
- MSW
- Vitest + Testing Library

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

## Login API Contract (from SBMS backend)

- Endpoint: `POST /api/v1/auth/login`
- Base URL (local): `http://localhost:8080/api/v1`
- Request body:

```json
{
  "email": "alice@example.com",
  "password": "User123!"
}
```

- Success response:

```json
{
  "token": "<jwt>",
  "user": {
    "userId": 3,
    "email": "alice@example.com",
    "role": "user"
  }
}
```

## Recommended Testing Order

1. UI-first testing with mock data:

- `make dev` (default) or `make dev-mock`

2. Integration with local API:

- `make dev-local`

3. Integration with hosted API (including APIs backed by Cloud SQL):

- `make dev-hosted HOSTED_API_BASE_URL=https://your-api-domain/api/v1`

## Auth Modes

- Mock mode: calls `/mock-api/v1/auth/login` via MSW.
- API mode: calls `${VITE_API_BASE_URL}/auth/login`.

Mock credentials (from imported data):

- `admin@example.com` / `Admin123!`
- `manager@example.com` / `Manager123!`
- `alice@example.com` / `User123!`
- `bob@example.com` / `User123!`

## Environment Variables

Environment variables are optional. Make targets already set the right defaults for each testing stage.

Create a `.env.local` only if you want to override defaults:

```env
VITE_AUTH_MODE=mock
VITE_MOCK_BASE_URL=/mock-api/v1
VITE_ENABLE_MOCK_WORKER=true

# Later switch to API mode
# VITE_AUTH_MODE=api
# VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Notes:

- `make dev` uses mock mode by default for UI-first testing.
- Use `make dev-local` or `make dev-hosted` when you want real backend integration.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run test` - run tests once
- `npm run test:watch` - run tests in watch mode
