# Fab Clean Website Handoff

Last updated: 2026-04-02  
Repository: `Fab Clean Website`  
Current role: public website + customer portal for Fab Clean

## 1. What this repo is

This repo is the public-facing Fab Clean product.

It contains:
- the marketing website
- public order tracking
- public feedback submission
- public reviews pages
- customer login by phone OTP
- customer dashboard for orders, profile, and wallet visibility

This repo is designed to work even if the engineer reading it does not have the ERP repo open. Everything important about the integration is summarized here.

## 2. High-level architecture

This is a monorepo with:
- `Frontend/`
  React + Vite + Wouter + React Query
- `Backend/`
  Express + TypeScript
- `lib/`
  shared workspace packages including generated API clients and DB/schema helpers

Deployment model:
- Frontend deploys to Firebase Hosting
- Backend deploys to Render

Runtime split:
- Frontend talks to backend over HTTP
- Backend talks to Supabase using service-role access
- Some older generated client flows still use typed API endpoints exposed by this backend

## 3. Current product behavior

### Public pages

Key public routes:
- `/`
- `/services`
- `/pricing`
- `/about`
- `/contact`
- `/schedule-pickup`
- `/track-order`
- `/track-order/:identifier`
- `/feedback`
- `/feedback/:identifier`
- `/reviews`

Public order tracking:
- Supports ERP order number URLs like `/track-order/FZC-2026FAB0041A`
- Also supports UUID ERP order ids
- Backend safely detects whether the identifier is a UUID or an order number

Public feedback:
- Supports `/feedback/:identifier`
- Looks up the order first
- Saves rating + feedback to Supabase
- Attempts Gemini analysis
- If Gemini is slow or unavailable, feedback still saves and fallback analysis is used

Public reviews:
- Homepage and `/reviews` both read live review data
- Review display intentionally exposes only:
  - customer name
  - star rating
  - review text
  - review date/time
- Phone numbers are stored internally but are not shown publicly

### Customer portal

Portal routes:
- `/dashboard/orders`
- `/dashboard/track/:id`
- `/dashboard/profile`
- `/dashboard/wallet`

Portal features:
- phone OTP login
- orders list
- order detail / progress
- profile edit
- wallet summary

## 4. Important reality: auth is not pure Supabase Auth today

Even though the long-term unification plan mentioned Supabase Auth, the currently working production path in this repo is:

- Backend local OTP flow in `Backend/src/routes/auth.ts`
- JWT access token returned by backend
- Frontend stores token in localStorage
- Protected portal endpoints validate that JWT

This means:
- customer login is phone OTP only
- there is no password reset flow
- “resend password” does not exist and should stay out of scope
- portal auth is currently backend-managed, not Supabase session-managed

This is important because a future engineer might incorrectly assume the website is already fully on Supabase Auth. It is not.

## 5. Current backend route surface

Main route registration:
- `Backend/src/routes/index.ts`

Active route modules:
- `auth.ts`
  phone OTP send/verify
- `portal.ts`
  authenticated customer orders/profile/wallet
- `public-orders.ts`
  public order tracking
- `feedback.ts`
  public feedback load/submit
- `public-reviews.ts`
  homepage/reviews-page review data
- `services.ts`
- `pickups.ts`
- `contact.ts`
- `ai.ts`
- `health.ts`

Backend root:
- `GET /`
- returns `200` health JSON
- this exists so Render root checks do not mislead with a 404

## 6. Current frontend route surface

Main app entry:
- `Frontend/src/App.tsx`

Important pages:
- `Frontend/src/pages/home.tsx`
- `Frontend/src/pages/track-order.tsx`
- `Frontend/src/pages/feedback.tsx`
- `Frontend/src/pages/reviews.tsx`
- `Frontend/src/pages/login.tsx`
- `Frontend/src/pages/register.tsx`
- `Frontend/src/pages/dashboard/index.tsx`

Navigation shell:
- `Frontend/src/components/layout.tsx`

Auth state:
- `Frontend/src/hooks/use-auth.tsx`

Public API helpers:
- `Frontend/src/lib/public-api.ts`
- `Frontend/src/lib/api-base.ts`
- `Frontend/src/lib/portal-api.ts`

## 7. Supabase responsibilities used by this repo

The backend reads and writes against the unified Supabase project.

Important tables/views/functions this repo depends on:
- `public.customers`
- `public.orders`
- `public.reviews_table`
- `public.website_top_reviews`
- `public.website_best_reviews`
- `public.website_latest_reviews`

Important write behavior:
- feedback submission writes review data and order feedback fields
- review AI ranking uses Gemini-backed enrichment

Important display behavior:
- homepage and `/reviews` consume the review views as the public source of truth

## 8. Key env vars

### Frontend

Important frontend env:
- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Critical rule:
- in production, `VITE_API_URL` must be set
- it should point to the backend origin, usually:
  - `https://backend.myfabclean.com/api`

The frontend normalizes this so generated client calls do not accidentally become `/api/api/...`.

### Backend

Important backend env:
- `PORT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `JWT_SECRET`
- `NODE_ENV`

Important note:
- the backend fails in confusing ways if `SUPABASE_URL` or `SUPABASE_SERVICE_KEY` is missing
- production env should use `NODE_ENV=production`

## 9. Recent shipped changes in this repo

This repo has recently been upgraded with the following functional changes:

### Public order tracking
- order-number lookup fixed for ERP identifiers
- direct deep-link support added:
  - `/track-order/:identifier`

### Public feedback
- direct deep-link support added:
  - `/feedback/:identifier`
- feedback save made resilient even if Gemini fails
- existing review state can be reloaded and shown on the page

### Review system
- public review display now comes from live Supabase review views
- homepage no longer relies only on hardcoded testimonial placeholders
- `/reviews` page added
- public review payload no longer exposes phone numbers

### Customer portal
- authenticated portal routes added in backend
- dashboard rebuilt with:
  - orders
  - order detail
  - profile
  - wallet summary
- login/logout redirect handling improved
- mobile UX improved across the portal shell

## 10. Known constraints and caveats

### Constraint 1: auth model is still transitional
- login works
- portal works
- but this is not yet the final Supabase Auth architecture

### Constraint 2: generated typed client and backend are partly hybrid
- some frontend code uses generated hooks
- some newer flows use manual fetch helpers
- future cleanup should unify those patterns, but do not break working routes casually

### Constraint 3: Gemini is optional for save path
- review submission should never depend on Gemini availability
- Gemini improves ranking and categorization, but save must succeed without it

### Constraint 4: public review sync to Google is intentionally paused
- Google review push/integration is not active
- Gemini review analysis is active

## 11. Safe extension guidance

If you extend this repo, prefer these rules:

- Do not expose phone numbers in public review APIs or public UI
- Do not break `/track-order/:identifier` and `/feedback/:identifier`
- Do not make frontend production depend on implicit `/api` unless hosting is known to rewrite correctly
- Keep customer portal auth phone-OTP-only unless you are intentionally replacing the current auth stack
- Keep feedback submission transactional and tolerant of AI failure

If you are changing the dashboard:
- avoid adding fields that the backend portal routes do not provide
- keep mobile layout first-class

If you are changing reviews:
- treat Supabase review views as the display source of truth

## 12. Relationship to the ERP repo

This repo depends on the ERP database, but not on ERP frontend code.

What this repo expects from the ERP side:
- `customers` and `orders` remain canonical operational tables
- feedback and review SQL extensions exist in Supabase
- review ranking SQL/views exist

What this repo does not require from the ERP repo:
- direct import of ERP React components
- direct ERP route reuse

In other words:
- shared system of record: yes
- shared frontend codebase: no

## 13. Files to read first

If you are onboarding and want the fastest understanding, read these in order:

1. `Frontend/src/App.tsx`
2. `Frontend/src/hooks/use-auth.tsx`
3. `Frontend/src/pages/dashboard/index.tsx`
4. `Frontend/src/pages/track-order.tsx`
5. `Frontend/src/pages/feedback.tsx`
6. `Frontend/src/pages/reviews.tsx`
7. `Backend/src/routes/index.ts`
8. `Backend/src/routes/auth.ts`
9. `Backend/src/routes/portal.ts`
10. `Backend/src/routes/public-orders.ts`
11. `Backend/src/routes/feedback.ts`
12. `Backend/src/routes/public-reviews.ts`
13. `Backend/src/lib/supabase-admin.ts`

## 14. Verification status at handoff

At the last verified state before this document:
- frontend typecheck passed
- frontend production build passed
- backend typecheck passed

This repo is in a working deployable state from the application side.

## 15. Short operational summary

If you only remember five things, remember these:

1. This repo is the public/customer-facing system, not the ERP.
2. Public tracking and feedback are URL-driven and must keep working with ERP order numbers.
3. Customer auth is currently backend JWT + phone OTP, not full Supabase Auth.
4. Reviews are stored in Supabase and displayed from live review views.
5. Frontend deploys to Firebase, backend deploys to Render, and both must be configured with the correct env vars.
