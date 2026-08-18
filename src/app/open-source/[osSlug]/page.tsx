import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOpenSourceToolBySlug, getAllUniqueOpenSourceTools } from '@/domain/catalog-service';
import { getOssTechnicalProfile } from '@/domain/oss-guide-service';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ osSlug: string }>;
}): Promise<Metadata> {
  const { osSlug } = await params;
  const tool = getOpenSourceToolBySlug(osSlug);
  if (!tool) return {};

  const profile = getOssTechnicalProfile(tool);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';
  const replacedNames = tool.replacedProducts.slice(0, 3).map((p) => p.name).join(', ');

  return {
    title: `${tool.name} Self-Hosting Guide: Free Open Source Alternative to ${replacedNames || 'Commercial SaaS'}`,
    description: `Step-by-step action guide to self-hosting ${tool.name} with Docker Compose. Replace ${replacedNames} with zero monthly seat fees and 100% data sovereignty.`,
    keywords: [
      tool.name,
      `${tool.name} self host`,
      `${tool.name} docker compose`,
      `${tool.name} review`,
      `${tool.name} vs ${tool.replacedProducts[0]?.name || 'SaaS'}`,
      `how to install ${tool.name}`,
      `open source ${profile.functionalRole}`,
    ],
    openGraph: {
      title: `${tool.name} Production Self-Hosting Guide & Docker Runbook`,
      description: `Complete technical deployment runbook for ${tool.name}. Includes Docker Compose, hardware specs, reverse proxy, and migration checklist.`,
      images: [
        {
          url: '/saas-decision.webp',
          width: 1200,
          height: 630,
          alt: `${tool.name} Open Source Deployment Guide`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} Production Self-Hosting Guide & Docker Runbook`,
      description: `Deploy ${tool.name} with Docker Compose and replace expensive SaaS tools.`,
      images: [`${baseUrl}/saas-decision.webp`],
    },
  };
}

export default async function OpenSourceToolPage({
  params,
}: {
  params: Promise<{ osSlug: string }>;
}) {
  const { osSlug } = await params;
  const tool = getOpenSourceToolBySlug(osSlug);
  if (!tool) notFound();

  const profile = getOssTechnicalProfile(tool);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';
  const replacedPrimary = tool.replacedProducts[0]?.name || 'Commercial SaaS';

  // Schema.org HowTo Schema for Step-by-Step Deployment
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Self-Host ${tool.name} using Docker Compose`,
    description: `Complete step-by-step technical guide to deploy ${tool.name} on a Linux VPS and replace commercial SaaS tools like ${replacedPrimary}.`,
    step: profile.migrationSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.detail,
    })),
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.categoryName,
    operatingSystem: 'Linux, Docker, Self-Hosted',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: `${baseUrl}/open-source/${tool.slug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What commercial SaaS products does ${tool.name} replace?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool.name} is a verified self-hosted replacement for ${tool.replacedProducts.map((p) => p.name).join(', ')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the minimum hardware requirements to self-host ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Minimum specs: ${profile.hardwareMin.cpu}, ${profile.hardwareMin.ram}, ${profile.hardwareMin.disk}. Recommended: ${profile.hardwareRec.cpu}, ${profile.hardwareRec.ram}, ${profile.hardwareRec.disk}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${tool.name} free to use and self-host for commercial teams?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${tool.name} is open-source (${tool.license || 'Open Source License'}). You can run unlimited team users on your own server with $0 monthly seat fees.`,
        },
      },
    ],
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-6 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href="/open-source" className="hover:text-[#2b00d9] transition">Open Source Directory</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{tool.name}</span>
      </nav>

      {/* Hero Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#f3e8ff] text-[#9333ea] px-3 py-1 rounded-full border border-[#9333ea]/20">
              Verified Open-Source Platform
            </span>
            <span className="text-xs font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-[#86efac]">
              $0 Monthly Seat Fees
            </span>
          </div>
          <a
            href={tool.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-2 shadow-sm"
          >
            <span>GitHub Repository</span>
            <span>↗</span>
          </a>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
            {tool.name} Production Self-Hosting Guide & Runbook
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#9333ea]">
            {profile.functionalRole}
          </p>
          <p className="text-sm text-[#475569] max-w-3xl leading-relaxed">
            {profile.subheadline}
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
            <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider block">Primary Replaces</span>
            <span className="text-sm font-black text-[#0f172a] mt-0.5 block">{replacedPrimary} (+{tool.replacedProducts.length - 1} more)</span>
          </div>
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
            <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider block">Recommended RAM</span>
            <span className="text-sm font-black text-[#2b00d9] mt-0.5 block">{profile.hardwareRec.ram} ({profile.hardwareMin.ram} min)</span>
          </div>
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
            <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider block">License</span>
            <span className="text-sm font-black text-[#16a34a] mt-0.5 block">{tool.license || 'Open Source (AGPL/MIT)'}</span>
          </div>
        </div>
      </div>

      {/* 3-Year TCO Savings Section */}
      <section className="bg-gradient-to-br from-[#f0fdf4] to-white border border-[#86efac]/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#bbf7d0] pb-4 flex flex-wrap justify-between items-center gap-2">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-[#16a34a] bg-white px-2.5 py-0.5 rounded-full border border-[#86efac]">
              SaaS Cost Elimination
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
              💰 TCO Comparison: {tool.name} vs Proprietary SaaS
            </h2>
          </div>
          <span className="text-xs font-bold text-[#16a34a] bg-white px-3 py-1 rounded-xl border border-[#86efac]">
            Save up to 97% Annually
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-[#bbf7d0] bg-white/80 text-[#334155] uppercase font-extrabold">
                <th className="p-3.5 rounded-l-xl">Team Size</th>
                <th className="p-3.5 text-center">{replacedPrimary} Annual Cost</th>
                <th className="p-3.5 text-center font-bold text-[#16a34a]">{tool.name} VPS Hosting</th>
                <th className="p-3.5 text-center font-black text-[#16a34a] rounded-r-xl">Annual Dollar Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcfce7] font-medium text-[#0f172a]">
              {profile.tcoComparison.map((row) => (
                <tr key={row.teamSize} className="hover:bg-white/60 transition">
                  <td className="p-3.5 font-bold">{row.teamSize} Active Team Members</td>
                  <td className="p-3.5 text-center text-[#dc2626] font-bold">${row.saasAnnualCost.toLocaleString()} / yr</td>
                  <td className="p-3.5 text-center text-[#16a34a] font-bold">${row.vpsAnnualCost.toLocaleString()} / yr</td>
                  <td className="p-3.5 text-center font-black text-[#16a34a] bg-white/60">
                    Save ${row.annualSavings.toLocaleString()} / yr ({row.savingsPercent}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Parity & Privacy Matrix */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Feature Comparison
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            {tool.name} vs {replacedPrimary}: Feature & Privacy Breakdown
          </h2>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#475569] uppercase font-extrabold">
                <th className="p-3.5 rounded-l-xl">Evaluation Attribute</th>
                <th className="p-3.5 text-center font-black text-[#9333ea] w-2/5">{tool.name} (Self-Hosted)</th>
                <th className="p-3.5 text-center font-black text-[#0f172a] w-2/5 rounded-r-xl">{replacedPrimary} (SaaS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] font-medium text-[#0f172a]">
              {profile.featureMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f8fafc]/80 transition">
                  <td className="p-3.5 font-bold text-[#334155]">{row.feature}</td>
                  <td className="p-3.5 text-center font-bold text-[#16a34a] bg-[#f0fdf4]/50">{row.ossValue}</td>
                  <td className="p-3.5 text-center text-[#64748b]">{row.saasValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* System Requirements & Hardware Specifications */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Architecture Specs
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            Server Hardware & System Requirements
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Minimum Specs */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2">
              <h3 className="font-extrabold text-sm text-[#0f172a]">Minimum Hardware (Testing / Small Team)</h3>
              <span className="text-[10px] bg-[#e2e8f0] text-[#64748b] font-bold px-2 py-0.5 rounded">1-5 Users</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-[#334155]">
              <div className="flex justify-between"><span className="text-[#64748b]">vCPU:</span> <span>{profile.hardwareMin.cpu}</span></div>
              <div className="flex justify-between"><span className="text-[#64748b]">Memory (RAM):</span> <span>{profile.hardwareMin.ram}</span></div>
              <div className="flex justify-between"><span className="text-[#64748b]">Storage:</span> <span>{profile.hardwareMin.disk}</span></div>
              <div className="flex justify-between"><span className="text-[#64748b]">Database:</span> <span>{profile.dbEngine}</span></div>
            </div>
          </div>

          {/* Recommended Specs */}
          <div className="bg-[#f8fafc] border border-[#2b00d9]/30 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2">
              <h3 className="font-extrabold text-sm text-[#2b00d9]">Recommended Hardware (Production)</h3>
              <span className="text-[10px] bg-[#eef2ff] text-[#2b00d9] font-bold px-2 py-0.5 rounded">Production Grade</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-[#334155]">
              <div className="flex justify-between"><span className="text-[#64748b]">vCPU:</span> <span className="font-bold text-[#0f172a]">{profile.hardwareRec.cpu}</span></div>
              <div className="flex justify-between"><span className="text-[#64748b]">Memory (RAM):</span> <span className="font-bold text-[#0f172a]">{profile.hardwareRec.ram}</span></div>
              <div className="flex justify-between"><span className="text-[#64748b]">Storage:</span> <span className="font-bold text-[#0f172a]">{profile.hardwareRec.disk}</span></div>
              <div className="flex justify-between"><span className="text-[#64748b]">Database:</span> <span className="font-bold text-[#0f172a]">{profile.dbEngine}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Runbook: Docker Compose Deployment */}
      <section className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#818cf8] tracking-wider">
              Production Runbook
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Step-by-Step Docker Compose Deployment
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded">docker-compose.yml</span>
        </div>

        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">1</span>
            <h3>{profile.migrationSteps[0].title}</h3>
          </div>
          <p className="text-xs text-slate-300">{profile.migrationSteps[0].detail}</p>
          {profile.migrationSteps[0].command && (
            <pre className="text-xs font-mono bg-slate-900/90 p-3.5 rounded-xl overflow-x-auto text-emerald-400 border border-slate-800 leading-relaxed">
              <code>{profile.migrationSteps[0].command}</code>
            </pre>
          )}
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">2</span>
            <h3>{profile.migrationSteps[1].title}</h3>
          </div>
          <p className="text-xs text-slate-300">{profile.migrationSteps[1].detail}</p>
          {profile.migrationSteps[1].command && (
            <pre className="text-xs font-mono bg-slate-900/90 p-3.5 rounded-xl overflow-x-auto text-amber-300 border border-slate-800 leading-relaxed">
              <code>{profile.migrationSteps[1].command}</code>
            </pre>
          )}
        </div>

        {/* Step 3: Production docker-compose.yml */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">3</span>
              <h3>Production <code className="text-xs text-indigo-200">docker-compose.yml</code> Architecture</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">docker-compose.yml</span>
          </div>
          <pre className="text-xs font-mono bg-slate-900/90 p-4 rounded-xl overflow-x-auto text-emerald-400 border border-slate-800 leading-relaxed">
            <code>{profile.dockerComposeYaml}</code>
          </pre>
        </div>

        {/* Step 4 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">4</span>
            <h3>{profile.migrationSteps[2].title}</h3>
          </div>
          <p className="text-xs text-slate-300">{profile.migrationSteps[2].detail}</p>
          {profile.migrationSteps[2].command && (
            <pre className="text-xs font-mono bg-slate-900/90 p-3.5 rounded-xl overflow-x-auto text-emerald-400 border border-slate-800 leading-relaxed">
              <code>{profile.migrationSteps[2].command}</code>
            </pre>
          )}
        </div>

        {/* Step 5: Caddy Reverse Proxy */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">5</span>
            <h3>Automatic HTTPS & SSL Reverse Proxy (<code className="text-xs text-indigo-200">Caddy</code>)</h3>
          </div>
          <p className="text-xs text-slate-300">Issue free automatic Let's Encrypt certificates and proxy traffic to port {profile.ports[0]}.</p>
          <pre className="text-xs font-mono bg-slate-900/90 p-3.5 rounded-xl overflow-x-auto text-sky-300 border border-slate-800 leading-relaxed">
            <code>{profile.caddyConfig}</code>
          </pre>
        </div>
      </section>

      {/* Production Pro-Tips & Best Practices */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#d97706] bg-[#fffbeb] px-2.5 py-0.5 rounded-full border border-[#fde68a]">
            Production Stability
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            ⚡ DevOps Best Practices for {tool.name}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {profile.proTips.map((tip, idx) => (
            <div key={idx} className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-[#2b00d9]">Tip #{idx + 1}</span>
              <p className="text-xs text-[#475569] font-medium leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commercial SaaS Platforms Replaced Section */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Replaces Commercial Tools
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            Commercial SaaS Replaced by {tool.name} ({tool.replacedProducts.length})
          </h2>
          <p className="text-xs text-[#64748b] font-medium mt-1">
            Click on any commercial software to view its deterministic decision intelligence review and pricing teardown.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {tool.replacedProducts.map((p) => (
            <Link
              key={p.slug}
              href={`/software/${p.slug}`}
              className="bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#2b00d9] p-5 rounded-2xl space-y-2 transition shadow-sm hover:bg-white group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[#0f172a] group-hover:text-[#2b00d9] transition">
                    {p.name}
                  </h3>
                  <span className="text-[10px] bg-[#e2e8f0] text-[#64748b] px-2 py-0.5 rounded font-semibold">
                    {p.categoryName?.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] font-medium line-clamp-2">
                  {p.shortDescription}
                </p>
              </div>
              <div className="pt-3 text-[11px] font-bold text-[#2b00d9] flex items-center justify-between border-t border-[#e2e8f0]/60">
                <span>View Decision Score</span>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended VPS Providers */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-[#16a34a]/20">
            Infrastructure Recommendation
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            Recommended VPS Infrastructure for {tool.name}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3 flex flex-col justify-between hover:border-[#2b00d9]/40 transition">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#16a34a]">★ Best Value for Production</span>
              <h3 className="text-lg font-black text-[#0f172a]">Hostinger KVM VPS</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-medium">
                High-performance NVMe SSDs, 1-click Docker OS template, automated weekly backups, and dedicated IPv4 starting at $4.99/mo.
              </p>
            </div>
            <a
              href="https://hostinger.in/cloud-hosting"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-center font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
            >
              Deploy on Hostinger ↗
            </a>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3 flex flex-col justify-between hover:border-[#0069ff]/40 transition">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0069ff]">Developer Standard</span>
              <h3 className="text-lg font-black text-[#0f172a]">DigitalOcean Droplets</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-medium">
                Fast developer droplet instances, 1-click Docker Marketplace app, floating IPs, and managed databases starting at $4.00/mo.
              </p>
            </div>
            <a
              href="https://www.digitalocean.com"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-[#0069ff] hover:bg-[#0052cc] text-white text-center font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
            >
              Deploy on DigitalOcean ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
