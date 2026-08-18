import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSoftwareByCategory, getAllUniqueOpenSourceTools, getTopComparisonPairs } from '@/domain/catalog-service';
import { evaluateSoftware } from '@/domain/decision-engine';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = getSoftwareByCategory(slug);
  if (products.length === 0) return {};

  const categoryName = products[0].categoryName;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

  return {
    title: `Best ${categoryName} Alternatives & Open Source Solutions (2026)`,
    description: `Discover verified ${categoryName} alternatives and open source SaaS solutions. Compare 19-dimension decision ratings, commercial competitors, free tiers, and self-hosted replacements.`,
    keywords: [
      `${categoryName} alternatives`,
      `best ${categoryName} software 2026`,
      `open source ${categoryName}`,
      `free ${categoryName} tools`,
      `self-hosted ${categoryName}`,
      `open source SaaS solutions`,
    ],
    openGraph: {
      title: `Best ${categoryName} Alternatives & Open Source Solutions`,
      description: `Explore top verified open source alternatives and decision scores for ${categoryName} software tools.`,
      images: [
        {
          url: '/saas-decision.webp',
          width: 1200,
          height: 630,
          alt: `${categoryName} Alternatives - SaaS Decision`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best ${categoryName} Alternatives & Open Source Solutions`,
      description: `Explore top verified open source alternatives and decision scores for ${categoryName} software tools.`,
      images: [
        `${baseUrl}/api/og?title=${encodeURIComponent(categoryName)}+Software+Index`,
        `${baseUrl}/saas-decision.webp`,
      ],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productsInCategory = getSoftwareByCategory(slug);

  if (productsInCategory.length === 0) {
    notFound();
  }

  const categoryName = productsInCategory[0].categoryName;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

  // Find relevant open-source alternatives in this category
  const allOss = getAllUniqueOpenSourceTools();
  const categoryOss = allOss.filter(
    (os) =>
      os.categorySlug === slug ||
      os.categoryName.toLowerCase() === categoryName.toLowerCase() ||
      os.replacedProducts.some((p) => p.categoryName?.toLowerCase() === categoryName.toLowerCase())
  ).slice(0, 4);

  // Find category head-to-head comparison pairs
  const allPairs = getTopComparisonPairs(2);
  const categoryPairs = allPairs.filter(
    (p) => p.categorySlug === slug || p.categoryName?.toLowerCase() === categoryName.toLowerCase()
  ).slice(0, 6);

  // Structured Schemas
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Software Decision Index & Alternatives`,
    description: `Comprehensive comparison of ${productsInCategory.length} ${categoryName} SaaS tools and verified open source alternatives.`,
    url: `${baseUrl}/category/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: productsInCategory.slice(0, 10).map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: prod.name,
        url: `${baseUrl}/software/${prod.slug}`,
      })),
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best open source alternative in ${categoryName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: categoryOss.length > 0
            ? `Top verified open-source solutions in ${categoryName} include ${categoryOss.map((o) => o.name).join(', ')}. These can be self-hosted on your own infrastructure for 100% data ownership and zero seat fees.`
            : `Multiple open-source alternatives exist depending on your exact workflow and data privacy requirements. Check the decision matrix below.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I choose the right ${categoryName} software for my team?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Evaluate each platform using 5 key factors: API & integration availability, vendor lock-in risk, data portability, 3-year total cost of ownership (TCO), and whether self-hosting or in-house automation is viable.`,
        },
      },
    ],
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-6 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{categoryName}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-10 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3.5 py-1 rounded-full border border-[#2b00d9]/20">
            Category Intelligence Hub
          </span>
          <span className="text-xs font-bold text-[#64748b]">
            {productsInCategory.length} Tools Evaluated
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          {categoryName} Software & Open-Source Alternatives
        </h1>
        <p className="text-sm sm:text-base font-medium text-[#475569] max-w-3xl leading-relaxed">
          Comprehensive, hallucination-free decision index for {categoryName}. Compare deterministic KEEP/SWITCH scores, starting prices, and self-hostable open-source replacements for 2026.
        </p>
      </div>

      {/* Top Open Source Spotlight in this Category */}
      {categoryOss.length > 0 && (
        <section className="bg-gradient-to-br from-[#f8fafc] to-[#f3e8ff]/30 border border-[#d8b4fe]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#e2e8f0] pb-4">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#9333ea] bg-[#f3e8ff] px-2.5 py-0.5 rounded-full border border-[#9333ea]/20">
                Data Sovereignty & Zero Seat Cost
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
                ⭐ Top Verified Open-Source Picks in {categoryName}
              </h2>
            </div>
            <Link
              href="/open-source"
              className="text-xs font-bold text-[#9333ea] hover:underline"
            >
              Browse Full OSS Directory →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryOss.map((os) => (
              <Link
                key={os.slug}
                href={`/open-source/${os.slug}`}
                className="bg-white border border-[#e2e8f0] hover:border-[#9333ea] p-5 rounded-2xl space-y-3 transition shadow-sm hover:shadow-md group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-base text-[#0f172a] group-hover:text-[#9333ea] transition">
                      {os.name}
                    </h3>
                    <span className="text-[10px] bg-[#f0fdf4] text-[#16a34a] font-bold px-2 py-0.5 rounded">
                      Open Source
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] font-medium line-clamp-2">
                    Replaces {os.replacedProducts.slice(0, 3).map((p) => p.name).join(', ')}
                    {os.replacedProducts.length > 3 ? ` +${os.replacedProducts.length - 3} more` : ''}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-bold text-[#9333ea]">
                  <span>Self-Host Guide</span>
                  <span className="group-hover:translate-x-1 transition-transform">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comparison Matrix Table */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Categorical Matrix
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            {categoryName} Decision Ratings & Pricing Matrix
          </h2>
          <p className="text-xs text-[#64748b] font-medium mt-1">
            Deterministic ratings calculated across 19 technical, architectural, and business dimensions.
          </p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#475569] uppercase font-extrabold">
                <th className="p-3.5 rounded-l-xl">Software</th>
                <th className="p-3.5 text-center">Primary Verdict</th>
                <th className="p-3.5 text-center">KEEP Score</th>
                <th className="p-3.5 text-center">Starting Price</th>
                <th className="p-3.5 text-center">Top Open Source Alt</th>
                <th className="p-3.5 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] font-medium text-[#0f172a]">
              {productsInCategory.map((prod) => {
                const scores = evaluateSoftware(prod.assessment);
                const topOss = prod.openSourceAlternatives?.[0]?.name;
                return (
                  <tr key={prod.slug} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="p-3.5">
                      <Link href={`/software/${prod.slug}`} className="font-extrabold text-sm text-[#0f172a] hover:text-[#2b00d9]">
                        {prod.name}
                      </Link>
                      <span className="block text-[11px] text-[#64748b] truncate max-w-[200px]">{prod.shortDescription}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-[10px] uppercase font-extrabold bg-[#eef2ff] text-[#2b00d9] px-2.5 py-1 rounded-full border border-[#2b00d9]/20">
                        {scores.primaryDecision.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-extrabold text-xs">
                      {scores.keepScore}/100
                    </td>
                    <td className="p-3.5 text-center font-bold text-[#16a34a]">
                      {prod.pricing[0]?.freeTier ? 'Free Tier' : `$${prod.pricing[0]?.basePrice ?? 0}/mo`}
                    </td>
                    <td className="p-3.5 text-center text-[#475569] font-medium">
                      {topOss ? (
                        <span className="bg-[#f3e8ff] text-[#9333ea] px-2 py-0.5 rounded font-bold text-[11px]">
                          {topOss}
                        </span>
                      ) : (
                        <span className="text-[#94a3b8]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/software/${prod.slug}`}
                        className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition inline-block shadow-sm"
                      >
                        Review ↗
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Head-to-Head Comparisons in this Category */}
      {categoryPairs.length > 0 && (
        <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#f1f5f9] pb-4">
            <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
              Head-to-Head Matchups
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
              Popular {categoryName} Head-to-Head Comparisons
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categoryPairs.map((pair) => (
              <Link
                key={pair.slugPair}
                href={`/compare/${pair.slugPair}`}
                className="group bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#2b00d9] hover:bg-white p-5 rounded-2xl space-y-2 transition shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-[#64748b]">Compare Pair</span>
                  <span className="text-xs text-[#2b00d9] font-bold group-hover:translate-x-1 transition-transform">↗</span>
                </div>
                <h3 className="text-sm font-black text-[#0f172a]">
                  {pair.nameA} <span className="text-[#94a3b8] font-normal">vs</span> {pair.nameB}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Buyer's Guide & Framework */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            AEO Buyer's Framework
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            How to Evaluate {categoryName} Solutions in 2026
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-2">
            <span className="text-lg">🔒</span>
            <h3 className="font-extrabold text-sm text-[#0f172a]">1. Vendor Lock-In & Portability</h3>
            <p className="text-xs text-[#475569] font-medium leading-relaxed">
              Verify if the platform supports full raw JSON/SQL exports, standard API endpoints, and webhook triggers to prevent costly migration traps.
            </p>
          </div>

          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-2">
            <span className="text-lg">💰</span>
            <h3 className="font-extrabold text-sm text-[#0f172a]">2. 3-Year Seat TCO Delta</h3>
            <p className="text-xs text-[#475569] font-medium leading-relaxed">
              Per-seat pricing compounds rapidly as teams scale. Compare the 3-year multi-seat cost against self-hosting open source on a $10/mo VPS.
            </p>
          </div>

          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-2">
            <span className="text-lg">⚡</span>
            <h3 className="font-extrabold text-sm text-[#0f172a]">3. Automation & In-House Viability</h3>
            <p className="text-xs text-[#475569] font-medium leading-relaxed">
              Check if the software's core workflow can be replaced with automated scripts (e.g. n8n or Python cron) or a lightweight starter kit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

