# Backend - JWT Authentication

NestJS API with JWT-based authentication, TypeORM, and PostgreSQL.

## Features

- **JWT Authentication** - Access and refresh token pair
- **Passport.js** - Local and JWT strategies
- **TypeORM** - Database ORM with PostgreSQL
- **Argon2** - Secure password hashing
- **Swagger** - API documentation with Bearer auth support
- **Docker** - Containerized development environment

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# (Optional) Create .env.local for local overrides
# .env.local is gitignored and takes precedence over .env
# Use this for local database passwords, ports, etc.
cp env.example .env.local

# Stop and remove containers AND volumes (this deletes existing data!)
docker compose down -v

# Start fresh with the new password
docker compose up -d

# Seed the database (optional)
npm run seed

# Or run locally (requires PostgreSQL)
npm run start:dev
```

> **Note**: If you have a local PostgreSQL instance running on port 5432, the Docker container is configured to use port 5433 to avoid conflicts. Update your `DATABASE_URL` in `.env.local` accordingly.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `JWT_ACCESS_SECRET` | Access token secret | - |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry | 15m |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | - |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login with credentials | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Bearer |
| GET | `/api/auth/me` | Get current user | Bearer |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List all products | Bearer |
| GET | `/api/products/:id` | Get product by ID | Bearer |
| POST | `/api/products` | Create product | Bearer |
| PATCH | `/api/products/:id` | Update product | Bearer |
| DELETE | `/api/products/:id` | Delete product | Bearer |

## JWT Flow

1. **Login** - POST `/api/auth/login` with email/password
2. **Receive Tokens** - Get `accessToken` (15min) and `refreshToken` (7 days)
3. **Authorize Requests** - Send `Authorization: Bearer <accessToken>` header
4. **Refresh** - When access token expires, POST `/api/auth/refresh` with refresh token
5. **Logout** - POST `/api/auth/logout` to invalidate refresh token

## Project Structure

```
src/
├── entities/           # TypeORM entities
├── guards/            # Auth guards (JWT, Local)
├── middlewares/       # Express middlewares
└── modules/
    ├── auth/         # Authentication module
    │   ├── dtos/     # Data transfer objects
    │   └── providers/ # Strategies and services
    └── product/      # Product CRUD module
        └── dtos/     # Product DTOs
```

## API Documentation

Visit `http://localhost:3000/api/docs` for Swagger UI.
