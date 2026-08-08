import { describe, it, expect } from 'vitest';
import { evaluateSoftware } from './index';
import { SoftwareAssessmentInput } from './types';

const mockAssessment: SoftwareAssessmentInput = {
  buildComplexity: 3,
  integrationDependency: 3,
  dataMoat: 2,
  networkEffects: 2,
  complianceRequirement: 2,
  infrastructureComplexity: 2,
  realtimeCollaboration: 2,
  maintenanceBurden: 2,
  businessCriticality: 3,
  migrationComplexity: 2,
  apiAvailability: 4,
  workflowAutomatable: 4,
  openSourceMaturity: 5,
  alternativeMarketStrength: 4,
  dataPortability: 4,
  mobileDependency: 1,
  permissionComplexity: 2,
  reliabilityRequirement: 3,
  vendorLockIn: 2,
};

describe('Decision Engine v1.0', () => {
  it('computes deterministic scores within 0-100 bounds', () => {
    const result = evaluateSoftware(mockAssessment);

    expect(result.keepScore).toBeGreaterThanOrEqual(0);
    expect(result.keepScore).toBeLessThanOrEqual(100);

    expect(result.switchScore).toBeGreaterThanOrEqual(0);
    expect(result.switchScore).toBeLessThanOrEqual(100);

    expect(result.selfHostScore).toBeGreaterThanOrEqual(0);
    expect(result.selfHostScore).toBeLessThanOrEqual(100);

    expect(result.automateScore).toBeGreaterThanOrEqual(0);
    expect(result.automateScore).toBeLessThanOrEqual(100);

    expect(result.buildScore).toBeGreaterThanOrEqual(0);
    expect(result.buildScore).toBeLessThanOrEqual(100);

    expect(result.scoringVersion).toBe('v1.0');
  });

  it('applies safety gate penalty to BUILD when compliance and criticality are high', () => {
    const highRiskAssessment: SoftwareAssessmentInput = {
      ...mockAssessment,
      complianceRequirement: 5,
      businessCriticality: 5,
      buildComplexity: 1, // raw build score would naturally be high
    };

    const result = evaluateSoftware(highRiskAssessment);
    expect(result.buildScore).toBeLessThanOrEqual(35);
    expect(result.warnings.some((w) => w.includes('compliance'))).toBe(true);
  });

  it('boosts SELF-HOST score when open source maturity is maximum and migration is low', () => {
    const openSourceAssessment: SoftwareAssessmentInput = {
      ...mockAssessment,
      openSourceMaturity: 5,
      migrationComplexity: 1,
    };

    const result = evaluateSoftware(openSourceAssessment);
    expect(result.reasons.some((r) => r.includes('open-source'))).toBe(true);
  });
});
