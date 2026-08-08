# Data Model Specification: SaaS Decision Engine

## Prisma Multi-File Structure Overview
The database schema utilizes Prisma 7 multi-file schema layout located under `prisma/models/`:

```
prisma/
  schema.prisma
  models/
    auth.prisma
    software.prisma
    pricing.prisma
    features.prisma
    assessment.prisma
    relationships.prisma
    sources.prisma
    audit.prisma
    blueprint.prisma
    monetization.prisma
    analytics.prisma
```

---

## Domain Schemas

### 1. `software.prisma`
- **Software**: `id`, `name`, `slug`, `shortDescription`, `summary`, `websiteUrl`, `logoUrl`, `categoryId`, `status` (`DRAFT` | `REVIEW` | `PUBLISHED` | `ARCHIVED`), `dataConfidence`, `lastVerifiedAt`, timestamps.
- **SoftwareAlias**: `id`, `softwareId`, `alias` (e.g. "Click Up" -> ClickUp).
- **Category**: `id`, `name`, `slug`, `description`.

### 2. `assessment.prisma`
- **SoftwareAssessment**: 19 discrete numeric 1-5 evaluation attributes stored as scalar columns:
  - `buildComplexity`, `integrationDependency`, `dataMoat`, `networkEffects`, `complianceRequirement`, `infrastructureComplexity`, `realtimeCollaboration`, `maintenanceBurden`, `businessCriticality`, `migrationComplexity`, `apiAvailability`, `workflowAutomatable`, `openSourceMaturity`, `alternativeMarketStrength`, `dataPortability`, `mobileDependency`, `permissionComplexity`, `reliabilityRequirement`, `vendorLockIn`.

### 3. `pricing.prisma`
- **PricingPlan**: `id`, `softwareId`, `name`, `currency`, `billingInterval`, `basePrice`, `pricePerSeat`, `minimumSeats`, `freeTier`, `pricingUrl`, `verifiedAt`.
- **PricingSnapshot**: `id`, `pricingPlanId`, `price`, `recordedAt`.

### 4. `features.prisma`
- **Feature**: `id`, `name`, `slug`, `category`, `description`.
- **SoftwareFeature**: `softwareId`, `featureId`, `availability` (`FULL` | `PARTIAL` | `NONE`), `importance`, `notes`.

### 5. `relationships.prisma`
- **SoftwareRelationship**: `id`, `sourceSoftwareId`, `targetSoftwareId`, `type` (`ALTERNATIVE` | `OPEN_SOURCE` | `CHEAPER` | `REPLACEMENT` | `COMPLEMENT`), `featureParity`, `migrationDifficulty`, `priceAdvantage`, `technicalDifficulty`, `confidence`, `notes`, `verifiedAt`.

### 6. `sources.prisma`
- **Source**: `id`, `softwareId`, `type` (`OFFICIAL_WEBSITE` | `OFFICIAL_PRICING` | `OFFICIAL_DOCS` | `GITHUB` | `CHANGELOG` | `REPUTABLE_SECONDARY` | `OTHER`), `title`, `url`, `publisher`, `checkedAt`, `notes`.

### 7. `auth.prisma`
- **User**, **Session**, **Account**, **Verification**: Standard Better Auth schema backing admin logins and guest-to-user claims.

### 8. `audit.prisma`, `blueprint.prisma`, `monetization.prisma`, `analytics.prisma`
- Models supporting Phase 2-7 functionality (Affiliate tracking, audits, blueprints).
