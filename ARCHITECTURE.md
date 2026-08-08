# Architecture Specification: SaaS Decision Engine

## System Overview
The SaaS Decision Engine is a public software intelligence platform delivering deterministic 5-way evaluations (`KEEP`, `SWITCH`, `SELF-HOST`, `AUTOMATE`, `BUILD`) for software applications. 

## Architectural Principles
1. **Server-First Execution**: Default to Next.js React Server Components (RSC). Client Components are used strictly for interactive elements.
2. **Deterministic Scoring**: Scoring algorithms are pure, versioned, and executed deterministically in code—never generated dynamically by AI models.
3. **Multi-Platform Portability**: Cloudflare Workers deployment via `@opennextjs/cloudflare` with PostgreSQL on Neon via `@prisma/adapter-neon`.

---

## Technical Stack Overview

```
+-----------------------------------------------------------------------+
|                            Client Browser                             |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    Cloudflare Workers Edge Network                    |
|                        (@opennextjs/cloudflare)                       |
+-----------------------------------------------------------------------+
|  Next.js 16.2 App Router (React 19)                                   |
|  - Public Intelligence Pages (/software/[slug], /search, /)           |
|  - Admin Dashboard (/admin/*)                                         |
|  - Domain Engines (Decision Scoring, Safety Gates)                    |
|  - Better Auth Middleware & Route Handlers                            |
+-----------------------------------------------------------------------+
         |                                           |
         v                                           v
+------------------------+               +------------------------------+
| Neon Serverless Postgres|               |  Resend Email Engine         |
| (Pooled Runtime Driver)|               |  (sendEmail abstraction)     |
+------------------------+               +------------------------------+
```

---

## System Components

### 1. Database & Persistence Layer
- **Database**: PostgreSQL hosted on Neon.
- **ORM**: Prisma ORM 7 with multi-file schema support (`prisma/models/*.prisma`).
- **Connection Adapter**: Direct integration via `@prisma/adapter-neon` with Neon's serverless pooler (`@neondatabase/serverless`).
- **Data Access Layer**: Centralized server-side data service functions enforcing authorization and validation.

### 2. Decision Engine (`src/domain/decision-engine/`)
- **Deterministic Evaluation**: Pure functions that compute numerical scores (0-100) across 5 decisions (`KEEP`, `SWITCH`, `SELF-HOST`, `AUTOMATE`, `BUILD`).
- **Safety Gates**: Rule-based overrides penalizing high-risk choices (e.g. compliance violations) or boosting low-friction choices (e.g. open-source maturity).
- **Score Versioning**: Scores recorded with model versions (e.g., `v1.0`) for auditability.

### 3. Authentication & Security Layer
- **Authentication**: Better Auth with Prisma adapter.
- **Scope**: Required for `/admin/*` management routes, saved user assessments, and private audits. Guest access is fully supported for search, reading software intelligence pages, and basic score calculations.
- **Bot Defense**: Cloudflare Turnstile integration on public submission forms.

### 4. Public Intelligence & SEO Engine
- **Server-Side Rendering (SSR)**: High-speed, SEO-optimized page generation for `/software/[slug]`.
- **Search**: PostgreSQL full-text search and alias matching (`pg_trgm`).
- **AEO (Answer Engine Optimization)**: Structured 40-120 word responses embedded in metadata and JSON-LD schema for search crawlers.

### 5. Email & Notifications
- **Provider**: Resend.
- **Abstraction**: Internal `sendEmail()` interface ensuring provider isolation.
