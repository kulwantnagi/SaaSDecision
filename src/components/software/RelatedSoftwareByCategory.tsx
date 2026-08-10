import React from 'react';
import Link from 'next/link';
import { VerifiedProductSeed } from '@/domain/seed-data';
import { evaluateSoftware } from '@/domain/decision-engine';

interface RelatedSoftwareByCategoryProps {
  categoryName: string;
  categorySlug: string;
  relatedProducts: VerifiedProductSeed[];
  currentProductName?: string;
  currentProductSlug?: string;
  title?: string;
  description?: string;
}

export default function RelatedSoftwareByCategory({
  categoryName,
  categorySlug,
  relatedProducts,
  currentProductName,
  currentProductSlug,
  title,
  description,
}: RelatedSoftwareByCategoryProps) {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  const sectionTitle = title || `Related Software in ${categoryName}`;
  const sectionDescription =
    description ||
    `Explore verified SaaS decision scores, pricing, and self-hosting alternatives for software in ${categoryName}.`;

  const cardGradients = [
    {
      bg: 'bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#eff6ff]',
      border: 'border-[#cbd5e1] hover:border-[#2b00d9]/40',
      badgeBg: 'bg-[#eef2ff] text-[#2b00d9] border-[#2b00d9]/20',
      btnBg: 'bg-[#2b00d9] hover:bg-[#1f00a8] text-white',
    },
    {
      bg: 'bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#faf5ff]',
      border: 'border-[#cbd5e1] hover:border-[#9333ea]/40',
      badgeBg: 'bg-[#f3e8ff] text-[#9333ea] border-[#9333ea]/20',
      btnBg: 'bg-[#9333ea] hover:bg-[#7e22ce] text-white',
    },
    {
      bg: 'bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#f0fdf4]',
      border: 'border-[#cbd5e1] hover:border-[#16a34a]/40',
      badgeBg: 'bg-[#dcfce7] text-[#15803d] border-[#86efac]',
      btnBg: 'bg-[#16a34a] hover:bg-[#15803d] text-white',
    },
  ];

  return (
    <section id="related-category-software" className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f1f5f9] pb-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            Category Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight mt-1">
            {sectionTitle}
          </h2>
          <p className="text-xs font-medium text-[#475569] mt-1 max-w-2xl">
            {sectionDescription}
          </p>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#2b00d9] hover:underline self-start sm:self-center shrink-0 bg-[#eef2ff] px-3.5 py-2 rounded-xl border border-[#2b00d9]/20 transition"
        >
          View All {categoryName} Tools ↗
        </Link>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {relatedProducts.map((prod, idx) => {
          const style = cardGradients[idx % cardGradients.length];
          const scores = prod.assessment ? evaluateSoftware(prod.assessment) : null;
          const startingPrice = prod.pricing?.[0]?.basePrice ?? 0;
          const hasFreeTier = prod.pricing?.[0]?.freeTier ?? false;

          return (
            <div
              key={prod.slug}
              className={`relative ${style.bg} ${style.border} border p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 group`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${style.badgeBg}`}>
                      {prod.categoryName || categoryName}
                    </span>
                    <h3 className="font-extrabold text-lg text-[#0f172a] group-hover:text-[#2b00d9] transition mt-1.5">
                      {prod.name}
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-xl shrink-0">
                    {hasFreeTier ? 'Free Tier' : `$${startingPrice}/mo`}
                  </span>
                </div>

                <p className="text-xs text-[#475569] font-medium leading-relaxed line-clamp-2">
                  {prod.shortDescription || prod.summary}
                </p>

                {/* Score Indicators */}
                {scores && (
                  <div className="bg-white/80 border border-[#e2e8f0] p-3 rounded-2xl space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center text-[#64748b] font-semibold">
                      <span>Primary Recommendation</span>
                      <span className="text-[#2b00d9] font-extrabold uppercase text-[10px] bg-[#eef2ff] px-2 py-0.5 rounded">
                        {scores.primaryDecision.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1 text-center font-extrabold text-[10px]">
                      <div className="bg-[#f0fdf4] text-[#166534] p-1 rounded-lg border border-[#bbf7d0]">
                        KEEP: {scores.keepScore}
                      </div>
                      <div className="bg-[#eef2ff] text-[#2b00d9] p-1 rounded-lg border border-[#c7d2fe]">
                        SWITCH: {scores.switchScore}
                      </div>
                      <div className="bg-[#f3e8ff] text-[#9333ea] p-1 rounded-lg border border-[#e9d5ff]">
                        SELF-HOST: {scores.selfHostScore}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#e2e8f0] flex items-center gap-2">
                {currentProductSlug && currentProductSlug !== prod.slug ? (
                  <Link
                    href={`/compare/${currentProductSlug}-vs-${prod.slug}`}
                    className={`flex-1 text-center ${style.btnBg} text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-xs hover:shadow-md truncate`}
                    title={`Compare ${currentProductName || 'Product'} vs ${prod.name}`}
                  >
                    Compare ↗
                  </Link>
                ) : null}

                <Link
                  href={`/software/${prod.slug}`}
                  className="flex-1 text-center bg-[#f8fafc] hover:bg-[#e2e8f0] border border-[#cbd5e1] text-[#0f172a] text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-xs truncate"
                >
                  View Review ↗
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
