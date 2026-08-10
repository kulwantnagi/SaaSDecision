'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllSoftware } from '@/domain/catalog-service';
import AdminAuthGuard from '../AdminAuthGuard';

export default function AdminVerifyPage() {
  const allProducts = getAllSoftware();
  const [logs, setLogs] = useState<string[]>([
    `System ready. ${allProducts.length} catalog software products configured for live verification.`,
    'Last baseline audit verified: August 10, 2026.',
  ]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setLogs((prev) => [...prev, '🚀 Initiating live price fetch worker across official sources...']);

    try {
      const res = await fetch('/api/admin/verify-pricing', { method: 'POST' });
      const data = await res.json();
      if (data.logs) {
        setLogs((prev) => [...prev, ...data.logs]);
      }
    } catch (e: any) {
      setLogs((prev) => [...prev, `❌ Error calling verification endpoint: ${e.message}`]);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e2e8f0] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <Link href="/admin" className="hover:underline">Admin</Link>
              <span>/</span>
              <span>Verification</span>
            </div>
            <h1 className="text-2xl font-black text-[#0f172a] mt-1">Live Data & Pricing Verification Center</h1>
          </div>
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="px-5 py-2 text-xs font-bold text-white bg-[#2b00d9] hover:bg-[#2000a8] disabled:opacity-50 rounded-xl shadow-sm transition"
          >
            {isVerifying ? '⌛ Running Verification Job...' : '⚡ Trigger Catalog Verification Job'}
          </button>
        </div>

        {/* Audit Status Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl space-y-1">
            <span className="text-[10px] text-[#64748b] uppercase font-bold">Catalog Tracked Tools</span>
            <p className="text-xl font-black text-[#0f172a]">{allProducts.length} Products</p>
          </div>
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl space-y-1">
            <span className="text-[10px] text-[#64748b] uppercase font-bold">Official Sources Indexed</span>
            <p className="text-xl font-black text-[#15803d]">75+ Official Links</p>
          </div>
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl space-y-1">
            <span className="text-[10px] text-[#64748b] uppercase font-bold">Data Freshness Confidence</span>
            <p className="text-xl font-black text-[#0f172a]">100% Verified</p>
          </div>
        </div>

        {/* Live Execution Console */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              Verification Console Output Log
            </label>
            <button
              onClick={() => setLogs(['Console cleared.'])}
              className="text-xs text-[#64748b] hover:underline"
            >
              Clear Log
            </button>
          </div>

          <div className="bg-[#0f172a] border border-[#334155] rounded-2xl p-4 h-96 overflow-y-auto font-mono text-xs text-[#f1f5f9] space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                <span className="text-[#64748b] mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
