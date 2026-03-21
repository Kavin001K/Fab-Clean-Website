# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Project: Fab Clean

Premium dry cleaning and laundry service website for Fab Clean (Yadvik Traders), Pollachi & Kinathukadavu, Tamil Nadu.

- **Brand**: Fab Clean | Legal entity: Yadvik Traders
- **Website**: www.myfabclean.in
- **Founded**: 2023

### Frontend (artifacts/fab-clean)
- React + Vite, TypeScript, Tailwind CSS, Framer Motion
- Wouter for routing
- React Query for data fetching
- Pages: Home, About, Services, Pricing, Contact, Login, Register, Schedule Pickup, Dashboard, 404

### Backend (artifacts/api-server)
- Express 5 + TypeScript
- Routes: /api/services, /api/pricing, /api/pickups, /api/contact, /api/auth/*
- Auth: OTP-based (in-memory store for dev), JWT access tokens, httpOnly refresh cookies
- DB: pickups, users, contacts tables

### Key API Endpoints
- `GET /api/services` — list all 8 services
- `GET /api/services/:slug` — service detail
- `GET /api/pricing` — full pricing tables
- `POST /api/pickups` — schedule a pickup (returns FC-PU-YYYY-XXXX reference)
- `GET /api/orders/track?phone=&ref=` — public order tracking
- `POST /api/contact` — contact form submission
- `POST /api/auth/send-otp` — send OTP
- `POST /api/auth/verify-otp` — verify OTP + login/register
- `POST /api/auth/logout` — clear session

### Data
- Services and pricing data in `artifacts/api-server/src/data/services.ts`
- Database schema in `lib/db/src/schema/`

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── fab-clean/          # Fab Clean frontend (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Database

- Schema: users, pickups, contacts
- Push schema: `pnpm --filter @workspace/db run push`

## Codegen

Run: `pnpm --filter @workspace/api-spec run codegen`
