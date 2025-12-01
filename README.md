# JWT Starter Template

A fullstack starter template using **JWT (JSON Web Token)** authentication, mirroring the structure of the original `starter-template` but replacing server-side sessions with token-based auth.

## When to use this template

Use this JWT-based starter when:

- You need to support multiple clients (SPAs, mobile apps, third-party services) calling the same API.
- You want stateless authentication that scales well across instances and microservices.
- You prefer an explicit access/refresh token flow with rotation and short-lived access tokens.

Consider the **session-based starter** (`starter-template/`) instead when:

- Your app is primarily server-rendered and browser-only.
- You are comfortable with cookie-based sessions and don't need tokens outside the browser.

## Structure

- `backend/` – NestJS API with JWT auth, TypeORM, PostgreSQL, Swagger, Docker
- `frontend/` – Next.js 15 App Router, Redux Toolkit, Axios with JWT interceptors, TailwindCSS

## Quick Start

### Backend

1. Go to the backend folder:
   ```bash
   cd starter-template-jwt/backend
   ```
2. Copy env file and configure values:
   ```bash
   cp env.example .env
   ```
3. Run with Docker (Postgres + API):
   ```bash
   docker compose up -d
   ```
   Or run locally:
   ```bash
   npm install
   npm run start:dev
   ```

### Frontend

1. Go to the frontend folder:
   ```bash
   cd starter-template-jwt/frontend
   ```
2. Copy env file and configure API URL:
   ```bash
   cp env.example .env.local
   ```
3. Install deps and start dev server:
   ```bash
   npm install
   npm run dev
   ```

## Documentation

- Backend details: `starter-template-jwt/backend/README.md`
- Frontend details: `starter-template-jwt/frontend/README.md`
- High-level plan and design: `jwt-starter-plan.md` at the repo root
