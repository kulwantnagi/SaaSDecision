'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StickyFooterRecommendationProps {
  productName: string;
  productSlug: string;
  primaryDecision: string;
  confidence: number;
  topScoreValue: number;
}

export default function StickyFooterRecommendationBar({
  productName,
  productSlug,
  primaryDecision,
  confidence,
  topScoreValue,
}: StickyFooterRecommendationProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const decisionLabel = primaryDecision.replace('_', ' ');

  // Light theme badge styles based on decision type
  let badgeClass = 'bg-[#eef2ff] text-[#2b00d9] border-[#c7d2fe]';
  if (primaryDecision === 'KEEP') {
    badgeClass = 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]';
  } else if (primaryDecision === 'SWITCH') {
    badgeClass = 'bg-[#eef2ff] text-[#2b00d9] border-[#c7d2fe]';
  } else if (primaryDecision === 'SELF_HOST') {
    badgeClass = 'bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]';
  } else if (primaryDecision === 'AUTOMATE') {
    badgeClass = 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]';
  } else if (primaryDecision === 'BUILD') {
    badgeClass = 'bg-[#fdf2f8] text-[#be185d] border-[#fbcfe8]';
  }

  return (
    <aside
      role="region"
      aria-label={`Recommendation for ${productName}`}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99990] w-[94%] max-w-3xl animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md text-[#0f172a] border border-[#cbd5e1] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-xl shadow-slate-900/12 flex items-center justify-between gap-3 sm:gap-4 relative">
        {/* Left Info: Clear title + verdict + scores */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-[#f1f5f9] text-base shrink-0 border border-[#e2e8f0]">
            🎯
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] truncate">
                {productName} Verdict:
              </span>
              <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-lg border ${badgeClass} shrink-0`}>
                {decisionLabel}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#64748b] font-medium mt-0.5 truncate">
              Decision Score: <strong className="text-[#0f172a] font-extrabold">{topScoreValue}/100</strong> ({confidence}% Confidence)
            </p>
          </div>
        </div>

        {/* Right Actions: See Why + Customize + View Analysis + Close */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#decision-framework"
            className="flex items-center gap-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#2b00d9] border border-[#c7d2fe] font-bold text-xs py-2 px-3 sm:px-3.5 rounded-xl transition shadow-2xs active:scale-95 whitespace-nowrap"
          >
            <span>💡</span>
            <span>See Why</span>
          </a>

          <Link
            href={`/software/${productSlug}/personalize`}
            className="flex items-center gap-1.5 bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#334155] border border-[#cbd5e1] font-bold text-xs py-2 px-3 sm:px-3.5 rounded-xl transition shadow-2xs active:scale-95 whitespace-nowrap"
          >
            <span>⚙</span>
            <span>Customize</span>
          </Link>

          <a
            href="#scores"
            className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-extrabold text-xs py-2 px-3 sm:px-4 rounded-xl transition shadow-xs active:scale-95 whitespace-nowrap flex items-center gap-1"
          >
            <span>View Analysis</span>
            <span>↓</span>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="text-[#94a3b8] hover:text-[#0f172a] text-xs w-6 h-6 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center transition shrink-0 ml-0.5"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
