import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSoftwareByCategory } from '@/domain/catalog-service';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productsInCategory = getSoftwareByCategory(slug);

  if (productsInCategory.length === 0) {
    notFound();
  }

  const categoryName = productsInCategory[0].categoryName;

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3 py-1 rounded-full border border-[#2b00d9]/20">
          Category Index
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">{categoryName}</h1>
        <p className="text-sm font-medium text-[#475569]">
          Explore verified SaaS decision scores, commercial alternatives, and open-source options in {categoryName}.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {productsInCategory.map((prod) => (
          <Link
            key={prod.slug}
            href={`/software/${prod.slug}`}
            className="block bg-white border border-[#e2e8f0] hover:border-[#2b00d9]/40 hover:shadow-md p-6 rounded-3xl space-y-3 transition group"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-extrabold text-[#0f172a] group-hover:text-[#2b00d9] transition">
                {prod.name}
              </h3>
              <span className="text-xs text-[#16a34a] font-extrabold">
                From ${prod.pricing[0]?.basePrice ?? 0}/mo
              </span>
            </div>
            <p className="text-xs font-medium text-[#475569] line-clamp-2 leading-relaxed">{prod.shortDescription}</p>
            <div className="pt-2 flex justify-between items-center border-t border-[#f1f5f9] text-xs font-bold text-[#2b00d9]">
              <span>Read Intelligence Review ↗</span>
              <span className="text-[#64748b] text-[10px] uppercase">{prod.pricing[0]?.freeTier ? 'Free Tier Available' : 'Paid Tier'}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
