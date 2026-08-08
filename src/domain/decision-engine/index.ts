import { SoftwareAssessmentInput, DecisionResult, DecisionType } from './types';
import { calculateKeepScore } from './keep';
import { calculateSwitchScore } from './switch';
import { calculateSelfHostScore } from './self-host';
import { calculateAutomateScore } from './automate';
import { calculateBuildScore } from './build';
import { applySafetyGates } from './safety-gates';

export const SCORING_MODEL_VERSION = 'v1.0';

/**
 * Main deterministic decision pipeline.
 * Computes scores across 5 choices, applies safety rules, and determines primary/secondary decisions.
 */
export function evaluateSoftware(assessment: SoftwareAssessmentInput): DecisionResult {
  const rawKeep = calculateKeepScore(assessment);
  const rawSwitch = calculateSwitchScore(assessment);
  const rawSelfHost = calculateSelfHostScore(assessment);
  const rawAutomate = calculateAutomateScore(assessment);
  const rawBuild = calculateBuildScore(assessment);

  const processed = applySafetyGates(
    {
      keepScore: rawKeep,
      switchScore: rawSwitch,
      selfHostScore: rawSelfHost,
      automateScore: rawAutomate,
      buildScore: rawBuild,
    },
    assessment
  );

  const decisions: { type: DecisionType; score: number }[] = [
    { type: 'KEEP', score: processed.keepScore },
    { type: 'SWITCH', score: processed.switchScore },
    { type: 'SELF_HOST', score: processed.selfHostScore },
    { type: 'AUTOMATE', score: processed.automateScore },
    { type: 'BUILD', score: processed.buildScore },
  ];

  // Sort descending by score
  decisions.sort((a, b) => b.score - a.score);

  const primaryDecision = decisions[0].type;
  const secondaryDecision = decisions[1].type;

  // Calculate confidence based on lead gap
  const leadGap = decisions[0].score - decisions[1].score;
  const confidence = Math.min(100, Math.max(50, 60 + leadGap * 2));

  return {
    keepScore: processed.keepScore,
    switchScore: processed.switchScore,
    selfHostScore: processed.selfHostScore,
    automateScore: processed.automateScore,
    buildScore: processed.buildScore,
    primaryDecision,
    secondaryDecision,
    confidence,
    reasons: processed.reasons,
    warnings: processed.warnings,
    scoringVersion: SCORING_MODEL_VERSION,
  };
}

export * from './types';
