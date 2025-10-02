# Auth App

Authentication micro frontend for the movie ticket booking application.

## Setup

### Installation

```bash
cd auth-app
pnpm install
```

### Development

```bash
pnpm run dev
```

Runs on `http://localhost:3001`

### Build

```bash
pnpm run build
pnpm run preview
```

## Architecture Decisions

### Module Federation

Uses Vite Plugin Federation to expose authentication components as remote modules.

**Exposed Components:**
- `./Login` → `src/components/auth-form.tsx`
- `./UserProfile` → `src/components/user-profile.tsx`

**Remote Dependencies:**
- `storeApp` (http://localhost:3004) - Centralized state management

**Shared Dependencies:**
- `react`, `react-dom` - Ensures single React instance across federated modules

### Technology Stack

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Shadcn UI** - Component library (Card, Button, Input, Dialog, Select)
- **React Hook Form** + **Zod** - Form management and validation
- **Module Federation** - Micro frontend architecture

### Form Validation

Zod schemas validate user input:

**Login:** Email (valid format), Password (required)

**Registration:** First/Last Name (min 2 chars), Email (valid format), Password (min 8 chars), Confirm Password (must match), Role (user/admin)

### Responsive Design

Mobile-first approach using Tailwind breakpoints (`sm:`, `md:`, `lg:`). All components adapt to viewport sizes using responsive grid, flexbox, and typography utilities.

## Communication Design

### State Management

Communicates with other micro frontends through the centralized Zustand store exposed by `storeApp`:

```typescript
import { useAppStore, type User } from "storeApp/store";
```

### Store Interface

```typescript
interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
}
```

### Store Actions

**`addUserData(user: User)`**
- Sets current authenticated user in global state
- Called after successful login/registration
- Makes user data available to all federated apps

**`removeUserData()`**
- Clears current user from global state
- Called on logout

**`updateUser(userId: string, updates: Partial<User>)`**
- Updates user information (name, password)
- Synchronizes changes in both `registeredUsers` array and current `user`

**`registeredUsers`**
- Array of all registered users
- Used for authentication validation
- Persisted via Zustand persist middleware

**`addRegisteredUser(user: User)`**
- Adds new user to registration database
- Called during user registration

### Communication Flow

**Login Flow:**
1. User submits credentials
2. Validates against `registeredUsers` in store
3. On success, calls `addUserData()` to set current user
4. User data propagates to all micro frontends

**Registration Flow:**
1. User submits registration form
2. Validates email doesn't exist in `registeredUsers`
3. Generates unique `userId` using `crypto.randomUUID()`
4. Calls `addRegisteredUser()` to persist user
5. Calls `addUserData()` to set as current user

**Profile Update Flow:**
1. Reads current user: `useAppStore((state) => state.user)`
2. User edits name or password
3. Calls `updateUser()` with changes
4. Updates propagate to all consuming apps immediately

### Cross-App Communication

All micro frontends importing `storeApp/store` share the same state instance. Changes in auth-app (login, logout, profile updates) trigger re-renders in other apps (booking-app, reporting-app) that depend on user data.
