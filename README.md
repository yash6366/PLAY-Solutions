# PLAYQ Solutions — Production Web Application

> **Engineering Technology. Empowering People. Building Tomorrow.**

PLAYQ Solutions is a premium enterprise technology solutions web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Prisma ORM**, and **Three.js**.

---

## 1. System Architecture

- **Core Pillars**:
  1. *Enterprise Technology Solutions* (14 technical services specifications with dynamic routing, search, and category filtering)
  2. *Student Development & Industry Apprenticeship* (Structured internship catalog, eligibility terms, and application workflow)
  3. *Industry Expertise & Mentorship* (Professional collaboration portal)
- **Database Layer**: PostgreSQL managed via Prisma (`prisma/schema.prisma`).
- **Migrations Strategy**: Version-controlled SQL migrations located in `prisma/migrations/`.
- **Security & Resilience**:
  - Sliding-window rate limiter with Upstash Redis REST distributed capability and in-memory fail-safe fallback.
  - Honeypot bot traps and Zod runtime schema validation on all submission endpoints.
  - Strict Content Security Policy (CSP), HSTS, and X-Frame-Options headers.
- **Notifications**: Transactional email dispatch via Resend REST API with per-submission idempotency keys.

---

## 2. Environment Variables

Copy `.env.example` to `.env.local` for local execution or configure them in your production environment:

| Variable | Category | Description | Example / Default |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Required (Prod)** | PostgreSQL database connection string | `postgresql://user:pass@host:5432/playq_solutions_db?schema=public` |
| `DIRECT_URL` | Optional | Direct connection string for Prisma migrations when using connection poolers | `postgresql://user:pass@host:5432/playq_solutions_db?schema=public` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical domain used for sitemaps, robots, and OpenGraph tags | `https://playqsolutions.com` |
| `RESEND_API_KEY` | Optional | API key for transactional email alerts via Resend | `re_xxxxxxxxxxxxxxxxxxxx` |
| `NOTIFICATION_FROM_EMAIL` | Optional | Verified sender address in Resend | `notifications@playqsolutions.com` |
| `CONTACT_NOTIFICATION_EMAIL` | Optional | Recipient inbox for internal team alerts | `contact@playqsolutions.com` |
| `RATE_LIMIT_REDIS_URL` | Optional | Upstash Redis REST endpoint for distributed rate limiting | `https://xxxx-redis.upstash.io` |
| `RATE_LIMIT_REDIS_TOKEN` | Optional | Upstash Redis REST token | `xxxxxxxxxxxxxxxxxxxxxxxx` |

---

## 3. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test

# 3. Check code style and linting
npm run lint

# 4. Start local development server
npm run dev
```

The site will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 4. Production Database Deployment

### Applying Migrations
Do **not** use `prisma db push` in production. Always deploy version-controlled migrations:

```bash
# Deploy all pending migrations safely to the database
npm run db:migrate:deploy
```

### Seeding Catalog Data
To populate the initial 14-service metadata, project case studies, and internship opportunities:

```bash
# Safely upsert initial opportunities and projects without touching user submissions
npm run db:seed
```

---

## 5. Health & Monitoring

The service exposes `/api/health` with comprehensive operational diagnostics:

```bash
# General health & configuration telemetry (Returns HTTP 200)
curl http://localhost:3000/api/health

# Kubernetes / Cloud Readiness Probe (Returns HTTP 503 if configured DB is unreachable)
curl http://localhost:3000/api/health?probe=readiness
```

Telemetry returns:
- `status`: `"healthy"` or `"degraded"`
- `liveness`: `"ok"`
- `readiness`: `"ready"`, `"database_unconfigured"`, or `"database_unreachable"`
- `database`: connection status and driver info
- `rateLimiting`: active backend (`"local-memory"` or `"upstash-redis"`) and distributed status
- `notifications`: email provider status

---

## 6. Business Operations & Submission Management

When visitors submit inquiries or applications:
1. Data is validated and committed to PostgreSQL tables (`Inquiry`, `InternshipApplication`, `MentorInquiry`).
2. A unique reference ID is returned to the user interface.
3. An internal transactional email alert is dispatched to `CONTACT_NOTIFICATION_EMAIL` with the full inquiry body.
4. *Internal Access Note*: Submissions are stored securely in PostgreSQL. Because no authenticated administrative dashboard is deployed to public routes for security, system administrators should query the database directly or use Prisma Studio (`npx prisma studio`) in a secure internal environment to manage incoming leads and student submissions.

---

## 7. Production Build & Deployment

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```
