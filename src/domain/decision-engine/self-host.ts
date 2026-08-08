import { SoftwareAssessmentInput } from './types';

/**
 * Calculates raw SELF-HOST Score (0-100)
 * Higher score means a mature open-source self-hostable alternative is practical.
 */
export function calculateSelfHostScore(assessment: SoftwareAssessmentInput): number {
  const {
    openSourceMaturity,
    dataPortability,
    infrastructureComplexity,
    maintenanceBurden,
  } = assessment;

  // Inverse complexity and maintenance
  const inverseInfra = 6 - infrastructureComplexity;
  const inverseMaint = 6 - maintenanceBurden;

  const weighted =
    (openSourceMaturity / 5) * 40 +
    (dataPortability / 5) * 25 +
    (inverseInfra / 5) * 20 +
    (inverseMaint / 5) * 15;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}
