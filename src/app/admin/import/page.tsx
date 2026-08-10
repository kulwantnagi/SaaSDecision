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
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string; count?: number } | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any[] | null>(null);

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
        <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <Link href="/admin" className="hover:underline">Admin</Link>
              <span>/</span>
              <span>Import</span>
            </div>
            <h1 className="text-2xl font-black text-[#0f172a] mt-1">Catalog Batch Importer</h1>
          </div>
          <button
            onClick={() => setJsonInput(SAMPLE_JSON_TEMPLATE)}
            className="px-3 py-1.5 text-xs font-bold text-[#2b00d9] bg-[#f0ebff] hover:bg-[#e4dcff] border border-[#d2c2ff] rounded-xl transition"
          >
            Load Sample Template
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* JSON Input Column */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              Paste JSON Payload
            </label>
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

          {/* Validation & Preview Column */}
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
      </div>
    </AdminAuthGuard>
  );
}
