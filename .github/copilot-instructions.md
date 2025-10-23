# Copilot Instructions for the `maglo` Project

Welcome to the `maglo` codebase! This document provides essential guidelines for AI coding agents to be productive and aligned with the project's architecture, workflows, and conventions.

## Project Overview

- **Purpose**: Maglo is a modern full-stack web application showcasing best practices with NestJS backend, React frontend, GraphQL API, and modern tooling.
- **Architecture**: Monorepo structure with clear separation between backend and frontend:
  - **Backend** (`backend/`): NestJS GraphQL API with Drizzle ORM for PostgreSQL
  - **Frontend** (`frontend/`): React 18 + Vite with ShadCN UI and GSAP animations
  - **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Data Flow**: GraphQL API serves data from PostgreSQL → Apollo Client → React components

## Developer Workflows

### Starting Development

- **Full stack**: `npm run dev` (starts both backend and frontend)
- **Individual services**: `npm run dev:backend` or `npm run dev:frontend`

### Database Operations

- **Generate migrations**: `npm run db:generate`
- **Push schema changes**: `npm run db:push`
- **Open database studio**: `npm run db:studio`

### Building and Testing

- **Build all**: `npm run build`
- **Lint code**: `npm run lint`
- **Run tests**: `npm run test`

## Project-Specific Conventions

- **Backend**: NestJS decorators pattern, GraphQL resolvers in dedicated modules
- **Frontend**: Functional components with hooks, ShadCN UI components in `components/ui/`
- **Database**: Drizzle schema in `backend/src/database/schema.ts`, use typed queries
- **Styling**: Tailwind CSS with CSS variables for theming, component variants with `class-variance-authority`

## Integration Points

- **GraphQL API**: Backend serves GraphQL at `/graphql`, frontend uses Apollo Client
- **Database**: Drizzle ORM with PostgreSQL, schema-first approach
- **Authentication**: Ready for implementation in user modules
- **Animations**: GSAP with React integration via `@gsap/react` hook

## Key Files and Directories

- `backend/src/app.module.ts`: Main NestJS module with GraphQL configuration
- `backend/src/database/`: Drizzle schema and connection setup
- `frontend/src/main.tsx`: React app entry with Apollo Provider setup
- `frontend/src/lib/utils.ts`: ShadCN utilities and common functions
- `frontend/src/lib/animations.ts`: GSAP animation presets and utilities

## Code Patterns

- **GraphQL Resolvers**: Use `@Resolver()` decorator with typed inputs/outputs
- **Database Queries**: Always use Drizzle's typed query builder, avoid raw SQL
- **React Components**: Use `forwardRef` for UI components, custom hooks for logic
- **Animations**: Use `useGSAP` hook for component animations, timeline for complex sequences

---

Feel free to update this document as the project evolves. If any section is unclear or incomplete, please provide feedback to improve it.
