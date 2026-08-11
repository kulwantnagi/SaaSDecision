import { NextResponse } from 'next/server';
import searchIndex from '../../../../public/search-index.json';

export const runtime = 'edge';

interface SearchIndexItem {
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  shortDescription: string;
  aliases: string[];
  openSourceCount: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  if (!q) {
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  }

  const rawList = (searchIndex as SearchIndexItem[]) || [];

  const results = rawList.filter((item) => {
    if (!item) return false;
    const nameMatch = item.name && item.name.toLowerCase().includes(q);
    const slugMatch = item.slug && item.slug.toLowerCase().includes(q);
    const catMatch = item.categoryName && item.categoryName.toLowerCase().includes(q);
    const descMatch = item.shortDescription && item.shortDescription.toLowerCase().includes(q);
    const aliasMatch = Array.isArray(item.aliases) && item.aliases.some((a) => a.toLowerCase().includes(q));
    return nameMatch || slugMatch || catMatch || descMatch || aliasMatch;
  }).slice(0, limit);

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
