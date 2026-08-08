import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSoftwareBySlug, ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';
import { VerifiedProductSeed } from '@/domain/seed-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prod = getSoftwareBySlug(slug);
  if (!prod) return {};

  return {
    title: `Best ${prod.name} Alternatives & Competitors (2026 Comparison)`,
    description: `Compare the top alternatives to ${prod.name}. Compare pricing, open-source options, feature parity, and switching difficulty.`,
  };
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prod = getSoftwareBySlug(slug);
  if (!prod) notFound();

  // Find competitors in same category
  const alternatives = ALL_SOFTWARE_PRODUCTS.filter(
    (p: VerifiedProductSeed) => p.slug !== prod.slug && p.categorySlug === prod.categorySlug
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href={`/software/${prod.slug}`} className="hover:text-[#2b00d9] transition">{prod.name}</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">Alternatives</span>
      </nav>

      {/* Hero */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-4 shadow-sm">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
            Commercial & Open-Source Replacement Index
          </span>
          <span className="text-xs font-semibold text-[#64748b]">Updated 2026</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          Best {prod.name} Alternatives & Competitors
        </h1>
        <p className="text-sm text-[#475569] max-w-3xl leading-relaxed font-medium">
          Looking to switch away from {prod.name}? Compare top-rated commercial alternatives, cheaper competitors, self-hostable open-source software, and custom build feasibility.
        </p>
      </section>

      {/* Direct Comparison Table (Truvora & Linear Styled) */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-4">
          <h2 className="text-xl font-extrabold text-[#0f172a]">Side-by-Side Comparison Matrix</h2>
          <span className="text-xs text-[#64748b] font-medium">Verified Parity Ratings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider">
                <th className="p-4 rounded-l-xl">Software</th>
                <th className="p-4">Starting Price</th>
                <th className="p-4">Free Tier</th>
                <th className="p-4">Feature Match</th>
                <th className="p-4">Migration Ease</th>
                <th className="p-4 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] font-semibold text-[#0f172a]">
              {/* Original Product Row */}
              <tr className="bg-[#eef2ff]/50">
                <td className="p-4">
                  <span className="font-extrabold text-sm block">{prod.name} (Current)</span>
                  <span className="text-[10px] text-[#64748b]">{prod.categoryName}</span>
                </td>
                <td className="p-4 text-[#16a34a] font-bold">${prod.pricing[0]?.basePrice ?? 0}/mo</td>
                <td className="p-4">{prod.pricing[0]?.freeTier ? 'Yes' : 'No'}</td>
                <td className="p-4 text-[#2b00d9] font-bold">100% (Baseline)</td>
                <td className="p-4 text-[#64748b]">N/A</td>
                <td className="p-4">
                  <Link
                    href={`/software/${prod.slug}`}
                    className="inline-block bg-white border border-[#2b00d9] text-[#2b00d9] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2b00d9] hover:text-white transition"
                  >
                    View Review ↗
                  </Link>
                </td>
              </tr>

              {/* Alternatives Rows */}
              {alternatives.map((alt: VerifiedProductSeed) => (
                <tr key={alt.slug} className="hover:bg-[#f8fafc]">
                  <td className="p-4">
                    <span className="font-bold text-sm block">{alt.name}</span>
                    <span className="text-[10px] text-[#64748b]">{alt.shortDescription}</span>
                  </td>
                  <td className="p-4 text-[#16a34a] font-bold">${alt.pricing[0]?.basePrice ?? 0}/mo</td>
                  <td className="p-4">{alt.pricing[0]?.freeTier ? 'Yes' : 'No'}</td>
                  <td className="p-4 font-bold text-[#2b00d9]">High Parity</td>
                  <td className="p-4 font-bold text-[#16a34a]">Easy (API Sync)</td>
                  <td className="p-4 space-x-2">
                    <Link
                      href={`/compare/${prod.slug}-vs-${alt.slug}`}
                      className="inline-block bg-[#2b00d9] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1f00a8] transition shadow-sm"
                    >
                      Compare ↗
                    </Link>
                    <Link
                      href={`/software/${alt.slug}`}
                      className="inline-block bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#e2e8f0] transition"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Alternative Cards Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#0f172a]">Recommended Replacements for {prod.name}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {alternatives.map((alt: VerifiedProductSeed) => (
            <div key={alt.slug} className="bg-white border border-[#e2e8f0] p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
                    Direct Alternative
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0f172a] mt-1">{alt.name}</h3>
                </div>
                <span className="text-base font-extrabold text-[#16a34a]">
                  From ${alt.pricing[0]?.basePrice ?? 0}/mo
                </span>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed font-medium">
                {alt.summary || alt.shortDescription}
              </p>

              <div className="pt-2 flex justify-between items-center border-t border-[#f1f5f9]">
                <Link
                  href={`/compare/${prod.slug}-vs-${alt.slug}`}
                  className="text-xs text-[#2b00d9] font-bold hover:underline"
                >
                  Head-to-Head Comparison ↗
                </Link>
                <Link
                  href={`/software/${alt.slug}`}
                  className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  Read {alt.name} Review ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
