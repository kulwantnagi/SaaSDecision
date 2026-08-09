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
}: {
  initialQuery?: string;
  totalCount?: number;
  category?: string;
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

  return (
    <div ref={wrapperRef} className="relative max-w-2xl mx-auto pt-2">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
            placeholder={`Search across ${totalCount} software tools (e.g. Slack, Granola, Stripe, Zoom)...`}
            className="w-full bg-white border border-[#e2e8f0] rounded-2xl px-6 py-4 pr-32 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition shadow-lg shadow-[#0f172a]/5"
          />

          <button
            type="submit"
            className="absolute right-2.5 top-2.5 bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-[#2b00d9]/25 flex items-center gap-1.5"
          >
            {loading && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Evaluate
          </button>
        </div>
      </form>

      {/* Live Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#f1f5f9] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 bg-[#f8fafc] flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            <span>Live Results ({results.length})</span>
            <span>Press Enter for full list</span>
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {results.map((item) => (
              <Link
                key={item.slug}
                href={`/software/${item.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-4 hover:bg-[#eef2ff]/50 transition group"
              >
                <div className="space-y-0.5 max-w-[75%]">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#0f172a] group-hover:text-[#2b00d9] transition">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-md">
                      {item.categoryName}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] line-clamp-1 font-medium">{item.shortDescription}</p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-full border border-[#86efac] inline-flex items-center gap-1">
                    Evaluate &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#f8fafc] hover:bg-[#eef2ff] text-center text-xs font-bold text-[#2b00d9] transition"
          >
            View all results for "{query}" &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
