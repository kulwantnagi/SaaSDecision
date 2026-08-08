import { SoftwareAssessmentInput } from './types';

/**
 * Calculates raw BUILD Score (0-100)
 * Higher score means custom-building an internal replacement software is viable.
 */
export function calculateBuildScore(assessment: SoftwareAssessmentInput): number {
  const {
    buildComplexity,
    integrationDependency,
    dataMoat,
    networkEffects,
    complianceRequirement,
    infrastructureComplexity,
    realtimeCollaboration,
    maintenanceBurden,
  } = assessment;

  // Difficulty metrics inversely impact build feasibility
  const invBuild = 6 - buildComplexity;
  const invIntegration = 6 - integrationDependency;
  const invMoat = 6 - dataMoat;
  const invNetwork = 6 - networkEffects;
  const invCompliance = 6 - complianceRequirement;
  const invInfra = 6 - infrastructureComplexity;
  const invCollab = 6 - realtimeCollaboration;
  const invMaint = 6 - maintenanceBurden;

  const weighted =
    (invBuild / 5) * 18 +
    (invMaint / 5) * 16 +
    (invIntegration / 5) * 12 +
    (invMoat / 5) * 12 +
    (invCompliance / 5) * 12 +
    (invInfra / 5) * 12 +
    (invNetwork / 5) * 10 +
    (invCollab / 5) * 8;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}
