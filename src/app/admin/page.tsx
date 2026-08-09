import Link from 'next/link';
import { INITIAL_25_PRODUCTS } from '@/domain/seed-data';
import AdminAuthGuard from './AdminAuthGuard';

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <div className="space-y-8 max-w-6xl mx-auto py-2">
        <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a]">Admin Operations Portal</h1>
            <p className="text-xs font-medium text-[#64748b]">Software Intelligence Management & Data Verification</p>
          </div>
          <span className="bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] px-3 py-1 rounded-full text-xs font-bold">
            Authenticated Session
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-4">
          <StatCard title="Total Products" value={INITIAL_25_PRODUCTS.length.toString()} />
          <StatCard title="Data Completeness" value="100%" />
          <StatCard title="Engine Version" value="v1.0" />
          <StatCard title="Status" value="PUBLISHED" />
        </div>

        <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#0f172a]">Software Catalog Maintenance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-[#0f172a]">
              <thead className="bg-[#f8fafc] text-[#64748b] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Software</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Sources</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {INITIAL_25_PRODUCTS.slice(0, 10).map((prod) => (
                  <tr key={prod.slug} className="hover:bg-[#f8fafc]">
                    <td className="p-3.5 font-bold text-[#0f172a]">{prod.name}</td>
                    <td className="p-3.5 text-[#64748b]">{prod.categoryName}</td>
                    <td className="p-3.5">{prod.sources.length} sources</td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full font-bold">
                        PUBLISHED
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Link
                        href={`/software/${prod.slug}`}
                        className="text-xs text-[#2b00d9] font-bold hover:underline"
                      >
                        View Intelligence ↗
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
