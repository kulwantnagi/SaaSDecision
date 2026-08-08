import { SoftwareAssessmentInput } from './types';

export interface ScorePostProcessing {
  keepScore: number;
  switchScore: number;
  selfHostScore: number;
  automateScore: number;
  buildScore: number;
  reasons: string[];
  warnings: string[];
}

/**
 * Executes deterministic business rules and safety overrides on computed raw scores.
 */
export function applySafetyGates(
  rawScores: {
    keepScore: number;
    switchScore: number;
    selfHostScore: number;
    automateScore: number;
    buildScore: number;
  },
  assessment: SoftwareAssessmentInput
): ScorePostProcessing {
  let { keepScore, switchScore, selfHostScore, automateScore, buildScore } = rawScores;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Gate 1: High Compliance + High Business Criticality strongly penalizes BUILD
  if (assessment.complianceRequirement >= 4 && assessment.businessCriticality >= 4) {
    if (buildScore > 35) {
      buildScore = 35;
      warnings.push('High compliance and critical reliance severely restrict custom building.');
    }
  }

  // Gate 2: Strong Network Effect boosts KEEP
  if (assessment.networkEffects >= 4) {
    keepScore = Math.min(100, keepScore + 15);
    reasons.push('Established network effect makes replacement impractical.');
  }

  // Gate 3: High Open-Source Maturity + Easy Migration boosts SELF-HOST
  if (assessment.openSourceMaturity === 5 && assessment.migrationComplexity <= 2) {
    selfHostScore = Math.min(100, selfHostScore + 20);
    reasons.push('Highly mature open-source ecosystem with straightforward data migration.');
  }

  // Gate 4: High Automation Potential + Robust API boosts AUTOMATE
  if (assessment.workflowAutomatable >= 4 && assessment.apiAvailability >= 4) {
    automateScore = Math.min(100, automateScore + 15);
    reasons.push('High automation suitability using workflow tools or custom scripts.');
  }

  // Gate 5: High Reliability Requirement without simple build path penalizes BUILD
  if (assessment.reliabilityRequirement >= 4 && assessment.infrastructureComplexity >= 4) {
    buildScore = Math.max(0, buildScore - 20);
    warnings.push('High uptime and reliability demands increase self-build maintenance risk.');
  }

  return {
    keepScore,
    switchScore,
    selfHostScore,
    automateScore,
    buildScore,
    reasons,
    warnings,
  };
}
