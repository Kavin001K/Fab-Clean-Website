# Deployment Guide

This project is a monorepo containing a React frontend and an Express backend, along with shared libraries.

## Prerequisites

- Node.js (v24+)
- pnpm (v9+)
- Docker (for backend production builds)
- Firebase CLI (for frontend deployment)

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Build all packages:
   ```bash
   pnpm run build
   ```

## Development

- Frontend: `cd frontend && pnpm run dev`
- Backend: `cd backend && pnpm run dev`

## Deployment

### Frontend (Firebase)
- The frontend is deployed to Firebase Hosting.
- Build the frontend: `cd frontend && pnpm run build`
- Deploy: `firebase deploy --only hosting`

### Backend (GCP)
- The backend is deployed to Google Cloud Platform as a containerized application.
- Build the Docker image: `cd backend && docker build -t backend .`
- Follow GCP documentation for deploying the container.

## Shared Packages

Shared libraries are located in the `lib/` directory and are managed as workspace packages.
- `lib/db`: Drizzle ORM schema and client
- `lib/api-spec`: OpenAPI specification and Orval configuration
- `lib/api-zod`: Generated Zod schemas
- `lib/api-client-react`: Generated React Query hooks
