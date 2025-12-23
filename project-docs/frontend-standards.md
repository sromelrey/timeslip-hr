# Frontend Development Standards

This document outlines the technical standards, architecture, and coding conventions for the TimeSlip-HR frontend application.

## Core Tech Stack

- **Framework**: [Next.js 15.1 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**:
  - [Tailwind CSS](https://tailwindcss.com/) for styling.
  - [Radix UI](https://www.radix-ui.com/) for accessible component primitives.
  - [shadcn/ui](https://ui.shadcn.com/) for pre-built components.
  - [Lucide React](https://lucide.dev/) for iconography.
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Table Management**: [TanStack Table v8](https://tanstack.com/table)

## Project Structure

The project follows the Next.js App Router structure with logical separation of concerns:

```text
frontend/
├── app/                  # App Router routes and layouts
│   ├── (admin)/          # Protected admin routes (grouped)
│   ├── sign-in/          # Authentication routes
│   └── globals.css       # Global styles & Tailwind directives
├── components/           # React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── admin/            # Admin-specific components
│   └── [Feature].tsx     # Feature-specific shared components
├── store/                # Redux State Management
│   ├── core/             # Business logic/feature slices (employee, timesheet)
│   ├── global/           # Global app state (auth)
│   └── index.ts          # Store configuration
├── lib/                  # Utilities and configurations
│   ├── api.ts            # Axios instance with interceptors
│   └── utils.ts          # Tailwind merge (cn) helper
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## Coding Conventions

### Naming Conventions
- **Directories & Files**: Use `dash-case` (e.g., `employee-form.tsx`, `auth-slice.ts`).
- **Components**: Use `PascalCase` (e.g., `EmployeeCard.tsx`).
- **Functions & Variables**: Use `camelCase`.
- **Constants**: Use `UPPER_SNAKE_CASE`.

### Components
- Prefer **Functional Components** with TypeScript interfaces for props.
- Use the `cn` utility from `lib/utils` for conditional class joining:
  ```tsx
  import { cn } from "@/lib/utils";
  
  export function MyComponent({ className }: { className?: string }) {
    return <div className={cn("base-classes", className)}>Content</div>;
  }
  ```

## State Management (Redux)

State is organized into slices. 
- **Global**: App-wide state like authentication (`store/global/slices/auth-slice.ts`).
- **Core**: Feature-specific state (`store/core/slices/`).

### Usage Pattern
- Use `useAppSelector` and `useAppDispatch` (typed wrappers) for interacting with the store.
- Keep slices focused on specific domain entities (e.g., `employee`, `timesheet`).

## API & Data Fetching

Standardized API interaction is handled in `lib/api.ts`.

### Axios Instance
- Includes base URL configuration.
- Automatically handles **JWT Bearer tokens** via request interceptors.
- Implements **Token Refresh** logic via response interceptors (401 handling).

### Token Management
- `accessToken` and `refreshToken` are stored in `localStorage`.
- An `auth=1` cookie is set for server-side middleware awareness.

## UI & Styling

- **Theme**: Defined in `tailwind.config.ts` using CSS variables for colors (linked to `globals.css`).
- **Responsive Design**: Mobile-first approach using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- **Icons**: Always use `lucide-react`.

## Best Practices

1. **Type Everything**: Avoid `any`. Define interfaces for API responses and component props.
2. **Server vs Client Components**: Use `"use client"` directive only when necessary (event listeners, state, hooks).
3. **Reusable UI**: If a component is used in more than one place, move it to `components/ui` or a feature folder.
4. **Environment Variables**: Always use `NEXT_PUBLIC_` prefix for variables needed on the client.
