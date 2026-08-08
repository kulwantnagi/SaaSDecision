import { SoftwareAssessmentInput } from './types';

/**
 * Calculates raw KEEP Score (0-100)
 * Higher score means staying with existing SaaS carries less risk and high strategic value.
 */
export function calculateKeepScore(assessment: SoftwareAssessmentInput): number {
  const {
    businessCriticality,
    dataMoat,
    migrationComplexity,
    integrationDependency,
    networkEffects,
    complianceRequirement,
  } = assessment;

  // Weighted score based on 1-5 scale ratings
  const weighted =
    (businessCriticality / 5) * 25 +
    (dataMoat / 5) * 20 +
    (migrationComplexity / 5) * 15 +
    (integrationDependency / 5) * 15 +
    (networkEffects / 5) * 15 +
    (complianceRequirement / 5) * 10;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}
