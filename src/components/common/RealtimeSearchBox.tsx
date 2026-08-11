'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  name: string;
  slug: string;
  categoryName: string;
  shortDescription: string;
  openSourceCount: number;
}

export default function RealtimeSearchBox({
  initialQuery = '',
  totalCount = 989,
  category = '',
  variant = 'default',
}: {
  initialQuery?: string;
  totalCount?: number;
  category?: string;
  variant?: 'default' | 'header';
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced real-time fetch
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=7`);
        if (res.ok) {
          const data: SearchResult[] = await res.json();
          setResults(data);
          setIsOpen(data.length > 0);
        }
      } catch (err) {
        console.error('Realtime search error:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category) params.set('category', category);
    router.push(`/?${params.toString()}`);
  };

  const isHeader = variant === 'header';

  return (
    <div ref={wrapperRef} className={isHeader ? 'relative w-full max-w-sm sm:max-w-md' : 'relative max-w-2xl mx-auto pt-2'}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
            placeholder={isHeader ? 'Search software & alternatives...' : `Search across ${totalCount} software tools...`}
            className={
              isHeader
                ? 'w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-3.5 pr-10 py-1.5 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2b00d9] focus:bg-white transition shadow-sm'
                : 'w-full bg-white border border-[#cbd5e1] rounded-2xl pl-4 sm:pl-6 pr-24 sm:pr-32 py-3.5 sm:py-4 text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition shadow-lg shadow-[#0f172a]/5'
            }
          />

          <button
            type="submit"
            className={
              isHeader
                ? 'absolute right-1 top-1 bottom-1 bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold px-2.5 rounded-lg text-xs transition flex items-center justify-center shrink-0'
                : 'absolute right-1.5 sm:right-2.5 top-1.5 sm:top-2.5 bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs transition shadow-md shadow-[#2b00d9]/25 flex items-center gap-1.5 shrink-0'
            }
            aria-label="Search"
          >
            {loading ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isHeader ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ) : (
              'Evaluate'
            )}
          </button>
        </div>
      </form>

      {/* Live Dropdown Results */}
      {isOpen && (
        <div className={
          isHeader
            ? "absolute top-full right-0 sm:left-0 w-[340px] sm:w-[380px] mt-2 bg-white border border-[#cbd5e1] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-[#f1f5f9] animate-in fade-in slide-in-from-top-2 duration-150"
            : "absolute top-full left-0 right-0 mt-2 bg-white border border-[#cbd5e1] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-[#f1f5f9] animate-in fade-in slide-in-from-top-2 duration-150"
        }>
          <div className="px-3.5 py-2.5 bg-[#f8fafc] flex items-center justify-between text-[11px] font-bold tracking-wide text-[#475569]">
            <span className="uppercase text-[10px] tracking-wider text-[#64748b]">Live Results ({results.length})</span>
            <span className="hidden sm:inline text-[#64748b] font-normal text-[10px]">Press Enter to view all</span>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f1f5f9]">
            {results.map((item) => (
              <Link
                key={item.slug}
                href={`/software/${item.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3.5 hover:bg-[#f4f6fb] transition group gap-3"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#0f172a] group-hover:text-[#2b00d9] transition truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-medium text-[#475569] bg-[#e2e8f0]/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {item.categoryName}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] truncate leading-normal">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-[#16a34a] bg-[#f0fdf4] hover:bg-[#dcfce7] px-2.5 py-1 rounded-lg border border-[#bbf7d0] inline-flex items-center gap-1 transition">
                    Evaluate &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#f8fafc] hover:bg-[#eef2ff] text-center text-xs font-bold text-[#2b00d9] transition flex items-center justify-center gap-1.5"
          >
            <span>View all results for &quot;{query}&quot;</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
