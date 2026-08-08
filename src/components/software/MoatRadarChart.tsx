'use client';

export interface MoatMetrics {
  buildComplexity: number;
  integrationDependency: number;
  dataMoat: number;
  networkEffects: number;
  complianceRequirement: number;
  infrastructureComplexity?: number;
  realtimeCollaboration?: number;
  maintenanceBurden?: number;
  businessCriticality?: number;
  migrationComplexity?: number;
  vendorLockIn?: number;
}

interface MoatItem {
  label: string;
  val: number;
  icon: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  hint: string;
}

function getRisk(val: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (val >= 4) return 'HIGH';
  if (val >= 3) return 'MEDIUM';
  return 'LOW';
}

const RISK_CONFIG = {
  HIGH: {
    bar: 'bg-[#dc2626]',
    badge: 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]',
    dot: 'bg-[#dc2626]',
    track: 'bg-[#fee2e2]',
  },
  MEDIUM: {
    bar: 'bg-[#d97706]',
    badge: 'bg-[#fffbeb] text-[#b45309] border border-[#fde68a]',
    dot: 'bg-[#d97706]',
    track: 'bg-[#fef3c7]',
  },
  LOW: {
    bar: 'bg-[#16a34a]',
    badge: 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]',
    dot: 'bg-[#16a34a]',
    track: 'bg-[#dcfce7]',
  },
};

export default function MoatRadarChart({ metrics }: { metrics: MoatMetrics }) {
  const categories: MoatItem[] = [
    { label: 'Build Complexity', val: metrics.buildComplexity, icon: '⚙', riskLevel: getRisk(metrics.buildComplexity), hint: 'Difficulty of rebuilding from scratch' },
    { label: 'Integration Depth', val: metrics.integrationDependency, icon: '🔗', riskLevel: getRisk(metrics.integrationDependency), hint: 'How deeply embedded in your stack' },
    { label: 'Data Moat', val: metrics.dataMoat, icon: '🏛', riskLevel: getRisk(metrics.dataMoat), hint: 'Proprietary data lock-in over time' },
    { label: 'Network Effects', val: metrics.networkEffects, icon: '◎', riskLevel: getRisk(metrics.networkEffects), hint: 'Value derived from user network size' },
    { label: 'Compliance Risk', val: metrics.complianceRequirement, icon: '⚖', riskLevel: getRisk(metrics.complianceRequirement), hint: 'Regulatory and audit requirements' },
  ];

  const highRiskCount = categories.filter((c) => c.riskLevel === 'HIGH').length;
  const overallRisk = highRiskCount >= 3 ? 'HIGH' : highRiskCount >= 2 ? 'MEDIUM' : 'LOW';
  const moatScore = Math.round(categories.reduce((acc, c) => acc + c.val, 0) / categories.length * 20);

  const overallBadge = {
    HIGH: 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]',
    MEDIUM: 'bg-[#fffbeb] text-[#b45309] border border-[#fde68a]',
    LOW: 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]',
  }[overallRisk];

  return (
    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#f1f5f9]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-1">
              Software Moat & Risk
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                {moatScore}
              </span>
              <span className="text-sm text-[#94a3b8] font-semibold">/ 100</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mt-1 ${overallBadge}`}>
            {overallRisk} lock-in
          </span>
        </div>
      </div>

      {/* Metric Bars */}
      <div className="px-5 py-4 space-y-3">
        {categories.map((cat, idx) => {
          const cfg = RISK_CONFIG[cat.riskLevel];
          const pct = (cat.val / 5) * 100;

          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <span className="text-[11px] font-semibold text-[#334155]">{cat.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
                    {cat.riskLevel}
                  </span>
                  <span className="text-[11px] font-bold text-[#64748b] tabular-nums">
                    {cat.val}<span className="text-[#cbd5e1]">/5</span>
                  </span>
                </div>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${cfg.track}`}>
                <div
                  className={`h-full rounded-full ${cfg.bar} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer legend */}
      <div className="px-5 pb-4 pt-2 border-t border-[#f1f5f9] flex gap-4">
        {(['HIGH', 'MEDIUM', 'LOW'] as const).map((r) => (
          <div key={r} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${RISK_CONFIG[r].dot}`} />
            <span className="text-[9px] uppercase font-bold text-[#94a3b8] tracking-wide">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
