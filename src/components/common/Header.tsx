'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]">
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
        <div className="lg:hidden bg-white border-b border-[#e2e8f0] px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-bold text-sm text-[#0f172a]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#eef2ff] hover:text-[#2b00d9] transition"
            >
              Software Index
            </Link>
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
