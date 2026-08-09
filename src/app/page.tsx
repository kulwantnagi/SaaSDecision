import Link from 'next/link';
import { ALL_SOFTWARE_PRODUCTS, searchCatalog } from '@/domain/catalog-service';
import { evaluateSoftware } from '@/domain/decision-engine';
import DecisionGlossarySection from '@/components/common/DecisionGlossarySection';
import RealtimeSearchBox from '@/components/common/RealtimeSearchBox';

const CATEGORY_OPTIONS = [
  { label: 'All Software', value: '' },
  { label: 'AI & LLMs', value: 'ai-llm' },
  { label: 'Developer Tools', value: 'developer-tools' },
  { label: 'Design & Media', value: 'design-media' },
  { label: 'Project Management', value: 'project-management' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Forms & Surveys', value: 'forms' },
  { label: 'Automation', value: 'automation' },
  { label: 'CRM & Sales', value: 'crm-sales' },
  { label: 'Marketing & Email', value: 'marketing-email' },
  { label: 'Finance & Accounting', value: 'finance-accounting' },
  { label: 'Productivity & Notes', value: 'productivity-notes' },
  { label: 'Security & Auth', value: 'security-auth' },
  { label: 'Storage & Backup', value: 'storage-backup' },
  { label: 'Audio & Voice', value: 'audio-voice' },
  { label: 'SEO & Content', value: 'seo-content' },
  { label: 'Scheduling', value: 'scheduling' },
  { label: 'E-Commerce', value: 'ecommerce-billing' },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { q = '', category = '', page = '1' } = await searchParams;

  // Shuffle software on every page reload/request
  const shuffledSoftware = [...ALL_SOFTWARE_PRODUCTS].sort(() => Math.random() - 0.5);

  let filtered = shuffledSoftware;

  if (q) {
    filtered = searchCatalog(q, ALL_SOFTWARE_PRODUCTS.length);
  }

  if (category) {
    const catLower = category.toLowerCase();
    filtered = filtered.filter(
      (p) => p.categorySlug.toLowerCase() === catLower || p.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === catLower
    );
  }

  const pageSize = 24;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const featured = paginatedItems.map((prod) => ({
    ...prod,
    scores: evaluateSoftware(prod.assessment),
  }));

  // Dynamic real catalog analytics
  const freeTierCount = ALL_SOFTWARE_PRODUCTS.filter((p) => p.pricing?.some((tier) => tier.freeTier)).length;
  const openSourceCount = ALL_SOFTWARE_PRODUCTS.filter((p) => p.openSourceAlternatives && p.openSourceAlternatives.length > 0).length;
  const totalCategories = new Set(ALL_SOFTWARE_PRODUCTS.map((p) => p.categoryName)).size;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e2e8f0] text-xs font-semibold text-[#2b00d9] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#2b00d9] animate-pulse" />
          <span>Deterministic SaaS Intelligence ({ALL_SOFTWARE_PRODUCTS.length} Tools Indexed)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f172a] leading-[1.1]">
          Stop Paying for SaaS <br className="hidden sm:inline" />
          <span className="text-[#2b00d9]">You Don't Need.</span>
        </h1>

        <p className="text-sm sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
          Evaluate whether you should <strong className="text-[#16a34a] font-bold">KEEP</strong> it,{' '}
          <strong className="text-[#2b00d9] font-bold">SWITCH</strong> to alternatives,{' '}
          <strong className="text-[#9333ea] font-bold">SELF-HOST</strong> open source,{' '}
          <strong className="text-[#d97706] font-bold">AUTOMATE</strong> workflows, or{' '}
          <strong className="text-[#dc2626] font-bold">BUILD</strong> your own.
        </p>

        {/* Real-time Dynamic Search Bar */}
        <RealtimeSearchBox initialQuery={q} totalCount={ALL_SOFTWARE_PRODUCTS.length} category={category} />
      </section>

      {/* Metric Highlights — 100% Real Dynamic Catalog Intelligence */}
      <section className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-[#e2e8f0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[#64748b]">Indexed Software Products</span>
            <div className="w-8 h-8 rounded-full bg-[#eef2ff] text-[#2b00d9] flex items-center justify-center font-bold text-xs">
              📊
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">{ALL_SOFTWARE_PRODUCTS.length}</span>
            <span className="text-xs text-[#2b00d9] font-bold block mt-1">across {totalCategories} Software Categories</span>
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[#64748b]">Products with Free Tier</span>
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center font-bold text-xs">
              🎁
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#16a34a]">{freeTierCount}</span>
            <span className="text-xs text-[#16a34a] font-bold block mt-1">
              {Math.round((freeTierCount / ALL_SOFTWARE_PRODUCTS.length) * 100)}% of catalog has zero-cost starter tier
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[#64748b]">Open-Source Alternatives</span>
            <div className="w-8 h-8 rounded-full bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center font-bold text-xs">
              🚀
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#9333ea]">{openSourceCount}</span>
            <span className="text-xs text-[#9333ea] font-bold block mt-1">verified self-hostable replacements</span>
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[#64748b]">Evaluation Engine</span>
            <div className="w-8 h-8 rounded-full bg-[#eef2ff] text-[#2b00d9] flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2b00d9]">0 - 100</span>
            <span className="text-xs text-[#64748b] font-bold block mt-1">Pure deterministic scoring</span>
          </div>
        </div>
      </section>

      {/* Primary Catalog Grid */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#e2e8f0] pb-4 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">Software Decision Index</h2>
            <p className="text-xs font-medium text-[#64748b]">High-Commercial-Intent Verified Products ({totalItems} total matches)</p>
          </div>
          <span className="text-xs font-bold text-[#94a3b8]">
            Showing {(safePage - 1) * pageSize + 1} - {Math.min(safePage * pageSize, totalItems)} of {totalItems} Entries
          </span>
        </div>

        {/* Category Filter Bar (Smooth horizontal scroll on touch screens) */}
        <div className="flex gap-2 pt-1 pb-3 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
          {CATEGORY_OPTIONS.map((cat) => {
            const isActive = category === cat.value;
            const queryParams = new URLSearchParams();
            if (q) queryParams.set('q', q);
            if (cat.value) queryParams.set('category', cat.value);

            return (
              <Link
                key={cat.value}
                href={`/?${queryParams.toString()}#catalog`}
                scroll={false}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition shrink-0 ${
                  isActive
                    ? 'bg-[#2b00d9] text-white border-[#2b00d9] shadow-sm'
                    : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#cbd5e1] hover:text-[#0f172a]'
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {featured.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-12 text-center space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-[#0f172a]">No software matching current filters</h3>
            <p className="text-xs text-[#64748b]">Try resetting search query or selecting another category.</p>
            <Link
              href="/#catalog"
              scroll={false}
              className="inline-block bg-[#2b00d9] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#1f00a8] transition shadow-md shadow-[#2b00d9]/20"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((prod) => {
              const topDecision = prod.scores.primaryDecision;
              const badgeStyle =
                topDecision === 'KEEP'
                  ? 'bg-[#dcfce7] text-[#15803d]'
                  : topDecision === 'SWITCH'
                  ? 'bg-[#e0e7ff] text-[#3730a3]'
                  : topDecision === 'SELF_HOST'
                  ? 'bg-[#f3e8ff] text-[#6b21a8]'
                  : topDecision === 'AUTOMATE'
                  ? 'bg-[#fef3c7] text-[#92400e]'
                  : 'bg-[#fee2e2] text-[#991b1b]';

              return (
                <Link
                  key={prod.slug}
                  href={`/software/${prod.slug}`}
                  className="group bg-white border border-[#e2e8f0] hover:border-[#2b00d9]/40 hover:shadow-md rounded-2xl p-6 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-extrabold text-[#0f172a] group-hover:text-[#2b00d9] transition">
                        {prod.name}
                      </h3>
                      <span className={`text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full ${badgeStyle}`}>
                        {topDecision.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block mb-2">
                      {prod.categoryName}
                    </span>
                    <p className="text-xs text-[#475569] mb-5 line-clamp-2 leading-relaxed">
                      {prod.shortDescription}
                    </p>
                  </div>

                  {/* Score Bar Visuals */}
                  <div className="space-y-2 pt-4 border-t border-[#f1f5f9] text-[11px]">
                    <div className="flex justify-between text-[#64748b] font-semibold text-[10px]">
                      <span>Keep {prod.scores.keepScore}</span>
                      <span>Switch {prod.scores.switchScore}</span>
                      <span>Self-Host {prod.scores.selfHostScore}</span>
                      <span>Build {prod.scores.buildScore}</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                      <div style={{ width: `${prod.scores.keepScore}%` }} className="bg-[#16a34a] rounded-full" />
                      <div style={{ width: `${prod.scores.switchScore}%` }} className="bg-[#2b00d9] rounded-full" />
                      <div style={{ width: `${prod.scores.selfHostScore}%` }} className="bg-[#9333ea] rounded-full" />
                      <div style={{ width: `${prod.scores.buildScore}%` }} className="bg-[#dc2626] rounded-full" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-6 border-t border-[#e2e8f0]">
            {safePage > 1 ? (
              <Link
                href={`/?${new URLSearchParams({ ...(q ? { q } : {}), ...(category ? { category } : {}), page: (safePage - 1).toString() }).toString()}#catalog`}
                scroll={false}
                className="bg-white border border-[#e2e8f0] text-[#0f172a] hover:border-[#2b00d9] text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
              >
                ← Previous Page
              </Link>
            ) : (
              <span className="text-xs text-[#94a3b8] font-semibold opacity-50 cursor-not-allowed">← Previous Page</span>
            )}

            <span className="text-xs font-bold text-[#475569]">
              Page {safePage} of {totalPages}
            </span>

            {safePage < totalPages ? (
              <Link
                href={`/?${new URLSearchParams({ ...(q ? { q } : {}), ...(category ? { category } : {}), page: (safePage + 1).toString() }).toString()}#catalog`}
                scroll={false}
                className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md shadow-[#2b00d9]/20"
              >
                Next Page →
              </Link>
            ) : (
              <span className="text-xs text-[#94a3b8] font-semibold opacity-50 cursor-not-allowed">Next Page →</span>
            )}
          </div>
        )}
      </section>

      {/* Decision Definitions Framework */}
      <DecisionGlossarySection />
    </div>
  );
}
