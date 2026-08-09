'use client';

import React, { useState } from 'react';

interface PricingTier {
  name: string;
  billingInterval: string;
  basePrice: number;
  pricePerSeat: number;
  freeTier: boolean;
}

interface SourceItem {
  type: 'OFFICIAL_WEBSITE' | 'OFFICIAL_PRICING' | 'GITHUB' | 'REPUTABLE_SECONDARY';
  title: string;
  url: string;
}

interface CostSavingsCalculatorProps {
  productName: string;
  pricing?: PricingTier[];
  sources?: SourceItem[];
  openSourceAlternatives?: {
    name: string;
    description: string;
    githubUrl?: string;
  }[];
  commercialAlternatives?: {
    name: string;
    startingPrice: string;
    slug?: string;
  }[];
}

export default function CostSavingsCalculator({
  productName,
  pricing = [],
  sources = [],
  openSourceAlternatives = [],
}: CostSavingsCalculatorProps) {
  const pricingSource = sources.find((s) => s.type === 'OFFICIAL_PRICING') || sources[0];

  // Strictly check if we have verified paid pricing tiers for this tool
  const paidTierIndex = pricing.findIndex((p) => !p.freeTier && (p.basePrice > 0 || p.pricePerSeat > 0));
  const defaultTierIndex = paidTierIndex >= 0 ? paidTierIndex : 0;

  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(defaultTierIndex);
  const activeTier = pricing[selectedTierIndex] || pricing[0];

  const hasVerifiedPaidPricing = Array.isArray(pricing) && pricing.length > 0 && pricing.some((p) => p.basePrice > 0 || p.pricePerSeat > 0);

  const [seats, setSeats] = useState<number>(10);
  const [vpsCost, setVpsCost] = useState<number>(10);

  // If no verified paid pricing exists in database, show Enterprise / Custom Quote banner
  if (!hasVerifiedPaidPricing || !activeTier) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 text-[#0f172a] shadow-sm space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-xs font-bold text-[#64748b]">
            <span>🔒 Enterprise / Custom Quote Tool</span>
          </div>
          {pricingSource && (
            <a
              href={pricingSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-extrabold text-[#2b00d9] hover:underline bg-[#eef2ff] border border-[#c7d2fe] px-3 py-1 rounded-full inline-flex items-center gap-1"
            >
              <span>Visit Official {productName} Pricing Page ↗</span>
            </a>
          )}
        </div>

        <h3 className="text-xl font-black text-[#0f172a]">
          {productName} uses custom enterprise or unlisted tier pricing
        </h3>
        <p className="text-xs text-[#475569] leading-relaxed max-w-2xl font-medium">
          Official public per-seat pricing for <strong className="text-[#0f172a]">{productName}</strong> requires contacting sales or custom quote negotiation. We do not display synthetic estimate numbers to ensure 100% accuracy.
        </p>

        {openSourceAlternatives.length > 0 && (
          <div className="bg-[#f0fdf4] border border-[#86efac] p-4 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold text-[#15803d] block">
                🚀 Recommended Open-Source Self-Hosted Alternative: {openSourceAlternatives[0].name}
              </span>
              <span className="text-[11px] text-[#166534] font-medium block mt-0.5">
                Cap operational infrastructure spend at server VPS costs ($5–$20/mo) with zero licensing fees.
              </span>
            </div>
            <a
              href={openSourceAlternatives[0].githubUrl || '#open-source'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition"
            >
              View Repository ↗
            </a>
          </div>
        )}
      </div>
    );
  }

  const basePrice = activeTier.basePrice || 0;
  const pricePerSeat = activeTier.pricePerSeat || 0;

  // Exact real calculation based on verified catalog tier data
  const monthlySaasCost = basePrice + seats * pricePerSeat;
  const annualSaasCost = monthlySaasCost * 12;

  const monthlyOpenSourceCost = vpsCost;
  const annualOpenSourceCost = monthlyOpenSourceCost * 12;

  const annualSavings = Math.max(0, annualSaasCost - annualOpenSourceCost);
  const savingsPercent = annualSaasCost > 0 ? Math.round((annualSavings / annualSaasCost) * 100) : 0;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 text-[#0f172a] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#f1f5f9] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#2b00d9]/20 text-xs font-bold text-[#2b00d9] mb-2">
            <span>💸 Verified SaaS Cost Savings Calculator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0f172a]">
            How much will your team save switching from {productName}?
          </h3>
        </div>
        <div className="bg-[#f0fdf4] border border-[#86efac] px-4 py-2 rounded-2xl text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a] block">Verified Annual Savings</span>
          <span className="text-2xl sm:text-3xl font-black text-[#15803d]">${annualSavings.toLocaleString()}/yr</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left column: Controls & Tier Selector */}
        <div className="space-y-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5">
          {pricing.length > 0 && (
            <div>
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider block mb-2">
                Select Official {productName} Tier
              </label>
              <div className="flex flex-wrap gap-2">
                {pricing.map((tier, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTierIndex(idx)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border transition ${
                      selectedTierIndex === idx
                        ? 'bg-[#2b00d9] text-white border-[#2b00d9] shadow-sm'
                        : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#cbd5e1] hover:text-[#0f172a]'
                    }`}
                  >
                    {tier.name} ({tier.freeTier ? 'Free' : `$${tier.pricePerSeat > 0 ? `${tier.pricePerSeat}/seat` : tier.basePrice}`})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                Team Size (Active Seats)
              </label>
              <span className="text-sm font-extrabold text-[#2b00d9] bg-[#eef2ff] px-3 py-0.5 rounded-lg border border-[#c7d2fe]">
                {seats} {seats === 1 ? 'Seat' : 'Seats'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value, 10) || 1)}
              className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#2b00d9]"
            />
            <div className="flex justify-between text-[10px] text-[#64748b] mt-1 font-semibold">
              <span>1 User</span>
              <span>50 Users</span>
              <span>100 Users</span>
              <span>200 Users</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                Self-Hosted VPS Infrastructure Cost
              </label>
              <span className="text-sm font-extrabold text-[#9333ea] bg-[#f3e8ff] px-3 py-0.5 rounded-lg border border-[#e9d5ff]">
                ${vpsCost}/month
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="5"
              value={vpsCost}
              onChange={(e) => setVpsCost(parseInt(e.target.value, 10) || 5)}
              className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#9333ea]"
            />
            <div className="flex justify-between text-[10px] text-[#64748b] mt-1 font-semibold">
              <span>$5/mo (Hetzner / Hostinger)</span>
              <span>$40/mo (Managed Cloud)</span>
              <span>$80/mo (HA Cluster)</span>
            </div>
          </div>
        </div>

        {/* Right column: Exact Comparison Breakdown */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#fef2f2] border border-[#fca5a5] p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#dc2626] block mb-1">
                Official {productName} ({activeTier.name})
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#991b1b]">${annualSaasCost.toLocaleString()}<span className="text-xs text-[#7f1d1d] font-normal">/yr</span></div>
              <span className="text-[11px] text-[#b91c1c] font-semibold block mt-1">
                ${monthlySaasCost}/mo ({pricePerSeat > 0 ? `$${pricePerSeat}/seat` : `$${basePrice} base`})
              </span>
            </div>

            <div className="bg-[#f0fdf4] border border-[#86efac] p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a] block mb-1">
                Self-Hosted Open Source
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#15803d]">${annualOpenSourceCost.toLocaleString()}<span className="text-xs text-[#166534] font-normal">/yr</span></div>
              <span className="text-[11px] text-[#15803d] font-bold block mt-1">
                {savingsPercent > 0 ? `Save ~${savingsPercent}% annually` : 'Flat infrastructure cost'}
              </span>
            </div>
          </div>

          <div className="bg-[#eef2ff] border border-[#c7d2fe] p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-extrabold text-[#2b00d9]">💡 Verified Official Pricing Citation:</span>
              {pricingSource && (
                <a
                  href={pricingSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-extrabold text-[#2b00d9] hover:underline bg-white border border-[#c7d2fe] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>Verify on {pricingSource.title}</span>
                  <span>↗</span>
                </a>
              )}
            </div>
            {annualSaasCost > 0 ? (
              openSourceAlternatives && openSourceAlternatives.length > 0 && openSourceAlternatives[0].name ? (
                <p className="text-xs text-[#334155] leading-relaxed font-medium">
                  Replacing <strong className="text-[#0f172a]">{productName} ({activeTier.name})</strong> for <strong className="text-[#2b00d9]">{seats} users</strong> with{' '}
                  <strong className="text-[#2b00d9]">{openSourceAlternatives[0].name}</strong> on a ${vpsCost}/mo VPS caps annual costs at <strong className="text-[#16a34a]">${annualOpenSourceCost}/yr</strong> versus <strong className="text-[#dc2626]">${annualSaasCost}/yr</strong>.
                </p>
              ) : (
                <p className="text-xs text-[#334155] leading-relaxed font-medium">
                  Self-hosting an open source alternative on a ${vpsCost}/mo VPS caps annual costs at <strong className="text-[#16a34a]">${annualOpenSourceCost}/yr</strong> versus <strong className="text-[#dc2626]">${annualSaasCost}/yr</strong> for <strong className="text-[#0f172a]">{productName} ({activeTier.name})</strong>.
                </p>
              )
            ) : (
              <p className="text-xs text-[#334155] leading-relaxed font-medium">
                You are evaluating the <strong className="text-[#0f172a]">{activeTier.name} (Free)</strong> tier of {productName}. Select a paid plan above to calculate team savings when upgrading.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
