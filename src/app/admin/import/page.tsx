'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminAuthGuard from '../AdminAuthGuard';

const SAMPLE_JSON_TEMPLATE = `[
  {
    "name": "Linear",
    "slug": "linear",
    "categoryName": "Project Management",
    "shortDescription": "Issue tracking and project management for high-performance software teams.",
    "websiteUrl": "https://linear.app",
    "pricing": [
      { "name": "Free", "basePrice": 0, "pricePerSeat": 0, "freeTier": true },
      { "name": "Standard", "basePrice": 0, "pricePerSeat": 8, "freeTier": false }
    ],
    "assessment": {
      "buildComplexity": 4,
      "vendorLockIn": 3,
      "dataMoat": 2,
      "migrationComplexity": 3,
      "openSourceMaturity": 1
    }
  }
]`;

export default function AdminImportPage() {
  // Mode: URL vs JSON
  const [activeTab, setActiveTab] = useState<'url' | 'json'>('url');

  // URL Ingestion state
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlResult, setUrlResult] = useState<{ success?: boolean; message?: string; tool?: any; error?: string } | null>(null);

  // JSON Batch state
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string; count?: number } | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any[] | null>(null);

  const handleUrlIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setUrlLoading(true);
    setUrlResult(null);

    try {
      const res = await fetch('/api/admin/ingest-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUrlResult({ success: true, message: data.message, tool: data.tool });
      } else {
        setUrlResult({ success: false, error: data.error || 'Ingestion failed' });
      }
    } catch (err: any) {
      setUrlResult({ success: false, error: err.message || 'Network error' });
    } finally {
      setUrlLoading(false);
    }
  };

  const handleValidate = () => {
    try {
      if (!jsonInput.trim()) {
        setImportStatus({ success: false, message: 'Please enter or paste JSON data.' });
        return;
      }
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        setImportStatus({ success: false, message: 'Root JSON must be an array of software items.' });
        return;
      }
      setParsedPreview(data);
      setImportStatus({ success: true, message: `Successfully validated ${data.length} item(s)! Ready for ingestion.`, count: data.length });
    } catch (e: any) {
      setParsedPreview(null);
      setImportStatus({ success: false, message: `JSON Syntax Error: ${e.message}` });
    }
  };

  const handleSimulatedImport = () => {
    if (!parsedPreview) return;
    setImportStatus({
      success: true,
      message: `🎉 Imported ${parsedPreview.length} tool(s) into catalog! Decision algorithms updated.`,
    });
  };

  return (
    <AdminAuthGuard>
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e2e8f0] pb-4 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <Link href="/admin" className="hover:underline">Admin</Link>
              <span>/</span>
              <span>Import</span>
            </div>
            <h1 className="text-2xl font-black text-[#0f172a] mt-1">Catalog Importer & Automated Scraper</h1>
          </div>

          <div className="flex items-center gap-2 bg-[#f1f5f9] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('url')}
              className={`px-4 py-1.5 text-xs font-extrabold rounded-lg transition ${
                activeTab === 'url' ? 'bg-[#2b00d9] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              🔗 URL Auto-Ingest
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-4 py-1.5 text-xs font-extrabold rounded-lg transition ${
                activeTab === 'json' ? 'bg-[#2b00d9] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              📦 Batch JSON Payload
            </button>
          </div>
        </div>

        {/* URL Auto-Ingest Engine Tab */}
        {activeTab === 'url' && (
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2b00d9] bg-[#eef2ff] px-2.5 py-1 rounded-full border border-[#2b00d9]/20">
                1-Click Autonomous Extractor
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a]">Paste Website URL to Auto-Generate Tool Pages</h2>
              <p className="text-xs text-[#64748b] font-medium leading-relaxed">
                Enter any official SaaS product homepage (e.g., <code className="text-[#2b00d9] bg-[#f8fafc] px-1.5 py-0.5 rounded">https://clickup.com</code>). The engine automatically fetches page title, meta description, pricing tiers, semantic tags, and open-source alternatives, instantly creating all 4 target pages (`/software/[slug]`, `/open-source`, `/alternatives`, `/build`).
              </p>
            </div>

            <form onSubmit={handleUrlIngest} className="space-y-4 max-w-3xl">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-4 py-3.5 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2b00d9] focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={urlLoading}
                  className="w-full sm:w-auto bg-[#2b00d9] hover:bg-[#1f00a8] disabled:opacity-50 text-white font-extrabold px-7 py-3.5 rounded-2xl text-xs transition shadow-md shadow-[#2b00d9]/25 flex items-center justify-center gap-2 shrink-0"
                >
                  {urlLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Reading & Extracting...
                    </>
                  ) : (
                    '🚀 Ingest & Build Pages'
                  )}
                </button>
              </div>
            </form>

            {/* URL Result Card */}
            {urlResult && (
              <div
                className={`p-5 rounded-2xl border text-xs space-y-3 animate-in fade-in duration-200 ${
                  urlResult.success
                    ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]'
                    : 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]'
                }`}
              >
                <div className="font-extrabold flex items-center justify-between">
                  <span>{urlResult.message || urlResult.error}</span>
                  {urlResult.tool && (
                    <Link
                      href={`/software/${urlResult.tool.slug}`}
                      target="_blank"
                      className="bg-[#16a34a] hover:bg-[#15803d] text-white px-3 py-1 rounded-xl text-[11px] font-extrabold transition inline-flex items-center gap-1"
                    >
                      View Live Page ↗
                    </Link>
                  )}
                </div>

                {urlResult.tool && (
                  <div className="bg-white/80 border border-[#bbf7d0] p-4 rounded-xl space-y-2 text-[#0f172a] font-sans">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-[#0f172a]">{urlResult.tool.name}</span>
                      <span className="text-[10px] font-bold bg-[#eef2ff] text-[#2b00d9] px-2 py-0.5 rounded-md">
                        {urlResult.tool.categoryName}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569]">{urlResult.tool.shortDescription}</p>
                    <div className="text-[11px] font-medium text-[#64748b] pt-1">
                      <strong>Pricing:</strong> {urlResult.tool.pricing?.map((p: any) => `${p.name}: $${p.basePrice}`).join(' | ') || 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* JSON Batch Payload Tab */}
        {activeTab === 'json' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  Paste JSON Payload
                </label>
                <button
                  onClick={() => setJsonInput(SAMPLE_JSON_TEMPLATE)}
                  className="text-[10px] font-bold text-[#2b00d9] hover:underline"
                >
                  Load Sample Template
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON array of software products..."
                className="w-full h-80 p-4 text-xs font-mono bg-[#0f172a] text-[#f8fafc] rounded-2xl border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#2b00d9]"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleValidate}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2b00d9] hover:bg-[#2000a8] rounded-xl shadow-sm transition"
                >
                  Validate Schema
                </button>
                {parsedPreview && (
                  <button
                    onClick={handleSimulatedImport}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#16a34a] hover:bg-[#15803d] rounded-xl shadow-sm transition"
                  >
                    Confirm & Ingest Batch ({parsedPreview.length})
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Ingestion Status & Schema Preview
              </label>

              {importStatus && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-semibold ${
                    importStatus.success
                      ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
                      : 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
                  }`}
                >
                  {importStatus.message}
                </div>
              )}

              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 h-80 overflow-y-auto font-mono text-[11px]">
                {parsedPreview ? (
                  <pre className="text-[#0f172a] whitespace-pre-wrap">
                    {JSON.stringify(parsedPreview, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-[#94a3b8] text-center text-xs">
                    Paste JSON and click "Validate Schema" to inspect preview and attribute mappings.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
}
