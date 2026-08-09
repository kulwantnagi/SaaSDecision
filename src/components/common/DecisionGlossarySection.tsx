'use client';

import { useState } from 'react';

export const DECISION_DEFINITIONS = [
  {
    key: 'KEEP',
    step: '01',
    title: 'KEEP',
    subtitle: 'Retain SaaS Subscription',
    icon: '🛡️',
    accentColor: '#16a34a',
    borderColor: 'border-[#16a34a]',
    bgLight: 'bg-[#f0fdf4]',
    badgeBg: 'bg-[#16a34a] text-white',
    ringColor: 'ring-[#16a34a]/30',
    dotBg: 'bg-[#16a34a]',
    summary: 'Retain your current commercial SaaS subscription without changing workflows.',
    details: 'Recommended when software compliance, deep third-party integrations, proprietary data moats, or heavy team reliance outweigh potential cost savings. Switching or building custom alternatives would introduce unnecessary operational risk.',
    idealWhen: ['High integration complexity', 'Critical team reliance', 'Strict compliance requirements'],
    typicalSavings: '$0 / mo (Operational Stability)',
  },
  {
    key: 'SWITCH',
    step: '02',
    title: 'SWITCH',
    subtitle: 'Migrate to Commercial Competitor',
    icon: '⚡',
    accentColor: '#2b00d9',
    borderColor: 'border-[#2b00d9]',
    bgLight: 'bg-[#eef2ff]',
    badgeBg: 'bg-[#2b00d9] text-white',
    ringColor: 'ring-[#2b00d9]/30',
    dotBg: 'bg-[#2b00d9]',
    summary: 'Migrate to a direct commercial competitor offering better pricing or features.',
    details: 'Recommended when competing products offer identical feature parity at a lower cost per seat, superior API access, or cleaner user experience. Data migration is straightforward via standard CSV or API exports.',
    idealWhen: ['Lower cost per seat available', 'Better UX / API features', 'Easy CSV/API migration'],
    typicalSavings: '30% - 60% Per Seat',
  },
  {
    key: 'SELF_HOST',
    step: '03',
    title: 'SELF-HOST',
    subtitle: 'Deploy Open-Source Alternative',
    icon: '🚀',
    accentColor: '#9333ea',
    borderColor: 'border-[#9333ea]',
    bgLight: 'bg-[#f3e8ff]',
    badgeBg: 'bg-[#9333ea] text-white',
    ringColor: 'ring-[#9333ea]/30',
    dotBg: 'bg-[#9333ea]',
    summary: 'Replace per-seat licensing by self-hosting an open-source alternative on cloud servers.',
    details: 'Recommended when mature open-source repositories exist (e.g. Cal.com for Calendly, n8n for Zapier). Eliminates recurring per-user fees, giving your team 100% data privacy and database control for minimal hosting costs ($5 - $25/mo).',
    idealWhen: ['Mature OSS replacement exists', 'High seat count licensing cost', '100% data privacy required'],
    typicalSavings: '70% - 90% Recurring Cost',
  },
  {
    key: 'AUTOMATE',
    step: '04',
    title: 'AUTOMATE',
    subtitle: 'No-Code / Scripted Workflows',
    icon: '🔄',
    accentColor: '#d97706',
    borderColor: 'border-[#d97706]',
    bgLight: 'bg-[#fffbeb]',
    badgeBg: 'bg-[#d97706] text-white',
    ringColor: 'ring-[#d97706]/30',
    dotBg: 'bg-[#d97706]',
    summary: 'Bypass expensive full-stack SaaS by automating key routines via webhooks & scripts.',
    details: 'Recommended when your team only uses a tiny subset of features (under 25%). Webhook triggers, Make/n8n workflows, or lightweight cloud functions replace full software subscriptions.',
    idealWhen: ['Using < 25% of features', 'Simple recurring routines', 'High subscription tier bloat'],
    typicalSavings: '80% - 95% Cut in Fees',
  },
  {
    key: 'BUILD',
    step: '05',
    title: 'BUILD',
    subtitle: 'Custom In-House Micro-SaaS App',
    icon: '🛠️',
    accentColor: '#dc2626',
    borderColor: 'border-[#dc2626]',
    bgLight: 'bg-[#fef2f2]',
    badgeBg: 'bg-[#dc2626] text-white',
    ringColor: 'ring-[#dc2626]/30',
    dotBg: 'bg-[#dc2626]',
    summary: 'Build a custom lightweight in-house application using Next.js & AI coding assistants.',
    details: 'Recommended when off-the-shelf software is overpriced and the build complexity is low (1-2 out of 5). Modern AI coding agents (Claude Code, Cursor, Windsurf) allow engineering teams to build custom replacements in under 40 dev hours.',
    idealWhen: ['Low build complexity (1-2/5)', 'AI code generators available', 'Niche internal workflows'],
    typicalSavings: '100% License Elimination',
  },
];

export default function DecisionGlossarySection() {
  const [activeTab, setActiveTab] = useState<string>('KEEP');

  const selectedDef = DECISION_DEFINITIONS.find((d) => d.key === activeTab) || DECISION_DEFINITIONS[0];

  return (
    <section id="decision-framework" className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="border-b border-[#f1f5f9] pb-5 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#2b00d9] bg-[#eef2ff] px-3 py-1 rounded-full border border-[#2b00d9]/20 shadow-xs">
            Evaluation Methodology
          </span>
          <span className="text-xs text-[#64748b] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            Pure 0 - 100 Deterministic Engine
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
          Understanding the 5 SaaS Decision Paths
        </h2>
        <p className="text-sm font-medium text-[#475569] max-w-3xl leading-relaxed">
          Every software product evaluated on Keep.Switch.Build receives five deterministic decision scores (0 to 100). 
          Follow the workflow matrix below to explore how each outcome is calculated:
        </p>
      </div>

      {/* Stepper Header Buttons */}
      <div className="relative">
        {/* Connecting timeline line */}
        <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-1 bg-[#e2e8f0] -translate-y-1/2 z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10">
          {DECISION_DEFINITIONS.map((def) => {
            const isActive = activeTab === def.key;
            return (
              <button
                key={def.key}
                onClick={() => setActiveTab(def.key)}
                className={`relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? `bg-white ${def.borderColor} shadow-md ring-4 ${def.ringColor} scale-[1.02]`
                    : 'bg-[#f8fafc] border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#94a3b8] uppercase">
                    STEP {def.step}
                  </span>
                  <span className="text-base">{def.icon}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${def.dotBg}`} />
                  <span className={`font-extrabold text-sm ${isActive ? 'text-[#0f172a]' : 'text-[#334155]'}`}>
                    {def.title}
                  </span>
                </div>
                
                <span className="text-[11px] font-medium text-[#64748b] mt-1 line-clamp-1">
                  {def.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Detail Card */}
      <div className={`p-6 sm:p-8 rounded-3xl ${selectedDef.bgLight} border-2 ${selectedDef.borderColor} space-y-6 transition-all duration-300 shadow-sm`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-black/5">
              {selectedDef.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#64748b]">Path {selectedDef.step}</span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${selectedDef.badgeBg}`}>
                  {selectedDef.key.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] mt-0.5">
                {selectedDef.title} — {selectedDef.subtitle}
              </h3>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs px-4 py-2 rounded-xl border border-black/5 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase text-[#64748b] block">Potential Savings</span>
            <span className="text-sm font-extrabold text-[#0f172a]">{selectedDef.typicalSavings}</span>
          </div>
        </div>

        {/* Summary & Description */}
        <div className="space-y-3">
          <p className="text-base font-extrabold text-[#0f172a] leading-snug">
            "{selectedDef.summary}"
          </p>
          <p className="text-sm text-[#334155] font-medium leading-relaxed">
            {selectedDef.details}
          </p>
        </div>

        {/* Indicators / Ideal When */}
        <div className="pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#475569] block mb-2">
            Key Decision Triggers & Criteria:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {selectedDef.idealWhen.map((item, idx) => (
              <div key={idx} className="bg-white/90 px-3.5 py-2.5 rounded-xl border border-black/5 flex items-center gap-2 text-xs font-semibold text-[#0f172a] shadow-xs">
                <span className="text-[#16a34a] font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Recommended Hosting Providers (Shown for SELF-HOST) */}
        {selectedDef.key === 'SELF_HOST' && (
          <div className="pt-2 space-y-2 border-t border-black/5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9333ea] block">
              Recommended VPS Hosting Providers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="https://hostinger.in/vps-hosting"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#9333ea] hover:bg-[#7e22ce] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
              >
                <span>🚀 Hostinger VPS</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">★ Best Value</span>
              </a>
              <a
                href="https://www.hetzner.com/cloud"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-[#e2e8f0] text-[#0f172a] font-extrabold text-xs rounded-xl shadow-xs transition-colors"
              >
                <span>⚡ Hetzner Cloud</span>
              </a>
              <a
                href="https://www.digitalocean.com"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-[#e2e8f0] text-[#0f172a] font-extrabold text-xs rounded-xl shadow-xs transition-colors"
              >
                <span>🌊 DigitalOcean Droplets</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Grid view fallback summary list for fast scanning */}
      <div className="pt-2">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748b] mb-4">
          All 5 Decision Paths at a glance
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {DECISION_DEFINITIONS.map((def) => (
            <button
              key={def.key}
              onClick={() => setActiveTab(def.key)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeTab === def.key
                  ? `${def.bgLight} ${def.borderColor} font-bold shadow-xs`
                  : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{def.icon}</span>
                <span className="text-xs font-extrabold text-[#0f172a]">{def.title}</span>
              </div>
              <p className="text-[11px] text-[#64748b] line-clamp-2 leading-tight">
                {def.summary}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

