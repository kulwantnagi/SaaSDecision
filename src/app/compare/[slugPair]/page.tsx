import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getComparePair } from '@/domain/catalog-service';

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slugPair: string }>;
}) {
  const { slugPair } = await params;
  const pair = getComparePair(slugPair);
  if (!pair) notFound();

  const { prodA, prodB } = pair;

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{prodA.name} vs {prodB.name}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6 text-center space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
          Head-to-Head Comparison
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          {prodA.name} vs {prodB.name}
        </h1>
        <p className="text-sm font-medium text-[#475569]">
          Side-by-side pricing, replacement difficulty, and feature parity comparison.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#e2e8f0] p-8 rounded-3xl space-y-4 shadow-sm">
          <h2 className="text-2xl font-extrabold text-[#0f172a]">{prodA.name}</h2>
          <p className="text-xs font-medium text-[#475569] leading-relaxed">{prodA.shortDescription}</p>
          <div className="pt-2">
            <span className="text-sm font-extrabold text-[#16a34a]">
              Starts at ${prodA.pricing[0]?.basePrice ?? 0}/mo
            </span>
          </div>
          <Link
            href={`/software/${prodA.slug}`}
            className="inline-block bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-md shadow-[#2b00d9]/25"
          >
            View {prodA.name} Review ↗
          </Link>
        </div>

        <div className="bg-white border border-[#e2e8f0] p-8 rounded-3xl space-y-4 shadow-sm">
          <h2 className="text-2xl font-extrabold text-[#0f172a]">{prodB.name}</h2>
          <p className="text-xs font-medium text-[#475569] leading-relaxed">{prodB.shortDescription}</p>
          <div className="pt-2">
            <span className="text-sm font-extrabold text-[#16a34a]">
              Starts at ${prodB.pricing[0]?.basePrice ?? 0}/mo
            </span>
          </div>
          <Link
            href={`/software/${prodB.slug}`}
            className="inline-block bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-md shadow-[#2b00d9]/25"
          >
            View {prodB.name} Review ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
