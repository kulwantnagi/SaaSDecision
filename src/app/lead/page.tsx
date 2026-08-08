'use client';

import { useState } from 'react';

export default function ImplementationLeadPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="border-b border-[#e2e8f0] pb-4 text-center space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#2b00d9] tracking-wider bg-[#eef2ff] px-3 py-1 rounded-full border border-[#2b00d9]/20">
          Monetization Layer 2 • High-Intent Lead Capture
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mt-1">
          Build or Migrate My Software
        </h1>
        <p className="text-[#475569] text-sm font-medium">
          Get expert guidance and dedicated engineering to replace your expensive SaaS subscriptions with automated workflows or custom builds.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white border border-[#16a34a]/30 p-8 rounded-3xl text-center space-y-3 shadow-sm">
          <span className="text-3xl block">✅</span>
          <h3 className="text-xl font-bold text-[#0f172a]">Inquiry Received</h3>
          <p className="text-xs text-[#475569] font-medium">
            Our engineering team will review your software replacement requirements and contact you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-[#0f172a] font-bold uppercase tracking-wider">Your Name *</label>
              <input
                required
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[#0f172a] font-bold uppercase tracking-wider">Work Email *</label>
              <input
                required
                type="email"
                placeholder="jane@company.com"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-[#0f172a] font-bold uppercase tracking-wider">Target SaaS to Replace *</label>
              <input
                required
                type="text"
                placeholder="e.g. Calendly, Zapier, HubSpot"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[#0f172a] font-bold uppercase tracking-wider">Current Monthly Spend ($)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#0f172a] font-bold uppercase tracking-wider">Project Notes / Key Features Needed</label>
            <textarea
              rows={4}
              placeholder="Describe what features you use and what outcome you want..."
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 text-[#0f172a] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2b00d9] hover:bg-[#1f00a8] text-white font-bold py-4 rounded-2xl text-sm transition shadow-md shadow-[#2b00d9]/25"
          >
            Submit Implementation Request
          </button>
        </form>
      )}
    </div>
  );
}
