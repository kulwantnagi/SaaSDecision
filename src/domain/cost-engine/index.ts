import { SoftwareAssessmentInput } from '../decision-engine/types';

export interface CostCalculationInput {
  assessment: SoftwareAssessmentInput;
  monthlySubscriptionCost: number;
  seatsCount?: number;
  seatCostMonthly?: number;
  estimatedDevHourlyRate?: number;
  developerTeamCount?: number;
}

export interface OptionCostBreakdown {
  option: 'KEEP' | 'SWITCH' | 'SELF_HOST' | 'AUTOMATE' | 'BUILD';
  cost12Months: { min: number; max: number };
  cost24Months: { min: number; max: number };
  cost36Months: { min: number; max: number };
  breakdownNotes: string;
}

export interface TrueCostComparisonResult {
  currentMonthlySpend: number;
  options: OptionCostBreakdown[];
  recommendedOption: 'KEEP' | 'SWITCH' | 'SELF_HOST' | 'AUTOMATE' | 'BUILD';
  breakevenMonthLow?: number;
  breakevenMonthHigh?: number;
  potentialAnnualSavingsMin: number;
  potentialAnnualSavingsMax: number;
}

/**
 * Calculates 12, 24, and 36 month true cost ranges for KEEP, SWITCH, SELF_HOST, AUTOMATE, BUILD
 */
export function calculateTrueCost(input: CostCalculationInput): TrueCostComparisonResult {
  const {
    monthlySubscriptionCost,
    seatsCount = 1,
    seatCostMonthly = 0,
    estimatedDevHourlyRate = 75,
  } = input;

  const currentMonthly = monthlySubscriptionCost + seatsCount * seatCostMonthly;
  const keep12 = currentMonthly * 12;
  const keep24 = currentMonthly * 24;
  const keep36 = currentMonthly * 36;

  // SWITCH: ~70% of current cost + initial migration fee
  const switch12Min = Math.round(keep12 * 0.65 + 300);
  const switch12Max = Math.round(keep12 * 0.85 + 1000);
  const switch24Min = Math.round(keep24 * 0.65 + 300);
  const switch24Max = Math.round(keep24 * 0.85 + 1000);
  const switch36Min = Math.round(keep36 * 0.65 + 300);
  const switch36Max = Math.round(keep36 * 0.85 + 1000);

  // SELF-HOST: VPS hosting (~$20-$50/mo) + setup maintenance
  const hostMonthly = 35;
  const maintMonthly = 100;
  const selfHost12Min = Math.round((hostMonthly + maintMonthly) * 12 + 500);
  const selfHost12Max = Math.round((hostMonthly + maintMonthly * 2) * 12 + 1500);
  const selfHost24Min = Math.round((hostMonthly + maintMonthly) * 24 + 500);
  const selfHost24Max = Math.round((hostMonthly + maintMonthly * 2) * 24 + 1500);
  const selfHost36Min = Math.round((hostMonthly + maintMonthly) * 36 + 500);
  const selfHost36Max = Math.round((hostMonthly + maintMonthly * 2) * 36 + 1500);

  // AUTOMATE: Zapier/Make tasks (~$30/mo)
  const autoMonthly = 30;
  const automate12Min = Math.round(autoMonthly * 12 + 200);
  const automate12Max = Math.round(autoMonthly * 2.5 * 12 + 800);
  const automate24Min = Math.round(autoMonthly * 24 + 200);
  const automate24Max = Math.round(autoMonthly * 2.5 * 24 + 800);
  const automate36Min = Math.round(autoMonthly * 36 + 200);
  const automate36Max = Math.round(autoMonthly * 2.5 * 36 + 800);

  // BUILD: Initial build hours based on complexity
  const buildHoursLow = input.assessment.buildComplexity * 30;
  const buildHoursHigh = input.assessment.buildComplexity * 80;
  const initialBuildCostLow = buildHoursLow * estimatedDevHourlyRate;
  const initialBuildCostHigh = buildHoursHigh * estimatedDevHourlyRate;
  const monthlyMaintenanceBuild = 80;

  const build12Min = Math.round(initialBuildCostLow + monthlyMaintenanceBuild * 12);
  const build12Max = Math.round(initialBuildCostHigh + monthlyMaintenanceBuild * 2 * 12);
  const build24Min = Math.round(initialBuildCostLow + monthlyMaintenanceBuild * 24);
  const build24Max = Math.round(initialBuildCostHigh + monthlyMaintenanceBuild * 2 * 24);
  const build36Min = Math.round(initialBuildCostLow + monthlyMaintenanceBuild * 36);
  const build36Max = Math.round(initialBuildCostHigh + monthlyMaintenanceBuild * 2 * 36);

  // Calculate Breakeven Month for BUILD vs KEEP
  let breakevenMonthLow: number | undefined;
  let breakevenMonthHigh: number | undefined;

  if (currentMonthly > monthlyMaintenanceBuild) {
    const netMonthlySavings = currentMonthly - monthlyMaintenanceBuild;
    breakevenMonthLow = Math.ceil(initialBuildCostLow / netMonthlySavings);
    breakevenMonthHigh = Math.ceil(initialBuildCostHigh / netMonthlySavings);
  }

  const potentialAnnualSavingsMin = Math.max(0, keep12 - switch12Max);
  const potentialAnnualSavingsMax = Math.max(0, keep12 - switch12Min);

  return {
    currentMonthlySpend: currentMonthly,
    options: [
      {
        option: 'KEEP',
        cost12Months: { min: keep12, max: keep12 },
        cost24Months: { min: keep24, max: keep24 },
        cost36Months: { min: keep36, max: keep36 },
        breakdownNotes: 'Ongoing recurring subscription and seat licensing.',
      },
      {
        option: 'SWITCH',
        cost12Months: { min: switch12Min, max: switch12Max },
        cost24Months: { min: switch24Min, max: switch24Max },
        cost36Months: { min: switch36Min, max: switch36Max },
        breakdownNotes: 'Discounted commercial alternative with one-time migration.',
      },
      {
        option: 'SELF_HOST',
        cost12Months: { min: selfHost12Min, max: selfHost12Max },
        cost24Months: { min: selfHost24Min, max: selfHost24Max },
        cost36Months: { min: selfHost36Min, max: selfHost36Max },
        breakdownNotes: 'VPS infrastructure plus internal maintenance overhead.',
      },
      {
        option: 'AUTOMATE',
        cost12Months: { min: automate12Min, max: automate12Max },
        cost24Months: { min: automate24Min, max: automate24Max },
        cost36Months: { min: automate36Min, max: automate36Max },
        breakdownNotes: 'Workflow task consumption and API connector execution.',
      },
      {
        option: 'BUILD',
        cost12Months: { min: build12Min, max: build12Max },
        cost24Months: { min: build24Min, max: build24Max },
        cost36Months: { min: build36Min, max: build36Max },
        breakdownNotes: 'Upfront dev labor + minimal monthly infrastructure.',
      },
    ],
    recommendedOption: 'SWITCH',
    breakevenMonthLow,
    breakevenMonthHigh,
    potentialAnnualSavingsMin,
    potentialAnnualSavingsMax,
  };
}
