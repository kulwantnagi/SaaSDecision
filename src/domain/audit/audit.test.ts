import { describe, it, expect } from 'vitest';
import { calculateStackAudit } from './index';

describe('SaaS Stack Audit Engine', () => {
  it('calculates total spend, overlap detection, and stack efficiency score', () => {
    const res = calculateStackAudit([
      {
        softwareName: 'Calendly',
        categoryName: 'Scheduling',
        monthlyCost: 20,
        seatsCount: 2,
        usageLevel: 'LOW',
        recommendedDecision: 'SWITCH',
        potentialMonthlySavings: 10,
      },
      {
        softwareName: 'Acuity',
        categoryName: 'Scheduling',
        monthlyCost: 30,
        seatsCount: 2,
        usageLevel: 'LOW',
        recommendedDecision: 'SWITCH',
        potentialMonthlySavings: 20,
      },
    ]);

    expect(res.totalMonthlySpend).toBe(50);
    expect(res.totalAnnualSpend).toBe(600);
    expect(res.categoryOverlaps.length).toBe(1);
    expect(res.categoryOverlaps[0].categoryName).toBe('Scheduling');
    expect(res.potentialAnnualSavings).toBe(360);
    expect(res.stackEfficiencyScore).toBeLessThan(100);
  });
});
