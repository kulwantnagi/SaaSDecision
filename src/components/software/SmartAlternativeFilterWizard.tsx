'use client';

import React from 'react';

export type FilterConstraint = 'all' | 'free' | 'open-source' | 'self-host' | 'no-code';

interface SmartAlternativeFilterWizardProps {
  activeFilter: FilterConstraint;
  onFilterChange: (filter: FilterConstraint) => void;
  counts?: {
    total: number;
    free: number;
    openSource: number;
    selfHost: number;
  };
}

export default function SmartAlternativeFilterWizard({
  activeFilter,
  onFilterChange,
  counts,
}: SmartAlternativeFilterWizardProps) {
  const options: { id: FilterConstraint; label: string; icon: string; badge?: string }[] = [
    { id: 'all', label: 'All Options', icon: '🔍' },
    { id: 'open-source', label: 'Open Source', icon: '🚀', badge: counts ? `${counts.openSource}` : undefined },
    { id: 'free', label: 'Free Tier', icon: '🎁', badge: counts ? `${counts.free}` : undefined },
    { id: 'self-host', label: 'Self-Hostable', icon: '🛡️' },
    { id: 'no-code', label: 'No-Code', icon: '⚡' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#eef2ff] to-[#f3e8ff] border-2 border-[#a5b4fc] rounded-3xl p-5 sm:p-6 shadow-xl shadow-[#2b00d9]/10 space-y-4">
      {/* Background glow accent blob */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#2b00d9]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-center flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2b00d9] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[#2b00d9] flex items-center gap-1.5">
            <span>🧭 Smart Alternative Finder Wizard</span>
          </span>
        </div>
        <span className="text-[10px] font-extrabold text-[#475569] bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#c7d2fe]">
          ⚡ Instant Deployment & Budget Filter
        </span>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 pt-1 relative z-10">
        {options.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onFilterChange(opt.id)}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-[#2b00d9] to-[#1f00a8] text-white border-[#2b00d9] shadow-lg shadow-[#2b00d9]/30 scale-[1.03]'
                  : 'bg-white text-[#334155] border-[#c7d2fe] hover:border-[#2b00d9]/50 hover:text-[#2b00d9] hover:bg-[#eef2ff]/50'
              }`}
            >
              <span className="text-xs">{opt.icon}</span>
              <span>{opt.label}</span>
              {opt.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#eef2ff] text-[#2b00d9]'
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
