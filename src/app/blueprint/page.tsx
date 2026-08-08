'use client';

import { useState } from 'react';
import { StandardAIProvider, ReplacementBlueprint } from '@/domain/ai';
import { ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';

export default function BlueprintPage() {
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(ALL_SOFTWARE_PRODUCTS[0].slug);
  const [requirements, setRequirements] = useState<string>('Need custom booking page with calendar sync and stripe payment integration.');
  const [blueprint, setBlueprint] = useState<ReplacementBlueprint | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const prod = ALL_SOFTWARE_PRODUCTS.find((p) => p.slug === selectedProductSlug);
    const provider = new StandardAIProvider();

    const result = await provider.generateBlueprint(prod ? prod.name : 'Target SaaS', requirements);
    setBlueprint(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6 text-center space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
          AI Replacement Blueprint Engine
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          Generate SaaS Replacement Blueprint
        </h1>
        <p className="text-sm font-medium text-[#475569] max-w-2xl mx-auto">
          Get a Zod-validated software architecture specification, dev labor estimates, recommended tech stack, and Codex build prompts.
        </p>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="bg-white border border-[#e2e8f0] p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">Target Software to Replace *</label>
          <select
            value={selectedProductSlug}
            onChange={(e) => setSelectedProductSlug(e.target.value)}
            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
          >
            {ALL_SOFTWARE_PRODUCTS.map((p: any) => (
              <option key={p.slug} value={p.slug}>
                {p.name} ({p.categoryName})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">Your Specific Requirements & Used Features *</label>
          <textarea
            rows={3}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold py-4 rounded-2xl text-sm transition shadow-md shadow-[#2b00d9]/25"
        >
          {loading ? 'Generating Structured Specification...' : 'Generate Replacement Blueprint Specification'}
        </button>
      </form>

      {/* Generated Blueprint View */}
      {blueprint && (
        <div className="bg-white border border-[#2b00d9]/30 rounded-3xl p-8 space-y-6 shadow-lg shadow-[#2b00d9]/5">
          <div className="flex justify-between items-start border-b border-[#f1f5f9] pb-4">
            <div>
              <span className="text-[10px] text-[#2b00d9] font-bold uppercase tracking-wider bg-[#eef2ff] px-2.5 py-0.5 rounded-full">
                Zod Verified Specification
              </span>
              <h2 className="text-2xl font-extrabold text-[#0f172a] mt-1">
                Replacement Spec for {blueprint.softwareName}
              </h2>
            </div>
            <span className="text-xs bg-[#dcfce7] text-[#15803d] font-bold px-3 py-1 rounded-full">
              Ready for Codex Execution
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#64748b] font-bold uppercase">Estimated Dev Labor</span>
              <p className="text-2xl font-extrabold text-[#0f172a]">{blueprint.estimatedDevHours} hours</p>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#64748b] font-bold uppercase">Initial Dev Budget</span>
              <p className="text-2xl font-extrabold text-[#16a34a]">${blueprint.estimatedInitialCost}</p>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#64748b] font-bold uppercase">Monthly Hosting</span>
              <p className="text-2xl font-extrabold text-[#2b00d9]">${blueprint.estimatedMonthlyHosting}/mo</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#0f172a] text-sm">Recommended Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {blueprint.suggestedStack.map((tech, idx) => (
                <span key={idx} className="text-xs bg-[#eef2ff] text-[#2b00d9] font-bold px-3 py-1.5 rounded-xl border border-[#2b00d9]/20">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#0f172a] text-sm">Codex Build Implementation Prompt</h3>
            <pre className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl text-xs text-[#e2e8f0] font-mono whitespace-pre-wrap leading-relaxed">
              {blueprint.codexPrompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
