# Implementation Plan & Execution Guide: SaaS Decision Engine

## Overview
This document outlines the step-by-step technical execution workflow for Phase 1 of the SaaS Decision Engine, focusing on core framework setup, data schema creation, scoring engine implementation, public rendering, search indexing, and verification suite.

---

## Phase 1 Execution Milestones

### Milestone 1: Core Tooling & Framework Initialization
1. Initialize Next.js 16.2 project with App Router, TypeScript strict mode, React 19, and Tailwind CSS v4.
2. Configure `@opennextjs/cloudflare` configuration for deployment readiness.
3. Configure Prisma ORM 7 multi-file schema (`prisma/models/*.prisma`) and `@prisma/adapter-neon`.
4. Setup Better Auth configuration for Admin session control.

### Milestone 2: Domain Decision Engine Implementation
1. Define score input and output interfaces in `src/domain/decision-engine/types.ts`.
2. Implement pure scoring formulas in:
   - `src/domain/decision-engine/keep.ts`
   - `src/domain/decision-engine/switch.ts`
   - `src/domain/decision-engine/self-host.ts`
   - `src/domain/decision-engine/automate.ts`
   - `src/domain/decision-engine/build.ts`
3. Implement business logic post-processing in `src/domain/decision-engine/safety-gates.ts`.
4. Expose main scoring pipeline in `src/domain/decision-engine/index.ts` tagged with version `v1.0`.
5. Write Vitest unit test suite covering scoring bounds (0-100), normalization, and safety overrides.

### Milestone 3: Database Models & Seed Dataset
1. Build Prisma schema domain models (`auth`, `software`, `pricing`, `features`, `assessment`, `relationships`, `sources`, `audit`, `blueprint`, `monetization`, `analytics`).
2. Run database migration and generate Prisma client.
3. Create seed dataset script (`prisma/seed.ts`) containing **25 high-commercial-intent verified products**:
   - Calendly, Typeform, Jotform, Zapier, Make, Notion, ClickUp, Monday, Asana, Airtable, Loom, Linktree, Buffer, Hootsuite, HubSpot, Mailchimp, ActiveCampaign, ConvertKit, Cursor, Lovable, Canva, Miro, Intercom, Zendesk, Webflow.

### Milestone 4: Admin Backoffice
1. Set up protected `/admin` route layout with Better Auth middleware (`requireAdmin()`).
2. Implement Admin CRUD management interfaces:
   - Software & Aliases management
   - Software 19-attribute Assessment management
   - Pricing Plans & Snapshots management
   - Sources & Relationships management

### Milestone 5: Public Intelligence & Search Engine
1. Homepage (`/`): High-converting design featuring quick-search input, top replaceable products, worth keeping, and open-source alternatives.
2. Search Service (`src/services/search/`): Fast PostgreSQL full-text and alias match handler.
3. Software Intelligence Route (`/software/[slug]`):
   - 5 Decision Score visual bars
   - Hero recommendation badge & key metadata
   - Deep-dive sections for KEEP, SWITCH, SELF-HOST, AUTOMATE, BUILD
   - AEO answer blocks (40-120 words) for direct AI/Search indexing
   - OpenGraph cards and JSON-LD schema metadata
4. Dynamic Sitemap (`src/app/sitemap.ts`) & Robots (`src/app/robots.ts`).

---

## Verification & Validation Suite
To declare Phase 1 complete, all of the following commands must execute cleanly:

```bash
# 1. Code Style Verification
npm run lint

# 2. Typecheck Verification
npx tsc --noEmit

# 3. Unit Test Verification
npm run test

# 4. Production Build Verification
npm run build

# 5. Cloudflare Workers Compatibility Build
npx open-next-cloudflare build
```
