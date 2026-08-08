'use client';

import { useState } from 'react';
import { evaluatePersonalizedSoftware } from '@/domain/decision-engine/personalize';
import { SoftwareAssessmentInput } from '@/domain/decision-engine/types';

export default function PersonalizeForm({
  assessment,
  softwareName,
}: {
  assessment: SoftwareAssessmentInput;
  softwareName: string;
}) {
  const [usedFeaturesCount, setUsedFeaturesCount] = useState<number>(4);
  const [totalFeaturesCount] = useState<number>(16);
  const [hasDevTeam, setHasDevTeam] = useState<boolean>(true);
  const [requiresSSO, setRequiresSSO] = useState<boolean>(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);

  const personalizedResult = evaluatePersonalizedSoftware(assessment, {
    featuresUsedRatio: usedFeaturesCount / totalFeaturesCount,
    hasDeveloperTeam: hasDevTeam,
    requiresSSO: requiresSSO,
  });

  const handleSaveAssessment = () => {
    const randomToken = Math.random().toString(36).substring(2, 12);
    setSavedToken(randomToken);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-8 max-w-3xl mx-auto shadow-sm">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-[#0f172a]">Personalized Assessment for {softwareName}</h2>
        <p className="text-xs font-medium text-[#64748b]">
          Answer 3 questions to calculate your team's specific BUILD, KEEP, and SWITCH scores.
        </p>
      </div>

      <div className="space-y-6 bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">
        {/* Question 1: Feature Usage */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a]">
            How many features of {softwareName} do you actually use regularly?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max={totalFeaturesCount}
              value={usedFeaturesCount}
              onChange={(e) => setUsedFeaturesCount(Number(e.target.value))}
              className="w-full h-2 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#2b00d9]"
            />
            <span className="text-xs font-extrabold text-[#2b00d9] min-w-[90px]">
              {usedFeaturesCount} of {totalFeaturesCount} features
            </span>
          </div>
        </div>

        {/* Question 2: Dev Capacity */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a]">
            Do you have in-house software developers available?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setHasDevTeam(true)}
              className={`px-4 py-2.5 text-xs rounded-xl border font-bold transition ${
                hasDevTeam ? 'bg-[#2b00d9] border-[#2b00d9] text-white' : 'bg-white border-[#e2e8f0] text-[#64748b]'
              }`}
            >
              Yes, Dev Team Available
            </button>
            <button
              type="button"
              onClick={() => setHasDevTeam(false)}
              className={`px-4 py-2.5 text-xs rounded-xl border font-bold transition ${
                !hasDevTeam ? 'bg-[#2b00d9] border-[#2b00d9] text-white' : 'bg-white border-[#e2e8f0] text-[#64748b]'
              }`}
            >
              No Dev Capacity
            </button>
          </div>
        </div>

        {/* Question 3: SSO */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a]">
            Does your company require Enterprise SSO / SOC2 compliance?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRequiresSSO(true)}
              className={`px-4 py-2.5 text-xs rounded-xl border font-bold transition ${
                requiresSSO ? 'bg-[#2b00d9] border-[#2b00d9] text-white' : 'bg-white border-[#e2e8f0] text-[#64748b]'
              }`}
            >
              Yes, Required
            </button>
            <button
              type="button"
              onClick={() => setRequiresSSO(false)}
              className={`px-4 py-2.5 text-xs rounded-xl border font-bold transition ${
                !requiresSSO ? 'bg-[#2b00d9] border-[#2b00d9] text-white' : 'bg-white border-[#e2e8f0] text-[#64748b]'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Results Preview */}
      <div className="bg-white border border-[#2b00d9]/30 p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2b00d9]">Personalized Recommendation</span>
          <span className="text-xl font-extrabold text-[#0f172a]">{personalizedResult.primaryDecision}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-5 text-center text-xs">
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#64748b] block font-bold">KEEP</span>
            <span className="text-[#16a34a] font-extrabold text-base">{personalizedResult.keepScore}</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#64748b] block font-bold">SWITCH</span>
            <span className="text-[#2b00d9] font-extrabold text-base">{personalizedResult.switchScore}</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#64748b] block font-bold">SELF-HOST</span>
            <span className="text-[#9333ea] font-extrabold text-base">{personalizedResult.selfHostScore}</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#64748b] block font-bold">AUTOMATE</span>
            <span className="text-[#d97706] font-extrabold text-base">{personalizedResult.automateScore}</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#64748b] block font-bold">BUILD</span>
            <span className="text-[#dc2626] font-extrabold text-base">{personalizedResult.buildScore}</span>
          </div>
        </div>

        {personalizedResult.reasons.length > 0 && (
          <div className="text-xs text-[#475569] font-semibold space-y-1 pt-2">
            {personalizedResult.reasons.map((r, i) => (
              <p key={i} className="text-[#16a34a]">• {r}</p>
            ))}
          </div>
        )}

        {/* Save Token CTA */}
        <div className="pt-4 flex justify-between items-center border-t border-[#f1f5f9]">
          {savedToken ? (
            <div className="text-xs text-[#16a34a] font-bold bg-[#dcfce7] px-4 py-2.5 rounded-xl border border-[#bbf7d0]">
              Saved Token: {savedToken}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSaveAssessment}
              className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md shadow-[#2b00d9]/25"
            >
              Save Report Without Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
