'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORY_TREE } from '@/domain/category-navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#2b00d9] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#2b00d9]/25 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0f172a]">
            SaaS<span className="text-[#2b00d9]"> Decision</span>
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase bg-[#eef2ff] text-[#2b00d9] px-2 py-0.5 rounded-full border border-[#2b00d9]/20 hidden xs:inline-block">
            v1.0
          </span>
        </Link>

        {/* Desktop Navigation Links (>= lg screens) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-[#475569]">
          <Link href="/" className="hover:text-[#2b00d9] transition-colors">
            Software Index
          </Link>

          {/* Categories & Subcategories Mega Dropdown */}
          <div
            ref={dropdownRef}
            className="relative py-2"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-1.5 hover:text-[#2b00d9] transition-colors font-bold text-[#0f172a] focus:outline-none"
            >
              <span>Categories</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#2b00d9]' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute left-0 top-full w-[600px] bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                {/* Main Categories Column */}
                <div className="col-span-2 bg-[#f8fafc] border-r border-[#e2e8f0] p-2 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#94a3b8] px-3 py-1.5 block">
                    Primary Categories
                  </span>
                  {CATEGORY_TREE.map((cat, index) => {
                    const isActive = activeCategoryIndex === index;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/?category=${cat.slug}#catalog`}
                        scroll={false}
                        onMouseEnter={() => setActiveCategoryIndex(index)}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center justify-between ${
                          isActive
                            ? 'bg-[#2b00d9] text-white shadow-sm'
                            : 'text-[#334155] hover:bg-[#eef2ff] hover:text-[#2b00d9]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-70">›</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Subcategories Column */}
                {(() => {
                  const activeCategory = CATEGORY_TREE[activeCategoryIndex] || CATEGORY_TREE[0];
                  return (
                    <div className="col-span-3 p-4 space-y-3 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-2 mb-3">
                          <span className="text-[10px] font-extrabold uppercase text-[#2b00d9] tracking-wider">
                            {activeCategory.name} Subcategories
                          </span>
                          <Link
                            href={`/?category=${activeCategory.slug}#catalog`}
                            scroll={false}
                            onClick={() => setCategoriesDropdownOpen(false)}
                            className="text-[10px] font-bold text-[#64748b] hover:text-[#2b00d9]"
                          >
                            View All ↗
                          </Link>
                        </div>

                        <div className="space-y-1.5">
                          {activeCategory.subcategories.map((sub, idx) => (
                            <Link
                              key={idx}
                              href={`/?category=${sub.slug}#catalog`}
                              scroll={false}
                              onClick={() => setCategoriesDropdownOpen(false)}
                              className="group flex justify-between items-center p-2 rounded-xl hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] transition"
                            >
                              <div>
                                <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#2b00d9] block">
                                  {sub.name}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded-md shrink-0">
                                {sub.toolCount} tools
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <Link href="/audit" className="hover:text-[#2b00d9] transition-colors">
            Stack Audit
          </Link>
          <Link href="/blueprint" className="hover:text-[#2b00d9] transition-colors">
            AI Replacement Blueprint
          </Link>
          <Link href="/expert-audit" className="hover:text-[#2b00d9] transition-colors">
            Expert Review
          </Link>
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/lead"
            className="hidden sm:inline-flex bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#2b00d9] border border-[#2b00d9]/20 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            Build for Me
          </Link>
          <Link
            href="/admin"
            className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-xl shadow-md shadow-[#2b00d9]/25 transition"
          >
            Admin Portal
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#0f172a] hover:bg-[#f1f5f9] transition focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e2e8f0] px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-3 font-bold text-sm text-[#0f172a]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#eef2ff] hover:text-[#2b00d9] transition"
            >
              Software Index
            </Link>

            {/* Mobile Accordion for Categories & Subcategories */}
            <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden bg-[#f8fafc]">
              <button
                type="button"
                onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                className="w-full px-4 py-3 text-left font-extrabold text-xs uppercase tracking-wider text-[#2b00d9] flex justify-between items-center"
              >
                <span>Browse Categories ({CATEGORY_TREE.length})</span>
                <span>{mobileCategoryOpen ? '▲' : '▼'}</span>
              </button>

              {mobileCategoryOpen && (
                <div className="p-3 space-y-4 bg-white border-t border-[#e2e8f0]">
                  {CATEGORY_TREE.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <Link
                        href={`/?category=${cat.slug}#catalog`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs font-black text-[#0f172a] hover:text-[#2b00d9] block"
                      >
                        {cat.name} →
                      </Link>
                      <div className="pl-3 border-l-2 border-[#e2e8f0] space-y-1.5">
                        {cat.subcategories.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={`/?category=${sub.slug}#catalog`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-[#475569] font-medium hover:text-[#2b00d9] flex justify-between items-center"
                          >
                            <span>{sub.name}</span>
                            <span className="text-[10px] text-[#94a3b8]">{sub.toolCount}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#eef2ff] hover:text-[#2b00d9] transition"
            >
              Stack Audit
            </Link>
            <Link
              href="/blueprint"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#eef2ff] hover:text-[#2b00d9] transition"
            >
              AI Replacement Blueprint
            </Link>
            <Link
              href="/expert-audit"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#eef2ff] hover:text-[#2b00d9] transition"
            >
              Expert Review
            </Link>
            <Link
              href="/lead"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-[#eef2ff] text-[#2b00d9] font-extrabold border border-[#2b00d9]/20 transition flex items-center justify-between"
            >
              <span>Build for Me</span>
              <span>&rarr;</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
