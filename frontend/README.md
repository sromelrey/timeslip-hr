# Frontend - JWT Authentication

Next.js 15 App Router with Redux Toolkit and JWT authentication.

## Features

- **Next.js 15** - App Router with React 19
- **Redux Toolkit** - State management with slices and thunks
- **JWT Auth** - Token storage in localStorage with auto-refresh
- **TailwindCSS** - Utility-first CSS framework
- **Middleware** - Route protection using auth cookie flag

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Run development server
npm run dev
```

The app runs on `http://localhost:3001`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., `http://localhost:3000/api`) |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── sign-in/           # Login page
│   ├── products/          # Protected products page
│   ├── layout.tsx         # Root layout with providers
│   └── providers.tsx      # Redux provider wrapper
├── hooks/                  # Custom React hooks
│   ├── auth/              # Authentication hooks
│   ├── sign-in/           # Sign-in form hooks
│   └── products/          # Product management hooks
├── lib/                    # Utilities
│   └── api.ts             # Axios client with JWT interceptors
├── store/                  # Redux store
│   ├── global/            # Global state (auth)
│   │   ├── slices/        # Auth slice
│   │   └── thunks/        # Auth async thunks
│   └── core/              # Feature state (products)
│       ├── slices/        # Product slice
│       ├── thunks/        # Product async thunks
│       └── selectors/     # Product selectors
└── middleware.ts           # Next.js middleware for route protection
```

## JWT Token Management

### Storage
- **Access Token** - Stored in `localStorage` as `accessToken`
- **Refresh Token** - Stored in `localStorage` as `refreshToken`
- **Auth Cookie** - Lightweight cookie flag (`auth=1`) for middleware route protection

### Token Flow
1. **Login** - Tokens received and stored in localStorage + cookie flag set
2. **API Requests** - Access token attached via Axios interceptor
3. **Auto-Refresh** - 401 responses trigger automatic token refresh
4. **Logout** - Tokens cleared from localStorage + cookie flag removed

### Axios Interceptors

```typescript
// Request interceptor - adds Bearer token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh...
    }
  }
);
```

## Route Protection

The `middleware.ts` checks for the `auth` cookie to protect routes:

- **Protected Routes** - `/products` (requires auth)
- **Auth Routes** - `/sign-in` (redirects if authenticated)

## Hooks Usage

```tsx
// Authentication
const { user, login, logout, isAuthenticated } = useAuth();

// Sign-in form
const { formData, handleChange, handleSubmit, isLoading } = useSignInForm();

// Product management
const { products, createProduct, deleteProduct } = useProductManagement();
const { showForm, formData, toggleForm } = useProductForm();
```
