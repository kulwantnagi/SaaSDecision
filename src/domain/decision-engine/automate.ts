import { SoftwareAssessmentInput } from './types';

/**
 * Calculates raw AUTOMATE Score (0-100)
 * Higher score means the product's primary utility can be achieved via workflow automation/APIs.
 */
export function calculateAutomateScore(assessment: SoftwareAssessmentInput): number {
  const {
    workflowAutomatable,
    apiAvailability,
    mobileDependency,
    realtimeCollaboration,
  } = assessment;

  const inverseMobile = 6 - mobileDependency;
  const inverseCollab = 6 - realtimeCollaboration;

  const weighted =
    (workflowAutomatable / 5) * 40 +
    (apiAvailability / 5) * 30 +
    (inverseMobile / 5) * 15 +
    (inverseCollab / 5) * 15;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}
