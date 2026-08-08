import { SoftwareAssessmentInput } from './types';

/**
 * Calculates raw SWITCH Score (0-100)
 * Higher score means replacing this software with a market alternative is highly viable.
 */
export function calculateSwitchScore(assessment: SoftwareAssessmentInput): number {
  const {
    alternativeMarketStrength,
    dataPortability,
    migrationComplexity,
    vendorLockIn,
  } = assessment;

  // Inverse migration complexity (easier migration boosts switch score)
  const inverseMigration = 6 - migrationComplexity;

  const weighted =
    (alternativeMarketStrength / 5) * 35 +
    (dataPortability / 5) * 25 +
    (inverseMigration / 5) * 25 +
    (vendorLockIn / 5) * 15;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}
