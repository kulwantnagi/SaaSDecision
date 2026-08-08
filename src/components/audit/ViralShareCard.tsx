'use client';

import { useState } from 'react';

export interface ViralShareCardProps {
  totalAnnualSpend: number;
  potentialAnnualSavings: number;
  stackEfficiencyScore: number;
}

export default function ViralShareCard({
  totalAnnualSpend,
  potentialAnnualSavings,
  stackEfficiencyScore,
}: ViralShareCardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const shareText = `AI audited my SaaS stack!
💰 Current SaaS Spend: $${totalAnnualSpend.toLocaleString()}/yr
✨ Potential Savings: $${potentialAnnualSavings.toLocaleString()}/yr
📊 Stack Efficiency Score: ${stackEfficiencyScore}/100

Evaluate your software stack on Keep.Switch.Build:`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white border border-[#2b00d9]/30 rounded-3xl p-6 space-y-5 shadow-lg shadow-[#2b00d9]/5 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full">
            Shareable Social Card
          </span>
          <h3 className="text-xl font-extrabold text-[#0f172a] mt-1">SaaS Stack Audit Summary</h3>
        </div>
        <span className="text-xs font-bold bg-[#eef2ff] text-[#2b00d9] border border-[#2b00d9]/20 px-3 py-1 rounded-full">
          Score: {stackEfficiencyScore}/100
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#64748b]">Annual SaaS Spend</span>
          <p className="text-2xl font-black text-[#0f172a]">${totalAnnualSpend.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#64748b]">Identified Savings</span>
          <p className="text-2xl font-black text-[#16a34a]">${potentialAnnualSavings.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-[#64748b]">No private vendor names exposed</span>
        <button
          type="button"
          onClick={handleCopy}
          className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-[#2b00d9]/25"
        >
          {copied ? '✓ Copied Share Card Text!' : 'Copy Viral Share Post 🚀'}
        </button>
      </div>
    </div>
  );
}
