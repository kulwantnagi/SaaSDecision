import Link from 'next/link';
import { ALL_SOFTWARE_PRODUCTS, getTopComparisonPairs } from '@/domain/catalog-service';
import { CATEGORY_TREE } from '@/domain/category-navigation';

export const metadata = {
  title: 'Compare SaaS Applications & Head-to-Head Decision Matrix | SaaS Decision Engine',
  description: 'Evaluate side-by-side head-to-head decision scores (KEEP, SWITCH, SELF-HOST, AUTOMATE, BUILD) and 3-year TCO for 1,010+ leading software tools.',
};

export default function CompareHubPage() {
  const topPairs = getTopComparisonPairs(3);

  // Group top pairs by category
  const categorizedPairs = CATEGORY_TREE.map((cat) => {
    const pairsInCat = topPairs.filter(
      (p) => p.categorySlug === cat.slug || p.categoryName?.toLowerCase().includes(cat.name.toLowerCase())
    ).slice(0, 6);
    return {
      category: cat,
      pairs: pairsInCat,
    };
  }).filter((item) => item.pairs.length > 0);

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-[#eef2ff] text-[#2b00d9] border border-[#2b00d9]/20 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
          Head-to-Head Decision Matrix
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          Compare Any 2 Software Tools Side-by-Side
        </h1>
        <p className="text-sm sm:text-base text-[#64748b] leading-relaxed">
          Deterministic side-by-side scoring across 19 technical & economic attributes. Compare retention scores, 3-year TCO savings, migration friction, and self-hosted open-source alternatives.
        </p>
      </div>

      {/* Categorized Head-to-Head Comparison Sections */}
      <div className="space-y-10">
        {categorizedPairs.map(({ category, pairs }) => (
          <section key={category.slug} className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#0f172a]">{category.name} Comparisons</h2>
              </div>
              <Link
                href={`/category/${category.slug}`}
                className="text-xs font-bold text-[#2b00d9] hover:underline"
              >
                View all in {category.name} →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {pairs.map((pair) => (
                <Link
                  key={pair.slugPair}
                  href={`/compare/${pair.slugPair}`}
                  className="group bg-white border border-[#e2e8f0] hover:border-[#2b00d9] p-5 rounded-2xl space-y-2 transition shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-md">
                      VS Matrix
                    </span>
                    <span className="text-xs text-[#2b00d9] font-bold group-hover:translate-x-1 transition-transform inline-block">
                      Compare ↗
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#0f172a] group-hover:text-[#2b00d9] transition">
                    {pair.nameA} <span className="text-[#94a3b8] font-normal">vs</span> {pair.nameB}
                  </h3>
                  <p className="text-xs text-[#64748b] font-medium line-clamp-2">
                    Compare KEEP/SWITCH scores, pricing differences & self-hostable open source alternatives.
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Complete Software Directory Index */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Catalog Directory
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Select Any Software to Compare or Audit
          </h2>
          <p className="text-xs text-[#64748b] font-medium mt-1">
            Browse all {ALL_SOFTWARE_PRODUCTS.length} software tools indexed in our deterministic intelligence engine.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-[500px] overflow-y-auto pr-2">
          {ALL_SOFTWARE_PRODUCTS.map((prod) => (
            <Link
              key={prod.slug}
              href={`/software/${prod.slug}`}
              className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#2b00d9] hover:bg-white flex items-center justify-between transition text-xs font-bold text-[#0f172a]"
            >
              <span className="truncate mr-2">{prod.name}</span>
              <span className="text-[10px] text-[#64748b] bg-[#e2e8f0] px-2 py-0.5 rounded font-semibold shrink-0">
                {prod.categoryName?.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

