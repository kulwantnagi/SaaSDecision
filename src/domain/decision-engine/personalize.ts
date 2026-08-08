import { SoftwareAssessmentInput, DecisionResult } from './types';
import { evaluateSoftware } from './index';

export interface UserPersonalizationProfile {
  featuresUsedRatio?: number; // e.g. 0.25 (4 out of 16 features used)
  hasDeveloperTeam?: boolean;
  requiresSSO?: boolean;
  requiresStrictCompliance?: boolean;
}

/**
 * Adjusts raw decision scores based on personalized user feature usage and team capability
 */
export function evaluatePersonalizedSoftware(
  assessment: SoftwareAssessmentInput,
  profile: UserPersonalizationProfile
): DecisionResult {
  const baseResult = evaluateSoftware(assessment);
  let { buildScore, keepScore, switchScore, selfHostScore, automateScore } = baseResult;

  const extraReasons: string[] = [];
  const extraWarnings: string[] = [];

  // Core Principle: "Can AI rebuild the part of this SaaS that YOU actually use?"
  if (profile.featuresUsedRatio !== undefined) {
    if (profile.featuresUsedRatio <= 0.3) {
      // User only uses a small fraction of features -> BUILD score rises dramatically
      buildScore = Math.min(100, buildScore + 25);
      automateScore = Math.min(100, automateScore + 15);
      keepScore = Math.max(0, keepScore - 15);
      extraReasons.push(
        `You use under 30% of features. Building or automating your specific subset is significantly simpler than replacing the full suite.`
      );
    } else if (profile.featuresUsedRatio >= 0.8) {
      // User uses full feature suite -> BUILD falls
      buildScore = Math.max(0, buildScore - 20);
      keepScore = Math.min(100, keepScore + 10);
      extraWarnings.push(
        `Heavy feature usage across the entire platform makes custom building high-friction.`
      );
    }
  }

  // Developer availability
  if (profile.hasDeveloperTeam) {
    buildScore = Math.min(100, buildScore + 15);
    selfHostScore = Math.min(100, selfHostScore + 15);
    extraReasons.push(`In-house engineering team available to maintain builds and self-hosted infrastructure.`);
  } else {
    buildScore = Math.max(0, buildScore - 25);
    extraWarnings.push(`Lack of developer capacity makes custom building impractical.`);
  }

  // SSO & Compliance
  if (profile.requiresSSO || profile.requiresStrictCompliance) {
    buildScore = Math.max(0, buildScore - 20);
    keepScore = Math.min(100, keepScore + 15);
    extraWarnings.push(`Enterprise SSO and compliance requirements favor retaining established SaaS.`);
  }

  const updatedDecisions = [
    { type: 'KEEP' as const, score: keepScore },
    { type: 'SWITCH' as const, score: switchScore },
    { type: 'SELF_HOST' as const, score: selfHostScore },
    { type: 'AUTOMATE' as const, score: automateScore },
    { type: 'BUILD' as const, score: buildScore },
  ].sort((a, b) => b.score - a.score);

  return {
    keepScore,
    switchScore,
    selfHostScore,
    automateScore,
    buildScore,
    primaryDecision: updatedDecisions[0].type,
    secondaryDecision: updatedDecisions[1].type,
    confidence: baseResult.confidence,
    reasons: [...baseResult.reasons, ...extraReasons],
    warnings: [...baseResult.warnings, ...extraWarnings],
    scoringVersion: `${baseResult.scoringVersion}-personalized`,
  };
}
