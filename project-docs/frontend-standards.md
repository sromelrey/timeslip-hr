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

### API File Standards

**CRITICAL**: All API client files (`lib/*.api.ts`) MUST use the centralized `api` instance from `lib/api.ts`.

#### ✅ Correct Pattern
```typescript
// lib/payroll.api.ts
import api from './api';

export const getPayPeriods = async (): Promise<PayPeriod[]> => {
  const response = await api.get('/payroll/pay-periods');
  return response.data;
};

export const createPayPeriod = async (dto: CreatePayPeriodDto): Promise<PayPeriod> => {
  const response = await api.post('/payroll/pay-periods', dto);
  return response.data;
};
```

#### ❌ Incorrect Pattern (DO NOT DO THIS)
```typescript
// ❌ Don't create separate axios instances
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// ❌ Don't manually pass tokens
export const getPayPeriods = async (token: string): Promise<PayPeriod[]> => {
  const response = await axios.get(`${baseURL}/payroll/pay-periods`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### Why?
- ✅ **Automatic JWT injection** - No need to manually get/pass tokens
- ✅ **Automatic token refresh** - 401 errors trigger token refresh automatically
- ✅ **Single source of truth** - All auth logic centralized in `lib/api.ts`
- ✅ **Cleaner code** - No `localStorage.getItem('accessToken')` scattered everywhere
- ✅ **Easier testing** - Mock one instance instead of multiple axios calls


### Token Management
- `accessToken` and `refreshToken` are stored in `localStorage`.
- An `auth=1` cookie is set for server-side middleware awareness.

## UI & Styling

- **Theme**: Defined in `tailwind.config.ts` using CSS variables for colors (linked to `globals.css`).
- **Responsive Design**: Mobile-first approach using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- **Icons**: Always use `lucide-react`.

## Custom Hooks & Clean JSX

### Extract Logic into Custom Hooks
- **Purpose**: Keep component JSX focused on presentation, move business logic to reusable hooks.
- **Location**: Create hooks in `hooks/` directory using `use-` prefix (e.g., `use-payslip-actions.ts`).
- **Pattern**: 
  ```tsx
  // hooks/use-feature-actions.ts
  export function useFeatureActions() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    
    const handleAction = async (id: number) => {
      setLoading(true);
      // business logic here
      setLoading(false);
    };
    
    return { handleAction, loading };
  }
  
  // component.tsx
  export function MyComponent() {
    const { handleAction, loading } = useFeatureActions();
    return <button onClick={() => handleAction(1)}>Action</button>;
  }
  ```

### Component Composition
- **Single Responsibility**: Each component should do one thing well.
- **Prefer Composition**: Break large components into smaller, focused sub-components.
- **Logic Extraction**: Event handlers with >5 lines should be in custom hooks or helper functions.
- **Clean JSX**: Component body should primarily contain JSX, not business logic.

## Best Practices

1. **Type Everything**: Avoid `any`. Define interfaces for API responses and component props.
2. **Server vs Client Components**: Use `"use client"` directive only when necessary (event listeners, state, hooks).
3. **Reusable UI**: If a component is used in more than one place, move it to `components/ui` or a feature folder.
4. **Environment Variables**: Always use `NEXT_PUBLIC_` prefix for variables needed on the client.
5. **Custom Hooks**: Extract complex logic into custom hooks to keep JSX clean and testable.
6. **Component Size**: If a component exceeds 150 lines, consider splitting it into smaller components or extracting logic into hooks.

## Testing Standards

We use **Jest** and **React Testing Library (RTL)** to ensure application stability and correctness.

### Core Principles
- **Test Behavior, Not Implementation**: Focus on what the user sees and interacts with, not internal state or private methods.
- **Critical Paths**: Prioritize testing complex logic, authentication flows, and critical user journeys (e.g., Timesheet submission).
- **Isolation**: Unit tests should be isolated; integration tests can mock network requests.

### 1. Unit Testing
- **Hooks**: Test custom hooks in isolation using `renderHook` from RTL.
- **Utilities**: Test helper functions in `lib/utils.ts` to ensure edge case handling.

**Naming Convention**: `*.test.ts` or `*.test.tsx` located in `__tests__` directory alongside the feature.

**Example (Hook Test):**
```typescript
// hooks/__tests__/use-time-actions.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTimeActions } from '../use-time-actions';

test('should handle clock in successfully', async () => {
  const { result } = renderHook(() => useTimeActions());
  
  await act(async () => {
    await result.current.clockIn();
  });
  
  expect(result.current.status).toBe('CLOCKED_IN');
});
```

### 2. Component Testing
- **Interactive Components**: Test forms, modals, and complex UI elements.
- **Accessibility**: Use `getByRole`, `getByLabelText`, etc., to enforce accessible HTML.
- **Mocking**: Mock child components if they are heavy or irrelevant to the parent's test logic.

**Example (Component Test):**
```tsx
// components/kiosk/__tests__/action-buttons.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButtons } from '../action-buttons';

test('calls onClockIn when button is clicked', () => {
  const mockFn = jest.fn();
  render(<ActionButtons onClockIn={mockFn} />);
  
  fireEvent.click(screen.getByRole('button', { name: /clock in/i }));
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

### 3. Integration Testing
- Test the interaction between parent components and Redux store.
- Mock API responses using Jest or MSW (Mock Service Worker).

### 4. Code Coverage
- Aim for high coverage on **utility functions** and **business logic hooks**.
- UI Coverage is less critical but ensure no "crash on render" scenarios.
