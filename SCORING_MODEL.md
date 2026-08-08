# Scoring Model Specification: SaaS Decision Engine

## Overview
The Decision Engine generates five deterministic 0-100 scores for every software entity based on its 19-attribute `SoftwareAssessment`, optional personalized profile, pricing data, and relationship graph.

Scoring Version: `v1.0`

---

## 1. Score Formulations

All 19 assessment attributes are normalized ratings on a 1–5 scale.

### A. BUILD SCORE
Calculates how realistic and sensible it is for a user/team to custom-build an alternative.
- **Weights**:
  - Build Complexity: 18% (inverse)
  - Maintenance Burden: 16% (inverse)
  - Integration Dependency: 12% (inverse)
  - Data Moat: 12% (inverse)
  - Compliance Requirement: 12% (inverse)
  - Infrastructure Complexity: 12% (inverse)
  - Network Effects: 10% (inverse)
  - Realtime Collaboration: 8% (inverse)

### B. KEEP SCORE
Calculates how strongly the user should stay with the existing SaaS product due to lock-in, business risk, or core value.
- **Weights**:
  - Business Criticality: 25%
  - Data Moat: 20%
  - Migration Complexity: 15%
  - Integration Dependency: 15%
  - Network Effects: 15%
  - Compliance Requirement: 10%

### C. SWITCH SCORE
Calculates the advantage of switching to a direct commercial alternative.
- **Weights**:
  - Alternative Market Strength: 30%
  - Data Portability: 20%
  - Migration Complexity: 20% (inverse)
  - Vendor Lock-In: 15%
  - Feature Parity (if alternative exists): 15%

### D. SELF-HOST SCORE
Calculates the viability of replacing the SaaS with a self-hosted open-source software alternative.
- **Weights**:
  - Open Source Maturity: 35%
  - Data Portability: 25%
  - Deployment/Infrastructure Complexity: 20% (inverse)
  - Maintenance Burden: 20% (inverse)

### E. AUTOMATE SCORE
Calculates whether custom workflows (e.g. Zapier, Make, custom scripts/APIs) can replace the SaaS UI entirely without building a replacement app.
- **Weights**:
  - Workflow Automatable: 40%
  - API Availability: 30%
  - Mobile Dependency: 15% (inverse)
  - Realtime Collaboration: 15% (inverse)

---

## 2. Safety Gates (Post-Processing Overrides)

Deterministic rules applied after raw score calculations:

1. **High Compliance + Business Criticality Penalty**:
   If `complianceRequirement >= 4` AND `businessCriticality >= 4`, cap `BUILD` score at maximum 35.
2. **Network Effect Lock-In**:
   If `networkEffects >= 4`, boost `KEEP` score by +15 (capped at 100).
3. **Mature Open Source Opportunity**:
   If `openSourceMaturity == 5` AND `migrationComplexity <= 2`, boost `SELF-HOST` score by +20 (capped at 100).
4. **Automation Gate**:
   If `workflowAutomatable >= 4` AND `apiAvailability >= 4`, boost `AUTOMATE` score by +15 (capped at 100).
5. **High Reliability Requirement Without Verified Alternative**:
   If `reliabilityRequirement >= 4`, penalize `BUILD` by -20.
