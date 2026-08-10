'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import FeatureParityMatrix from './FeatureParityMatrix';
import SmartAlternativeFilterWizard, { FilterConstraint } from './SmartAlternativeFilterWizard';

interface InteractiveAlternativesSuiteProps {
  productName: string;
  productSlug: string;
  pricing?: {
    name: string;
    billingInterval: string;
    basePrice: number;
    pricePerSeat: number;
    freeTier: boolean;
  }[];
  sources?: {
    type: 'OFFICIAL_WEBSITE' | 'OFFICIAL_PRICING' | 'GITHUB' | 'REPUTABLE_SECONDARY';
    title: string;
    url: string;
  }[];
  openSourceAlternatives?: {
    name: string;
    githubUrl: string;
    description: string;
    stars: string;
  }[];
  commercialAlternatives?: {
    name: string;
    slug: string;
    startingPrice: string;
    freeTier: boolean;
    featureParity: string;
    keyAdvantage: string;
  }[];
}

export default function InteractiveAlternativesSuite({
  productName,
  productSlug,
  pricing = [],
  sources = [],
  openSourceAlternatives = [],
  commercialAlternatives = [],
}: InteractiveAlternativesSuiteProps) {
  const [activeFilter, setActiveFilter] = useState<FilterConstraint>('all');

  const openSourceCount = openSourceAlternatives.length;
  const freeCount = commercialAlternatives.filter((c) => c.freeTier).length;

  // Filter alternatives based on selected wizard constraint
  const filteredCommercial = useMemo(() => {
    return commercialAlternatives.filter((alt) => {
      if (activeFilter === 'free') return alt.freeTier || alt.startingPrice.toLowerCase().includes('free');
      if (activeFilter === 'open-source') return false; // Handled in open-source section
      if (activeFilter === 'self-host') return alt.keyAdvantage?.toLowerCase().includes('host') || alt.keyAdvantage?.toLowerCase().includes('private');
      if (activeFilter === 'no-code') return true;
      return true;
    });
  }, [commercialAlternatives, activeFilter]);

  const primaryAltName = openSourceAlternatives[0]?.name || commercialAlternatives[0]?.name || 'Verified Alternative';

  return (
    <div className="space-y-10">
      {/* Smart Alternative Finder Wizard */}
      <div id="alternatives" className="space-y-6">
        <SmartAlternativeFilterWizard
          activeFilter={activeFilter}
          onFilterChange={(f) => setActiveFilter(f)}
          counts={{
            total: openSourceAlternatives.length + commercialAlternatives.length,
            free: freeCount,
            openSource: openSourceCount,
            selfHost: openSourceCount,
          }}
        />

        {/* Alternatives Cards Display */}
        {activeFilter !== 'open-source' && filteredCommercial.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommercial.map((alt, index) => (
              <div
                key={index}
                className="bg-white border border-[#e2e8f0] hover:border-[#2b00d9]/40 hover:shadow-lg transition-all rounded-3xl p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-[#0f172a]">{alt.name}</h3>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        alt.freeTier
                          ? 'bg-[#dcfce7] text-[#15803d] border border-[#86efac]'
                          : 'bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]'
                      }`}
                    >
                      {alt.startingPrice}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] block">
                        Feature Parity
                      </span>
                      <p className="text-xs text-[#334155] font-semibold">{alt.featureParity}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] block">
                        Key Advantage
                      </span>
                      <p className="text-xs text-[#16a34a] font-bold">{alt.keyAdvantage}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/software/${alt.slug}`}
                    className="text-xs font-bold text-[#2b00d9] hover:underline flex items-center gap-1 shrink-0"
                  >
                    View Evaluation <span className="text-[10px]">↗</span>
                  </Link>
                  <Link
                    href={`/compare/${alt.slug}-vs-${productSlug}`}
                    className="text-[11px] font-semibold text-[#64748b] hover:text-[#2b00d9] transition-colors leading-tight text-right hover:underline"
                  >
                    Compare vs {productName}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Feature Parity & Trade-off Matrix */}
      <FeatureParityMatrix
        productName={productName}
        alternativeName={primaryAltName}
        alternativeType={openSourceAlternatives.length > 0 ? 'OPEN_SOURCE' : 'COMMERCIAL'}
        migrationDifficulty={productName.toLowerCase().includes('notion') || productName.toLowerCase().includes('salesforce') ? 'COMPLEX' : 'EASY'}
      />
    </div>
  );
}
