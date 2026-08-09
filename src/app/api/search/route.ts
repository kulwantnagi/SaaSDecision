import { NextResponse } from 'next/server';
import { searchCatalog } from '@/domain/catalog-service';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const results = searchCatalog(q, limit);
  
  return NextResponse.json(
    results.map((p) => ({
      name: p.name,
      slug: p.slug,
      categoryName: p.categoryName,
      shortDescription: p.shortDescription,
      openSourceCount: p.openSourceAlternatives?.length || 0,
    }))
  );
}
