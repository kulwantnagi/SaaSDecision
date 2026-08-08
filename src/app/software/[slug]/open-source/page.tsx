import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSoftwareBySlug } from '@/domain/catalog-service';

export default async function OpenSourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prod = getSoftwareBySlug(slug);
  if (!prod) notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Breadcrumbs */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href={`/software/${prod.slug}`} className="hover:text-[#2b00d9] transition">{prod.name}</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">Open-Source Alternatives</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#f3e8ff] text-[#9333ea] px-3 py-1 rounded-full border border-[#9333ea]/20">
          Self-Hosted Intent
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          Accurate Open-Source Alternatives to {prod.name}
        </h1>
        <p className="text-sm font-medium text-[#475569]">
          Verified self-hostable open-source software projects offering zero monthly subscription fees and 100% data sovereignty.
        </p>
      </div>

      {/* Feasibility Summary */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-[#0f172a]">{prod.name} Self-Hosting Feasibility</h3>
        <p className="text-sm font-medium text-[#475569] leading-relaxed">
          {prod.name} has an Open-Source Maturity score of <strong className="text-[#9333ea]">{prod.assessment.openSourceMaturity}/5</strong> and Infrastructure Complexity of <strong className="text-[#9333ea]">{prod.assessment.infrastructureComplexity}/5</strong>.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-1">
            <span className="text-[10px] text-[#64748b] font-bold uppercase">Recommended Deployment Stack</span>
            <p className="text-sm font-bold text-[#0f172a]">Docker Compose / Kubernetes / PostgreSQL / Hetzner</p>
          </div>
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-1">
            <span className="text-[10px] text-[#64748b] font-bold uppercase">Estimated Monthly Hosting</span>
            <p className="text-sm font-bold text-[#16a34a]">$5 - $25 / month VPS hosting</p>
          </div>
        </div>
      </div>

      {/* Verified Open Source List */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#0f172a]">Verified Open-Source Repositories</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {prod.openSourceAlternatives && prod.openSourceAlternatives.length > 0 ? (
            prod.openSourceAlternatives.map((os, idx) => (
              <div key={idx} className="bg-white border border-[#e2e8f0] p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-[#9333ea] uppercase">Verified Repository</span>
                      <h3 className="text-xl font-extrabold text-[#0f172a] mt-0.5">{os.name}</h3>
                    </div>
                    <span className="text-xs bg-[#f3e8ff] text-[#6b21a8] px-3 py-1 rounded-full font-bold">
                      {os.stars}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed font-medium pt-1">{os.description}</p>
                </div>

                <div className="pt-3 flex justify-between items-center border-t border-[#e2e8f0]">
                  <span className="text-xs text-[#16a34a] font-bold">Zero License Fees</span>
                  <a
                    href={os.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
                  >
                    View GitHub Repo ↗
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-[#e2e8f0] p-6 rounded-3xl space-y-3 sm:col-span-2 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#0f172a]">Open-{prod.name} Project</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-medium">Self-hostable community alternative software with complete control over your data.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
