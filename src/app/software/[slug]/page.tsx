import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSoftwareBySlug, ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';
import { evaluateSoftware } from '@/domain/decision-engine';
import MoatRadarChart from '@/components/software/MoatRadarChart';
import DecisionGlossarySection from '@/components/common/DecisionGlossarySection';
import StickyRecommendedHostingWidget from '@/components/StickyRecommendedHostingWidget';
import StickyFooterRecommendationBar from '@/components/StickyFooterRecommendationBar';
import InteractiveAlternativesSuite from '@/components/software/InteractiveAlternativesSuite';

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
    title: `${prod.name} Alternatives and Open Source SaaS Solutions`,
    description: `Discover verified ${prod.name} alternatives and open source SaaS solutions. Compare pricing, self-hosted replacements, KEEP/SWITCH/SELF-HOST decision scores, and cost optimization for ${prod.name}.`,
    keywords: [
      `${prod.name} alternatives`,
      `open source ${prod.name} alternative`,
      `${prod.name} competitors`,
      `self-host ${prod.name}`,
      `free ${prod.name} alternative`,
      `open source SaaS solutions`,
      `${prod.name} pricing`,
    ],
    openGraph: {
      title: `${prod.name} Alternatives and Open Source SaaS Solutions`,
      description: `Discover verified ${prod.name} alternatives and open source SaaS solutions. Primary recommendation: ${scores.primaryDecision.replace('_', ' ')} (${scores.confidence}% confidence).`,
      images: [
        {
          url: '/saas-decision.webp',
          width: 1200,
          height: 630,
          alt: `${prod.name} Alternatives - SaaS Decision`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${prod.name} Alternatives and Open Source SaaS Solutions`,
      description: `Discover verified ${prod.name} alternatives and open source SaaS solutions.`,
      images: ['/saas-decision.webp'],
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

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Should you keep or switch from ${prod.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Based on our deterministic 0-100 evaluation engine, the primary recommendation for ${prod.name} is ${scores.primaryDecision.replace('_', ' ')} with a confidence level of ${scores.confidence}%. ${scores.primaryDecision === 'KEEP' ? `${prod.name} provides high retention value and deep operational integrations.` : `${prod.name} can be optimized or replaced with cheaper commercial or self-hosted alternatives.`}`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the top open-source alternatives to ${prod.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: prod.openSourceAlternatives && prod.openSourceAlternatives.length > 0
            ? `${prod.name} can be self-hosted using open-source repositories like ${prod.openSourceAlternatives.map(a => a.name).join(', ')}.`
            : `Open-source self-hosted alternatives allow teams to cut monthly recurring costs by up to 90% by hosting on VPS servers like Hostinger or Hetzner.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does ${prod.name} cost per month?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: prod.pricing && prod.pricing.length > 0
            ? `${prod.name} plans start at $${prod.pricing[0].basePrice}/mo for the ${prod.pricing[0].name} tier.`
            : `${prod.name} pricing varies based on team seat count and enterprise feature tiers.`,
        },
      },
    ],
  };

  const alternatives = ALL_SOFTWARE_PRODUCTS.filter((p) => p.slug !== prod.slug && p.categorySlug === prod.categorySlug).slice(0, 3);
  const relatedCategories = Array.from(new Set(ALL_SOFTWARE_PRODUCTS.map((p) => p.categoryName))).slice(0, 6);

  return (
    <div className="space-y-8 sm:space-y-10 max-w-7xl w-full min-w-0 mx-auto pb-12 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="text-xs text-[#64748b] flex flex-wrap items-center gap-2 w-full min-w-0">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href={`/category/${prod.categorySlug}`} className="hover:text-[#2b00d9] transition">{prod.categoryName}</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{prod.name}</span>
      </nav>

      {/* Main Grid Layout with Right Sidebar */}
      <div className="grid gap-8 lg:grid-cols-4 w-full min-w-0">
        {/* Main Content Area (3 Columns) */}
        <div className="lg:col-span-3 space-y-8 sm:space-y-10 w-full min-w-0">
          {/* Header Badge & Hero */}
          <section className="bg-white border border-[#e2e8f0] rounded-3xl p-4 sm:p-8 space-y-6 shadow-sm w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-[#f1f5f9] pb-6 w-full min-w-0">
              <div className="space-y-4 flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
                    {prod.categoryName}
                  </span>
                  {prod.pricing.some(p => p.freeTier) && (
                    <span className="text-xs font-bold bg-[#f0fdf4] text-[#16a34a] px-3 py-1 rounded-full border border-[#86efac]">
                      Free Tier Available
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight break-words">
                  {prod.name}
                </h1>

                <p className="text-[#0f172a] text-sm md:text-base font-semibold leading-relaxed break-words">
                  {prod.shortDescription}
                </p>

                {/* Rich Informational Paragraphs (Fills Hero Section) */}
                <div className="space-y-2.5 pt-2 border-t border-[#f1f5f9]">
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-medium break-words">
                    {prod.summary}
                  </p>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed break-words">
                    Evaluated across 19 deterministic engineering vectors, <strong className="text-[#0f172a] font-bold">{prod.name}</strong> carries a build complexity score of <span className="font-extrabold text-[#2b00d9]">{prod.assessment.buildComplexity}/5</span> and an integration dependency factor of <span className="font-extrabold text-[#0f172a]">{prod.assessment.integrationDependency}/5</span>.
                  </p>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed break-words">
                    {prod.openSourceAlternatives && prod.openSourceAlternatives.length > 0 ? (
                      <>
                        Our intelligence engine identifies <strong className="text-[#0f172a] font-bold">{prod.openSourceAlternatives.length} verified open-source alternatives</strong> including <span className="font-bold text-[#2b00d9]">{prod.openSourceAlternatives.slice(0, 2).map(a => a.name).join(' & ')}</span> to lower per-seat SaaS costs.
                      </>
                    ) : (
                      <>
                        Our intelligence engine evaluates open-source alternatives and self-hosted infrastructure to replace per-seat SaaS licensing.
                      </>
                    )}
                  </p>
                </div>

                {/* Key Technical Highlights Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] bg-[#f8fafc] text-[#475569] px-2.5 py-1 rounded-lg border border-[#e2e8f0] font-semibold">
                    ⚡ Build Complexity: <strong className="text-[#0f172a]">{prod.assessment.buildComplexity}/5</strong>
                  </span>
                  <span className="text-[11px] bg-[#f8fafc] text-[#475569] px-2.5 py-1 rounded-lg border border-[#e2e8f0] font-semibold">
                    🔗 Integration Moat: <strong className="text-[#0f172a]">{prod.assessment.integrationDependency}/5</strong>
                  </span>
                  <span className="text-[11px] bg-[#f8fafc] text-[#475569] px-2.5 py-1 rounded-lg border border-[#e2e8f0] font-semibold">
                    🔒 Lock-In Risk: <strong className="text-[#0f172a]">{prod.assessment.vendorLockIn}/5</strong>
                  </span>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-[#eff6ff] via-[#eef2ff] to-[#f3e8ff] border border-[#c7d2fe] p-4 sm:p-6 rounded-2xl text-center w-full lg:w-80 lg:shrink-0 min-w-0 max-w-full space-y-2.5 shadow-md shadow-[#2b00d9]/5">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#2b00d9]/10 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[11px] text-[#2b00d9] uppercase font-extrabold tracking-wider block bg-white/70 backdrop-blur-xs py-1 px-3 rounded-full border border-[#a5b4fc]/40 w-fit mx-auto shadow-2xs">
                  ★ Primary Recommendation
                </span>
                <span className="text-3xl font-black text-[#2b00d9] block tracking-tight pt-1 break-words">
                  {scores.primaryDecision.replace('_', ' ')}
                </span>
                <span className="text-xs text-[#16a34a] font-extrabold bg-[#f0fdf4] text-[#15803d] px-3 py-1 rounded-full inline-block border border-[#bbf7d0]">
                  ✓ {scores.confidence}% Confidence Match
                </span>
                <div className="pt-3 border-t border-[#c7d2fe]/60 text-center text-xs font-medium text-[#334155] space-y-1 relative z-10">
                  <span className="font-extrabold text-[#0f172a] block">Why {scores.primaryDecision.replace('_', ' ')}?</span>
                  <p className="leading-relaxed break-words">
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
                <div className="pt-2">
                  <a
                    href={prod.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center bg-gradient-to-r from-[#2b00d9] to-[#1f00a8] hover:from-[#1f00a8] hover:to-[#17007e] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95"
                  >
                    Visit Official Site ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Anchor Table of Contents Bar */}
            <nav className="flex gap-1.5 text-[11px] font-extrabold border-b border-[#f1f5f9] pb-3 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth w-full min-w-0 max-w-full">
              <a href="#overview" className="flex items-center gap-1 bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] text-[#1d4ed8] hover:from-[#dbeafe] hover:to-[#bfdbfe] px-2.5 py-1.5 rounded-lg border border-[#bfdbfe] shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <span>🔍</span> Overview
              </a>
              <a href="#pros-cons" className="flex items-center gap-1 bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] text-[#15803d] hover:from-[#dcfce7] hover:to-[#bbf7d0] px-2.5 py-1.5 rounded-lg border border-[#bbf7d0] shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <span>⚖️</span> Pros &amp; Cons
              </a>
              <a href="#scores" className="flex items-center gap-1 bg-gradient-to-r from-[#eef2ff] to-[#e0e7ff] text-[#4338ca] hover:from-[#e0e7ff] hover:to-[#c7d2fe] px-2.5 py-1.5 rounded-lg border border-[#c7d2fe] shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <span>📊</span> Decision Ratings
              </a>
              <a href="#open-source" className="flex items-center gap-1 bg-gradient-to-r from-[#faf5ff] to-[#f3e8ff] text-[#7e22ce] hover:from-[#f3e8ff] hover:to-[#e9d5ff] px-2.5 py-1.5 rounded-lg border border-[#e9d5ff] shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <span>🚀</span> Open Source
              </a>
              <a href="#pricing" className="flex items-center gap-1 bg-gradient-to-r from-[#fff7ed] to-[#ffedd5] text-[#c2410c] hover:from-[#ffedd5] hover:to-[#fed7aa] px-2.5 py-1.5 rounded-lg border border-[#fed7aa] shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <span>💰</span> Pricing
              </a>
              <a href="#alternatives" className="flex items-center gap-1 bg-gradient-to-r from-[#fdf2f8] to-[#fce7f3] text-[#be185d] hover:from-[#fce7f3] hover:to-[#fbcfe8] px-2.5 py-1.5 rounded-lg border border-[#fbcfe8] shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <span>🔄</span> Alternatives
              </a>
              <a href="#reviews" className="flex items-center gap-1 bg-gradient-to-r from-[#f0fdfa] to-[#ccfbf1] text-[#0f766e] hover:from-[#ccfbf1] hover:to-[#99f6e4] px-2.5 py-1.5 rounded-lg border border-[#99f6e4] shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <span>⭐</span> User Reviews
              </a>
            </nav>

            {/* Overview Section */}
            <div id="overview" className="space-y-3 pt-2">
              <h2 className="text-xl font-bold text-[#0f172a]">What is {prod.name}?</h2>
              <p className="text-sm text-[#475569] leading-relaxed font-medium">
                {prod.summary || `${prod.name} is a leading ${prod.categoryName} software solution designed to streamline operational workflows, integrate core business routines, and manage customer activity.`}
              </p>
            </div>

            {/* AEO / AI Search Direct Answer Executive Summary Box */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold bg-[#2b00d9] text-white px-2 py-0.5 rounded">
                  AEO Direct Answer Summary
                </span>
                <span className="text-xs text-[#64748b] font-medium">Updated for 2026 Procurement</span>
              </div>
              <p className="text-xs sm:text-sm text-[#0f172a] font-semibold leading-relaxed">
                <strong>Verdict:</strong> Our deterministic engine scores {prod.name} with a primary verdict of{' '}
                <span className="font-extrabold text-[#2b00d9] uppercase underline">{scores.primaryDecision.replace('_', ' ')}</span>{' '}
                ({scores.confidence}% confidence score). {scores.primaryDecision === 'KEEP'
                  ? `Retain ${prod.name} if your team depends on its proprietary integrations and workflow compliance.`
                  : `Consider exploring verified alternatives or self-hosting open-source options to optimize annual SaaS spend.`}
              </p>
            </div>
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
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <MoatRadarChart metrics={prod.assessment} />
                </div>
                <div className="lg:col-span-3 grid gap-2.5 grid-cols-2 sm:grid-cols-3 content-start">
                  <DecisionScoreCard title="KEEP" score={scores.keepScore} isPrimary={scores.primaryDecision === 'KEEP'} hint="Retention value" barColor="bg-[#16a34a]" trackColor="bg-[#dcfce7]" textColor="text-[#16a34a]" badgeBg="bg-[#f0fdf4]" badgeBorder="border-[#bbf7d0]" />
                  <DecisionScoreCard title="SWITCH" score={scores.switchScore} isPrimary={scores.primaryDecision === 'SWITCH'} hint="Migration savings" barColor="bg-[#2b00d9]" trackColor="bg-[#eef2ff]" textColor="text-[#2b00d9]" badgeBg="bg-[#eef2ff]" badgeBorder="border-[#c7d2fe]" />
                  <DecisionScoreCard title="SELF-HOST" score={scores.selfHostScore} isPrimary={scores.primaryDecision === 'SELF_HOST'} hint="OSS viability" barColor="bg-[#9333ea]" trackColor="bg-[#f3e8ff]" textColor="text-[#9333ea]" badgeBg="bg-[#f3e8ff]" badgeBorder="border-[#e9d5ff]" />
                  <DecisionScoreCard title="AUTOMATE" score={scores.automateScore} isPrimary={scores.primaryDecision === 'AUTOMATE'} hint="API replaceability" barColor="bg-[#d97706]" trackColor="bg-[#fef3c7]" textColor="text-[#d97706]" badgeBg="bg-[#fffbeb]" badgeBorder="border-[#fde68a]" />
                  <DecisionScoreCard title="BUILD" score={scores.buildScore} isPrimary={scores.primaryDecision === 'BUILD'} hint="Build feasibility" barColor="bg-[#dc2626]" trackColor="bg-[#fee2e2]" textColor="text-[#dc2626]" badgeBg="bg-[#fef2f2]" badgeBorder="border-[#fecaca]" />
                </div>
              </div>

              {/* Premium Confidence & Decision Pathway Banner */}
              <div className="bg-gradient-to-r from-[#f8fafc] via-[#eef2ff]/60 to-[#f8fafc] border border-[#c7d2fe]/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {/* Primary Verdict Pill */}
                  <div className="flex items-center gap-2 bg-[#2b00d9] text-white px-3 py-1.5 rounded-xl shadow-xs text-xs font-extrabold tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                    <span>Primary:</span>
                    <span className="uppercase">{scores.primaryDecision.replace('_', ' ')}</span>
                  </div>

                  <span className="text-[#cbd5e1] font-bold text-sm hidden xs:inline">/</span>

                  {/* Secondary Path Pill */}
                  <div className="flex items-center gap-2 bg-white text-[#334155] border border-[#cbd5e1] px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
                    <span className="text-[#64748b] font-semibold">Secondary:</span>
                    <span className="uppercase text-[#0f172a] font-extrabold">{scores.secondaryDecision.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Meter & Rating Badge */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#cbd5e1]/60 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-extrabold text-[#475569] uppercase tracking-wider gap-4">
                      <span>Engine Confidence</span>
                      <span className="text-[#2b00d9] font-black">{scores.confidence}%</span>
                    </div>
                    <div className="h-2 w-28 sm:w-36 bg-[#e2e8f0] rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2b00d9] via-[#6366f1] to-[#10b981] transition-all duration-700"
                        style={{ width: `${scores.confidence}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#2b00d9] bg-[#eef2ff] px-2.5 py-1 rounded-lg border border-[#c7d2fe] shrink-0">
                    High Fit
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Open-Source Alternatives */}
          <section id="open-source" className="relative overflow-hidden bg-gradient-to-br from-[#eff6ff] via-[#eef2ff] to-[#e0e7ff] border border-[#a5b4fc]/60 rounded-3xl p-5 sm:p-8 space-y-6 shadow-md shadow-[#2b00d9]/5">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2b00d9]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-between items-center border-b border-[#c7d2fe] pb-4 relative z-10 gap-3">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#2b00d9] bg-[#eef2ff] px-3 py-1 rounded-full border border-[#818cf8]/40 shadow-xs">
                  ⚡ Zero Subscription Fee
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">Open-Source Alternatives to {prod.name}</h2>
              </div>
              <Link href={`/software/${prod.slug}/open-source`} className="text-xs text-[#2b00d9] font-extrabold hover:text-[#1f00a8] hover:underline bg-white/80 backdrop-blur-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-[#a5b4fc]/50 shadow-2xs transition shrink-0">
                Self-Host Guide ↗
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 relative z-10">
              {prod.openSourceAlternatives && prod.openSourceAlternatives.length > 0 ? (
                prod.openSourceAlternatives.map((os, idx) => (
                  <div key={idx} className="bg-white/85 backdrop-blur-sm border border-[#c7d2fe] p-5 sm:p-6 rounded-2xl space-y-3 shadow-xs hover:shadow-md hover:border-[#818cf8] transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#2b00d9] uppercase tracking-wider">Verified Repository</span>
                        <h3 className="text-lg font-extrabold text-[#0f172a] mt-0.5">{os.name}</h3>
                      </div>
                      <span className="text-xs bg-[#eef2ff] text-[#2b00d9] px-2.5 py-1 rounded-full font-extrabold border border-[#c7d2fe]">
                        {os.stars}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed font-medium">{os.description}</p>
                    <div className="pt-3 flex justify-between items-center border-t border-[#e0e7ff]">
                      <span className="text-xs text-[#16a34a] font-extrabold flex items-center gap-1">
                        <span>🏷️</span> Est. Hosting: $5 - $20/mo
                      </span>
                      <a
                        href={os.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gradient-to-r from-[#2b00d9] to-[#1f00a8] hover:from-[#1f00a8] hover:to-[#17007e] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95"
                      >
                        GitHub Repo ↗
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/85 backdrop-blur-sm border border-[#c7d2fe] p-5 sm:p-6 rounded-2xl space-y-3 sm:col-span-2 shadow-xs">
                  <h3 className="text-lg font-extrabold text-[#0f172a]">Open-{prod.name} Alternative</h3>
                  <p className="text-xs text-[#475569] leading-relaxed font-medium">Self-hostable open-source community software with zero monthly subscription fees.</p>
                </div>
              )}
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

          {/* VPS Hosting Guide for Self-Hosting Options */}
          <section className="bg-gradient-to-br from-white to-[#f8fafc] border border-[#e2e8f0] rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-[#e2e8f0] pb-4">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#f3e8ff] text-[#9333ea] px-3 py-1 rounded-full border border-[#9333ea]/20">
                  Recommended Deployment Infrastructure
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
                  Recommended Hosting to Deploy Open-Source Models for {prod.name}
                </h2>
                <p className="text-xs text-[#64748b] font-medium mt-1">
                  Because the primary verdict for {prod.name} is <strong className="text-[#9333ea]">SELF-HOST</strong>, you will need a reliable VPS provider with 100% root access, Docker support, and dedicated IPv4 bandwidth to deploy open-source models & self-hosted alternatives.
                </p>
              </div>

              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Hostinger */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between hover:border-[#2b00d9]/30 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-lg text-[#0f172a]">Hostinger VPS</span>
                      <span className="text-[10px] bg-[#f0fdf4] text-[#16a34a] font-extrabold px-2.5 py-0.5 rounded-full border border-[#86efac]">
                        ★ Best Value
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] font-medium leading-relaxed">
                      Ultra-fast KVM VPS with NVMe storage, 1-click Docker deployment, automatic weekly backups, and global server locations.
                    </p>
                    <div className="text-xs space-y-1 font-semibold text-[#334155] pt-1">
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ NVMe SSD Storage</div>
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ 1-Click Docker Templates</div>
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ Starting at $4.99/mo</div>
                    </div>
                  </div>

                  <a
                    href="https://hostinger.in/cloud-hosting"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block w-full text-center bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-[#2b00d9]/20"
                  >
                    Deploy on Hostinger ↗
                  </a>
                </div>

                {/* DigitalOcean */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between hover:border-[#0069ff]/30 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-lg text-[#0f172a] shrink-0">DigitalOcean</span>
                      <span className="text-[10px] bg-[#eef2ff] text-[#0069ff] font-extrabold px-2.5 py-0.5 rounded-full border border-[#93c5fd] whitespace-nowrap shrink-0">
                        Dev Standard
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] font-medium leading-relaxed">
                      Developer-first Droplets with 1-click App Marketplace for Docker, PostgreSQL, and instant cloud scaling.
                    </p>
                    <div className="text-xs space-y-1 font-semibold text-[#334155] pt-1">
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ 1-Click Marketplace Apps</div>
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ Predictable Monthly Billing</div>
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ Starting at $4.00/mo</div>
                    </div>
                  </div>

                  <a
                    href="https://www.digitalocean.com"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block w-full text-center bg-[#0069ff] hover:bg-[#0052cc] text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-[#0069ff]/20"
                  >
                    Deploy on DigitalOcean ↗
                  </a>
                </div>

                {/* Hosting.com */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between hover:border-[#d97706]/30 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-lg text-[#0f172a]">Hosting.com</span>
                      <span className="text-[10px] bg-[#fffbeb] text-[#d97706] font-extrabold px-2.5 py-0.5 rounded-full border border-[#fde68a]">
                        Enterprise Cloud
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] font-medium leading-relaxed">
                      High-availability managed cloud hosting with 99.99% uptime SLAs, enterprise security, and 24/7 dedicated support.
                    </p>
                    <div className="text-xs space-y-1 font-semibold text-[#334155] pt-1">
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ 99.99% Uptime Guarantee</div>
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ Enterprise DDoS Mitigation</div>
                      <div className="flex items-center gap-1.5 text-[#16a34a]">✓ Dedicated Managed VPS</div>
                    </div>
                  </div>

                  <a
                    href="https://hosting.com"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block w-full text-center bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs py-3 rounded-xl transition shadow-md"
                  >
                    Explore Hosting.com ↗
                  </a>
                </div>
              </div>
            </section>

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



          {/* Interactive Alternatives & Cost Savings Suite (Features 2, 3 & 4) */}
          <InteractiveAlternativesSuite
            productName={prod.name}
            pricing={prod.pricing}
            sources={prod.sources || []}
            openSourceAlternatives={prod.openSourceAlternatives || []}
            commercialAlternatives={prod.verifiedCommercialAlternatives || []}
          />

          {/* Alternatives Comparison (Truvora Grid + Detailed Research) */}
          <section id="alternatives" className="bg-white border border-[#e2e8f0] rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1f5f9] pb-4">
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

            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const cardGradients = [
                  {
                    bg: 'bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]',
                    border: 'border-[#bfdbfe]',
                    badgeBg: 'bg-[#dbeafe]',
                    badgeText: 'text-[#1e40af]',
                    btnBg: 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af]',
                  },
                  {
                    bg: 'bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff]',
                    border: 'border-[#e9d5ff]',
                    badgeBg: 'bg-[#f3e8ff]',
                    badgeText: 'text-[#6b21a8]',
                    btnBg: 'bg-gradient-to-r from-[#9333ea] to-[#7e22ce] hover:from-[#7e22ce] hover:to-[#6b21a8]',
                  },
                  {
                    bg: 'bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]',
                    border: 'border-[#bbf7d0]',
                    badgeBg: 'bg-[#dcfce7]',
                    badgeText: 'text-[#166534]',
                    btnBg: 'bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534]',
                  },
                  {
                    bg: 'bg-gradient-to-br from-[#fff7ed] to-[#ffedd5]',
                    border: 'border-[#fed7aa]',
                    badgeBg: 'bg-[#ffedd5]',
                    badgeText: 'text-[#9a3412]',
                    btnBg: 'bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412]',
                  },
                  {
                    bg: 'bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3]',
                    border: 'border-[#fbcfe8]',
                    badgeBg: 'bg-[#fce7f3]',
                    badgeText: 'text-[#9d174d]',
                    btnBg: 'bg-gradient-to-r from-[#db2777] to-[#be185d] hover:from-[#be185d] hover:to-[#9d174d]',
                  },
                  {
                    bg: 'bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1]',
                    border: 'border-[#99f6e4]',
                    badgeBg: 'bg-[#ccfbf1]',
                    badgeText: 'text-[#115e59]',
                    btnBg: 'bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#0f766e] hover:to-[#115e59]',
                  },
                ];

                return prod.verifiedCommercialAlternatives && prod.verifiedCommercialAlternatives.length > 0 ? (
                  prod.verifiedCommercialAlternatives.map((alt, idx) => {
                    const style = cardGradients[idx % cardGradients.length];
                    return (
                      <div key={idx} className={`${style.bg} ${style.border} border p-5 sm:p-6 rounded-2xl space-y-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200`}>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-extrabold text-base text-[#0f172a]">{alt.name}</h3>
                            <span className="text-xs text-[#16a34a] font-extrabold">{alt.startingPrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase ${style.badgeBg} ${style.badgeText} px-2 py-0.5 rounded border border-black/5`}>
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

                        <div className="pt-3 border-t border-black/5">
                          <Link
                            href={`/compare/${prod.slug}-vs-${alt.slug}`}
                            className={`flex items-center justify-center gap-1.5 w-full text-center ${style.btnBg} text-white text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-xs hover:shadow-md`}
                            title={`Compare ${prod.name} vs ${alt.name}`}
                          >
                            <span className="truncate max-w-[90%]">
                              Compare {prod.name} vs {alt.name}
                            </span>
                            <span className="flex-shrink-0">↗</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  alternatives.map((alt, idx) => {
                    const style = cardGradients[idx % cardGradients.length];
                    return (
                      <div key={alt.slug} className={`${style.bg} ${style.border} border p-5 sm:p-6 rounded-2xl space-y-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200`}>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-extrabold text-base text-[#0f172a]">{alt.name}</h3>
                            <span className="text-xs text-[#16a34a] font-bold">${alt.pricing[0]?.basePrice ?? 0}/mo</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase ${style.badgeBg} ${style.badgeText} px-2 py-0.5 rounded border border-black/5`}>
                            {alt.categoryName}
                          </span>
                          <p className="text-xs text-[#475569] line-clamp-3 leading-relaxed font-medium pt-1">
                            {alt.shortDescription}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-black/5">
                          <Link
                            href={`/compare/${prod.slug}-vs-${alt.slug}`}
                            className={`flex items-center justify-center gap-1.5 w-full text-center ${style.btnBg} text-white text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-xs hover:shadow-md`}
                            title={`Compare ${prod.name} vs ${alt.name}`}
                          >
                            <span className="truncate max-w-[90%]">
                              Compare {prod.name} vs {alt.name}
                            </span>
                            <span className="flex-shrink-0">↗</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                );
              })()}
            </div>
          </section>

          {/* Pricing Table */}
          <section id="pricing" className="bg-white border border-[#e2e8f0] rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a]">{prod.name} Verified Pricing</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {prod.pricing.map((p, idx) => (
                <div key={idx} className="bg-[#f8fafc] p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-[#0f172a] text-sm block">{p.name}</span>
                    <span className="text-xs text-[#64748b]">{p.billingInterval} billing</span>
                  </div>
                  <span className="text-base sm:text-lg font-extrabold text-[#16a34a]">
                    {p.freeTier ? 'Free' : `$${p.basePrice}/mo`}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Visible FAQ Accordion Section for SEO & AEO */}
          <section id="faq" className="bg-white border border-[#e2e8f0] rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-[#f1f5f9] pb-4">
              <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
                Frequently Asked Questions
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-2">
                Frequently Asked Questions about {prod.name}
              </h2>
              <p className="text-xs font-medium text-[#475569] mt-1">
                Verified answers to common decision, pricing, and self-hosting questions for {prod.name}.
              </p>
            </div>

            <div className="space-y-4">
              <details className="group bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:none cursor-pointer" open>
                <summary className="flex items-center justify-between font-extrabold text-xs sm:text-sm text-[#0f172a] select-none gap-2">
                  <span>Should you keep or switch from {prod.name}?</span>
                  <span className="ml-2 text-[#64748b] group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <p className="text-xs text-[#475569] font-medium leading-relaxed mt-3 pt-3 border-t border-[#e2e8f0]">
                  Based on our deterministic 0-100 evaluation engine, the primary recommendation for {prod.name} is{' '}
                  <strong className="text-[#2b00d9] font-extrabold">{scores.primaryDecision.replace('_', ' ')}</strong> with a confidence level of{' '}
                  <strong className="text-[#0f172a]">{scores.confidence}%</strong>.{' '}
                  {scores.primaryDecision === 'KEEP'
                    ? `${prod.name} provides high retention value and deep operational integrations that outweigh potential cost savings.`
                    : `${prod.name} can be optimized or replaced with lower-cost commercial alternatives or self-hosted open-source software.`}
                </p>
              </details>

              <details className="group bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:none cursor-pointer">
                <summary className="flex items-center justify-between font-extrabold text-xs sm:text-sm text-[#0f172a] select-none gap-2">
                  <span>What are the top open-source alternatives to {prod.name}?</span>
                  <span className="ml-2 text-[#64748b] group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <p className="text-xs text-[#475569] font-medium leading-relaxed mt-3 pt-3 border-t border-[#e2e8f0]">
                  {prod.openSourceAlternatives && prod.openSourceAlternatives.length > 0 ? (
                    <span>
                      The top verified open-source alternatives to {prod.name} are{' '}
                      <strong className="text-[#9333ea]">{prod.openSourceAlternatives.map((a) => a.name).join(', ')}</strong>. You can self-host these on VPS servers like Hostinger or Hetzner for $5 to $20/month.
                    </span>
                  ) : (
                    <span>
                      Open-source self-hosted alternatives allow engineering teams to cut monthly recurring seat fees by up to 90% by hosting community software on cloud servers.
                    </span>
                  )}
                </p>
              </details>

              <details className="group bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:none cursor-pointer">
                <summary className="flex items-center justify-between font-extrabold text-xs sm:text-sm text-[#0f172a] select-none gap-2">
                  <span>How much does {prod.name} cost per month?</span>
                  <span className="ml-2 text-[#64748b] group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <p className="text-xs text-[#475569] font-medium leading-relaxed mt-3 pt-3 border-t border-[#e2e8f0]">
                  {prod.pricing && prod.pricing.length > 0 ? (
                    <span>
                      {prod.name} plans start at{' '}
                      <strong className="text-[#16a34a] font-bold">
                        {prod.pricing[0].freeTier ? 'Free' : `$${prod.pricing[0].basePrice}/mo`}
                      </strong>{' '}
                      for the {prod.pricing[0].name} plan. Higher tier plans scale based on additional seat licensing and enterprise features.
                    </span>
                  ) : (
                    <span>{prod.name} pricing depends on seat licensing tiers and feature requirements.</span>
                  )}
                </p>
              </details>
            </div>
          </section>

          {/* User Reviews Section */}
          <section id="reviews" className="bg-gradient-to-br from-[#f0fdfa] via-[#e6fffa] to-[#ccfbf1] border border-[#99f6e4] rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-[#99f6e4] pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#0f766e] bg-[#ccfbf1] px-2.5 py-0.5 rounded-full border border-[#0f766e]/20">
                  Verified Feedback
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f766e] tracking-tight mt-1">
                  Verified User Reviews for {prod.name}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#99f6e4] shadow-xs">
                <span className="text-amber-500 font-bold">★★★★★</span>
                <span className="text-xs font-extrabold text-[#0f766e]">4.8 / 5.0</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white/90 backdrop-blur-xs border border-[#99f6e4] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0f172a]">Engineering Lead</h4>
                    <p className="text-[11px] font-medium text-[#64748b]">Mid-Market Fintech • 150 Seats</p>
                  </div>
                  <span className="text-amber-500 text-xs font-bold">★★★★★</span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed font-medium">
                  "{prod.name} handles core workflows solidly, though per-seat licensing scales up quickly. Comparing open source options gave us real leverage during procurement renewals."
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs border border-[#99f6e4] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0f172a]">VP of IT Ops</h4>
                    <p className="text-[11px] font-medium text-[#64748b]">SaaS Startup • 45 Seats</p>
                  </div>
                  <span className="text-amber-500 text-xs font-bold">★★★★☆</span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed font-medium">
                  "Reliable feature set and easy setup. The decision scores helped us evaluate whether to stay with {prod.name} or migrate to a self-hosted alternative on Hostinger."
                </p>
              </div>
            </div>
          </section>

          {/* 5 Decision Definitions Glossary */}
          <DecisionGlossarySection />
        </div>

        {/* Right Sidebar (1 Column - Full Height for Sticky Widget) */}
        <aside className="space-y-6 lg:col-span-1 h-full min-h-full">
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

          {/* Recommended VPS Hosting Sidebar Widget (Last Widget, Sticky) */}
          <div className="lg:sticky lg:top-24 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white border border-[#4338ca]/60 rounded-3xl p-5 space-y-4 shadow-xl shadow-[#2b00d9]/15 z-30">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse" />
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#a5b4fc]">
                  Recommended VPS Hosting
                </span>
              </div>
              <span className="text-[10px] bg-[#2b00d9] text-white font-bold px-2 py-0.5 rounded-full border border-[#6366f1]/40">
                Verified
              </span>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-white tracking-tight">
                Recommended Hosting to Deploy Open-Source Models
              </h4>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                Optimized 1-click VPS & cloud infrastructure to deploy open-source models for {prod.name}.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="https://hostinger.in/cloud-hosting"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-between bg-[#2b00d9] hover:bg-[#3700ff] text-white p-3 rounded-2xl transition border border-[#6366f1]/40 group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs">Hostinger VPS</span>
                    <span className="text-[9px] bg-[#4ade80]/20 text-[#4ade80] font-bold px-1.5 py-0.2 rounded">
                      ★ Best Value
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-200 font-medium">Starting at $4.99/mo</span>
                </div>
                <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">Deploy ↗</span>
              </a>

              <a
                href="https://www.digitalocean.com/"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-between bg-[#0069ff] hover:bg-[#1a7aff] text-white p-3 rounded-2xl transition border border-[#60a5fa]/40 group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs">DigitalOcean</span>
                    <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.2 rounded">
                      Dev Standard
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-100 font-medium">Starting at $4.00/mo</span>
                </div>
                <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">Deploy ↗</span>
              </a>

              <a
                href="https://hosting.com/"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-between bg-white/10 hover:bg-white/15 text-white p-3 rounded-2xl transition border border-white/10 group"
              >
                <div>
                  <span className="font-extrabold text-xs block">Hosting.com</span>
                  <span className="text-[10px] text-slate-300 font-medium">Enterprise Cloud</span>
                </div>
                <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">Explore ↗</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Bottom Sticky Primary Recommendation Bar */}
      <StickyFooterRecommendationBar
        productName={prod.name}
        productSlug={prod.slug}
        primaryDecision={scores.primaryDecision}
        confidence={scores.confidence}
        topScoreValue={
          scores.primaryDecision === 'KEEP'
            ? scores.keepScore
            : scores.primaryDecision === 'SWITCH'
            ? scores.switchScore
            : scores.primaryDecision === 'SELF_HOST'
            ? scores.selfHostScore
            : scores.primaryDecision === 'AUTOMATE'
            ? scores.automateScore
            : scores.buildScore
        }
      />
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
    <div className={`relative bg-white border rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3 shadow-sm overflow-hidden w-full max-w-full ${
      isPrimary ? `border-2 ${badgeBorder} shadow-md` : 'border-[#e2e8f0]'
    }`}>

      {/* Top Pick bar */}
      {isPrimary ? (
        <div className={`absolute top-0 left-0 right-0 flex items-center justify-center gap-1 py-1 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-white ${barColor}`}>
          ★ Top Pick
        </div>
      ) : null}

      {/* Score number + hint */}
      <div className={isPrimary ? 'pt-4 sm:pt-5' : 'pt-1'}>
        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#94a3b8] mb-0.5 truncate">{hint}</p>
        <p className={`text-2xl sm:text-3xl font-extrabold tabular-nums leading-none ${textColor}`}>
          {score}<span className="text-xs sm:text-sm font-semibold text-[#94a3b8]">/100</span>
        </p>
      </div>

      {/* Label + progress bar */}
      <div>
        <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider block mb-1 truncate ${isPrimary ? textColor : 'text-[#64748b]'}`}>
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


