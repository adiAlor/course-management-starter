# Project Requirements Document

## 1. Project Overview

This project will turn the existing “course-management-starter” Next.js template into the fully functional **frontend** for a Course Management System that communicates with a separate Express.js backend and a MySQL database. It leverages the starter’s pre-built UI, authentication screens, role‐based dashboard layouts, Tailwind CSS styling, and Shadcn/ui component library to accelerate development. Instead of using Next.js API routes and Drizzle ORM, the frontend will call out to Express endpoints for all data and authentication.

We’re building this because it saves months of UI work and ensures a modern, responsive, and well‐tested interface from day one. Key objectives include: secure JWT authentication, Role-Based Access Control (RBAC) for Admin, Instructor, Student, and Leadership users; CRUD pages for courses, users, and cohorts; rich data tables and charts; and containerized local development using Docker Compose. Success will be measured by having end-to-end signup/login flows, role‐specific dashboards, data management pages, and a reproducible development environment.

## 2. In-Scope vs. Out-of-Scope

### In-Scope
- Adapt Next.js **sign-up** and **sign-in** pages to call the Express.js authentication API and handle JWT storage in an HttpOnly cookie.
- Implement a React Context provider to store and expose user info and role across the app.
- Build a **role‐based** dashboard layout (`/dashboard/layout.tsx`) that renders different sidebars and landing pages for Admin, Instructor, Student, and Leadership.
- Create management pages under `/app/dashboard`:
  - **Admin**: User, Course, Class, Cohort management with DataTable, Dialog, and Form components.
  - **Instructor/Student**: Card or Table views for courses, assignments, file upload for materials/submissions.
  - **Leadership**: Charts and summary stats pages for KPIs.
- Remove `/app/api` routes and `/db` directory from the frontend; centralize all API calls in `lib/api-client.ts` using `fetch` or Axios.
- Integrate TanStack Query (React Query) for data fetching, caching, and mutation management.
- Maintain existing styling and theming via Tailwind CSS, Shadcn/ui, and `next-themes` for dark mode.
- Provide a **Docker Compose** configuration that runs the Next.js frontend, Express.js backend, and MySQL database together.

### Out-of-Scope (Phase 1)
- Implementing or fleshing out the Express.js backend itself (only API contract assumed).
- Detailed MySQL schema design and migrations in this repository (handled by backend).
- Audit logs, multi-tenant support, advanced reporting beyond basic charts.
- Mobile-first native apps or Progressive Web App (PWA) offline support.
- Third-party integrations (e.g., payment gateways, LMS connectors).

## 3. User Flow

A new visitor arrives at the landing page and clicks **Sign Up**. They see a form built with Shadcn/ui `Form` components. Upon submission, the form calls `POST /auth/register` on the Express API. If registration succeeds, the API responds with a JWT token set in an HttpOnly cookie. The frontend then redirects the user to `/dashboard`, initializes the React Context with user data and role, and displays the role-specific sidebar and home cards/tables.

When an existing user signs in via `/sign-in`, the flow is similar: capture credentials, call `POST /auth/login`, receive and store JWT, then load `/dashboard`. Inside the dashboard, the sidebar items (e.g., “Users,” “Courses,” “My Assignments,” “Analytics”) are rendered based on the user role stored in Context. Clicking a menu item fetches data via TanStack Query, displays it in DataTable or Chart components, and allows CRUD operations (Dialog & Form) that map to Express endpoints.

## 4. Core Features
- **Authentication**: Email/password sign-up & sign-in, JWT storage, React Context auth state.
- **Role-Based Access**: Conditional sidebar and content for Admin, Instructor, Student, Leadership.
- **Admin Panels**: User, Course, Class, Cohort management pages using DataTable, Dialog, Form components.
- **Instructor/Student Views**: Course listing, schedule tables, assignment upload/download components.
- **Leadership Dashboard**: Configurable charts and KPI summaries using Chart components.
- **API Client**: Centralized `lib/api-client.ts` for all Express API calls, token injection, error handling.
- **Data Fetching**: TanStack Query for caching, loading states, mutations.
- **Styling & Theming**: Tailwind CSS, Shadcn/ui, `next-themes` dark mode.
- **Containerization**: `docker-compose.yaml` to run `frontend`, `backend`, and `mysql` services.

## 5. Tech Stack & Tools
- Frontend: Next.js (App Router), React, TypeScript.
- UI Library: Shadcn/ui (DataTable, Dialog, Form, Card, Chart).
- Styling: Tailwind CSS, `next-themes` for dark mode.
- State & Data: React Context (auth), TanStack Query (data fetching).
- API Client: `fetch` or Axios in `lib/api-client.ts`.
- Backend (assumed): Express.js, Passport.js (JWT), MySQL, ORM (Prisma or Sequelize).
- Containerization: Docker, Docker Compose.
- Environment: `.env.local` for `NEXT_PUBLIC_API_URL`, theme flags.

## 6. Non-Functional Requirements
- **Performance**: Initial page load ≤ 2s; API response times ≤ 500ms; nav interactions ≤ 200ms.
- **Security**: JWT in HttpOnly cookies; CSRF protection via same-site cookies; input validation on forms; role guard on UI routes.
- **Accessibility**: WCAG AA compliance for UI components; keyboard navigation; proper ARIA labels.
- **Reliability**: Graceful error and loading states; retry logic for transient API failures.
- **Scalability**: Modular components and TanStack Query caching to support large data sets.

## 7. Constraints & Assumptions
- The Express.js backend exposes RESTful endpoints for auth and CRUD operations at `NEXT_PUBLIC_API_URL`.
- MySQL database is available and reachable in Docker Compose network.
- Team is familiar with TypeScript, Next.js, and React Query.
- No Next.js API routes or Drizzle ORM will remain in the frontend code.
- Environment variables follow 12-factor app conventions.

## 8. Known Issues & Potential Pitfalls
- **CORS**: Must configure Express CORS to accept requests from the Next.js origin.
- **Token Refresh**: JWT expiration requires refresh or re-login; consider adding a `/auth/refresh` endpoint later.
- **Docker Networking**: Ensure service names in `docker-compose.yaml` match API URL env variables.
- **Error Handling**: Centralize API errors in `lib/api-client.ts` to avoid duplication.
- **Role Sync**: Frontend role checks must mirror backend authorization rules to prevent UI leaks.


*This document provides a clear, unambiguous blueprint for the AI to build out the frontend adaptation of the course-management-starter template, integrating it with an Express.js/MySQL backend.*