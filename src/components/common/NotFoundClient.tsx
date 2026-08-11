'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ALL_SOFTWARE_PRODUCTS, VerifiedProductSeed } from '@/domain/catalog-service';

export default function NotFoundClient() {
  const router = useRouter();
  const [pathname, setPathname] = useState<string>('');
  const [referrer, setReferrer] = useState<string>('');
  const [attemptedQuery, setAttemptedQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recommendations, setRecommendations] = useState<VerifiedProductSeed[]>([]);
  const [openSourceAlts, setOpenSourceAlts] = useState<Array<{ name: string; githubUrl: string; description?: string; stars?: string; parentApp: string }>>([]);
  const [pricingHighlights, setPricingHighlights] = useState<Array<{ name: string; slug: string; startingPrice: string; freeTier: boolean }>>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentRef = document.referrer;
      setPathname(currentPath);
      setReferrer(currentRef);

      // Extract meaningful keyword from pathname
      // e.g. /software/bazqux-reader -> "bazqux reader"
      // e.g. /compare/notion-vs-obsidian -> "notion obsidian"
      const cleanPath = decodeURIComponent(currentPath)
        .replace(/^\//, '')
        .replace(/^(software|category|compare|kits)\//, '');
      
      const extractedKeyword = cleanPath
        .replace(/[-_]+/g, ' ')
        .replace(/\/.*$/, '')
        .trim();

      setAttemptedQuery(extractedKeyword);
      setSearchQuery(extractedKeyword);

      // Deep search matching
      const matched = findSmartRecommendations(extractedKeyword, currentPath);
      setRecommendations(matched);

      // Aggregate Open Source Alternatives from matched / category products
      const aggregatedOSS: Array<{ name: string; githubUrl: string; description?: string; stars?: string; parentApp: string }> = [];
      const seenOSS = new Set<string>();

      const aggregatedPricing: Array<{ name: string; slug: string; startingPrice: string; freeTier: boolean }> = [];

      for (const prod of matched) {
        // Collect OSS
        if (prod.openSourceAlternatives) {
          for (const oss of prod.openSourceAlternatives) {
            if (!seenOSS.has(oss.name.toLowerCase())) {
              seenOSS.add(oss.name.toLowerCase());
              aggregatedOSS.push({
                name: oss.name,
                githubUrl: oss.githubUrl,
                description: oss.description,
                stars: oss.stars,
                parentApp: prod.name,
              });
            }
          }
        }

        // Collect Pricing
        const starter = prod.pricing?.[0];
        const freeTier = prod.pricing?.some((p) => p.freeTier || p.basePrice === 0) || false;
        let startingPrice = 'Custom';
        if (freeTier) {
          startingPrice = 'Free Tier Available';
        } else if (starter && starter.basePrice > 0) {
          startingPrice = `$${starter.basePrice}/mo`;
        }

        aggregatedPricing.push({
          name: prod.name,
          slug: prod.slug,
          startingPrice,
          freeTier,
        });
      }

      setOpenSourceAlts(aggregatedOSS.slice(0, 6));
      setPricingHighlights(aggregatedPricing.slice(0, 6));
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      startTransition(() => {
        router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10">
      {/* Hero 404 Light Theme Card */}
      <div className="relative overflow-hidden bg-white text-slate-900 rounded-3xl p-8 sm:p-14 border border-slate-200 shadow-xl">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/80 blur-3xl rounded-full pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/80 blur-3xl rounded-full pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Error 404 &bull; Page Not Found
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 leading-tight">
            Looking for <span className="text-indigo-600">{attemptedQuery ? `"${attemptedQuery}"` : 'a SaaS Tool'}</span>?
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
            The target URL <span className="font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">{pathname || 'requested'}</span> was not found directly in our directory, but we’ve analyzed your intent, checked pricing indices, and compiled verified open-source replacements below.
          </p>

          {/* User Landed Deep Context Insights */}
          {(pathname || referrer || attemptedQuery) && (
            <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-200 text-left text-xs sm:text-sm text-slate-700 mb-8 shadow-sm">
              <div className="font-bold text-slate-900 mb-3 flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Route Intelligence &amp; Deep Scan Diagnostics
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold">
                  Catalog Scanned
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                {pathname && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                    <div className="text-slate-400 font-sans text-[11px] mb-1">Requested Path</div>
                    <div className="text-indigo-700 font-bold truncate">{pathname}</div>
                  </div>
                )}
                {attemptedQuery && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                    <div className="text-slate-400 font-sans text-[11px] mb-1">Extracted Intent</div>
                    <div className="text-amber-800 font-sans font-bold capitalize">{attemptedQuery}</div>
                  </div>
                )}
                {referrer ? (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                    <div className="text-slate-400 font-sans text-[11px] mb-1">Referrer URL</div>
                    <div className="text-emerald-700 font-medium truncate">{referrer}</div>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                    <div className="text-slate-400 font-sans text-[11px] mb-1">Access Source</div>
                    <div className="text-slate-600 font-sans font-medium">Direct / Bookmark</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Direct Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 980+ SaaS tools, pricing, or self-hosted alts..."
                className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                disabled={isPending}
                className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isPending ? 'Searching...' : 'Search Tools'}
              </button>
            </div>
          </form>

          {/* Quick Nav Action Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Browse 980+ SaaS Catalog
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Compare SaaS Tools
            </Link>
          </div>
        </div>
      </div>

      {/* Verified Open Source Alternatives Section */}
      {openSourceAlts.length > 0 && (
        <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/60 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                Self-Hosted &amp; Free
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Verified Open-Source Alternatives
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Eliminate recurring subscriptions with top self-hostable open-source projects related to your query:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {openSourceAlts.map((oss, idx) => (
              <a
                key={idx}
                href={oss.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors text-base flex items-center gap-1.5">
                      {oss.name}
                      <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                    {oss.stars && (
                      <span className="text-[11px] font-mono font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                        {oss.stars}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {oss.description || 'Open-source self-hosted alternative with full data control.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Alternative to <strong className="text-slate-200">{oss.parentApp}</strong></span>
                  <span className="text-emerald-400 font-semibold group-hover:underline">GitHub &rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Verified Commercial Software Solutions & Pricing Grid */}
      {recommendations.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {attemptedQuery ? `Matching SaaS Products & Commercial Alternatives` : 'Top Recommended Commercial Software'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Explore feature breakdowns, verified pricing tiers, and KEEP/SWITCH decision evaluations:
              </p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
            >
              Browse entire 980+ index &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((item) => {
              const starter = item.pricing?.[0];
              const freeTier = item.pricing?.some((p) => p.freeTier || p.basePrice === 0) || false;
              let priceDisplay = 'Custom Pricing';
              if (freeTier) {
                priceDisplay = 'Free Plan Available';
              } else if (starter && starter.basePrice > 0) {
                priceDisplay = `From $${starter.basePrice}/mo`;
              }

              return (
                <Link
                  key={item.slug}
                  href={`/software/${item.slug}`}
                  className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">
                          {item.name}
                        </h3>
                        <span className="inline-block mt-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.categoryName}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        freeTier
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                      }`}>
                        {priceDisplay}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {item.shortDescription || item.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {item.openSourceAlternatives?.length || 0} Open-Source Alt{item.openSourceAlternatives?.length === 1 ? '' : 's'}
                    </span>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Full Assessment
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Pricing Comparison Snapshot */}
      {pricingHighlights.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Pricing &amp; License Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Software Name</th>
                  <th className="py-2.5 px-3">Starting Rate</th>
                  <th className="py-2.5 px-3">Free Tier Available</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pricingHighlights.map((ph) => (
                  <tr key={ph.slug} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{ph.name}</td>
                    <td className="py-3 px-3 text-slate-700 font-mono">{ph.startingPrice}</td>
                    <td className="py-3 px-3">
                      {ph.freeTier ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Yes &bull; Free Forever
                        </span>
                      ) : (
                        <span className="text-slate-500">Commercial Only</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/software/${ph.slug}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                        View Details &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Smart recommendation engine for 404 page
 */
function findSmartRecommendations(extractedKeyword: string, fullPath: string): VerifiedProductSeed[] {
  const queryWords = extractedKeyword.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  
  if (queryWords.length === 0) {
    // Default fallback to popular SaaS tools
    return ALL_SOFTWARE_PRODUCTS.slice(0, 6);
  }

  // 1. Keyword match score
  const scored = ALL_SOFTWARE_PRODUCTS.map((p) => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    const slugLower = p.slug.toLowerCase();
    const catLower = (p.categoryName || '').toLowerCase();
    const descLower = (p.shortDescription || p.summary || '').toLowerCase();
    const aliases = (p.aliases || []).map((a) => a.toLowerCase());
    const tags = (p.tags || []).map((t) => t.toLowerCase());

    for (const word of queryWords) {
      if (slugLower.includes(word)) score += 10;
      if (nameLower.includes(word)) score += 8;
      if (aliases.some((a) => a.includes(word))) score += 7;
      if (catLower.includes(word)) score += 5;
      if (tags.some((t) => t.includes(word))) score += 4;
      if (descLower.includes(word)) score += 2;
    }

    return { product: p, score };
  });

  const matches = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);

  if (matches.length >= 6) {
    return matches.slice(0, 6);
  }

  // If fewer than 6 matches, fill with top catalog items not already included
  const existingSlugs = new Set(matches.map((m) => m.slug));
  for (const p of ALL_SOFTWARE_PRODUCTS) {
    if (matches.length >= 6) break;
    if (!existingSlugs.has(p.slug)) {
      matches.push(p);
      existingSlugs.add(p.slug);
    }
  }

  return matches.slice(0, 6);
}
