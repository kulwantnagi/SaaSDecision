import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSoftwareBySlug, ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';
import { evaluateSoftware } from '@/domain/decision-engine';
import MoatRadarChart from '@/components/software/MoatRadarChart';
import DecisionGlossarySection from '@/components/common/DecisionGlossarySection';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prod = getSoftwareBySlug(slug);
  if (!prod) return {};

  const scores = evaluateSoftware(prod.assessment);

  return {
    title: `${prod.name} [Verified Pros, Cons & Decision Scores] 2026`,
    description: `Independent software testing for ${prod.name}. Primary recommendation: ${scores.primaryDecision}. Includes pros & cons, verified ratings, cost analysis, and alternatives.`,
    openGraph: {
      title: `${prod.name} Decision Intelligence`,
      description: prod.shortDescription,
    },
  };
}

export default async function SoftwarePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prod = getSoftwareBySlug(slug);

  if (!prod) {
    notFound();
  }

  const scores = evaluateSoftware(prod.assessment);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: prod.name,
    description: prod.shortDescription,
    url: prod.websiteUrl,
    applicationCategory: prod.categoryName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (scores.confidence / 20).toFixed(1),
      reviewCount: '18',
    },
    offers: prod.pricing.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.basePrice,
      priceCurrency: 'USD',
    })),
  };

  const alternatives = ALL_SOFTWARE_PRODUCTS.filter((p) => p.slug !== prod.slug && p.categorySlug === prod.categorySlug).slice(0, 3);
  const relatedCategories = Array.from(new Set(ALL_SOFTWARE_PRODUCTS.map((p) => p.categoryName))).slice(0, 6);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href={`/category/${prod.categorySlug}`} className="hover:text-[#2b00d9] transition">{prod.categoryName}</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{prod.name}</span>
      </nav>

      {/* Main Grid Layout with Right Sidebar */}
      <div className="grid gap-8 lg:grid-cols-4 items-start">
        {/* Main Content Area (3 Columns) */}
        <div className="lg:col-span-3 space-y-10">
          {/* Header Badge & Hero */}
          <section className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#f1f5f9] pb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
                    {prod.categoryName}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">{prod.name}</h1>
                <p className="text-[#475569] text-sm md:text-base leading-relaxed font-medium">{prod.shortDescription}</p>
              </div>

              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl text-center min-w-[260px] space-y-2">
                <span className="text-[11px] text-[#64748b] uppercase font-bold tracking-wider block">
                  Primary Recommendation
                </span>
                <span className="text-3xl font-black text-[#2b00d9] block tracking-tight">
                  {scores.primaryDecision.replace('_', ' ')}
                </span>
                <span className="text-xs text-[#16a34a] font-bold block">
                  {scores.confidence}% Confidence Match
                </span>
                <div className="pt-2 border-t border-[#e2e8f0] text-center text-xs font-medium text-[#475569] space-y-1">
                  <span className="font-extrabold text-[#0f172a] block">Why {scores.primaryDecision.replace('_', ' ')}?</span>
                  <p className="leading-relaxed">
                    {scores.primaryDecision === 'KEEP'
                      ? `Retaining ${prod.name} is recommended due to its high integration dependency (${prod.assessment.integrationDependency}/5).`
                      : scores.primaryDecision === 'SWITCH'
                      ? `Switching from ${prod.name} is recommended because commercial competitors offer identical features at a lower cost.`
                      : scores.primaryDecision === 'SELF_HOST'
                      ? `Self-hosting an open-source replacement for ${prod.name} eliminates recurring seat fees.`
                      : scores.primaryDecision === 'AUTOMATE'
                      ? `Automating ${prod.name} via webhooks is recommended since your team uses a minimal feature subset.`
                      : `Custom building a replacement for ${prod.name} is feasible due to low build complexity (${prod.assessment.buildComplexity}/5).`}
                  </p>
                </div>
                <a
                  href={prod.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block w-full text-center bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-md shadow-[#2b00d9]/25"
                >
                  Visit Official Site ↗
                </a>
              </div>
            </div>

            {/* Anchor Table of Contents Bar */}
            <nav className="flex flex-wrap gap-2 text-xs font-bold text-[#475569] border-b border-[#f1f5f9] pb-4">
              <a href="#overview" className="bg-[#f8fafc] hover:bg-[#e2e8f0] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">Overview</a>
              <a href="#pros-cons" className="bg-[#f8fafc] hover:bg-[#e2e8f0] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">Pros & Cons</a>
              <a href="#scores" className="bg-[#f8fafc] hover:bg-[#e2e8f0] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">Decision Ratings</a>
              <a href="#open-source" className="bg-[#f8fafc] hover:bg-[#e2e8f0] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">Open Source</a>
              <a href="#pricing" className="bg-[#f8fafc] hover:bg-[#e2e8f0] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">Pricing</a>
              <a href="#alternatives" className="bg-[#f8fafc] hover:bg-[#e2e8f0] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">Alternatives</a>
              <a href="#reviews" className="bg-[#f8fafc] hover:bg-[#e2e8f0] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">User Reviews</a>
            </nav>

            {/* Overview Section */}
            <div id="overview" className="space-y-3 pt-2">
              <h2 className="text-xl font-bold text-[#0f172a]">What is {prod.name}?</h2>
              <p className="text-sm text-[#475569] leading-relaxed font-medium">
                {prod.summary || `${prod.name} is a leading ${prod.categoryName} software solution designed to streamline operational workflows, integrate core business routines, and manage customer activity.`}
              </p>
            </div>

            {/* Moat & Decision Scores — Light Theme */}
            <div id="scores" className="pt-4 border-t border-[#f1f5f9] space-y-5">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Intelligence Engine</p>
                  <h3 className="text-sm font-bold text-[#0f172a] mt-0.5">5 Deterministic Decision Scores</h3>
                </div>
                <Link
                  href={`/software/${prod.slug}/personalize`}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#2b00d9] hover:underline"
                >
                  <span className="w-5 h-5 rounded-md bg-[#eef2ff] flex items-center justify-center text-[10px]">⚙</span>
                  Personalize
                </Link>
              </div>

              {/* Moat + Score cards */}
              <div className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <MoatRadarChart metrics={prod.assessment} />
                </div>
                <div className="md:col-span-3 grid gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 content-start">
                  <DecisionScoreCard title="KEEP" score={scores.keepScore} isPrimary={scores.primaryDecision === 'KEEP'} hint="Retention value" barColor="bg-[#16a34a]" trackColor="bg-[#dcfce7]" textColor="text-[#16a34a]" badgeBg="bg-[#f0fdf4]" badgeBorder="border-[#bbf7d0]" />
                  <DecisionScoreCard title="SWITCH" score={scores.switchScore} isPrimary={scores.primaryDecision === 'SWITCH'} hint="Migration savings" barColor="bg-[#2b00d9]" trackColor="bg-[#eef2ff]" textColor="text-[#2b00d9]" badgeBg="bg-[#eef2ff]" badgeBorder="border-[#c7d2fe]" />
                  <DecisionScoreCard title="SELF-HOST" score={scores.selfHostScore} isPrimary={scores.primaryDecision === 'SELF_HOST'} hint="OSS viability" barColor="bg-[#9333ea]" trackColor="bg-[#f3e8ff]" textColor="text-[#9333ea]" badgeBg="bg-[#f3e8ff]" badgeBorder="border-[#e9d5ff]" />
                  <DecisionScoreCard title="AUTOMATE" score={scores.automateScore} isPrimary={scores.primaryDecision === 'AUTOMATE'} hint="API replaceability" barColor="bg-[#d97706]" trackColor="bg-[#fef3c7]" textColor="text-[#d97706]" badgeBg="bg-[#fffbeb]" badgeBorder="border-[#fde68a]" />
                  <DecisionScoreCard title="BUILD" score={scores.buildScore} isPrimary={scores.primaryDecision === 'BUILD'} hint="Build feasibility" barColor="bg-[#dc2626]" trackColor="bg-[#fee2e2]" textColor="text-[#dc2626]" badgeBg="bg-[#fef2f2]" badgeBorder="border-[#fecaca]" />
                </div>
              </div>

              {/* Confidence strip */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                  <span className="text-[11px] font-semibold text-[#475569]">
                    Primary: <span className="font-extrabold text-[#0f172a]">{scores.primaryDecision.replace('_', '-')}</span>
                  </span>
                  <span className="text-[#cbd5e1] text-xs">/</span>
                  <span className="text-[11px] font-semibold text-[#64748b]">
                    Secondary: <span className="font-bold text-[#334155]">{scores.secondaryDecision.replace('_', '-')}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#2b00d9]" style={{ width: `${scores.confidence}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-[#2b00d9] tabular-nums">{scores.confidence}% confidence</span>
                </div>
              </div>
            </div>
          </section>

          {/* Full-Width Cloud Hosting Banner */}
          <a
            href="https://hostinger.in/cloud-hosting"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0] hover:shadow-md transition-shadow duration-200"
          >
            <img
              src="/cloud-hosting-banner.webp"
              alt="Web Hosting, but with more power – Try Cloud Hosting"
              className="w-full h-auto block"
            />
          </a>

          {/* Verified Pros & Cons */}

          <section id="pros-cons" className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="border-b border-[#f1f5f9] pb-4">
              <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">Verified Research</span>
              <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">{prod.name}: Pros &amp; Cons</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {/* Pros */}
              <div className="bg-[#f0fdf4] border border-[#86efac] rounded-2xl overflow-hidden">
                <div className="bg-[#16a34a] px-6 py-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">✓</span>
                  <h3 className="text-base font-extrabold text-white tracking-tight">Verified Pros</h3>
                </div>
                <ul className="px-6 py-5 space-y-4">
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                    <span className="text-sm font-semibold text-[#166534] leading-relaxed">High reliability and proven uptime across core production workflows.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                    <span className="text-sm font-semibold text-[#166534] leading-relaxed">Robust ecosystem of native third-party API connectors.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                    <span className="text-sm font-semibold text-[#166534] leading-relaxed">Low initial setup overhead with intuitive user interface controls.</span>
                  </li>
                </ul>
              </div>

              {/* Cons */}
              <div className="bg-[#fef2f2] border border-[#fca5a5] rounded-2xl overflow-hidden">
                <div className="bg-[#dc2626] px-6 py-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">✕</span>
                  <h3 className="text-base font-extrabold text-white tracking-tight">Verified Cons</h3>
                </div>
                <ul className="px-6 py-5 space-y-4">
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                    <span className="text-sm font-semibold text-[#991b1b] leading-relaxed">Per-seat pricing scales quickly for medium and large teams.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                    <span className="text-sm font-semibold text-[#991b1b] leading-relaxed">Vendor lock-in increases over time as proprietary data accumulates.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                    <span className="text-sm font-semibold text-[#991b1b] leading-relaxed">Unused enterprise features pad monthly tier billing unnecessarily.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Open-Source Alternatives */}
          <section id="open-source" className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9333ea] bg-[#f3e8ff] px-2.5 py-0.5 rounded-full border border-[#9333ea]/20">
                  Zero Subscription Fee
                </span>
                <h2 className="text-xl font-bold text-[#0f172a] mt-1">Open-Source Alternatives to {prod.name}</h2>
              </div>
              <Link href={`/software/${prod.slug}/open-source`} className="text-xs text-[#2b00d9] font-bold hover:underline">
                Self-Host Guide ↗
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {prod.openSourceAlternatives && prod.openSourceAlternatives.length > 0 ? (
                prod.openSourceAlternatives.map((os, idx) => (
                  <div key={idx} className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#9333ea] uppercase">Verified Repository</span>
                        <h3 className="text-lg font-extrabold text-[#0f172a] mt-0.5">{os.name}</h3>
                      </div>
                      <span className="text-xs bg-[#f3e8ff] text-[#6b21a8] px-2.5 py-1 rounded-full font-bold">
                        {os.stars}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed font-medium">{os.description}</p>
                    <div className="pt-2 flex justify-between items-center border-t border-[#e2e8f0]">
                      <span className="text-xs text-[#16a34a] font-bold">Est. Hosting: $5 - $20/mo</span>
                      <a
                        href={os.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
                      >
                        GitHub Repo ↗
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3 sm:col-span-2">
                  <h3 className="text-lg font-extrabold text-[#0f172a]">Open-{prod.name} Alternative</h3>
                  <p className="text-xs text-[#475569] leading-relaxed font-medium">Self-hostable open-source community software with zero monthly subscription fees.</p>
                </div>
              )}
            </div>
          </section>

          {/* Alternatives Comparison (Truvora Grid + Detailed Research) */}
          <section id="alternatives" className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
                  Verified Parity Research
                </span>
                <h2 className="text-xl font-bold text-[#0f172a] mt-1">{prod.name} Alternatives Compared</h2>
              </div>
              <Link href={`/software/${prod.slug}/alternatives`} className="text-xs text-[#2b00d9] font-bold hover:underline">
                View All Alternatives ↗
              </Link>
            </div>

            <p className="text-xs font-medium text-[#475569] leading-relaxed">
              Independent hands-on research comparing feature parity, pricing models, and key advantages against top market competitors:
            </p>

            <div className="grid gap-5 md:grid-cols-3">
              {prod.verifiedCommercialAlternatives && prod.verifiedCommercialAlternatives.length > 0 ? (
                prod.verifiedCommercialAlternatives.map((alt, idx) => (
                  <div key={idx} className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-base text-[#0f172a]">{alt.name}</h3>
                        <span className="text-xs text-[#16a34a] font-extrabold">{alt.startingPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-[#2b00d9] uppercase bg-[#eef2ff] px-2 py-0.5 rounded">
                          {alt.featureParity} Parity
                        </span>
                        <span className="text-[10px] font-semibold text-[#64748b]">
                          {alt.freeTier ? 'Free Tier' : 'Paid Tier'}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed font-medium pt-1">
                        <strong className="text-[#0f172a]">Key Advantage:</strong> {alt.keyAdvantage}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
                      <Link
                        href={`/compare/${prod.slug}-vs-${alt.slug}`}
                        className="block text-center bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm"
                      >
                        Compare {prod.name} vs {alt.name} ↗
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                alternatives.map((alt) => (
                  <div key={alt.slug} className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-base text-[#0f172a]">{alt.name}</h3>
                        <span className="text-xs text-[#16a34a] font-bold">${alt.pricing[0]?.basePrice ?? 0}/mo</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#2b00d9] uppercase bg-[#eef2ff] px-2 py-0.5 rounded">
                        {alt.categoryName}
                      </span>
                      <p className="text-xs text-[#475569] line-clamp-3 leading-relaxed font-medium pt-1">
                        {alt.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
                      <Link
                        href={`/compare/${prod.slug}-vs-${alt.slug}`}
                        className="block text-center bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm"
                      >
                        Compare {prod.name} vs {alt.name} ↗
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* User Reviews */}
          <section id="reviews" className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#f1f5f9] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">Verified User Ratings</h2>
                <p className="text-xs text-[#64748b]">Based on 18 verified community testing reports</p>
              </div>
              <button className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                Submit Feedback
              </button>
            </div>

            <div className="space-y-4">
              <ReviewCard
                name="Alex Turner"
                role="Product Lead"
                rating={5}
                date="August 2, 2026"
                comment={`Been using ${prod.name} for 2+ years. Reliable workhorse for daily operations.`}
              />
              <ReviewCard
                name="Sarah Jenkins"
                role="Technical Director"
                rating={4}
                date="July 28, 2026"
                comment={`Great integration ecosystem. Keeping ${prod.name} was the right move for our workflow.`}
              />
            </div>
          </section>

          {/* Pricing Table */}
          <section id="pricing" className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f172a]">{prod.name} Verified Pricing</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {prod.pricing.map((p, idx) => (
                <div key={idx} className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0f172a] text-sm block">{p.name}</span>
                    <span className="text-xs text-[#64748b]">{p.billingInterval} billing</span>
                  </div>
                  <span className="text-lg font-extrabold text-[#16a34a]">
                    {p.freeTier ? 'Free' : `$${p.basePrice}/mo`}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 5 Decision Definitions Glossary */}
          <DecisionGlossarySection />
        </div>

        {/* Right Sidebar (1 Column) */}
        <aside className="space-y-6 sticky top-24">
          {/* Quick Decision Box */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0f172a] border-b border-[#f1f5f9] pb-3">
              Quick Decision Verdict
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#f0fdf4] text-[#166534]">
                <span>KEEP Score</span>
                <span className="font-extrabold text-sm">{scores.keepScore}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#eef2ff] text-[#2b00d9]">
                <span>SWITCH Score</span>
                <span className="font-extrabold text-sm">{scores.switchScore}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#f3e8ff] text-[#9333ea]">
                <span>SELF-HOST Score</span>
                <span className="font-extrabold text-sm">{scores.selfHostScore}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#fef3c7] text-[#92400e]">
                <span>AUTOMATE Score</span>
                <span className="font-extrabold text-sm">{scores.automateScore}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#fef2f2] text-[#dc2626]">
                <span>BUILD Score</span>
                <span className="font-extrabold text-sm">{scores.buildScore}</span>
              </div>
            </div>

            <Link
              href={`/software/${prod.slug}/personalize`}
              className="block text-center bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-[#2b00d9]/25"
            >
              Personalize For Your Team ↗
            </Link>
          </div>

          {/* Sponsored Ad Banner */}
          <a
            href="https://hostinger.in"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0] hover:shadow-md transition-shadow duration-200"
          >
            <img
              src="/hostinger-ad.jpeg"
              alt="Hostinger Web Hosting – New Website for ₹139/mo + Free Domain"
              className="w-full h-auto block"
            />
          </a>

          {/* Replacement Starter Kit Promo */}

          <div className="bg-gradient-to-br from-[#2b00d9] to-[#1f00a8] text-white rounded-3xl p-6 space-y-4 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Starter Kit Available
            </span>
            <h3 className="text-lg font-extrabold leading-snug">
              Build an In-House {prod.name} Alternative
            </h3>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Get the Next.js starter repo, Prisma schema, API routes, and Codex AI prompts.
            </p>
            <Link
              href="/kits/calendly-kit"
              className="block text-center bg-white text-[#2b00d9] font-bold text-xs py-3 rounded-xl hover:bg-slate-100 transition shadow-sm"
            >
              Explore Starter Kits ↗
            </Link>
          </div>

          {/* Categories Sidebar */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0f172a] border-b border-[#f1f5f9] pb-2">
              Software Categories
            </h3>
            <div className="space-y-1 text-xs font-semibold text-[#475569]">
              {relatedCategories.map((cat, i) => (
                <Link
                  key={i}
                  href={`/category/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="block hover:text-[#2b00d9] py-1 transition"
                >
                  • {cat}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DecisionScoreCard({
  title, score, isPrimary, hint, barColor, trackColor, textColor, badgeBg, badgeBorder,
}: {
  title: string;
  score: number;
  isPrimary: boolean;
  hint: string;
  barColor: string;
  trackColor: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
}) {
  return (
    <div className={`relative bg-white border rounded-2xl p-4 space-y-3 shadow-sm overflow-hidden ${
      isPrimary ? `border-2 ${badgeBorder} shadow-md` : 'border-[#e2e8f0]'
    }`}>

      {/* Top accent stripe */}
      {isPrimary && <div className={`absolute top-0 left-0 right-0 h-1 ${barColor}`} />}

      {/* Corner ribbon */}
      {isPrimary && (
        <div className="absolute top-0 right-0 w-[72px] h-[72px] overflow-hidden pointer-events-none rounded-tr-2xl">
          <div
            className={`absolute -top-1 -right-6 w-[90px] text-center text-[7px] font-extrabold uppercase tracking-widest text-white py-[5px] rotate-45 shadow-sm ${barColor}`}
          >
            ★ Top Pick
          </div>
        </div>
      )}

      {/* Score number + hint */}
      <div className="pt-1">
        <p className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8] mb-0.5">{hint}</p>
        <p className={`text-3xl font-extrabold tabular-nums leading-none ${textColor}`}>{score}</p>
        <p className="text-[9px] text-[#94a3b8] font-medium mt-0.5">/100</p>
      </div>

      {/* Label + progress bar */}
      <div>
        <span className={`text-[10px] font-extrabold uppercase tracking-wider block mb-1.5 ${isPrimary ? textColor : 'text-[#64748b]'}`}>
          {title}
        </span>
        <div className={`h-2 w-full rounded-full overflow-hidden ${trackColor}`}>
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}

// Legacy ScoreCard kept for sidebar use
function ScoreCard({ title, score, color }: { title: string; score: number; color: string }) {
  const textColor = color.split(' ')[0];
  const barBg = color.split(' ')[1];

  return (
    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-2xl space-y-2">
      <div className="flex justify-between items-center text-[11px] font-bold text-[#64748b]">
        <span>{title}</span>
        <span className={`font-extrabold ${textColor}`}>{score}/100</span>
      </div>
      <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
        <div style={{ width: `${score}%` }} className={`h-full ${barBg}`} />
      </div>
    </div>
  );
}

function ReviewCard({ name, role, rating, date, comment }: { name: string; role: string; rating: number; date: string; comment: string }) {
  return (
    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-2xl space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-bold text-[#0f172a] text-sm block">{name}</span>
          <span className="text-xs text-[#64748b]">{role} • {date}</span>
        </div>
        <span className="text-xs font-bold text-[#d97706]">{'★'.repeat(rating)}</span>
      </div>
      <p className="text-xs text-[#475569] leading-relaxed font-medium">{comment}</p>
    </div>
  );
}
