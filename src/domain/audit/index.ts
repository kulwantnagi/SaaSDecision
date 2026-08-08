import { DecisionType } from '../decision-engine/types';

export interface AuditItemInput {
  softwareName: string;
  categoryName: string;
  monthlyCost: number;
  seatsCount: number;
  usageLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedDecision: DecisionType;
  potentialMonthlySavings: number;
}

export interface StackAuditResult {
  totalMonthlySpend: number;
  totalAnnualSpend: number;
  optimizedMonthlySpend: number;
  potentialAnnualSavings: number;
  stackEfficiencyScore: number; // 0-100
  categoryOverlaps: { categoryName: string; count: number; softwareNames: string[] }[];
  groupedDecisions: Record<DecisionType, AuditItemInput[]>;
  topRecommendations: string[];
  highestRiskChange: string;
  easiestSavingsOpportunity: string;
}

/**
 * Calculates complete SaaS stack audit analytics, overlap detection, and efficiency metrics
 */
export function calculateStackAudit(items: AuditItemInput[]): StackAuditResult {
  if (items.length === 0) {
    return {
      totalMonthlySpend: 0,
      totalAnnualSpend: 0,
      optimizedMonthlySpend: 0,
      potentialAnnualSavings: 0,
      stackEfficiencyScore: 100,
      categoryOverlaps: [],
      groupedDecisions: { KEEP: [], SWITCH: [], SELF_HOST: [], AUTOMATE: [], BUILD: [] },
      topRecommendations: ['Add your software items to evaluate your SaaS stack efficiency.'],
      highestRiskChange: 'N/A',
      easiestSavingsOpportunity: 'N/A',
    };
  }

  const totalMonthlySpend = items.reduce((acc, curr) => acc + curr.monthlyCost, 0);
  const totalAnnualSpend = totalMonthlySpend * 12;

  const totalMonthlySavings = items.reduce((acc, curr) => acc + curr.potentialMonthlySavings, 0);
  const optimizedMonthlySpend = Math.max(0, totalMonthlySpend - totalMonthlySavings);
  const potentialAnnualSavings = totalMonthlySavings * 12;

  // Group products by decision
  const groupedDecisions: Record<DecisionType, AuditItemInput[]> = {
    KEEP: [],
    SWITCH: [],
    SELF_HOST: [],
    AUTOMATE: [],
    BUILD: [],
  };

  items.forEach((item) => {
    groupedDecisions[item.recommendedDecision].push(item);
  });

  // Detect category overlaps
  const categoryMap: Record<string, string[]> = {};
  items.forEach((item) => {
    if (!categoryMap[item.categoryName]) {
      categoryMap[item.categoryName] = [];
    }
    categoryMap[item.categoryName].push(item.softwareName);
  });

  const categoryOverlaps = Object.entries(categoryMap)
    .filter(([_, names]) => names.length > 1)
    .map(([cat, names]) => ({
      categoryName: cat,
      count: names.length,
      softwareNames: names,
    }));

  // Calculate Stack Efficiency Score (0-100)
  const savingsRatio = totalMonthlySpend > 0 ? totalMonthlySavings / totalMonthlySpend : 0;
  const overlapPenalty = categoryOverlaps.length * 10;
  const stackEfficiencyScore = Math.max(0, Math.min(100, Math.round(100 - savingsRatio * 60 - overlapPenalty)));

  // Recommendations
  const topRecommendations: string[] = [];
  if (categoryOverlaps.length > 0) {
    topRecommendations.push(
      `Eliminate redundant software in ${categoryOverlaps.map((c) => c.categoryName).join(', ')}.`
    );
  }
  if (groupedDecisions.SWITCH.length > 0) {
    topRecommendations.push(
      `Switch ${groupedDecisions.SWITCH.map((i) => i.softwareName).join(', ')} to commercial alternatives for immediate savings.`
    );
  }
  if (groupedDecisions.AUTOMATE.length > 0) {
    topRecommendations.push(
      `Automate workflow routines in ${groupedDecisions.AUTOMATE.map((i) => i.softwareName).join(', ')}.`
    );
  }

  const highestRiskChange =
    groupedDecisions.BUILD.length > 0
      ? `Custom building a replacement for ${groupedDecisions.BUILD[0].softwareName}`
      : groupedDecisions.SWITCH.length > 0
      ? `Migrating core processes away from ${groupedDecisions.SWITCH[0].softwareName}`
      : 'Low overall risk across current stack';

  const easiestSavingsOpportunity =
    groupedDecisions.SWITCH.length > 0
      ? `Switch ${groupedDecisions.SWITCH[0].softwareName} (Saves ~$${groupedDecisions.SWITCH[0].potentialMonthlySavings * 12}/year)`
      : groupedDecisions.AUTOMATE.length > 0
      ? `Automate ${groupedDecisions.AUTOMATE[0].softwareName} (Saves ~$${groupedDecisions.AUTOMATE[0].potentialMonthlySavings * 12}/year)`
      : 'Stack is already highly optimized';

  return {
    totalMonthlySpend,
    totalAnnualSpend,
    optimizedMonthlySpend,
    potentialAnnualSavings,
    stackEfficiencyScore,
    categoryOverlaps,
    groupedDecisions,
    topRecommendations: topRecommendations.length > 0 ? topRecommendations : ['Stack is currently lean with low overlap.'],
    highestRiskChange,
    easiestSavingsOpportunity,
  };
}
