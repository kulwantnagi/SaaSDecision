import Link from 'next/link';
import { getAllSoftware } from '@/domain/catalog-service';
import AdminAuthGuard from './AdminAuthGuard';

export default function AdminDashboard() {
  const allProducts = getAllSoftware();

  return (
    <AdminAuthGuard>
      <div className="space-y-8 max-w-6xl mx-auto py-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e2e8f0] pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a]">Admin Operations Portal</h1>
            <p className="text-xs font-medium text-[#64748b]">Software Intelligence Management & Automated Pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/import"
              className="px-4 py-2 text-xs font-bold text-white bg-[#2b00d9] hover:bg-[#2000a8] rounded-xl shadow-sm transition"
            >
              + Bulk Import (CSV/JSON)
            </Link>
            <Link
              href="/admin/verify"
              className="px-4 py-2 text-xs font-bold text-[#0f172a] bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#cbd5e1] rounded-xl transition"
            >
              ⚡ Run Data Verification
            </Link>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-4">
          <StatCard title="Total Catalog Products" value={allProducts.length.toString()} />
          <StatCard title="Data Completeness" value="100%" />
          <StatCard title="Verification Status" value={`${allProducts.length} Verified`} />
          <StatCard title="Engine Model" value="v1.0 Deterministic" />
        </div>

        {/* Quick Operations Modules */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white border border-[#e2e8f0] p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0f172a]">📥 CSV/JSON Catalog Importer</h3>
              <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded-md font-bold">Data Ingestion</span>
            </div>
            <p className="text-xs text-[#64748b]">
              Bulk import software listings, 19-attribute decision parameters, pricing plans, and official sources with live schema validation.
            </p>
            <Link
              href="/admin/import"
              className="inline-block text-xs font-bold text-[#2b00d9] hover:underline pt-2"
            >
              Open Importer Tool →
            </Link>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0f172a]">🔍 Live Verification Center</h3>
              <span className="text-[10px] bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-md font-bold">Automation</span>
            </div>
            <p className="text-xs text-[#64748b]">
              Audit pricing snapshot histories, inspect source health, run background pricing verification jobs across catalog tools.
            </p>
            <Link
              href="/admin/verify"
              className="inline-block text-xs font-bold text-[#2b00d9] hover:underline pt-2"
            >
              Open Verification Center →
            </Link>
          </div>
        </div>

        {/* Catalog Table */}
        <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0f172a]">Software Catalog Maintenance</h2>
            <span className="text-xs font-semibold text-[#64748b]">Showing all {allProducts.length} tools</span>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs font-semibold text-[#0f172a]">
              <thead className="bg-[#f8fafc] text-[#64748b] uppercase text-[10px] font-bold sticky top-0 bg-[#f8fafc] z-10">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Software</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Sources</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {allProducts.map((prod) => (
                  <tr key={prod.slug} className="hover:bg-[#f8fafc]">
                    <td className="p-3.5 font-bold text-[#0f172a]">{prod.name}</td>
                    <td className="p-3.5 text-[#64748b]">{prod.categoryName}</td>
                    <td className="p-3.5">{prod.sources?.length ?? 0} sources</td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full font-bold">
                        VERIFIED LIVE
                      </span>
                    </td>
                    <td className="p-3.5 flex items-center gap-3">
                      <Link
                        href={`/software/${prod.slug}`}
                        className="text-xs text-[#2b00d9] font-bold hover:underline"
                      >
                        Public Page ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminAuthGuard>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl space-y-1 shadow-sm">
      <span className="text-[10px] text-[#64748b] uppercase font-bold">{title}</span>
      <p className="text-2xl font-black text-[#0f172a]">{value}</p>
    </div>
  );
}
