# Frontend Guideline Document

This document outlines the architecture, design principles, and technologies used in the **course-management-starter** frontend. It is written in everyday language so that anyone can understand how the frontend is set up, how it works, and why certain choices were made.

---

## 1. Frontend Architecture

### 1.1 Overview
- **Framework**: Next.js (App Router) provides built-in routing, server-side rendering (SSR), and static site generation (SSG).
- **Language**: TypeScript ensures type safety across components and API calls.
- **Styling**: Tailwind CSS (utility-first) combined with the Shadcn/ui component library.
- **State & Data**:
  - **React Context** for global auth state (current user & token).
  - **React Query (TanStack Query)** for data fetching, caching, and synchronization.
- **Containerization**: Docker Compose manages three services—frontend, backend (Express.js), and MySQL database.

### 1.2 How It Supports Scalability, Maintainability, and Performance
- **Component-Based**: Small, reusable pieces (buttons, tables, dialogs) make it easy to add or modify features.
- **Decoupled API Layer**: A centralized `lib/api-client.ts` handles all HTTP requests, keeping UI components clean.
- **Type Safety**: TypeScript catches errors at compile time, reducing bugs as the codebase grows.
- **Caching & Optimization**: React Query caches server data and only refetches when needed, speeding up the UI.
- **Dockerized Setup**: Everyone on the team works in the same environment, eliminating “it works on my machine” issues.

---

## 2. Design Principles

1. **Usability**: Intuitive forms and navigation—users always know where they are and what to do next.
2. **Accessibility**: Semantic HTML, proper labels, focus management, and ARIA attributes ensure the app works for all users.
3. **Responsiveness**: Mobile-first layout that adapts seamlessly from phone to desktop using Tailwind’s responsive utilities.
4. **Consistency**: A unified look & feel achieved through a shared component library and theming.

> How we apply these:
> - Forms use clear labels and error messages.
> - Color contrast meets WCAG standards.
> - Keyboard navigation is fully supported (e.g., dialogs trap focus).
> - Breakpoints in Tailwind ensure layouts stack or resize gracefully on small screens.

---

## 3. Styling and Theming

### 3.1 Styling Approach
- Utility-first with **Tailwind CSS**—no custom CSS files or BEM naming.
- Shadcn/ui provides prebuilt, themeable React components (DataTable, Dialog, Card, Chart, etc.).

### 3.2 Theming
- **next-themes** library for light/dark mode toggling.
- Theme preference stored in `localStorage` and applied on page load.

### 3.3 Visual Style
- **Overall Style**: Modern, flat design with subtle glassmorphism accents (translucent panels with backdrop blur).
- **Color Palette**:
  - Primary: `#2563EB` (blue-600)
  - Secondary: `#14B8A6` (teal-500)
  - Success: `#10B981` (green-500)
  - Warning: `#F59E0B` (yellow-500)
  - Danger:  `#EF4444` (red-500)
  - Neutral Light: `#F3F4F6` (gray-100)
  - Neutral Dark: `#1F2937` (gray-800)
- **Font**: Inter (or system-ui) for a clean, readable appearance.

---

## 4. Component Structure

### 4.1 Folder Layout
```
/app
  ├─ sign-in
  ├─ sign-up
  └─ dashboard
      ├─ layout.tsx
      └─ [role]
/components
  ├─ ui         # Shadcn/ui components
  ├─ auth-buttons.tsx
  └─ ...
/lib
  └─ api-client.ts
/public
  └─ static assets
```

### 4.2 Reusability & Maintenance
- **`components/ui`** holds generic UI bits (buttons, tables, forms). When you need a table, import `DataTable`; don’t rewrite styles.
- **Layout Components** (`dashboard/layout.tsx`) wrap pages and handle common elements like sidebars.
- **Separation of Concerns**: UI components don’t know about data fetching; they just accept props. The API client and React Query hooks live in `lib` or dedicated hooks files.

---

## 5. State Management

1. **Auth Context**: Stores user info and JWT token. Provided at the root so any component can check `currentUser` or call `signOut()`.
2. **React Query**:
   - Centralizes data fetching logic.
   - Automatically handles loading, error, and refetch states.
   - Caches data for speedy back/forward navigation.

Example:
```ts
// lib/api-client.ts
export async function fetchCourses() {
  const res = await fetch(`${API_URL}/courses`);
  return res.json();
}

// hooks/useCourses.ts
import { useQuery } from '@tanstack/react-query';
export function useCourses() {
  return useQuery(['courses'], fetchCourses);
}
```

---

## 6. Routing and Navigation

- **Next.js App Router**: Files in `/app` correspond to URL paths.
  - `/sign-in` and `/sign-up` for authentication.
  - `/dashboard` for protected routes.
  - Nested folders under `/dashboard` for each role (admin, instructor, student, leadership).
- **Protected Routes**: The `dashboard/layout.tsx` fetches user data; if not authenticated, it redirects to `/sign-in`.
- **Sidebar Navigation**: Dynamically renders links based on the user’s role.

---

## 7. Performance Optimization

1. **Code Splitting**: Next.js automatically splits code by route. Heavy components can be dynamically imported:
   ```tsx
   const Chart = dynamic(() => import('../components/ui/Chart'));
   ```
2. **Image Optimization**: Use `next/image` for responsive, lazy-loaded images.
3. **Tailwind JIT**: Generates only the CSS you use, keeping bundle size small.
4. **React Query Caching**: Avoids unnecessary network calls.
5. **Static Assets CDN**: Serve icons and static files via a CDN in production.

---

## 8. Testing and Quality Assurance

1. **Unit Tests**:
   - Jest + React Testing Library for components and hooks.
   - Example: test that `<SignInForm />` shows an error when a field is empty.
2. **Integration Tests**:
   - Test multiple components working together, e.g., form submission + API client.
3. **End-to-End (E2E) Tests**:
   - Cypress (or Playwright) to simulate user flows: sign in, navigate to dashboard, create a course.
4. **Linting & Formatting**:
   - ESLint with TypeScript rules.
   - Prettier for consistent code style.
5. **Type Checking**:
   - `tsc --noEmit` in CI ensures no type errors slip through.

---

## 9. Conclusion and Overall Frontend Summary

We’ve built a modern, scalable, and maintainable frontend based on Next.js, TypeScript, Tailwind CSS, and Shadcn/ui. Our design principles—usability, accessibility, responsiveness, and consistency—guide every component and page. With a clear separation between UI, state management, and data fetching, the codebase remains easy to navigate and extend. Testing at every level ensures reliability, while performance optimizations guarantee a smooth experience for end users.

By following these guidelines, any developer—even without a deep technical background—can understand how the frontend is put together, add new features with confidence, and deliver a polished Course Management System.

---

*Ready to start building? Refer back to this document as your single source of truth for all frontend decisions.*
