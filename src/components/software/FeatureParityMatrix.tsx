'use client';

import React from 'react';

export interface ParityFeature {
  category: string;
  featureName: string;
  originalSupport: 'FULL' | 'PARTIAL' | 'NONE';
  alternativeSupport: 'FULL' | 'PARTIAL' | 'NONE';
  notes: string;
}

interface FeatureParityMatrixProps {
  productName: string;
  alternativeName: string;
  alternativeType?: 'OPEN_SOURCE' | 'COMMERCIAL';
  migrationDifficulty?: 'EASY' | 'MODERATE' | 'COMPLEX';
  features?: ParityFeature[];
}

const DEFAULT_FEATURES: ParityFeature[] = [
  {
    category: 'Core Capabilities',
    featureName: 'Primary Operational Workflow & Core Engine',
    originalSupport: 'FULL',
    alternativeSupport: 'FULL',
    notes: 'Direct 1-to-1 functional replacement for main daily tasks.',
  },
  {
    category: 'Data Ownership',
    featureName: 'Self-Hosted Database & Offline Data Access',
    originalSupport: 'NONE',
    alternativeSupport: 'FULL',
    notes: 'Complete control over data storage and zero vendor lock-in.',
  },
  {
    category: 'Integrations',
    featureName: 'Third-party Webhooks & API Automation',
    originalSupport: 'FULL',
    alternativeSupport: 'FULL',
    notes: 'Supports REST API and standard webhooks.',
  },
  {
    category: 'Security',
    featureName: 'Single Sign-On (SSO / SAML / OIDC)',
    originalSupport: 'FULL',
    alternativeSupport: 'PARTIAL',
    notes: 'Available via open-source OAuth2/OIDC plugin or enterprise license.',
  },
  {
    category: 'Governance',
    featureName: 'Detailed Audit Logs & Compliance Controls',
    originalSupport: 'FULL',
    alternativeSupport: 'PARTIAL',
    notes: 'Requires database level query logging in self-hosted setups.',
  },
];

export default function FeatureParityMatrix({
  productName,
  alternativeName,
  alternativeType = 'OPEN_SOURCE',
  migrationDifficulty = 'EASY',
  features = DEFAULT_FEATURES,
}: FeatureParityMatrixProps) {
  const getBadge = (status: 'FULL' | 'PARTIAL' | 'NONE') => {
    switch (status) {
      case 'FULL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#16a34a] bg-[#dcfce7] border border-[#86efac] px-2.5 py-0.5 rounded-full">
            ✓ Full Support
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#d97706] bg-[#fef3c7] border border-[#fde047] px-2.5 py-0.5 rounded-full">
            ⚠️ Partial
          </span>
        );
      case 'NONE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#dc2626] bg-[#fee2e2] border border-[#fca5a5] px-2.5 py-0.5 rounded-full">
            ✕ Not Supported
          </span>
        );
    }
  };

  const getDifficultyBadge = (diff: 'EASY' | 'MODERATE' | 'COMPLEX') => {
    switch (diff) {
      case 'EASY':
        return 'bg-[#dcfce7] text-[#15803d] border-[#86efac]';
      case 'MODERATE':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fde047]';
      case 'COMPLEX':
        return 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]';
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#f1f5f9] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-xs font-bold text-[#475569] mb-2">
            <span>🔄 1:1 Feature Parity & Migration Assessment</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
            {productName} vs {alternativeName} Trade-off Matrix
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#64748b]">Migration Effort:</span>
          <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${getDifficultyBadge(migrationDifficulty)}`}>
            {migrationDifficulty}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#e2e8f0] text-[11px] font-black uppercase text-[#64748b] tracking-wider bg-[#f8fafc]">
              <th className="py-3 px-4">Feature Capability</th>
              <th className="py-3 px-4 w-44">{productName} (Current)</th>
              <th className="py-3 px-4 w-44">{alternativeName} ({alternativeType === 'OPEN_SOURCE' ? 'Open Source' : 'Alternative'})</th>
              <th className="py-3 px-4">Migration / Parity Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9] text-xs">
            {features.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#f8fafc]/60 transition">
                <td className="py-3.5 px-4 font-bold text-[#0f172a]">
                  {item.featureName}
                  <span className="block text-[10px] font-semibold text-[#94a3b8]">{item.category}</span>
                </td>
                <td className="py-3.5 px-4">{getBadge(item.originalSupport)}</td>
                <td className="py-3.5 px-4">{getBadge(item.alternativeSupport)}</td>
                <td className="py-3.5 px-4 text-[#475569] leading-relaxed">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
