import { NextResponse } from 'next/server';
import catalogJson from '../../../../public/catalog.json';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  if (!q) {
    return NextResponse.json([]);
  }

  const rawList = (catalogJson as any[]) || [];
  
  const results = rawList.filter((p) => {
    if (!p) return false;
    const nameMatch = p.name && String(p.name).toLowerCase().includes(q);
    const slugMatch = p.slug && String(p.slug).toLowerCase().includes(q);
    const catMatch = p.categoryName && String(p.categoryName).toLowerCase().includes(q);
    const descMatch = p.shortDescription && String(p.shortDescription).toLowerCase().includes(q);
    const summaryMatch = p.summary && String(p.summary).toLowerCase().includes(q);
    const aliasMatch = Array.isArray(p.aliases) && p.aliases.some((a: any) => typeof a === 'string' && a.toLowerCase().includes(q));
    return nameMatch || slugMatch || catMatch || descMatch || summaryMatch || aliasMatch;
  }).slice(0, limit);

  return NextResponse.json(
    results.map((p) => ({
      name: p.name,
      slug: p.slug,
      categoryName: p.categoryName || 'General',
      shortDescription: p.shortDescription || p.summary || '',
      openSourceCount: Array.isArray(p.openSourceAlternatives) ? p.openSourceAlternatives.length : 0,
    }))
  );
}
