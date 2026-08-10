import Link from 'next/link';
import { INITIAL_25_PRODUCTS } from '@/domain/seed-data';

export const metadata = {
  title: 'Compare SaaS Applications & Head-to-Head Decision Matrix | SaaS Decision Engine',
  description: 'Evaluate side-by-side head-to-head decision scores (KEEP, SWITCH, SELF-HOST, AUTOMATE, BUILD) for leading SaaS software applications.',
};

export default function CompareHubPage() {
  const popularPairs = [
    { slugA: 'clickup', slugB: 'linear', nameA: 'ClickUp', nameB: 'Linear' },
    { slugA: 'jira', slugB: 'linear', nameA: 'Jira', nameB: 'Linear' },
    { slugA: 'notion', slugB: 'coda', nameA: 'Notion', nameB: 'Coda' },
    { slugA: 'salesforce-sales-cloud', slugB: 'hubspot-crm', nameA: 'Salesforce', nameB: 'HubSpot CRM' },
    { slugA: 'zendesk', slugB: 'intercom', nameA: 'Zendesk', nameB: 'Intercom' },
    { slugA: 'airtable', slugB: 'nocodb', nameA: 'Airtable', nameB: 'NocoDB' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-[#f0ebff] text-[#2b00d9] border border-[#d2c2ff] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
          Head-to-Head Decision Hub
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          Compare Any 2 Software Tools Side-by-Side
        </h1>
        <p className="text-base text-[#64748b] leading-relaxed">
          Deterministic side-by-side scoring across 19 technical & economic attributes. Find out whether to Keep, Switch, Self-Host, Automate, or Build.
        </p>
      </div>

      {/* Popular Pairings Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#0f172a]">Popular Head-to-Head Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {popularPairs.map((pair) => (
            <Link
              key={`${pair.slugA}-vs-${pair.slugB}`}
              href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
              className="group bg-white border border-[#e2e8f0] hover:border-[#2b00d9] p-6 rounded-3xl space-y-3 transition shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748b]">VS Pair</span>
                <span className="text-xs text-[#2b00d9] font-bold group-hover:translate-x-1 transition-transform inline-block">
                  Compare ↗
                </span>
              </div>
              <h3 className="text-lg font-black text-[#0f172a]">
                {pair.nameA} <span className="text-[#94a3b8] font-normal">vs</span> {pair.nameB}
              </h3>
              <p className="text-xs text-[#64748b]">
                Deterministic assessment breakdown, TCO comparison & migration friction analysis.
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Catalog Matrix Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-[#0f172a]">All Tracked Catalog Tools</h2>
        <p className="text-xs text-[#64748b]">
          Select any tool to view its full software intelligence report or pair it against competitors.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {INITIAL_25_PRODUCTS.map((prod) => (
            <Link
              key={prod.slug}
              href={`/software/${prod.slug}`}
              className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#2b00d9] hover:bg-white flex items-center justify-between transition text-xs font-bold text-[#0f172a]"
            >
              <span>{prod.name}</span>
              <span className="text-[10px] text-[#64748b] bg-[#e2e8f0] px-2 py-0.5 rounded-md font-semibold">
                {prod.categoryName}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
