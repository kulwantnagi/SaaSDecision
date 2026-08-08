import { db } from '@/lib/db';
import { ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';
import { VerifiedProductSeed } from '@/domain/seed-data';

export interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  categoryName: string;
  matchType: 'exact' | 'alias' | 'category' | 'partial';
}

/**
 * Searches software catalog using exact match, aliases, category, and substring search
 */
export async function searchSoftwareCatalog(query: string): Promise<SearchResultItem[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  try {
    const dbResults = await db.software.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { name: { contains: cleanQuery, mode: 'insensitive' } },
          { slug: { contains: cleanQuery, mode: 'insensitive' } },
          { shortDescription: { contains: cleanQuery, mode: 'insensitive' } },
          { aliases: { some: { alias: { contains: cleanQuery, mode: 'insensitive' } } } },
          { category: { name: { contains: cleanQuery, mode: 'insensitive' } } },
        ],
      },
      include: {
        category: true,
        aliases: true,
      },
      take: 10,
    });

    return dbResults.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      shortDescription: item.shortDescription,
      categoryName: item.category.name,
      matchType: item.name.toLowerCase() === cleanQuery ? 'exact' : 'partial',
    }));
  } catch (error) {
    // Fallback to static seed catalog if database is unpopulated or unreachable in initial build
    console.warn('[searchSoftwareCatalog] Database query failed/fallback to memory search');

    return ALL_SOFTWARE_PRODUCTS.filter((item: VerifiedProductSeed) => {
      const matchName = item.name.toLowerCase().includes(cleanQuery);
      const matchAlias = item.aliases.some((a: string) => a.toLowerCase().includes(cleanQuery));
      const matchCat = item.categoryName.toLowerCase().includes(cleanQuery);
      const matchDesc = item.shortDescription.toLowerCase().includes(cleanQuery);
      return matchName || matchAlias || matchCat || matchDesc;
    }).slice(0, 10).map((item: VerifiedProductSeed) => ({
      id: item.slug,
      name: item.name,
      slug: item.slug,
      shortDescription: item.shortDescription,
      categoryName: item.categoryName,
      matchType: item.name.toLowerCase() === cleanQuery ? 'exact' : 'partial',
    }));
  }
}
