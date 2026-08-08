'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateStackAudit, AuditItemInput } from '@/domain/audit';
import { ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';
import ViralShareCard from '@/components/audit/ViralShareCard';

export default function AuditForm() {
  const [items, setItems] = useState<AuditItemInput[]>([
    {
      softwareName: 'Calendly',
      categoryName: 'Scheduling & Meetings',
      monthlyCost: 24,
      seatsCount: 2,
      usageLevel: 'LOW',
      recommendedDecision: 'SWITCH',
      potentialMonthlySavings: 14,
    },
    {
      softwareName: 'Zapier',
      categoryName: 'Workflow Automation',
      monthlyCost: 60,
      seatsCount: 1,
      usageLevel: 'MEDIUM',
      recommendedDecision: 'AUTOMATE',
      potentialMonthlySavings: 30,
    },
  ]);

  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(ALL_SOFTWARE_PRODUCTS[0].slug);
  const [costInput, setCostInput] = useState<number>(20);
  const [savedToken, setSavedToken] = useState<string | null>(null);

  const auditResult = calculateStackAudit(items);

  const handleAddItem = () => {
    const prod = ALL_SOFTWARE_PRODUCTS.find((p: any) => p.slug === selectedProductSlug);
    if (!prod) return;

    const newItem: AuditItemInput = {
      softwareName: prod.name,
      categoryName: prod.categoryName,
      monthlyCost: Number(costInput),
      seatsCount: 1,
      usageLevel: 'MEDIUM',
      recommendedDecision: 'SWITCH',
      potentialMonthlySavings: Math.max(0, Math.round(Number(costInput) * 0.4)),
    };

    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveAudit = () => {
    const token = 'audit_' + Math.random().toString(36).substring(2, 12);
    setSavedToken(token);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
          Full SaaS Stack Optimization
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">SaaS Stack Audit</h1>
        <p className="text-sm font-medium text-[#475569]">
          Input your current software subscriptions to calculate total annual spend, identify redundant tool overlaps, and receive a 5-way decision breakdown.
        </p>
      </div>

      {/* Add Product Form */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-[#0f172a]">Add Software to Your Stack</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedProductSlug}
            onChange={(e) => setSelectedProductSlug(e.target.value)}
            className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
          >
            {ALL_SOFTWARE_PRODUCTS.map((p: any) => (
              <option key={p.slug} value={p.slug}>
                {p.name} ({p.categoryName})
              </option>
            ))}
          </select>

          <input
            type="number"
            value={costInput}
            onChange={(e) => setCostInput(Number(e.target.value))}
            placeholder="Monthly Cost ($)"
            className="w-full md:w-44 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
          />

          <button
            type="button"
            onClick={handleAddItem}
            className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-md shadow-[#2b00d9]/25"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Audit Analytics Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 text-center">
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-[#64748b] uppercase font-bold">Total Annual Spend</span>
          <p className="text-3xl font-extrabold text-[#0f172a]">${auditResult.totalAnnualSpend.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-[#64748b] uppercase font-bold">Optimized Annual Spend</span>
          <p className="text-3xl font-extrabold text-[#16a34a]">
            ${(auditResult.totalAnnualSpend - auditResult.potentialAnnualSavings).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-[#64748b] uppercase font-bold">Potential Annual Savings</span>
          <p className="text-3xl font-extrabold text-[#2b00d9]">${auditResult.potentialAnnualSavings.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-[#64748b] uppercase font-bold">Stack Efficiency</span>
          <p className="text-3xl font-extrabold text-[#9333ea]">{auditResult.stackEfficiencyScore}/100</p>
        </div>
      </div>

      {/* Viral Share Card */}
      <ViralShareCard
        totalAnnualSpend={auditResult.totalAnnualSpend}
        potentialAnnualSavings={auditResult.potentialAnnualSavings}
        stackEfficiencyScore={auditResult.stackEfficiencyScore}
      />

      {/* Current Stack List */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-[#0f172a]">Your SaaS Stack ({items.length} Items)</h3>
        {items.length === 0 ? (
          <p className="text-sm font-medium text-[#64748b]">No items in stack. Add software above.</p>
        ) : (
          <div className="divide-y divide-[#f1f5f9]">
            {items.map((item, idx) => (
              <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[#0f172a] text-base">{item.softwareName}</h4>
                  <span className="text-xs text-[#64748b] font-medium">{item.categoryName}</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#0f172a] block">${item.monthlyCost}/mo</span>
                    <span className="text-xs text-[#16a34a] font-bold block">
                      Rec: {item.recommendedDecision}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-xs text-[#dc2626] font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#e2e8f0] p-8 rounded-3xl space-y-3 shadow-sm">
          <h4 className="font-bold text-[#0f172a] text-lg">Top Optimization Priorities</h4>
          <ul className="text-xs text-[#475569] font-semibold space-y-2">
            {auditResult.topRecommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-[#16a34a] font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#e2e8f0] p-8 rounded-3xl space-y-3 shadow-sm">
          <h4 className="font-bold text-[#0f172a] text-lg">Easiest Savings Opportunity</h4>
          <p className="text-xs text-[#16a34a] font-bold">{auditResult.easiestSavingsOpportunity}</p>
          <div className="pt-4">
            <Link
              href="/lead"
              className="inline-block bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md shadow-[#2b00d9]/25"
            >
              Request Custom Implementation / Build Lead ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Save & Email Report Bar */}
      <div className="bg-white border border-[#e2e8f0] p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="font-bold text-[#0f172a]">Save or Share This Audit</h4>
          <p className="text-xs font-medium text-[#64748b]">Generate a secure shareable link without creating an account.</p>
        </div>

        {savedToken ? (
          <div className="text-xs text-[#16a34a] font-bold bg-[#dcfce7] px-4 py-2.5 rounded-xl border border-[#bbf7d0]">
            Share Token: {savedToken}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSaveAudit}
            className="bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#0f172a] font-bold text-xs px-5 py-3 rounded-xl border border-[#e2e8f0] transition"
          >
            Generate Anonymous Share Link
          </button>
        )}
      </div>
    </div>
  );
}
