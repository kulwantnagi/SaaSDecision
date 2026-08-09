'use client';

import { useState } from 'react';
import { createPaymentOrder, OrderResult } from '@/domain/payment';

export default function ExpertAuditPage() {
  const [email, setEmail] = useState<string>('');
  const [provider, setProvider] = useState<'STRIPE' | 'RAZORPAY'>('STRIPE');
  const [order, setOrder] = useState<OrderResult | null>(null);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createPaymentOrder({
      productType: 'EXPERT_AUDIT',
      amount: 299,
      currency: 'USD',
      userEmail: email,
      provider,
    });
    setOrder(res);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="border-b border-[#e2e8f0] pb-4 text-center space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#2b00d9] tracking-wider bg-[#eef2ff] px-3 py-1 rounded-full border border-[#2b00d9]/20">
          Monetization Layer 3 • Expert Review
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mt-1">
          Expert SaaS Optimization Audit
        </h1>
        <p className="text-[#475569] text-sm font-medium">
          Get a comprehensive human SaaS architecture review, contract optimization, migration roadmap, and build-vs-buy analysis from expert engineers.
        </p>
      </div>

      {order ? (
        <div className="bg-white border border-[#16a34a]/30 p-5 sm:p-8 rounded-3xl text-center space-y-4 shadow-sm">
          <span className="text-4xl block">💳</span>
          <h3 className="text-lg sm:text-xl font-bold text-[#0f172a]">Order Initialized ({order.provider})</h3>
          <p className="text-xs text-[#64748b] font-mono">Order ID: {order.orderId}</p>
          <p className="text-2xl font-black text-[#16a34a]">$299 USD</p>
          <a
            href={order.checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-md shadow-[#16a34a]/25"
          >
            Proceed to Payment Checkout ↗
          </a>
        </div>
      ) : (
        <form onSubmit={handleCreateOrder} className="bg-white border border-[#e2e8f0] p-5 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs text-[#0f172a] font-bold uppercase tracking-wider">Your Email Address *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-[#0f172a] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2b00d9] transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#0f172a] font-bold uppercase tracking-wider block">Select Payment Gateway</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setProvider('STRIPE')}
                className={`flex-1 py-3 sm:py-3.5 rounded-2xl border text-xs font-bold transition ${
                  provider === 'STRIPE' ? 'bg-[#2b00d9] border-[#2b00d9] text-white' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b]'
                }`}
              >
                Stripe (International)
              </button>
              <button
                type="button"
                onClick={() => setProvider('RAZORPAY')}
                className={`flex-1 py-3 sm:py-3.5 rounded-2xl border text-xs font-bold transition ${
                  provider === 'RAZORPAY' ? 'bg-[#2b00d9] border-[#2b00d9] text-white' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b]'
                }`}
              >
                Razorpay (India / UPI)
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm transition shadow-md shadow-[#16a34a]/25"
          >
            Order Expert SaaS Audit ($299)
          </button>
        </form>
      )}
    </div>
  );
}
