'use client';

export const DECISION_DEFINITIONS = [
  {
    key: 'KEEP',
    title: '1. KEEP (Retain SaaS Subscription)',
    color: 'border-l-4 border-l-[#16a34a] bg-[#f0fdf4]',
    badgeBg: 'bg-[#16a34a] text-white',
    summary: 'Retain your current commercial SaaS subscription without changing workflows.',
    details: 'Recommended when software compliance, deep third-party integrations, proprietary data moats, or heavy team reliance outweigh potential cost savings. Switching or building custom alternatives would introduce unnecessary operational risk.',
  },
  {
    key: 'SWITCH',
    title: '2. SWITCH (Migrate to Commercial Competitor)',
    color: 'border-l-4 border-l-[#2b00d9] bg-[#eef2ff]',
    badgeBg: 'bg-[#2b00d9] text-white',
    summary: 'Migrate to a direct commercial competitor offering better pricing or features.',
    details: 'Recommended when competing products offer identical feature parity at a lower cost per seat, superior API access, or cleaner user experience. Data migration is straightforward via standard CSV or API exports.',
  },
  {
    key: 'SELF_HOST',
    title: '3. SELF-HOST (Deploy Open-Source Alternative)',
    color: 'border-l-4 border-l-[#9333ea] bg-[#f3e8ff]',
    badgeBg: 'bg-[#9333ea] text-white',
    summary: 'Replace per-seat licensing by self-hosting an open-source alternative on cloud servers.',
    details: 'Recommended when mature open-source repositories exist (e.g. Cal.com for Calendly, n8n for Zapier). Eliminates recurring per-user fees, giving your team 100% data privacy and database control for minimal hosting costs ($5 - $25/mo).',
  },
  {
    key: 'AUTOMATE',
    title: '4. AUTOMATE (Replace with No-Code / Scripted Workflows)',
    color: 'border-l-4 border-l-[#d97706] bg-[#fffbeb]',
    badgeBg: 'bg-[#d97706] text-white',
    summary: 'Bypass expensive full-stack SaaS by automating key routines via webhooks & scripts.',
    details: 'Recommended when your team only uses a tiny subset of features (under 25%). Webhook triggers, Make/n8n workflows, or lightweight cloud functions replace full software subscriptions.',
  },
  {
    key: 'BUILD',
    title: '5. BUILD (Custom In-House Micro-SaaS App)',
    color: 'border-l-4 border-l-[#dc2626] bg-[#fef2f2]',
    badgeBg: 'bg-[#dc2626] text-white',
    summary: 'Build a custom lightweight in-house application using Next.js & AI coding assistants.',
    details: 'Recommended when off-the-shelf software is overpriced and the build complexity is low (1-2 out of 5). Modern AI coding agents (Claude Code, Cursor, Windsurf) allow engineering teams to build custom replacements in under 40 dev hours.',
  },
];

export default function DecisionGlossarySection() {
  return (
    <section id="decision-framework" className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
      <div className="border-b border-[#f1f5f9] pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Evaluation Methodology
          </span>
          <span className="text-xs text-[#64748b] font-semibold">Pure 0 - 100 Deterministic Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
          Understanding the 5 SaaS Decision Paths
        </h2>
        <p className="text-xs font-medium text-[#475569]">
          Every software product on Keep.Switch.Build receives five deterministic decision scores (0 to 100). Here is how each recommendation is defined:
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {DECISION_DEFINITIONS.map((def) => (
          <div key={def.key} className={`p-5 rounded-2xl ${def.color} space-y-2`}>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#0f172a]">{def.title}</h3>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${def.badgeBg}`}>
                {def.key.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs font-bold text-[#0f172a]">{def.summary}</p>
            <p className="text-xs text-[#475569] font-medium leading-relaxed">{def.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
