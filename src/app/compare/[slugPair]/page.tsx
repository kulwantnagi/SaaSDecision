import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getComparePair, getRelatedSoftwareByCategory } from '@/domain/catalog-service';
import { evaluateSoftware } from '@/domain/decision-engine';
import RelatedSoftwareByCategory from '@/components/software/RelatedSoftwareByCategory';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugPair: string }>;
}): Promise<Metadata> {
  const { slugPair } = await params;
  const pair = getComparePair(slugPair);
  if (!pair) return {};

  const { prodA, prodB } = pair;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

  return {
    title: `${prodA.name} vs ${prodB.name}: Alternatives and Open Source SaaS Solutions`,
    description: `Compare ${prodA.name} vs ${prodB.name} pricing, feature parity, and open source SaaS alternatives. Get deterministic KEEP, SWITCH & SELF-HOST decision scores.`,
    keywords: [
      `${prodA.name} vs ${prodB.name}`,
      `${prodA.name} alternatives`,
      `${prodB.name} alternatives`,
      `open source alternatives to ${prodA.name}`,
      `open source SaaS solutions`,
    ],
    openGraph: {
      title: `${prodA.name} vs ${prodB.name}: Alternatives and Open Source SaaS Solutions`,
      description: `Evaluate feature parity, pricing models, and open-source alternatives for ${prodA.name} and ${prodB.name}.`,
      images: [
        {
          url: '/saas-decision.webp',
          width: 1200,
          height: 630,
          alt: `${prodA.name} vs ${prodB.name} - SaaS Decision`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${prodA.name} vs ${prodB.name}: Alternatives and Open Source SaaS Solutions`,
      description: `Compare ${prodA.name} vs ${prodB.name} pricing, feature parity, and open source SaaS alternatives.`,
      images: [
        `${baseUrl}/api/og?title=${encodeURIComponent(prodA.name)}+vs+${encodeURIComponent(prodB.name)}`,
        `${baseUrl}/saas-decision.webp`,
      ],
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slugPair: string }>;
}) {
  const { slugPair } = await params;
  const pair = getComparePair(slugPair);
  if (!pair) notFound();

  const { prodA, prodB } = pair;
  const scoresA = evaluateSoftware(prodA.assessment);
  const scoresB = evaluateSoftware(prodB.assessment);

  const relatedCategorySoftware = getRelatedSoftwareByCategory(
    prodA.categorySlug,
    prodA.categoryName,
    [prodA.slug, prodB.slug],
    6
  );

  // Structural AEO FAQ JSON-LD Schema
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Which is better: ${prodA.name} or ${prodB.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${prodA.name} receives a KEEP score of ${scoresA.keepScore}/100 and SWITCH score of ${scoresA.switchScore}/100 (Primary verdict: ${scoresA.primaryDecision.replace('_', ' ')}). ${prodB.name} receives a KEEP score of ${scoresB.keepScore}/100 and SWITCH score of ${scoresB.switchScore}/100 (Primary verdict: ${scoresB.primaryDecision.replace('_', ' ')}).`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the price difference between ${prodA.name} and ${prodB.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${prodA.name} starting price is $${prodA.pricing[0]?.basePrice ?? 0}/mo (${prodA.pricing[0]?.freeTier ? 'Free tier available' : 'Paid only'}). ${prodB.name} starting price is $${prodB.pricing[0]?.basePrice ?? 0}/mo (${prodB.pricing[0]?.freeTier ? 'Free tier available' : 'Paid only'}).`,
        },
      },
    ],
  };

  const metricRows = [
    { label: 'Primary Verdict', valA: scoresA.primaryDecision.replace('_', ' '), valB: scoresB.primaryDecision.replace('_', ' '), isBadge: true },
    { label: 'KEEP Score (Retention Value)', valA: `${scoresA.keepScore}/100`, valB: `${scoresB.keepScore}/100`, isBar: true, numA: scoresA.keepScore, numB: scoresB.keepScore, colorA: 'bg-[#16a34a]', colorB: 'bg-[#16a34a]' },
    { label: 'SWITCH Score (Migration Savings)', valA: `${scoresA.switchScore}/100`, valB: `${scoresB.switchScore}/100`, isBar: true, numA: scoresA.switchScore, numB: scoresB.switchScore, colorA: 'bg-[#2b00d9]', colorB: 'bg-[#2b00d9]' },
    { label: 'SELF-HOST Score (OSS Viability)', valA: `${scoresA.selfHostScore}/100`, valB: `${scoresB.selfHostScore}/100`, isBar: true, numA: scoresA.selfHostScore, numB: scoresB.selfHostScore, colorA: 'bg-[#9333ea]', colorB: 'bg-[#9333ea]' },
    { label: 'AUTOMATE Score (Workflow Parity)', valA: `${scoresA.automateScore}/100`, valB: `${scoresB.automateScore}/100`, isBar: true, numA: scoresA.automateScore, numB: scoresB.automateScore, colorA: 'bg-[#d97706]', colorB: 'bg-[#d97706]' },
    { label: 'BUILD Score (Custom In-House Feasibility)', valA: `${scoresA.buildScore}/100`, valB: `${scoresB.buildScore}/100`, isBar: true, numA: scoresA.buildScore, numB: scoresB.buildScore, colorA: 'bg-[#dc2626]', colorB: 'bg-[#dc2626]' },
    { label: 'Engine Confidence', valA: `${scoresA.confidence}%`, valB: `${scoresB.confidence}%` },
    { label: 'Build Complexity (1 - 5)', valA: `${prodA.assessment.buildComplexity} / 5`, valB: `${prodB.assessment.buildComplexity} / 5` },
    { label: 'API & Webhook Availability', valA: `${prodA.assessment.apiAvailability} / 5`, valB: `${prodB.assessment.apiAvailability} / 5` },
    { label: 'Vendor Lock-in Risk', valA: `${prodA.assessment.vendorLockIn} / 5`, valB: `${prodB.assessment.vendorLockIn} / 5` },
    { label: 'Data Portability Score', valA: `${prodA.assessment.dataPortability} / 5`, valB: `${prodB.assessment.dataPortability} / 5` },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-6 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href={`/category/${prodA.categorySlug}`} className="hover:text-[#2b00d9] transition">{prodA.categoryName}</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{prodA.name} vs {prodB.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 sm:p-8 space-y-4 shadow-sm text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] text-[#2b00d9] border border-[#2b00d9]/20 text-xs font-bold uppercase tracking-wider">
          <span>⚡ Head-to-Head Deterministic Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          {prodA.name} <span className="text-[#2b00d9]">vs</span> {prodB.name}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#475569] max-w-2xl mx-auto leading-relaxed">
          Comprehensive deterministic comparison evaluating decision scores, pricing models, replacement difficulty, and open-source alternatives for 2026.
        </p>
      </div>

      {/* Product Summary Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Product A Card */}
        <div className="bg-white border border-[#e2e8f0] p-5 sm:p-8 rounded-3xl space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
                  {prodA.categoryName}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] mt-2">{prodA.name}</h2>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-[#64748b] block font-medium">Starting Price</span>
                <span className="text-base sm:text-lg font-extrabold text-[#16a34a]">
                  {prodA.pricing[0]?.freeTier ? 'Free' : `$${prodA.pricing[0]?.basePrice ?? 0}/mo`}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed font-medium">{prodA.shortDescription}</p>
          </div>

          <div className="pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#475569]">Verdict:</span>
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#eef2ff] text-[#2b00d9]">
                {scoresA.primaryDecision.replace('_', ' ')}
              </span>
            </div>
            <Link
              href={`/software/${prodA.slug}`}
              className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
            >
              Full {prodA.name} Review ↗
            </Link>
          </div>
        </div>

        {/* Product B Card */}
        <div className="bg-white border border-[#e2e8f0] p-5 sm:p-8 rounded-3xl space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
                  {prodB.categoryName}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] mt-2">{prodB.name}</h2>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-[#64748b] block font-medium">Starting Price</span>
                <span className="text-base sm:text-lg font-extrabold text-[#16a34a]">
                  {prodB.pricing[0]?.freeTier ? 'Free' : `$${prodB.pricing[0]?.basePrice ?? 0}/mo`}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed font-medium">{prodB.shortDescription}</p>
          </div>

          <div className="pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#475569]">Verdict:</span>
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#eef2ff] text-[#2b00d9]">
                {scoresB.primaryDecision.replace('_', ' ')}
              </span>
            </div>
            <Link
              href={`/software/${prodB.slug}`}
              className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
            >
              Full {prodB.name} Review ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Head-to-Head Detailed Decision Score Matrix */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Deterministic Decision Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Side-by-Side Decision Scores Matrix
          </h2>
          <p className="text-xs text-[#64748b] font-medium mt-1">
            Evaluated using pure deterministic algorithm scoring across retention, migration savings, self-hosting viability, and build complexity.
          </p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[540px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#475569] uppercase font-extrabold">
                <th className="p-3 sm:p-4 rounded-l-xl">Evaluation Metric</th>
                <th className="p-3 sm:p-4 text-center font-black text-[#0f172a] text-sm w-1/3">{prodA.name}</th>
                <th className="p-3 sm:p-4 text-center font-black text-[#0f172a] text-sm w-1/3 rounded-r-xl">{prodB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] font-medium text-[#0f172a]">
              {metricRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="p-3 sm:p-4 font-bold text-[#334155]">{row.label}</td>
                  
                  {/* Product A Column */}
                  <td className="p-3 sm:p-4 text-center">
                    {row.isBadge ? (
                      <span className="font-extrabold text-xs uppercase bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
                        {row.valA}
                      </span>
                    ) : row.isBar ? (
                      <div className="space-y-1">
                        <span className="font-bold text-xs">{row.valA}</span>
                        <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div className={`h-full ${row.colorA}`} style={{ width: `${row.numA}%` }} />
                        </div>
                      </div>
                    ) : (
                      <span className="font-bold text-xs">{row.valA}</span>
                    )}
                  </td>

                  {/* Product B Column */}
                  <td className="p-3 sm:p-4 text-center">
                    {row.isBadge ? (
                      <span className="font-extrabold text-xs uppercase bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
                        {row.valB}
                      </span>
                    ) : row.isBar ? (
                      <div className="space-y-1">
                        <span className="font-bold text-xs">{row.valB}</span>
                        <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div className={`h-full ${row.colorB}`} style={{ width: `${row.numB}%` }} />
                        </div>
                      </div>
                    ) : (
                      <span className="font-bold text-xs">{row.valB}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-[#16a34a]/20">
            Cost Structure Analysis
          </span>
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Verified Pricing Tiers Comparison
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pricing A */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-base text-[#0f172a]">{prodA.name} Pricing Tiers</h3>
            <div className="space-y-2">
              {prodA.pricing.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                  <div>
                    <span className="font-bold text-xs text-[#0f172a] block">{p.name}</span>
                    <span className="text-[10px] text-[#64748b]">{p.billingInterval} billing</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#16a34a]">
                    {p.freeTier ? 'Free' : `$${p.basePrice}/mo`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing B */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-base text-[#0f172a]">{prodB.name} Pricing Tiers</h3>
            <div className="space-y-2">
              {prodB.pricing.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                  <div>
                    <span className="font-bold text-xs text-[#0f172a] block">{p.name}</span>
                    <span className="text-[10px] text-[#64748b]">{p.billingInterval} billing</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#16a34a]">
                    {p.freeTier ? 'Free' : `$${p.basePrice}/mo`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Alternatives Comparison */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9333ea] bg-[#f3e8ff] px-2.5 py-0.5 rounded-full border border-[#9333ea]/20">
              Zero License Fees
            </span>
            <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
              Self-Hostable Open Source Options
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* OSS A */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-sm text-[#0f172a]">{prodA.name} Open-Source Options</h3>
            {prodA.openSourceAlternatives && prodA.openSourceAlternatives.length > 0 ? (
              prodA.openSourceAlternatives.map((os, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-[#e2e8f0] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-[#0f172a]">{os.name}</span>
                    <span className="text-[10px] bg-[#f3e8ff] text-[#9333ea] font-bold px-2 py-0.5 rounded-full">
                      {os.stars}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] font-medium leading-relaxed">{os.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#64748b]">No direct open-source alternatives indexed for {prodA.name}.</p>
            )}
          </div>

          {/* OSS B */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-sm text-[#0f172a]">{prodB.name} Open-Source Options</h3>
            {prodB.openSourceAlternatives && prodB.openSourceAlternatives.length > 0 ? (
              prodB.openSourceAlternatives.map((os, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-[#e2e8f0] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-[#0f172a]">{os.name}</span>
                    <span className="text-[10px] bg-[#f3e8ff] text-[#9333ea] font-bold px-2 py-0.5 rounded-full">
                      {os.stars}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] font-medium leading-relaxed">{os.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#64748b]">No direct open-source alternatives indexed for {prodB.name}.</p>
            )}
          </div>
        </div>
      </section>

      {/* Head-to-Head FAQ Section for AEO */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Head-to-Head FAQs
          </span>
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Frequently Asked Questions: {prodA.name} vs {prodB.name}
          </h2>
        </div>

        <div className="space-y-4">
          <details className="group bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 [&_summary::-webkit-details-marker]:none cursor-pointer" open>
            <summary className="flex items-center justify-between font-extrabold text-sm text-[#0f172a] select-none">
              <span>Which tool is easier to migrate or build custom?</span>
              <span className="ml-2 text-[#64748b] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-[#475569] font-medium leading-relaxed mt-3 pt-3 border-t border-[#e2e8f0]">
              {prodA.name} has a build complexity of {prodA.assessment.buildComplexity}/5 and API availability of {prodA.assessment.apiAvailability}/5. {prodB.name} has a build complexity of {prodB.assessment.buildComplexity}/5 and API availability of {prodB.assessment.apiAvailability}/5.
            </p>
          </details>

          <details className="group bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 [&_summary::-webkit-details-marker]:none cursor-pointer">
            <summary className="flex items-center justify-between font-extrabold text-sm text-[#0f172a] select-none">
              <span>Should I choose {prodA.name} or {prodB.name}?</span>
              <span className="ml-2 text-[#64748b] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-[#475569] font-medium leading-relaxed mt-3 pt-3 border-t border-[#e2e8f0]">
              If you prioritize retention value and deep integrations, {scoresA.keepScore > scoresB.keepScore ? prodA.name : prodB.name} leads with a KEEP score of {Math.max(scoresA.keepScore, scoresB.keepScore)}/100. If you are looking to switch or optimize costs, review their secondary verdicts and open-source alternatives above.
            </p>
          </details>
        </div>
      </section>

      {/* Category Related Software Section */}
      <RelatedSoftwareByCategory
        categoryName={prodA.categoryName}
        categorySlug={prodA.categorySlug}
        relatedProducts={relatedCategorySoftware}
        currentProductName={`${prodA.name} & ${prodB.name}`}
        currentProductSlug={prodA.slug}
        title={`Related Software in ${prodA.categoryName}`}
        description={`Explore other top verified software alternatives and decision metrics in ${prodA.categoryName}.`}
      />
    </div>
  );
}

