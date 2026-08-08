export type FeatureAvailability = 'FULL' | 'PARTIAL' | 'NONE';
export type SoftwareStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type SourceType = 
  | 'OFFICIAL_WEBSITE' 
  | 'OFFICIAL_PRICING' 
  | 'OFFICIAL_DOCS' 
  | 'GITHUB' 
  | 'CHANGELOG' 
  | 'REPUTABLE_SECONDARY' 
  | 'OTHER';

export type RelationshipType = 
  | 'ALTERNATIVE' 
  | 'OPEN_SOURCE' 
  | 'CHEAPER' 
  | 'REPLACEMENT' 
  | 'COMPLEMENT';

export interface SoftwareAssessmentInput {
  buildComplexity: number;
  integrationDependency: number;
  dataMoat: number;
  networkEffects: number;
  complianceRequirement: number;
  infrastructureComplexity: number;
  realtimeCollaboration: number;
  maintenanceBurden: number;
  businessCriticality: number;
  migrationComplexity: number;
  apiAvailability: number;
  workflowAutomatable: number;
  openSourceMaturity: number;
  alternativeMarketStrength: number;
  dataPortability: number;
  mobileDependency: number;
  permissionComplexity: number;
  reliabilityRequirement: number;
  vendorLockIn: number;
}

export interface PersonalizedProfileInput {
  teamSize?: number;
  featuresUsedCount?: number;
  totalFeaturesCount?: number;
  requiresSSO?: boolean;
  requiresCompliance?: boolean;
  hasDeveloperTeam?: boolean;
}

export type DecisionType = 'KEEP' | 'SWITCH' | 'SELF_HOST' | 'AUTOMATE' | 'BUILD';

export interface DecisionResult {
  keepScore: number;
  switchScore: number;
  selfHostScore: number;
  automateScore: number;
  buildScore: number;
  primaryDecision: DecisionType;
  secondaryDecision: DecisionType;
  confidence: number;
  reasons: string[];
  warnings: string[];
  scoringVersion: string;
}
