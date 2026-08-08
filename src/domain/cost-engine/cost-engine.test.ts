import { describe, it, expect } from 'vitest';
import { calculateTrueCost } from './index';

describe('True Cost Engine', () => {
  it('calculates 12, 24, and 36 month ranges for KEEP, SWITCH, SELF_HOST, AUTOMATE, BUILD', () => {
    const res = calculateTrueCost({
      assessment: {
        buildComplexity: 2,
        integrationDependency: 2,
        dataMoat: 2,
        networkEffects: 1,
        complianceRequirement: 1,
        infrastructureComplexity: 2,
        realtimeCollaboration: 1,
        maintenanceBurden: 2,
        businessCriticality: 3,
        migrationComplexity: 1,
        apiAvailability: 4,
        workflowAutomatable: 4,
        openSourceMaturity: 5,
        alternativeMarketStrength: 4,
        dataPortability: 4,
        mobileDependency: 1,
        permissionComplexity: 1,
        reliabilityRequirement: 3,
        vendorLockIn: 1,
      },
      monthlySubscriptionCost: 100,
      seatsCount: 5,
      seatCostMonthly: 10,
    });

    expect(res.currentMonthlySpend).toBe(150);
    expect(res.options.find((o) => o.option === 'KEEP')?.cost12Months.min).toBe(1800);
    expect(res.breakevenMonthLow).toBeGreaterThan(0);
  });
});
