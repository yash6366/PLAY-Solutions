# PLAYQ Solutions — Production Deployment & Operational Readiness Guide

This document defines the deployment, configuration, administrator bootstrapping, verification, and incident recovery procedures for PLAYQ Solutions when deploying to **Vercel** with **Neon PostgreSQL**.

---

## 1. Required Vercel Environment Variables

Configure these variables in your **Vercel Project Dashboard** under **Settings → Environment Variables**:

| Variable Name | Required | Environment | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | Production / Preview | Pooled PostgreSQL connection via PgBouncer (includes `sslmode=require` and pooler host). Used by Prisma Client for all runtime application queries. |
| `DIRECT_URL` | **Yes** | Production / Preview | Direct unpooled PostgreSQL connection (direct host on port 5432). Used by Prisma CLI for schema migrations (`prisma migrate deploy`). |
| `AUTH_SECRET` | **Yes** | Production / Preview | Cryptographic master signing key (minimum 32 characters, recommended 64-char hex string generated via `openssl rand -hex 32`). Used to sign and verify HS256 JWT admin sessions and MFA challenge tokens. |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Production / Preview | Canonical public URL of the deployed application (e.g. `https://playqsolutions.com` or `https://your-app.vercel.app`). Enforced by CSRF origin checks. |
| `ADMIN_COOKIE_SECURE` | **Yes** | Production | Set to `true` to mandate HTTPS-only transmission of the `playq_admin_session` cookie. |
| `UPSTASH_REDIS_REST_URL` | Optional | Production | REST endpoint URL for distributed sliding-window rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Production | REST token for distributed Upstash Redis authentication. |
| `RESEND_API_KEY` | Optional | Production | API key for transactional email delivery (inquiries, applications). |
| `NOTIFICATION_FROM_EMAIL` | Optional | Production | Sender address for transactional emails (e.g. `notifications@playqsolutions.com`). |
| `CONTACT_NOTIFICATION_EMAIL`| Optional | Production | Destination recipient for customer inquiries and applications. |

> **Security Guard:** Never commit live database credentials, production passwords, or JWT secrets to source control. Use Vercel's encrypted environment variable store.

---

## 2. Neon PostgreSQL Connection Architecture

Prisma is configured with dual-connection routing in `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

1. **`DATABASE_URL` (Runtime Query Pooler):**
   - Connects to the Neon pooled endpoint: `ep-[endpoint]-pooler.[region].aws.neon.tech/neondb?sslmode=require`
   - Optimized for high-concurrency serverless function lifecycles.
2. **`DIRECT_URL` (Schema Migrations & CLI):**
   - Connects directly to the compute instance: `ep-[endpoint].[region].aws.neon.tech/neondb?sslmode=require`
   - Bypasses PgBouncer transaction pooling to allow advisory locks and schema DDL migrations required by `prisma migrate deploy`.

---

## 3. Database Migration & Schema Sync Commands

Vercel builds compile Next.js code (`prisma generate && next build`) and **do not automatically alter production database schemas**. Run schema migrations before deployment or during your release pipeline:

### Deploy Pending Migrations
```bash
# Applies all unapplied SQL migrations using the direct connection
npm run db:migrate:deploy
```

### Validate Schema Integrity
```bash
# Ensures schema.prisma and migrations are consistent
npm run db:validate
```

---

## 4. Controlled Production Administrator Bootstrap Procedure

In production mode (`NODE_ENV=production`), seed scripts and CLI provisioning **never create predictable default passwords** and **never silently reset existing administrator credentials**.

### Option A: Provisioning via CLI Tool (Recommended)
From an authorized deployment machine or CI runner with the production `DATABASE_URL` and `DIRECT_URL` configured:

```bash
# Syntax: npm run admin:create <email> <fullName> <strongPassword> [role]
npm run admin:create security-officer@playqsolutions.com "Security Lead" "ReplaceWithStrong16+Chars!" SUPER_ADMIN
```

- Enforces minimum 12-character passwords in production (16+ recommended).
- Hashes passwords using bcrypt with 12 salt rounds (synchronized with the runtime login handler).
- Prevents duplicate account creation and logs an immutable entry to `AuditLog`.

### Option B: Automated Bootstrap via Environment Variables
```bash
INITIAL_ADMIN_EMAIL="admin@playqsolutions.com" \
INITIAL_ADMIN_PASSWORD="ReplaceWithStrong16+Chars!" \
INITIAL_ADMIN_NAME="Primary Administrator" \
INITIAL_ADMIN_ROLE="SUPER_ADMIN" \
npm run db:bootstrap
```

- `npm run db:bootstrap` runs `prisma migrate deploy` first, then executes `prisma/seed.ts`.
- If accounts already exist, the seed script **preserves existing administrator credentials** and does not overwrite passwords.
- If no accounts exist and credentials are not provided, the script halts safely with an explicit error instead of creating insecure defaults.

---

## 5. Pre-Flight Configuration & Database Verification Procedure

Before routing traffic or after modifying environment variables, execute the safe, non-destructive verification scripts:

### 1. Audit Environment Variables
```bash
npm run env:validate -- --mode=production
```
- Validates presence, formatting, and key length without printing secret values.

### 2. Verify Database Health & Schema Readiness
```bash
npm run db:verify
```
- Performs a live PostgreSQL handshake.
- Verifies existence of required tables: `Inquiry`, `InternshipOpportunity`, `InternshipApplication`, `MentorInquiry`, `Project`, `AdminUser`, `AuditLog`.
- Reports active administrator account counts without exposing credentials.

### 3. Check Live HTTP Diagnostics Endpoint
```bash
curl -s https://playqsolutions.com/api/health?probe=readiness
```
Returns HTTP 200 when operational, or HTTP 503 if the database is unreachable or degraded.

---

## 6. HTTP Status Codes & Troubleshooting Guide

| HTTP Status | Client Message | Root Cause | Remediation |
| :--- | :--- | :--- | :--- |
| **401 Unauthorized** | `Invalid email or password.` | • Email not found in `AdminUser` table.<br>• Password mismatch against bcrypt hash.<br>• Account is deactivated (`isActive: false`). | • Check Vercel server logs for `[ACCOUNT_NOT_FOUND]` or `[INVALID_CREDENTIALS]`.<br>• Verify the account was provisioned in the target database.<br>• Verify password accuracy. |
| **403 Forbidden** | `Cross-site request forgery detected. Request rejected.` | • Browser `Origin` or `Referer` does not match `NEXT_PUBLIC_SITE_URL` or request `Host`.<br>• Browser sent plain `http://` instead of `https://`. | • Update `NEXT_PUBLIC_SITE_URL` in Vercel to match your canonical domain (e.g. `https://playqsolutions.com`).<br>• Check Vercel server logs for `[CSRF_VALIDATION_FAILURE]`. |
| **429 Too Many Requests** | `Too many failed login attempts. Please wait 5 minutes...` | • Brute-force protection triggered (5 failed attempts within 5 minutes per IP). | • Wait 5 minutes for the sliding window to clear.<br>• In distributed setups, ensure Upstash Redis credentials are valid. |
| **500 Internal Server Error** | `An unexpected error occurred during login.` | • Missing or insufficient `AUTH_SECRET` in Vercel environment variables (<32 characters). | • In Vercel Project Settings, add `AUTH_SECRET` with at least 32 characters (e.g. `openssl rand -hex 32`).<br>• Trigger a project redeploy. |
| **503 Service Unavailable** | `Authentication service is temporarily unavailable...` | • `DATABASE_URL` is missing, empty, or unconfigured.<br>• Neon PostgreSQL database is unreachable or suspended.<br>• Schema migrations have not been applied (`AdminUser` table missing). | • Check Vercel server logs for `[DATABASE_CONNECTION_FAILURE]`.<br>• Verify `DATABASE_URL` in Vercel Settings.<br>• Run `npm run db:migrate:deploy` to apply missing migrations. |

---

## 7. Rollback & Disaster Recovery Guidance

### Rolling Back Code Deployments
1. In the **Vercel Dashboard**, navigate to **Deployments**.
2. Identify the last known healthy deployment and click **Instant Rollback**.
3. Vercel routes traffic immediately to the previous immutable build artifact.

### Revoking Compromised Administrator Sessions
If an administrator credential or session is suspected to be compromised:
1. Revoke all active JWT sessions for the administrator:
   ```bash
   node --experimental-strip-types scripts/reset-admin-mfa.ts <compromisedEmail>
   ```
   *Incrementing `tokenVersion` immediately invalidates all active sessions issued prior to that timestamp.*
2. Force-rotate the administrator password via authorized SQL or re-provisioning.
3. If `AUTH_SECRET` was leaked, rotate `AUTH_SECRET` in Vercel Environment Variables and redeploy. All existing sessions will immediately be invalidated globally.
