import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllUniqueOpenSourceTools } from '@/domain/catalog-service';

export const metadata: Metadata = {
  title: 'Open Source SaaS Alternatives Directory (2026) | SaaS Decision',
  description: 'Explore 325+ verified open-source software tools that replace commercial SaaS products. Free, self-hostable, with zero seat fees and 100% data sovereignty.',
  keywords: [
    'open source software directory',
    'open source saas alternatives',
    'self-hosted software',
    'free open source alternatives',
    'docker compose saas',
    'data sovereignty tools',
  ],
};

export default function OpenSourceDirectoryPage() {
  const allOss = getAllUniqueOpenSourceTools();

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-10 space-y-4 shadow-sm text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f3e8ff] text-[#9333ea] border border-[#9333ea]/20 text-xs font-extrabold uppercase tracking-wider">
          <span>⚡ 100% Data Sovereignty & Zero Seat Cost</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          Verified Open-Source SaaS Directory
        </h1>
        <p className="text-sm sm:text-base font-medium text-[#475569] max-w-2xl mx-auto leading-relaxed">
          Index of {allOss.length} production-ready, self-hostable open-source software projects mapped directly to the expensive commercial SaaS platforms they replace.
        </p>
      </div>

      {/* Value Proposition Highlights */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-2xl">💸</span>
          <h3 className="font-extrabold text-base text-[#0f172a]">$0 Monthly Seat Fees</h3>
          <p className="text-xs text-[#475569] leading-relaxed">
            Run unlimited users and projects on a $5-$10/month VPS instead of paying $20-$100 per seat per month.
          </p>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-2xl">🔒</span>
          <h3 className="font-extrabold text-base text-[#0f172a]">100% Data Sovereignty</h3>
          <p className="text-xs text-[#475569] leading-relaxed">
            Comply with GDPR, HIPAA, and SOC2 by keeping all database records and user analytics on your private servers.
          </p>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-2xl">🐳</span>
          <h3 className="font-extrabold text-base text-[#0f172a]">Docker & K8s Ready</h3>
          <p className="text-xs text-[#475569] leading-relaxed">
            Deploy in seconds via official Docker Compose files on Hostinger, DigitalOcean, or Hetzner.
          </p>
        </div>
      </div>

      {/* Directory Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9333ea] bg-[#f3e8ff] px-2.5 py-0.5 rounded-full border border-[#9333ea]/20">
              Complete Open Source Index
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
              All Verified Open-Source Tools ({allOss.length})
            </h2>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {allOss.map((tool) => (
            <Link
              key={tool.slug}
              href={`/open-source/${tool.slug}`}
              className="bg-white border border-[#e2e8f0] hover:border-[#9333ea] p-6 rounded-3xl space-y-4 transition shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-lg text-[#0f172a] group-hover:text-[#9333ea] transition">
                    {tool.name}
                  </h3>
                  <span className="text-[10px] bg-[#f3e8ff] text-[#9333ea] font-extrabold px-2.5 py-0.5 rounded-full border border-[#9333ea]/20">
                    {tool.categoryName?.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-[#475569] font-medium line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
                <div className="pt-2 text-xs text-[#64748b] font-semibold">
                  <span className="text-[#0f172a] font-bold">Replaces: </span>
                  {tool.replacedProducts.slice(0, 3).map((p) => p.name).join(', ')}
                  {tool.replacedProducts.length > 3 ? ` +${tool.replacedProducts.length - 3} more` : ''}
                </div>
              </div>

              <div className="pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-xs font-bold text-[#9333ea]">
                <span>Self-Host Guide & Docker</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
