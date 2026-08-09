'use client';

import { useState } from 'react';

export default function StickyRecommendedHostingWidget({ productName }: { productName: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside className="fixed bottom-4 right-4 z-[99999] w-80 max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white border border-[#4338ca]/60 rounded-3xl p-5 space-y-4 shadow-2xl shadow-[#2b00d9]/30 relative">
        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition"
          title="Dismiss Widget"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 pr-6">
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

        {/* Description */}
        <div>
          <h4 className="text-sm font-extrabold text-white tracking-tight pr-2">
            Recommended Hosting to Deploy Open-Source Models
          </h4>
          <p className="text-[11px] text-slate-300 font-medium mt-1 leading-relaxed">
            Optimized 1-click VPS & cloud infrastructure to deploy open-source models for {productName}.
          </p>
        </div>

        {/* Action Links */}
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
  );
}
