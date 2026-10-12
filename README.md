# PLAYQ Solutions — Production Web Application & Enterprise Portal

> **Engineering Technology. Empowering People. Building Tomorrow.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.0-2d3748?logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tests-132%20Passed-brightgreen?logo=vitest)](https://vitest.dev/)
[![Security](https://img.shields.io/badge/Security-MFA%20%7C%20RBAC%20%7C%20CSRF%20%7C%20CSP-success)]()

PLAYQ Solutions is a modern enterprise web application and management platform engineered with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Prisma ORM (PostgreSQL)**, **Three.js**, and a zero-trust **Administrative Portal** equipped with Multi-Factor Authentication (TOTP MFA), Role-Based Access Control (RBAC), and distributed rate limiting.

---

## Table of Contents

- [1. Executive Overview](#1-executive-overview)
- [2. Core Pillars & Capabilities](#2-core-pillars--capabilities)
  - [Public Client Experience](#public-client-experience)
  - [Administrative Management Portal](#administrative-management-portal)
- [3. Architecture & Tech Stack](#3-architecture--tech-stack)
- [4. Repository Structure](#4-repository-structure)
- [5. Database Schema & Entities](#5-database-schema--entities)
- [6. Security & Authentication Architecture](#6-security--authentication-architecture)
- [7. Environment Variables Configuration](#7-environment-variables-configuration)
- [8. Quick Start & Local Development](#8-quick-start--local-development)
- [9. Database Migrations & Seeding](#9-database-migrations--seeding)
- [10. Operational CLI Scripts & Administrative Tooling](#10-operational-cli-scripts--administrative-tooling)
- [11. Testing & Quality Assurance](#11-testing--quality-assurance)
- [12. Health Diagnostics & Observability](#12-health-diagnostics--observability)
- [13. Production Deployment Guidelines](#13-production-deployment-guidelines)

---

## 1. Executive Overview

PLAYQ Solutions bridges high-impact software engineering with student development and industry mentorship. The platform serves two primary audiences:

1. **Enterprise Clients & Partners**: Exploring custom software engineering, cloud architecture, AI integration, native mobile development, and scheduling consultations.
2. **Students & Emerging Engineers**: Browsing structured technical apprenticeships, fellowships, and submitting validated applications for mentorship cohorts.
3. **Internal Operations & Leadership**: Securely reviewing, triaging, and responding to business inquiries, apprenticeship submissions, and mentorship partnerships through an authenticated administrative cockpit.

---

## 2. Core Pillars & Capabilities

### Public Client Experience

- **14 Specialized Technical Services**: Comprehensive service specifications across 5 major categories with dynamic slug routing (`/services/[slug]`), interactive category filtering, and technical FAQs:
  - *Custom Software Engineering*: Bespoke domain logic, legacy system modernization, microservices.
  - *Web & Mobile*: Modern web apps, native Android (Kotlin), native iOS (Swift/SwiftUI), and cross-platform apps (React Native/Flutter).
  - *AI & Intelligent Automation*: LLM orchestration, predictive analytics, event-driven process automation.
  - *Cloud, DevOps & QA*: Database engineering, API integration, serverless architectures, automated test pipelines.
  - *Technology Consulting*: Codebase audits, technical roadmapping, long-term operational maintenance.
- **Student Apprenticeships & Opportunities (`/internships`)**:
  - Live listing of active engineering cohorts (Full-Stack, AI & ML, QA Automation).
  - Eligibility requirements, learning curricula, duration, and position capacities.
  - Validated multi-step application workflow (`/internships/apply`) with portfolio and resume ingestion.
- **Industry Mentorship Network (`/experts`)**:
  - Collaboration portal for senior architects, workshop leaders, and enterprise consultants.
- **Portfolio Case Studies (`/projects`)**:
  - Demonstrations featuring problem statements, architectural solutions, and tech stacks.
- **Interactive 3D Visual Experience**:
  - Custom Three.js particle wave canvas (`HeroVisual.tsx`) with automatic GPU detection and accessible CSS fallback (`HeroVisualFallback.tsx`).
- **Resilient Form Pipelines**:
  - Client and server-side validation powered by **Zod**.
  - Silent **honeypot bot traps** to deflect automated spam.
  - Dual persistence (PostgreSQL with graceful in-memory fallback for local development).
  - Non-blocking transactional notification delivery via **Resend REST API**.

### Administrative Management Portal

Accessible under `/admin`, protected behind strict authentication:

- **Executive KPI Dashboard (`/admin`)**: Real-time operational metrics across leads, applicants, mentor partnerships, and system statuses.
- **Inquiry Management (`/admin/inquiries`)**:
  - Filter inquiries by status (`NEW`, `IN_REVIEW`, `CONTACTED`, `CLOSED`, `ARCHIVED`).
  - Search by client name, organization, email, or project category.
  - Detailed lead drawer, internal notes editing, and secure record deletion.
- **Internship Applications Tracker (`/admin/internships`)**:
  - Review applicant submissions, education history, portfolio links, and motivation statements.
  - Lifecycle state progression (`SUBMITTED` -> `UNDER_REVIEW` -> `SHORTLISTED` -> `ACCEPTED` / `DECLINED`).
- **Opportunity Catalog Manager (`/admin/careers`)**:
  - Live CRUD interface to publish, modify, or archive internship cohorts and headcount limits.
- **Expert Collaboration Desk (`/admin/experts`)**:
  - Triage mentorship applications and schedule partnership dialogues.
- **Security Audit Trail**: Every status transition, deletion, and auth event is logged to the `AuditLog` table with actor metadata and IP logging.

---

## 3. Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.0 (App Router) | Turbopack compilation, React Server Components (RSC), Partial Prerendering |
| **UI Library** | React 19.3.0 | Modern concurrent React primitives and hooks |
| **Language** | TypeScript 5 (Strict Mode) | Full-stack end-to-end type safety |
| **Styling** | Tailwind CSS 4 | Zero-runtime engine paired with `@tailwindcss/turbopack` |
| **Motion & 3D** | Motion 14.1.0 & Three.js 0.186.1 | Micro-interactions and interactive WebGL canvas |
| **ORM & DB** | Prisma 6.4.0 & PostgreSQL | Strongly typed schema, automatic migrations, connection pooling support |
| **Authentication** | `jose` 6.2.12 & `bcryptjs` 3.0.3 | Stateless HMAC-SHA256 JWT sessions in HttpOnly cookies, bcrypt hashing |
| **Multi-Factor Auth** | Custom RFC 6238 TOTP | Authenticator apps (Google Authenticator/Authy) + single-use recovery codes |
| **Rate Limiter** | Upstash Redis REST + Memory Fallback | Distributed sliding-window limiter with fail-safe zero-downtime fallback |
| **Email Delivery** | Resend REST API | Transactional alert dispatch with idempotent request keys |
| **Form Validation** | Zod 4.6.5 & React Hook Form 7.90.0 | Isomorphic schema validation with descriptive error mapping |
| **Testing Engine** | Vitest 5.0.3 | High-performance unit and integration testing suite |

---

## 4. Repository Structure

```
PLAY-Solutions/
├── .env.example                  # Environment configuration blueprint
├── AGENTS.md                     # AI agent and development guidelines
├── eslint.config.mjs             # Next.js & TypeScript ESLint configuration
├── next.config.ts                # Production security headers, CSP, Turbopack
├── package.json                  # Dependencies, overrides, and runner scripts
├── tsconfig.json                 # Strict TypeScript configuration
├── vercel.json                   # Deployment caching and regional routing
├── vitest.config.ts              # Unit and integration test harness config
│
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema definition & indexes
│   ├── seed.ts                   # Initial opportunities & demo case study seeder
│   └── migrations/               # Version-controlled SQL migration history
│
├── scripts/
│   ├── create-admin.ts           # CLI tool to provision administrator accounts
│   ├── reset-admin-mfa.ts        # Emergency CLI tool to reset MFA and revoke tokens
│   ├── test-email.ts             # Transactional Resend delivery smoke tester
│   ├── validate-env.ts           # Safe non-leaking environment configuration audit
│   └── verify-db.ts              # Non-destructive database connectivity checker
│
├── src/
│   ├── app/                      # Next.js App Router root
│   │   ├── (public pages)        # /, /about, /services, /internships, /experts, /projects, /contact
│   │   ├── admin/                # Authenticated administrative portal
│   │   │   ├── login/            # Password + TOTP MFA authentication challenge flow
│   │   │   └── (dashboard)/      # Protected dashboard, inquiries, internships, careers, experts
│   │   ├── api/                  # Route handlers
│   │   │   ├── admin/            # Auth, MFA, overview, inquiries, opportunities endpoints
│   │   │   ├── contact/          # Public business inquiry submission handler
│   │   │   ├── internships/      # Public application submission handler
│   │   │   ├── experts/          # Public mentorship inquiry submission handler
│   │   │   └── health/           # Production liveness & readiness probe endpoint
│   │   ├── globals.css           # Tailwind CSS imports & theme tokens
│   │   ├── layout.tsx            # Global layout, fonts, header, footer
│   │   ├── robots.ts             # Search engine crawler permissions
│   │   └── sitemap.ts            # Dynamic XML sitemap generator
│   │
│   ├── components/
│   │   ├── 3d/                   # Three.js particle canvas & accessible fallback
│   │   ├── admin/                # Admin shell, status badges, deletion confirmation modals
│   │   ├── cards/                # Service cards, opportunity cards, project case study cards
│   │   ├── forms/                # Contact form, internship application form, mentor form
│   │   ├── layout/               # Global Header, Footer, Mobile Navigation
│   │   ├── sections/             # Modular landing page sections
│   │   └── ui/                   # Reusable atomic UI buttons, badges, inputs
│   │
│   ├── config/
│   │   ├── brand.ts              # Centralized brand identity, contact points, and URLs
│   │   ├── env.ts                # Runtime environment parser and validation
│   │   └── navigation.ts         # Navigation bar links and footer structure
│   │
│   ├── content/                  # Static metadata catalogs
│   │   ├── industries.ts         # 6 Target industry profiles & solutions
│   │   ├── internships.ts        # Fallback opportunity definitions
│   │   ├── projects.ts           # Case studies data & demonstration status
│   │   ├── services.ts           # 14 Detailed service specifications & FAQs
│   │   └── team.ts               # Leadership & technical team profiles
│   │
│   ├── lib/
│   │   ├── database/             # Prisma client singleton & connection tester
│   │   ├── rate-limit/           # Sliding-window rate limiter (Redis & Memory)
│   │   └── validation/           # Zod schemas for contact, internships, auth, opportunities
│   │
│   ├── server/
│   │   ├── auth/                 # JWT signing, session cookies, TOTP generation, CSRF guards
│   │   ├── notifications/        # Resend transactional email dispatch service
│   │   └── repositories/         # Prisma data access layer (admin, inquiries, internships, mentors)
│   │
│   └── types/                    # Shared TypeScript interfaces & types
│
└── tests/
    ├── integration/              # Admin APIs, MFA workflow, public endpoints
    └── unit/                     # JWT auth, TOTP verification, email service, rate limiting
```

---

## 5. Database Schema & Entities

The relational persistence layer is managed via Prisma targeting PostgreSQL:

```mermaid
erDiagram
    AdminUser ||--o{ AuditLog : triggers
    InternshipOpportunity ||--o{ InternshipApplication : receives

    AdminUser {
        string id PK
        string email UK
        string passwordHash
        string name
        enum role "SUPER_ADMIN | ADMIN | REVIEWER"
        boolean isActive
        boolean mfaEnabled
        string mfaSecret
        string[] mfaRecoveryCodes
        int tokenVersion
        datetime lastLoginAt
    }

    Inquiry {
        string id PK
        enum type "BUSINESS | STUDENT | COLLABORATION | GENERAL"
        string name
        string email
        string organization
        string projectCategory
        string budgetRange
        string timeline
        string message
        enum status "NEW | IN_REVIEW | CONTACTED | CLOSED | ARCHIVED"
        string internalNotes
        boolean consentGiven
        datetime createdAt
    }

    InternshipOpportunity {
        string id PK
        string title
        string slug UK
        string department
        enum type "TECHNICAL_INTERNSHIP | PROJECT_APPRENTICESHIP | RESEARCH_FELLOWSHIP"
        string description
        string eligibility
        string[] skills
        string duration
        string locationMode
        string compensationStatus
        int availablePositions
        boolean published
    }

    InternshipApplication {
        string id PK
        string opportunityId FK
        string fullName
        string email
        string phone
        string education
        string skills
        string motivationStatement
        string portfolioUrl
        string resumeUrl
        enum status "SUBMITTED | UNDER_REVIEW | SHORTLISTED | ACCEPTED | DECLINED"
        string internalNotes
        datetime createdAt
    }

    MentorInquiry {
        string id PK
        string fullName
        string email
        string areaOfExpertise
        enum collaborationPreference "MENTOR_STUDENTS | CONDUCT_WORKSHOP | ARCHITECTURE_REVIEW | PROJECT_COLLABORATION | CONSULTING_PARTNERSHIP"
        string linkedInOrWebsiteUrl
        string introduction
        enum status "NEW | IN_REVIEW | CONTACTED | CLOSED | ARCHIVED"
        string internalNotes
        datetime createdAt
    }

    AuditLog {
        string id PK
        string adminId
        string adminEmail
        string action
        string resource
        string targetId
        json metadata
        string ipAddress
        datetime createdAt
    }
```

---

## 6. Security & Authentication Architecture

PLAYQ Solutions implements enterprise-grade security controls:

### Multi-Factor Authentication (TOTP MFA)
1. **RFC 6238 TOTP Standard**: Integrates with Google Authenticator, 1Password, or Authy using HMAC-SHA1 algorithm with 30-second time steps.
2. **Replay Attack Defense**: Tracks the last used time step in the database to prevent token replay within valid windows.
3. **Emergency Backup Codes**: Generates 8 cryptographically secure 16-character single-use recovery codes. Consumed codes are permanently invalidated.
4. **Enforced Security Policy**: Accounts with role `SUPER_ADMIN` are strictly mandated to enroll in MFA before executing sensitive modifications.

### Session Management & RBAC
- **Stateless HMAC-SHA256 JWTs**: Signed using `jose` with an 8-hour expiry window, stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies (`playq_admin_session`).
- **Token Version Revocation**: Each admin account tracks a `tokenVersion` counter. Revoking sessions or resetting MFA increments this counter, immediately invalidating all active JWTs.
- **Role Hierarchy**:
  - `SUPER_ADMIN`: Full access to user management, MFA resets, catalog deletion, and system auditing.
  - `ADMIN`: Inquiry management, applicant review, status transitions, internal notes.
  - `REVIEWER`: Read-only access to submissions and operational reports.

### Threat Mitigation & Defenses
- **CSRF Protection**: Origin and Referer header verification enforced on all state-altering mutation endpoints (`POST`, `PUT`, `DELETE`).
- **Distributed Rate Limiting**: Sliding-window token limiters (Upstash Redis REST) applied to submission and login routes to deter brute-force and credential stuffing.
- **Honeypot Bot Defense**: Transparent hidden fields trap automated crawlers and return simulated success without persisting bad payloads.
- **Strict HTTP Headers**: Configured in `next.config.ts`:
  - `Content-Security-Policy (CSP)`
  - `Strict-Transport-Security (HSTS)` with 2-year preload
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 7. Environment Variables Configuration

Copy `.env.example` to `.env.local` to start developing. Below is the operational reference:

| Variable | Target Environment | Required? | Purpose & Format |
| :--- | :---: | :---: | :--- |
| `DATABASE_URL` | Production / Staging | **Required** | PostgreSQL connection string (`postgresql://user:pass@host:5432/db?sslmode=require`). For automated local testing, set to `"memory"`. |
| `DIRECT_URL` | Production / Staging | Optional | Direct connection string for Prisma migrations when using connection poolers (Supabase/Neon/PgBouncer). |
| `AUTH_SECRET` | Production / Staging | **Required** | High-entropy signing key (minimum 32 characters, generate with `openssl rand -hex 32`). |
| `NEXT_PUBLIC_SITE_URL` | All Environments | **Required** | Canonical site URL for metadata, sitemaps, and CSRF origin verification (e.g., `https://playqsolutions.com`). |
| `ADMIN_COOKIE_SECURE` | Production | Optional | Enforces HTTPS-only cookies (automatically `true` when `NODE_ENV=production`). |
| `UPSTASH_REDIS_REST_URL` | Production | Optional | Upstash Redis REST endpoint for distributed rate limiting across serverless lambdas. |
| `UPSTASH_REDIS_REST_TOKEN`| Production | Optional | Upstash Redis REST authentication token. |
| `RESEND_API_KEY` | Production / Staging | Optional | API key starting with `re_` for transactional email alerts. App safely falls back to mock delivery if omitted. |
| `NOTIFICATION_FROM_EMAIL` | Production | Optional | Verified sender address in Resend (default: `notifications@playqsolutions.com`). |
| `CONTACT_NOTIFICATION_EMAIL`| Production | Optional | Recipient inbox for internal team alerts (default: `contact@playqsolutions.com`). |

---

## 8. Quick Start & Local Development

### Prerequisites
- **Node.js**: v20.x or higher (Node 22 recommended)
- **npm**: v10.x or higher
- **PostgreSQL**: v14+ (or set `DATABASE_URL="memory"` for mock local execution)

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/yash6366/PLAY-Solutions.git
cd "Tech Solutions"

# 2. Install dependencies
npm install

# 3. Configure local environment
cp .env.example .env.local

# 4. Generate Prisma Client
npx prisma generate

# 5. Run automated test suite
npm test

# 6. Verify environment safety
npx tsx scripts/validate-env.ts --mode=development

# 7. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Database Migrations & Seeding

### Applying Migrations
Never use `prisma db push` in production. Always apply version-controlled migration files:

```bash
# Deploy all pending migrations safely to PostgreSQL
npm run db:migrate:deploy

# In local development: generate a new migration after editing schema.prisma
npx prisma migrate dev --name describe_your_change
```

### Seeding Catalog Data
To populate the 3 initial internship opportunities and project case studies:

```bash
# Idempotently upsert initial opportunities without modifying user submissions
npm run db:seed
```

### Prisma Studio
To inspect raw tables during local debugging:

```bash
npx prisma studio
```

---

## 10. Operational CLI Scripts & Administrative Tooling

The repository provides production-safe CLI scripts located in `scripts/`:

### 1. Provisioning Administrators (`create-admin.ts`)
Creates an administrator account with hashed password and audit logging:

```bash
# Direct argument execution
node --experimental-strip-types scripts/create-admin.ts <email> <name> <password> [role]

# Example
node --experimental-strip-types scripts/create-admin.ts admin@playqsolutions.com "Lead Engineer" "SuperSecurePass123!" SUPER_ADMIN

# Or via environment variables
INITIAL_ADMIN_EMAIL=admin@playqsolutions.com INITIAL_ADMIN_PASSWORD=secret npm run admin:create
```

### 2. Emergency MFA Reset (`reset-admin-mfa.ts`)
Disables MFA for a locked-out administrator, revokes all active session tokens, and logs the emergency intervention:

```bash
node --experimental-strip-types scripts/reset-admin-mfa.ts admin@playqsolutions.com
```

### 3. Environment Variable Auditor (`validate-env.ts`)
Safely validates environment readiness across development, staging, or production **without printing secrets or passwords**:

```bash
npx tsx scripts/validate-env.ts --mode=production
```

### 4. Database Handshake Verification (`verify-db.ts`)
Non-destructively verifies PostgreSQL connectivity and table accessibility without altering data:

```bash
npx tsx scripts/verify-db.ts
```

### 5. Transactional Email Verification (`test-email.ts`)
Sends a test transactional notification through the Resend REST API to verify API keys and deliverability:

```bash
npx tsx scripts/test-email.ts --recipient=dev@playqsolutions.com
```

---

## 11. Testing & Quality Assurance

The codebase includes comprehensive unit and integration tests powered by **Vitest**:

```bash
# Run entire test suite
npm test

# Run tests in interactive watch mode
npx vitest

# Run a specific test suite
npx vitest tests/integration/admin-mfa.test.ts
```

### Test Coverage Summary (132 Tests Passing)
- **Authentication & MFA**: Bcrypt hashing, session signing, invalid password rejection, TOTP code generation & step calculation, emergency recovery codes, replay prevention.
- **Administrative APIs**: Overview KPI aggregation, inquiry filtering, applicant status updates, career catalog CRUD, role permission barriers.
- **Resilience & Email**: Graceful degradation on network timeout, non-blocking email failures, mock mode in non-production environments.
- **Rate Limiting**: Sliding-window counter arithmetic, distributed Redis fallback to local in-memory store.
- **Content Integrity**: All 14 service specifications, 6 industry sectors, and opportunity slugs verified against unique routing standards.

---

## 12. Health Diagnostics & Observability

The application features a production health check endpoint at `/api/health`:

```bash
# Standard Operational Telemetry
curl http://localhost:3000/api/health

# Kubernetes / Cloud Readiness Probe (Returns HTTP 503 if configured DB is down)
curl http://localhost:3000/api/health?probe=readiness
```

### Sample Health Payload:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-12T20:55:00.000Z",
  "version": "0.1.0",
  "environment": "production",
  "probes": {
    "liveness": "ok",
    "readiness": "ready"
  },
  "database": {
    "status": "connected",
    "configured": true,
    "driver": "prisma-postgresql"
  },
  "rateLimiting": {
    "backend": "upstash-redis",
    "distributed": true
  },
  "notifications": {
    "configured": true,
    "provider": "resend"
  }
}
```

---

## 13. Production Deployment Guidelines

### Recommended Deployment on Vercel
1. Link your GitHub repository to Vercel.
2. In Project Settings > Environment Variables, supply:
   - `DATABASE_URL` (e.g. from Supabase or Neon with connection pooling)
   - `DIRECT_URL` (direct port 5432 endpoint for Prisma migrations)
   - `AUTH_SECRET` (generate with `openssl rand -hex 32`)
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://playqsolutions.com`)
   - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`
   - `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`, `CONTACT_NOTIFICATION_EMAIL`
3. Set Build Command: `npm run build`
4. Post-deployment: Run `npm run db:migrate:deploy` and `npm run db:seed` via GitHub Actions or your deployment pipeline.
5. Provision your first administrator via CLI:
   ```bash
   node --experimental-strip-types scripts/create-admin.ts owner@playqsolutions.com "Super Admin" "StrongPassword!" SUPER_ADMIN
   ```

### Standalone Node.js / Docker
```bash
# Build optimized standalone bundle
npm run build

# Start production server
npm run start
```

---

## 14. License & Ownership

Copyright © 2026 **PLAYQ Solutions**. All rights reserved.  
Proprietary software developed for enterprise client operations, apprenticeships, and digital engineering services.
